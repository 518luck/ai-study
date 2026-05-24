# Sentry Agent Skills 概述

> 本文档概述 Sentry 项目 `.agents/skills/` 下的 19 个技能模块，按功能分类整理。

---

## 一、目录结构

```
skills/
├── cell-architecture/           # Cell 架构与迁移指南
├── cmdk-actions/                # Command+K 快捷命令开发
├── design-system/               # 设计系统（布局/排版组件）
├── django-models/               # Django ORM 模型设计
├── generate-frontend-forms/     # 前端表单生成（TanStack）
├── generate-migration/          # 数据库迁移生成
├── generate-snapshot-tests/     # 快照测试生成
├── hybrid-cloud-outboxes/       # 混合云 Outbox 模式（最终一致性）
│   └── references/              # 4 个参考文档
├── hybrid-cloud-rpc/            # 混合云 RPC 服务
│   └── references/              # 4 个参考文档
├── hybrid-cloud-test-gen/       # 混合云测试生成
│   └── references/              # 4 个参考文档
├── lint-fix/                    # ESLint 规则修复
│   └── references/              # 2 个参考文档
├── lint-new/                    # ESLint 新规则创建
│   └── references/              # 3 个参考文档
├── migrate-frontend-forms/      # 前端表单迁移（旧→新）
├── notification-platform/       # 通知平台开发
│   └── references/              # 4 个参考文档
├── react-component-documentation/  # React 组件文档生成
├── sentry-backend-bugs/         # 后端 Bug 模式审查
│   └── references/              # 8 个参考文档
├── sentry-javascript-bugs/      # 前端 Bug 模式审查
│   └── references/              # 7 个参考文档
├── sentry-security/             # 安全审查
│   └── references/              # 6 个参考文档
└── setup-dev/                   # 开发环境搭建
    └── references/              # 1 个参考文档
```

---

## 二、技能分类

### 架构与基础设施（3 个）

| 技能 | 说明 |
|------|------|
| **cell-architecture** | Cell 架构迁移指南。解释 Cell 与 Locality 的区别、请求如何路由到 Cell、跨 Cell 数据查询安全，以及迁移工作流（URL_NAME_TO_ACTION 注册表清理、滚动部署等） |
| **hybrid-cloud-outboxes** | 基于 Outbox 的最终一致性操作指南。涵盖 CellOutbox（cell→control）和 ControlOutbox（control→cell）的事务性写入、信号接收器、回填和调试 |
| **hybrid-cloud-rpc** | 混合云 RPC 服务创建/更新/弃用。严格约束：禁用 `from __future__ import annotations`，参数必须 keyword-only，敏感字段用 `Field(repr=False)` |

### 后端开发（3 个）

| 技能 | 说明 |
|------|------|
| **django-models** | Django ORM 模型设计决策树：数据属于哪个 Silo？另一个 Silo 是否需要看到？是否属于组织导出（relocation）？外键类型选择？ |
| **generate-migration** | Django 数据库迁移生成。覆盖 `makemigrations`、空迁移、迁移冲突处理（`./bin/update-migration`）|
| **notification-platform** | 通知平台开发。支持 Email/Slack/Discord/MS Teams。核心概念：NotificationData → NotificationTemplate → NotificationProvider → NotificationRenderer → NotificationTarget |

### 前端开发（5 个）

| 技能 | 说明 |
|------|------|
| **design-system** | 设计系统使用指南。强制使用 `@sentry/scraps` 核心组件（Grid/Flex/Container/Text/Heading）而非 Emotion styled components |
| **cmdk-actions** | Command+K 快捷命令开发。基于树形集合系统，`CMDKAction` 组件通过 React Context 注册，三个插槽：`task`、`page`、`global` |
| **generate-frontend-forms** | 基于 TanStack React Form + Zod 的新表单系统。使用 `useScrapsForm` / `AutoSaveForm` |
| **migrate-frontend-forms** | 旧表单系统（JsonForm/FormModel）迁移到新 TanStack 表单系统的映射指南 |
| **react-component-documentation** | React 组件 MDX 文档生成。生成带在线演示、无障碍指南和 TypeScript API 文档的结构化 MDX |

### 测试（2 个）

