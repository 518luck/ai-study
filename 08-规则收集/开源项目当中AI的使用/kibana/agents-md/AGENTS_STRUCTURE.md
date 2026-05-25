# Kibana AGENTS.md 结构全景图

> 本文档总结了 Kibana 仓库中全部 9 个 `AGENTS.md` 文件的目录分布、层级关系、核心内容和交叉引用。

---

## 一、目录树状分布

```
kibana/
│
├── AGENTS.md                              ← [全局] 仓库级通用开发规范
│
├── src/
│   ├── core/
│   │   └── AGENTS.md                      ← [核心] Core 平台内部包结构与可见性规则
│   │
│   └── platform/packages/shared/
│       ├── shared-ux/datetime/
│       │   └── kbn-date-range-picker/
│       │       └── AGENTS.md              ← [组件] 单个 UI 组件（日期范围选择器）
│       │
│       └── kbn-synthtrace/src/scenarios/
│           └── agent_builder/
│               └── AGENTS.md              ← [测试数据] Synthtrace 合成数据场景
│
└── x-pack/solutions/observability/
    │
    ├── plugins/observability_agent_builder/
    │   ├── AGENTS.md                      ← [插件入口] Agent Builder 插件总览 + 子文档索引
    │   │
    │   └── server/
    │       ├── AGENTS.md                  ← [服务端] 工具开发指南（设计原则 / APM 数据 / 测试）
    │       │
    │       ├── routes/ai_insights/
    │       │   └── AGENTS.md              ← [功能] AI Insights 架构与提示词设计
    │       │
    │       └── tools/get_service_topology/
    │           └── AGENTS.md              ← [工具] get_service_topology 实现规范
    │
    └── test/api_integration_deployment_agnostic/
        └── apis/observability_agent_builder/
            └── AGENTS.md                  ← [测试] API 集成测试编写指南
```

---

## 二、五层架构分析

### Layer 0 — 仓库根级（全局规范）

| 属性 | 值 |
|---|---|
| **文件** | `/AGENTS.md` |
| **覆盖范围** | 整个 Kibana 仓库 |
| **受众** | 所有开发者 / LLM 编码助手 |

**核心主题：**
- **Setup** — `yarn kbn bootstrap` 初始化
- **Overview** — 模块组织（core / packages / plugins）、插件生命周期、模块 ID、可见性规则
- **Server Plugin Entry** — `server/index.ts` 必须延迟加载 `./plugin`，禁止同步导入
- **Testing** — Jest unit / Jest integration / FTR / Scout 四套测试框架
- **Code Style** — TypeScript 规范、Linting、Formatting、Naming、Control Flow、React UI 约定
- **i18n** — 国际化指南
- **CI** — Buildkite `bk` CLI
- **Contribution Hygiene** — 修复根因、聚焦变更、不删测试、PR 以 draft 开启

**关键规则数：** ~30 条

---

### Layer 1 — 核心平台级

| 属性 | 值 |
|---|---|
| **文件** | `/src/core/AGENTS.md` |
| **覆盖范围** | `src/core/packages/` 下的所有子包 |
| **受众** | Core 平台开发者 |

**核心主题：**
- **子包后缀约定** — 7 种后缀（`-server`, `-server-internal`, `-server-mocks`, `-browser`, `-browser-internal`, `-browser-mocks`, `common`）
- **职责分离** — 公共包仅导出类型和纯工具，内部包包含实现，mocks 包生成类型化模拟对象
- **可见性声明** — `shared`（任何包可导入）vs `private`（仅 `src/core` 内部可导入）
- **维护责任** — 修改 core 代码时必须同步更新此文档
- **关联文档** — `src/core/CONVENTIONS.md`

**关键规则数：** 7 条

---

### Layer 2 — 共享包级

此层有两个独立的 AGENTS.md，分属不同领域。

#### 2a. UI 组件

| 属性 | 值 |
|---|---|
| **文件** | `/src/platform/packages/shared/shared-ux/datetime/kbn-date-range-picker/AGENTS.md` |
| **覆盖范围** | `kbn-date-range-picker` 组件 |
| **受众** | 该组件的维护者 |

