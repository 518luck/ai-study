# Observability Agent Builder — 开发指南

## 关于本文档

**受众**：协助开发 Observability Agent Builder（工具、Agent、AI 洞察）的 LLM 编码 Agent。

**团队使命**：Observability AI 团队构建了一系列工具，帮助网站可靠性工程师（SRE）排查故障并降低平均恢复时间（MTTR）。这些工具将 Observability 数据（日志、指标、追踪）暴露给 LLM Agent，以便在事件响应期间协助 SRE。

**收录内容**：特定的 Elastic 领域知识（字段映射、数据类型、指标计算）以及现有代码中不易发现的代码库约定。

**排除内容**：通用建议、LLM 训练数据中已有的信息、通过阅读现有工具即可发现的任何内容。

---

## 1. 工具与调查阶段的映射关系 (Tool-to-Investigation Phase Mapping)

| 阶段 (Phase) | 示例工具 (Example Tools) |
| :--- | :--- |
| **检测 (Detection)** | `get_alerts`、`get_services` |
| **定界 (Scope)** | `get_services`、`get_hosts`、`get_trace_metrics` |
| **时间线 (Timeline)** | `get_trace_metrics`（时序数据）、`run_log_rate_analysis` |
| **关联 (Correlation)** | `get_traces`、`get_service_topology` |
| **根因 (Root Cause)** | `get_log_groups`、`get_trace_metrics`（按维度分组） |

---

## 2. 设计原则 (Design Principles)

### LLM 优化 (LLM Optimization)

1. **用于工具选择的自文档化 (Self-documenting for tool selection)** — 工具的描述应当使 LLM 能够根据描述直接选出正确的工具并正确使用，无需依赖外部上下文。
2. **结构化以利于总结 (Structured for summarization)** — 工具的输出应当便于 LLM 提取洞察，并能以自然语言向用户展示。
3. **渐进式呈现 (Progressive disclosure)** — 优先返回高层次的摘要信息以节省上下文窗口 Token。Agent 需要先查看数据的大体轮廓和标识信息，进而决定往哪个方向深入分析。当需要进行更深层调查时，必须提供工具参数以供调用。

### 工具设计 (Tool Design)

1. **回答特定问题 (Answer specific questions)** — 试图回答过多问题的工具会使 LLM 在选择时产生混淆。应将复杂的工具拆分为聚焦的、可组合的工具。
2. **最少必需参数 (Minimal required parameters)** — 常见的使用场景应当只需要 0 个或 1 个参数。使用合理的默认值。
3. **跨工具导航 (Cross-tool navigation)** — 工具的输出和描述应当使 LLM 能够建议合理的下一步操作（例如：当 `get_services` 发现某服务不健康时，建议调用 `get_trace_metrics` 进行深入分析）。

### 数据与实现 (Data & Implementation)

1. **噪音减少 (Noise reduction)** — 过滤掉无关的数据，仅返回对事件排查有用的信息。优先展示可落地的信息。
2. **兼容 ECS 和 OTel (ECS and OTel compatible)** — 工具必须能够同时兼容 Elastic Common Schema 和 OpenTelemetry 的数据格式。
3. **防过载保护 (Guard rails)** — 使用并发限制和结果上限，避免使 Elasticsearch 过载。
4. **简单实现 (Simple implementation)** — 代码应易于维护、易于阅读，避免不必要的复杂性。

---

## 3. 工具描述指南 (Tool Description Guidelines)

LLM 仅根据描述和参数 Schema 来选择工具。糟糕的描述会导致错误的工具选择。

### 规则

- 首句应为动作导向：“Retrieves...”（检索）、“Identifies...”（识别）、“Analyzes...”（分析）。
- 包含 2 至 4 个具体的“When to use”（何时使用）场景。
- 包含“When NOT to use”（何时不使用），并指明替代工具。
- 通过 Tool ID 引用相关工具，以实现 LLMs 间的导航。
- 避免在描述中包含具体实现细节。
- 保持总描述字数在 500 字以内。

---

## 4. 参数命名规范 (Parameter Naming Conventions)

在所有 Observability 工具中保持参数命名一致：