| 技能 | 说明 |
|------|------|
| **generate-snapshot-tests** | 前端快照测试生成。分析组件 props 的联合类型和布尔开关，创建覆盖所有视觉变体的快照排列 |
| **hybrid-cloud-test-gen** | 混合云测试生成。覆盖 RPC 服务测试、API 网关测试、Outbox 模式测试、端点 Silo 测试 |

### 代码质量（2 个）

| 技能 | 说明 |
|------|------|
| **lint-fix** | 修复 `eslintPluginScraps` 规则违规。支持自动修复、批量处理和 codemod 策略。已有规则：no-core-import、no-token-import、use-semantic-token、restrict-jsx-slot-children |
| **lint-new** | 创建新的 ESLint 规则。定义四种规则原型：Import rewrite、Property validation、JSX structural、Template text analysis |

### 审查与安全（3 个）

| 技能 | 说明 |
|------|------|
| **sentry-backend-bugs** | 后端 Bug 模式审查。基于 638 个真实生产问题（2700 万+ 错误事件）编码的模式。仅报告 HIGH/MEDIUM 置信度发现 |
| **sentry-javascript-bugs** | 前端 Bug 模式审查。基于 428 个真实生产问题（52.4 万+ 错误事件）编码的模式。追踪组件 props、hook 返回值、API 响应结构 |
| **sentry-security** | 安全审查。基于过去一年 37 个真实安全补丁（非通用 OWASP 理论）。覆盖端点模式、序列化器模式、权限提升等 |

### 开发环境（1 个）

| 技能 | 说明 |
|------|------|
| **setup-dev** | 开发环境搭建与故障排除。使用 devenv 管理，完整流程 30-45 分钟。检测 OS/Shell/Docker 状态并提供定制化指引 |

---

## 三、参考文档统计

| 技能 | 参考文档数 | 参考文档列表 |
|------|:---:|------|
| sentry-backend-bugs | 8 | database-integrity, data-validation, integration-errors, query-validation, null-and-type-errors, url-safety, missing-records, concurrency-bugs |
| sentry-javascript-bugs | 7 | ai-insights-parsing, dashboard-widget-errors, react-lifecycle-errors, trace-view-errors, null-reference-errors, api-response-handling, range-and-bounds-errors |
| sentry-security | 6 | enforcement-layers, token-lifecycle, serializer-patterns, endpoint-patterns, output-sanitization, privilege-escalation |
| hybrid-cloud-outboxes | 4 | backfill, category-and-scope, debugging, signal-receivers |
| hybrid-cloud-rpc | 4 | resolvers, service-template, rpc-models, deprecation |
| hybrid-cloud-test-gen | 4 | endpoint-silo-tests, api-gateway-tests, rpc-service-tests, outbox-tests |
| notification-platform | 4 | targets-and-sending, custom-renderers, provider-template, data-and-templates |
| lint-new | 3 | rule-archetypes, style-collector-guide, schema-patterns |
| lint-fix | 2 | token-taxonomy, fix-patterns |
| setup-dev | 1 | orbstack-fix |
| **总计** | **43** | |

---

## 四、技能间的依赖关系

```
django-models（模型设计入口）
  ├── → generate-migration（创建迁移）
  ├── → hybrid-cloud-outboxes（跨 Silo 复制）
  └── → hybrid-cloud-rpc（跨 Silo 服务）

hybrid-cloud-rpc（RPC 服务）
  └── → hybrid-cloud-test-gen（生成 RPC 测试）

hybrid-cloud-outboxes（Outbox 模式）
  └── → hybrid-cloud-test-gen（生成 Outbox 测试）

lint-new（创建规则）
  └── → lint-fix（修复规则违规）

generate-frontend-forms（新表单）
  └── migrate-frontend-forms（旧→新迁移参考）

design-system（设计系统）
  └── react-component-documentation（组件文档遵循设计规范）
```

---

## 五、每个技能的核心文件

每个技能目录都包含一个 `SKILL.md` 作为主入口，部分技能还有 `references/` 子目录存放详细参考文档。部分技能还包含 `README.md` 提供概览信息。

| 文件类型 | 说明 |
|----------|------|
| `SKILL.md` | 技能主文件，定义触发条件、工作流、约束和代码模板 |
| `references/*.md` | 详细参考文档，针对特定子主题的深入指南 |
| `README.md` | 技能概览（仅部分技能提供） |