**核心主题：**
- **项目定位** — 带"智能输入"的日期范围选择器 UI 组件
- **依赖限制** — 仅允许 `@elastic/eui`, `@elastic/datemath`, `@kbn/i18n`, `moment`, `react-day-picker`
- **开发命令** — 单元测试、Lint、类型检查、Storybook
- **编码规则** — 避免 TS 类型复杂性、JSDoc 文档、不暴露 moment 对象、保持测试简洁
- **哲学** — 正确性 > 巧妙性、描述性命名 > 简短、PR < 1000 行

**关键规则数：** 5 条

#### 2b. 测试数据场景

| 属性 | 值 |
|---|---|
| **文件** | `/src/platform/packages/shared/kbn-synthtrace/src/scenarios/agent_builder/AGENTS.md` |
| **覆盖范围** | Agent Builder 相关的 Synthtrace 合成数据场景 |
| **受众** | LLM 编码助手（编写/修改测试数据场景时） |

**核心主题：**
- **原则** — 每个 Tool 和 AI Insight 都必须有对应的 Synthtrace 场景
- **场景位置** — `tools/` 和 `ai_insights/` 子目录
- **验证工具** — 运行 Synthtrace 场景命令 + curl 调用 API 验证
- **前置条件** — Kibana (5601) + Elasticsearch (9200) + 凭证

**关键规则数：** 3 条

---

### Layer 3 — 解决方案插件级

#### 3a. 插件入口

| 属性 | 值 |
|---|---|
| **文件** | `/x-pack/.../observability_agent_builder/AGENTS.md` |
| **覆盖范围** | 整个 Observability Agent Builder 插件 |
| **受众** | LLM 编码助手（Agent Builder 相关任何工作） |

**核心主题：**
- **插件定位** — LLM 驱动的工具和洞察，帮助 SRE 调查事件
- **子文档索引** — 汇总链接到 5 个子领域文档：
  1. `server/AGENTS.md` — 开发指南
  2. `DATA_INGESTION.md` — 数据摄入
  3. `server/routes/ai_insights/AGENTS.md` — AI Insights
  4. API 集成测试指南
  5. Synthtrace 场景指南

**特点：** 此文件本身不含具体规则，主要起**导航索引**作用。

#### 3b. 服务端开发指南

| 属性 | 值 |
|---|---|
| **文件** | `/x-pack/.../observability_agent_builder/server/AGENTS.md` |
| **覆盖范围** | Agent Builder 服务端（工具、代理、AI 洞察） |
| **受众** | LLM 编码助手（Agent Builder 开发） |

**核心主题（8 大章节）：**

1. **Tool-to-Investigation Phase Mapping** — 工具按调查阶段分类（Detection → Scope → Timeline → Correlation → Root Cause）
2. **Design Principles** — LLM 优化（自文档化、结构化输出、渐进式披露）、工具设计（回答特定问题、最小必需参数、跨工具导航）、数据实现（降噪、ECS/OTel 兼容、护栏、简洁实现）
3. **Tool Description Guidelines** — 动词开头、2-4 个使用场景、不使用场景、关联工具引用、< 500 词
4. **Parameter Naming Conventions** — 统一参数命名（Time / Filters / Entities / Grouping / Pagination）
5. **ECS and OpenTelemetry Compatibility** — 仅查询 ECS 字段、别名自动映射、APM 指标不变、完整别名列表
6. **APM Data Types** — Transaction Latency（3 种文档类型的不同字段）、Error Rate、Processor Events、Metricset Names、Service Destination Metrics
7. **Testing and Development** — 文件位置、数据摄入、本地执行工具、聊天测试、API 集成测试、Allow list、日志写入文件、Arize Phoenix 追踪
8. **Pre-Merge Checklist** — 5 项必检项

**关键规则数：** ~40 条（最详细的 AGENTS.md）

---

### Layer 4 — 子功能级

#### 4a. AI Insights 架构

| 属性 | 值 |
|---|---|
| **文件** | `/x-pack/.../server/routes/ai_insights/AGENTS.md` |
| **覆盖范围** | AI Insights 功能 |
| **受众** | LLM 编码助手（AI Insights / Agent / Agent Builder 相关工作） |

**核心主题（6 大章节）：**