| 类别 (Category) | 参数 (Parameter) | 类型 (Type) | 说明 (Notes) |
| :--- | :--- | :--- | :--- |
| **时间 (Time)** | `start` | string | Elasticsearch 日期数学表达式（例如 `now-1h`） |
| | `end` | string | Elasticsearch 日期数学表达式（例如 `now`） |
| **过滤器 (Filters)** | `kqlFilter` | string | KQL 查询字符串。请勿使用 `query`、`filter` 或 `kql`。 |
| **实体 (Entities)** | `serviceName` | string | 映射到 `service.name` |
| | `hostName` | string | 映射到 `host.name` |
| | `environment` | string | 映射到 `service.environment` |
| **分组 (Grouping)** | `groupBy` | string | 聚合所依据的字段 |
| **分页 (Pagination)** | `limit` | number | 要返回的最大结果数 |

---

## 5. ECS 与 OpenTelemetry 兼容性 (ECS and OpenTelemetry Compatibility)

工具必须同时支持 ECS（Elastic Common Schema）和 OpenTelemetry 数据。Elasticsearch 中的 Observability 索引模板提供了**字段别名**，用于将 OTel 字段映射到其等效的 ECS 字段，因此查询时只需使用 ECS 字段名即可。

### 关键点

1. **仅查询 ECS 字段** — 别名会自动处理映射。例如，查询 `message` 而非 `body.text`（尽管 `_source` 中仍会显示原始字段名）。
2. **APM 指标保持不变** — OTel 追踪数据在写入时已被预聚合为相同的 APM 指标格式，该过程通过：
   - 托管的 OTLP 端点（自动完成）
   - 自托管：使用 [带 Elastic APM 处理器的 EDOT 收集器](https://www.elastic.co/docs/reference/edot-collector/components/elasticapmprocessor)
3. **完整别名列表** — 参阅 [ECS to OTel aliases](https://gist.github.com/sorenlouv/5ed2a53c3a43504c0fea7a7a992d18af) 以获取从 Elasticsearch 组件模板中提取的完整映射。

### 常用别名 (Common Aliases)

| ECS 别名 (ECS Alias) | OTel 字段 (OTel Field) |
| :--- | :--- |
| `message` | `body.text` |
| `log.level` | `severity_text` |
| `trace.id` | `trace_id` |
| `span.id` | `span_id` |
| `service.environment` | `deployment.environment` |
| `kubernetes.pod.name` | `k8s.pod.name` |
| `kubernetes.namespace` | `k8s.namespace.name` |

您可以通过以下命令获取集群中的完整 OTel 别名列表：

```bash
curl -s -u elastic:changeme "http://localhost:9200/*otel*/_mapping/field/*" | jq '[.[] | .mappings | to_entries[] | select(.value.mapping[].type == "alias") | {alias: .key, target: .value.mapping[].path}] | unique'
```

---

## 6. APM 数据类型 (APM Data Types)

APM 数据存储在多种具有不同字段结构的文档类型中。理解这些结构对于编写正确的聚合查询至关重要。

### 事务延迟字段 (Transaction Latency Fields)

根据文档类型的不同，事务延迟存储在三种不同的字段类型中：

| 文档类型 (Document Type) | 延迟字段 (Latency Field) | 字段类型 (Field Type) | 说明 (Notes) |
| :--- | :--- | :--- | :--- |
| `TransactionEvent` | `transaction.duration.us` | `long` | 单个事务事件 |
| `TransactionMetric` | `transaction.duration.histogram` | `histogram` | 按事务名称预聚合 |
| `ServiceTransactionMetric` | `transaction.duration.summary` | `aggregate_metric_double` | 按服务预聚合（最高聚合层级） |

**关键认知**：Elasticsearch 的 `avg` 聚合天然支持这三种字段类型——它能计算直方图的加权平均值，并在处理 `aggregate_metric_double` 时自动使用预存的 sum/count。无需进行特殊处理。

**吞吐量注意事项**：对于 `ServiceTransactionMetric`，`doc_count` 并不等于事务总数。应在相应字段上使用 `value_count`，而不要依赖 `_count`。

**分位数 (Percentiles)**：仅 `TransactionEvent` 和 `TransactionMetric` 支持分位数聚合。`ServiceTransactionMetric` 使用的是 `aggregate_metric_double`，它仅存储了 sum/count，因此无法计算分位数。

### 错误率字段 (Error Rate Fields)

对于 `TransactionEvent` 和 `TransactionMetric`，每个文档都有 `event.outcome`（其值为 `success`、`failure` 或 `unknown`）。可以使用 filter 聚合来统计各结果数量。

对于 `ServiceTransactionMetric`，结果已在 `event.success_count` (`aggregate_metric_double`) 中预聚合：

- `sum` = 成功事务的数量
- `value_count` = 具有明确结果的事务总数（成功数 + 失败数）
- 失败率 = `(value_count - sum) / value_count`

| 文档类型 (Document Type) | 字段 (Field) | 类型 (Type) |
| :--- | :--- | :--- |
| `TransactionEvent` | `event.outcome` | `keyword` |
| `TransactionMetric` | `event.outcome` | `keyword` |
| `ServiceTransactionMetric` | `event.success_count` | `aggregate_metric_double` |

### 处理事件与指标集名称 (Processor Events and Metricset Names)

APM 文档按 `processor.event` 进行分类：

| `processor.event` | 说明 (Description) |
| :--- | :--- |
| `transaction` | 单个事务事件 |
| `span` | Span（跨度）事件 |
| `metric` | 所有预聚合的指标 |
| `error` | 错误事件 |

对于指标文档，可以通过过滤 `metricset.name` 来查询特定类型：

| `metricset.name` | 使用场景 (Use case) |
| :--- | :--- |
| `transaction` | 事务指标（每个端点） |
| `service_transaction` | 服务级指标（最高聚合层级） |
| `service_destination` | 对下游依赖发起的请求 |
| `span_breakdown` | 按跨度类型（`span.type`）消耗的时间 |
| `app` | 系统指标（CPU、内存） |

### 服务目标指标 (Service Destination Metrics)

服务目标指标用于捕获服务发往其依赖项的**外部**请求指标。应当将其用于依赖项/连接的性能分析，而非服务本身的性能分析。

| 字段 (Field) | 说明 (Description) |
| :--- | :--- |
| `span.destination.service.resource` | 依赖项名称（例如 `elasticsearch`、`redis`） |
| `span.destination.service.response_time.sum.us` | 总延迟（所有请求时长的总和） |
| `span.destination.service.response_time.count` | 请求次数 |
| `event.outcome` | `success` 或 `failure` |

**指标计算方法**：

- 延迟 (Latency)：`response_time.sum.us / response_time.count`
- 吞吐量 (Throughput)：在一段时间内的 `response_time.count`
- 错误率 (Error rate)：过滤 `event.outcome: failure`，并除以总次数

**参考资料**：

- [APM 聚合查询开发文档](https://github.com/elastic/kibana/blob/main/x-pack/solutions/observability/plugins/apm/dev_docs/apm_queries.md)
- [服务目标指标（官方公开文档）](https://www.elastic.co/docs/solutions/observability/apm/metrics#_service_destination_metrics)
- [聚合指标双精度浮点数类型 (Aggregate Metric Double Field Type)](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/aggregate-metric-double)

---

## 7. 测试与开发 (Testing and Development)

### 文件位置

- 工具 (Tools)：`x-pack/solutions/observability/plugins/observability_agent_builder/server/tools/`
- API 测试 (API Tests)：`x-pack/solutions/observability/test/api_integration_deployment_agnostic/apis/observability_agent_builder/tools/`
- Synthtrace 场景：`src/platform/packages/shared/kbn-synthtrace/src/scenarios/agent_builder/tools/`

### 导入测试数据 (Ingesting Test Data)

请参阅 [数据导入](../DATA_INGESTION.md) 获取所有可用的导入方法：数据导入脚本（RCAEval、OpenRCA）、Synthtrace 场景以及 OpenTelemetry Demo。

### 在本地执行工具 (Executing Tools Locally)

可以直接通过 API 测试您的工具：

```bash
curl -X POST http://localhost:5601/api/agent_builder/tools/_execute \
  -u elastic:changeme \
  -H 'kbn-xsrf: true' \
  -H 'x-elastic-internal-origin: kibana' \
  -H 'Content-Type: application/json' \
  -d '{
    "tool_id": "observability.<tool_name>",
    "tool_params": { "start": "now-1h", "end": "now" }
  }'
```

### 与 Elastic AI Agent 对话 (Chatting with the Elastic AI Agent)

使用默认的 Elastic AI Agent（`elastic-ai-agent`）对您的工具进行端到端测试：

```bash
curl -X POST http://localhost:5601/api/agent_builder/converse \
  -u elastic:changeme \
  -H 'kbn-xsrf: true' \
  -H 'x-elastic-internal-origin: kibana' \
  -H 'Content-Type: application/json' \
  -d '{
    "input": "What services are experiencing issues?",
    "agent_id": "elastic-ai-agent"
  }'
```

注意：

- 若要继续会话，请在请求体中附带上一次响应中返回的 `conversation_id`。
- 对于流式响应（SSE），请使用 `/api/agent_builder/converse/async` 端点。

### API 集成测试 (API _Integration Tests_)

Kibana API 测试服务器：[http://elastic:changeme@localhost:5620](http://elastic:changeme@localhost:5620)  
Elasticsearch 测试服务器：[http://elastic:changeme@localhost:9220](http://elastic:changeme@localhost:9220)  

运行特定工具的 API 测试：

```
node scripts/functional_test_runner --config x-pack/solutions/observability/test/api_integration_deployment_agnostic/configs/stateful/oblt.ai_agent.stateful.config.ts --grep="<tool_name>"
```

工具的 API 测试必须添加到：`x-pack/solutions/observability/test/api_integration_deployment_agnostic/apis/observability_agent_builder/tools/`

### 准入白名单 (Allow list)

所有新创建的工具**必须**添加到 Agent Builder 的白名单中：

```
x-pack/platform/packages/shared/agent-builder/agent-builder-server/allow_lists.ts
```

### 将日志写入文件 (Writing Logs to a File)

默认情况下，Kibana 仅在终端中输出日志（`console` appender）。当 Kibana 在一个独立的终端窗口中运行时，编码 Agent 不太容易读取到它的输出。为解决此问题，可以配置 Kibana 同时将日志写入一个文件。

在 `config/kibana.dev.yml` 中添加以下配置：

```yaml
logging.appenders:
  file:
    type: rolling-file
    fileName: /tmp/kibana.log
    layout:
      type: pattern

logging.root:
  level: info
  appenders: [default, file]

logging.loggers:
  - name: plugins.observabilityAgentBuilder
    level: debug
```

完成配置后，编码 Agent 即可直接从 `/tmp/kibana.log` 读取 Kibana 的日志信息。

### 在 Arize Phoenix 中查看链路追踪 (Viewing Traces in Arize Phoenix)

工具执行和 Agent 对话链会被追踪到 [Arize Phoenix](https://oblt-apps.elastic.dev/phoenix-ai/)。在每次对话或工具执行完毕后，Kibana 会输出 Trace 链接日志：

```
[INFO ][telemetry] View trace at https://oblt-apps.elastic.dev/phoenix-ai/projects/<project-id>/traces/<trace-id>?selected
```

您可以从 `/tmp/kibana.log` 中提取 Trace ID，并利用 REST API 进行获取：

```bash
grep "View trace" /tmp/kibana.log | tail -1
```

```bash
curl -s 'https://oblt-apps.elastic.dev/phoenix-ai/v1/projects/<project-name>/spans?limit=100' \
  -H 'Authorization: Bearer <PHOENIX_API_KEY>' \
  | jq '.data[] | select(.context.trace_id == "<trace-id>") | {name, span_kind, status_code, start_time}'
```

请将 `<project-name>` 替换为您的 Phoenix 项目名称（其可在 `kibana.dev.yml` 中 `telemetry.tracing.exporters.phoenix.project_name` 节点下配置）。如未配置 `PHOENIX_API_KEY`，请向团队申请。

有关完整的 API 参考，请参阅 [Phoenix REST API 官方文档](https://arize.com/docs/phoenix/sdk-api-reference/rest-api/api-reference/traces)。

---

## 8. 合并前自查清单 (Pre-Merge Checklist)

- [ ] 工具已被添加到 `allow_lists.ts`。
- [ ] 能同时兼容 ECS 与 OTel 数据（在适用情况下）。
- [ ] 指标度量衡已完成标准化：延迟使用毫秒（ms）、吞吐量使用每分钟（per-minute）计数、失败率控制在 0 到 1 之间。
- [ ] 已提供用于生成测试数据的 Synthtrace 场景。
- [ ] API 集成测试已覆盖过滤器、groupBy 维度以及各种边界情况。

---

## 参考资料 (References)

- [Elastic Common Schema (ECS) 字段参考文档](https://www.elastic.co/docs/reference/ecs/ecs-field-reference)
- [OpenTelemetry 语义约定 (Semantic Conventions)](https://opentelemetry.io/docs/specs/semconv/)