1. **与 Tools 的区别** — 预获取上下文（非 LLM 决定）+ 硬编码提示词（非用户输入）
2. **Context Assembly** — 每种洞察类型定义固定的数据源集合，使用 XML 标签包装
3. **Architecture** — 用户点击按钮 → 服务端预取上下文 + 静态提示词 → LLM 单次调用 → Markdown 响应 → 可选会话接力
4. **Prompt Design** — 严格事实性、结构化输出、SRE 受众、实体链接
5. **UI Integration** — React 组件注册、可见性前提条件（GenAI 连接器 + Agent Builder + 聊天体验 + 企业许可证）、会话接力
6. **Testing** — 文件位置、本地调用、API 测试命令

**关键规则数：** ~15 条

#### 4b. 单工具实现规范

| 属性 | 值 |
|---|---|
| **文件** | `/x-pack/.../server/tools/get_service_topology/AGENTS.md` |
| **覆盖范围** | `get_service_topology` 工具 |
| **受众** | 修改该工具的开发者 |

**核心主题：**
- **Purpose** — 展示服务的上下游依赖关系
- **Direction Semantics** — `downstream`（被调用方）、`upstream`（调用方）、`both`
- **Depth Parameter** — BFS 遍历深度限制
- **Graph Traversal Rules** — 详细的 BFS 遍历规则，含拓扑图示例
- **Critical Constraints** — 服务身份必须使用 `service.name` 而非 `span.destination.service.resource`；上游必须同时支持有仪器服务和外部依赖
- **Test Coverage** — API 测试 + Synthtrace 场景

**关键规则数：** 6 条

---

### Layer 5 — 测试级

| 属性 | 值 |
|---|---|
| **文件** | `/x-pack/.../test/api_integration_deployment_agnostic/apis/observability_agent_builder/AGENTS.md` |
| **覆盖范围** | Agent Builder 的 API 集成测试 |
| **受众** | LLM 编码助手（编写/修改 API 集成测试时） |

**核心主题：**
- **运行命令** — 完整的 `functional_test_runner` 命令
- **按工具过滤** — `--grep` 参数
- **测试结构指南** — 单个 `it` 单个断言、工具 ID 命名 describe、使用共享 API client、使用 Synthtrace 生成数据

**关键规则数：** 4 条

---

## 三、交叉引用关系图

```
                         ┌─────────────────┐
                         │  /AGENTS.md     │  ← 全局规范（被所有文件隐式继承）
                         │  (Layer 0)      │
                         └────────┬────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
    ┌─────────▼─────────┐  ┌─────▼──────┐  ┌────────▼────────┐
    │ /src/core/        │  │ /x-pack/   │  │ /src/platform/  │
    │ AGENTS.md         │  │ .../       │  │ .../            │
    │ (Layer 1)         │  │ agent_     │  │ kbn-date-range/ │
    └───────────────────┘  │ builder/   │  │ AGENTS.md       │
                           │ AGENTS.md  │  │ (Layer 2a)      │
                           │ (Layer 3a) │  └─────────────────┘
                           └─────┬──────┘
                                 │ 索引指向
                 ┌───────────────┼───────────────┬─────────────────┐
                 │               │               │                 │
        ┌────────▼──────┐ ┌─────▼──────┐ ┌──────▼───────┐ ┌──────▼──────┐
        │ server/       │ │ ai_insights│ │ test/.../    │ │ synthtrace/ │
        │ AGENTS.md     │ │ AGENTS.md  │ │ AGENTS.md   │ │ AGENTS.md   │
        │ (Layer 3b)    │ │ (Layer 4a) │ │ (Layer 5)   │ │ (Layer 2b)  │
        └────────┬──────┘ └────────────┘ └──────────────┘ └─────────────┘
                 │
        ┌────────▼──────────────┐
        │ tools/get_service_    │
        │ topology/AGENTS.md    │
        │ (Layer 4b)            │
        └───────────────────────┘
```

**引用关系说明：**

| 来源 | 引用目标 | 引用类型 |
|---|---|---|
| `observability_agent_builder/AGENTS.md` | `server/AGENTS.md` | 开发指南链接 |
| `observability_agent_builder/AGENTS.md` | `server/routes/ai_insights/AGENTS.md` | AI Insights 链接 |
| `observability_agent_builder/AGENTS.md` | `test/.../AGENTS.md` | 测试指南链接 |
| `observability_agent_builder/AGENTS.md` | `synthtrace/.../AGENTS.md` | 数据场景链接 |
| `server/AGENTS.md` | `server/routes/ai_insights/AGENTS.md` | 隐含（同域） |
| `server/AGENTS.md` | `server/tools/get_service_topology/AGENTS.md` | 隐含（工具子集） |
| `synthtrace/.../AGENTS.md` | `server/tools/AGENTS.md` | 工具开发指南交叉引用 |
| `test/.../AGENTS.md` | `server/tools/AGENTS.md` | 工具设计原则引用 |
| `src/core/AGENTS.md` | `src/core/CONVENTIONS.md` | 关联文档 |

---

## 四、核心内容摘要总表

| # | 文件路径（简） | 层级 | 覆盖领域 | 核心主题 | 规则数 |
|---|---|---|---|---|---|
| 1 | `/AGENTS.md` | 0 | 全仓库 | Setup / Testing / Code Style / i18n / CI / Hygiene | ~30 |
| 2 | `src/core/AGENTS.md` | 1 | Core 平台 | 子包后缀约定 / 可见性规则 / 依赖方向 | ~7 |
| 3 | `shared-ux/.../AGENTS.md` | 2a | UI 组件 | 依赖限制 / JSDoc / 不暴露 moment / PR 大小 | ~5 |
| 4 | `synthtrace/.../AGENTS.md` | 2b | 测试数据 | 场景编写 / 验证命令 / 前置条件 | ~3 |
| 5 | `agent_builder/AGENTS.md` | 3a | 插件入口 | 插件定位 / 子文档索引 | 0 (索引) |
| 6 | `agent_builder/server/AGENTS.md` | 3b | 服务端开发 | 设计原则 / 参数命名 / ECS+OTel / APM 数据 / 测试 / 合并清单 | ~40 |
| 7 | `ai_insights/AGENTS.md` | 4a | AI Insights | 架构 / 提示词设计 / UI 集成 / 会话接力 | ~15 |
| 8 | `get_service_topology/AGENTS.md` | 4b | 单工具实现 | BFS 遍历 / 方向语义 / 深度参数 / 关键约束 | ~6 |
| 9 | `test/.../AGENTS.md` | 5 | API 集成测试 | 运行命令 / 测试结构 / 共享工具 | ~4 |

---

## 五、设计模式总结

### 1. 层级递进模式
```
全局规范 (Layer 0)
  └→ 核心模块 (Layer 1)
      └→ 共享包/组件 (Layer 2)
          └→ 解决方案插件 (Layer 3)
              └→ 子功能/工具 (Layer 4)
                  └→ 测试 (Layer 5)
```
每层仅关注该层特定的规则，不在子层重复父层内容。

### 2. 索引枢纽模式
`observability_agent_builder/AGENTS.md` 作为插件入口，不包含具体规则，仅汇总链接到所有子文档，形成导航中心。

### 3. 领域知识下沉模式
具体的领域知识（如 APM 数据类型、ECS/OTel 映射、BFS 遍历规则）下沉到最具体的层级（Layer 3b / 4b），而非放在全局或插件入口。

### 4. 受众声明模式
多数 AGENTS.md 文件开头即声明 **Audience**（如 "LLM coding agents working on ..."），明确文档的目标读者。

### 5. 文件组织规律
| 层级特征 | 典型内容 |
|---|---|
| 越靠近根 | 越通用（命名、格式、测试框架选择） |
| 越靠近叶 | 越具体（字段映射、遍历算法、参数类型） |
| 插件入口 | 索引 + 领域概述 |
| 具体实现 | 约束 + 算法 + 测试要求 |

---

## 六、统计

- **AGENTS.md 文件总数：** 9
- **涉及的主要领域：** 4 个（Core 平台、共享 UI 组件、Synthtrace 测试数据、Observability Agent Builder）
- **层级深度：** 6 层（0-5）
- **总规则数（估算）：** ~110 条
- **最大文件：** `server/AGENTS.md`（~40 条规则，涵盖 8 大章节）
- **最小文件：** `agent_builder/AGENTS.md`（纯索引，无具体规则）
