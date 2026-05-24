# Sentry AGENTS.md 结构图

> 本文档详细总结 Sentry 项目中 AGENTS.md 的分布结构、各文件职责、核心内容及其相互关系。

---

## 一、目录结构总览

```
sentry/                                    # 项目根目录
├── AGENTS.md                              # [全局入口] 项目总览 + 通用开发命令
├── src/
│   └── AGENTS.md                          # [后端] Python/Django 后端开发指南
├── static/
│   ├── AGENTS.md                          # [前端] React/TypeScript 前端开发指南
│   └── app/
│       └── utils/
│           └── seer/
│               └── AGENTS.md              # [模块] Seer/Autofix 工具模块指南
└── tests/
    └── AGENTS.md                          # [测试] Python 测试最佳实践
```

---

## 二、层级关系与加载路由

```
AGENTS.md (根)
  │
  ├── 工作文件匹配 ──→ src/**/*.py        ──→ src/AGENTS.md
  │                   tests/**/*.py        ──→ tests/AGENTS.md
  │                   static/**/*.{ts,tsx} ──→ static/AGENTS.md
  │
  └── 技能系统 (.agents/skills/)
        └── 工作流引导 (commit, pre-commit, hybrid cloud 等)
```

**加载规则**：AI Agent 根据当前工作文件的路径，自动加载对应目录下的 AGENTS.md：
- 后端 `src/**/*.py` → `src/AGENTS.md`
- 测试 `tests/**/*.py` → `tests/AGENTS.md`
- 前端 `static/**/*.{ts,tsx,js,jsx,css,scss}` → `static/AGENTS.md`
- 通用/不确定 → 根目录 `AGENTS.md`

---

## 三、各文件详细内容

### 1. `AGENTS.md`（根目录）— 全局入口

**定位**：Sentry 项目的 AI Agent 总指南，是所有 Agent 操作的入口文件。

| 章节 | 内容 |
|------|------|
| Overview | 项目简介：Django + React 的错误追踪与性能监控平台 |
| Project Structure | 顶层目录结构说明 |
| Python 命令执行要求 | 必须使用 `.venv/bin/` 虚拟环境 |
| 后端开发命令 | devenv sync / prek lint / pytest / 数据库迁移 |
| 前端开发命令 | pnpm dev / typecheck / lint:js / test-ci |
| Git Worktrees | 每个 worktree 有独立 .venv |
| Context-Aware Loading | 按文件路径自动加载对应 AGENTS.md |
| Viewer/Organization Context | 使用 ViewerContext 获取当前用户身份 |
| Agent Skills | `.agents/skills/` 下的技能遵循仓库惯例 |
| Feature Flags (FlagPole) | 功能开关注册 → Python 检查 → 前端检查 → 测试 |
| Customer Information | 禁止在代码/PR中包含真实客户信息 |
| Pull Requests | 前后端必须分 PR 提交，后端先合并 |

**关键命令速查**：

```bash
# 后端
.venv/bin/prek run -q                        # lint + format + typecheck
.venv/bin/pytest -n3 -svv --reuse-db <path>  # 运行测试
sentry django migrate                         # 运行迁移

# 前端
pnpm run typecheck                            # 类型检查（不能用 tsc）
pnpm run lint:js                              # JS/TS lint
pnpm test-ci <file>                           # 运行测试
```

---

### 2. `src/AGENTS.md` — 后端开发指南

**定位**：Python/Django 后端的完整开发参考手册（688 行，内容最丰富）。

| 章节 | 内容 |
|------|------|
| Tech Stack | Python 3.13+ / Django 5.2+ / Celery 5.5+ / PostgreSQL / Redis / ClickHouse(Snuba) / Kafka / Arroyo |
| Security Guidelines | **IDOR 防护**：始终用 organization_id/project_id 限定查询范围 |
| Exception Handling | 避免空 except，只捕获可处理的异常 |
| Development Services | devservices 管理本地依赖（PostgreSQL, Redis, Snuba, Relay, Symbolicator） |
| AI Assistant Decision Trees | 快速决策树：添加 API endpoint / 添加 Celery task |
| API Endpoint Pattern | 完整的 endpoint 代码模板（含 @cell_silo_endpoint） |
| Serializers | 避免 N+1：用 `get_attrs()` 批量查询，不在 `serialize()` 中查库 |
| Celery Task Pattern | @instrumented_task 模板 |
| API Development | 端点创建流程、OpenAPI 文档、设计规则（REST 规范） |
| Error Response | 错误必须用 `"detail"` 键（DRF 惯例） |
| Common Patterns | Feature Flags / Permissions / Options System / Logging / Arroyo Stream |
| Code Comments | 注释解释「为什么」而非「做什么」 |
| Architecture Rules | Silo Mode（Control Silo vs Region Silo）、数据库规范、复合索引策略 |
| Anti-Patterns | 禁止直接 import Model、同步外部调用、N+1 查询、函数内 import |
| Performance | 索引、分页、Redis 缓存、Celery 异步、select_related/prefetch_related |
| Debugging Tips | Django shell / SQL 查询调试 / Feature flag 检查 / Silo mode 查看 |
| File Location Map | Models / Endpoints / Serializers / Tasks / Integrations 等文件位置 |
| Integration Development | 集成开发模板（Integration + IntegrationProvider） |
| Python Typing | 输入参数用抽象类型(Sequence)，返回值用具体类型(list) |

**核心架构概念**：

```
Silo Mode（隔离模式）
├── Control Silo  → 用户认证、计费、组织管理
└── Region Silo   → 项目数据、事件、Issue

跨 Silo 规则：
- 禁止跨 Silo JOIN
- 使用 outbox 进行跨 Silo 更新
- 迁移必须向后兼容
```

---

### 3. `static/AGENTS.md` — 前端开发指南

**定位**：React/TypeScript 前端的完整开发参考手册（789 行）。

| 章节 | 内容 |
|------|------|
| Tech Stack | TypeScript / React 19 / Rspack / pnpm / Reflux + React Query(TanStack) / Emotion / Jest |
| 重要文件目录 | components / views / stores / actions / utils / types / api.tsx |
| Routing | React Router v6，懒加载路由 |
| Frontend API Calls | 使用 `apiOptions` + `useQuery`，**禁止** `useApiQuery`/`getApiQueryData`/`setApiQueryData` |
| Response Headers | 用 `selectJsonWithHeaders` 获取分页和计数头信息 |
| General Rules | 禁止新 Reflux store、禁止 class 组件、禁止 CSS 文件、必须 TypeScript |
| Core Components | Layout: Grid/Flex/Container（来自 @sentry/scraps/layout）|
| Typography | Heading/Text（来自 @sentry/scraps/text），禁止原生 h1-h6 |
| Assets | Image（@sentry/scraps/image）、Avatar 系列、Disclosure |
| Images & Icons | 图标放 static/app/icons，禁止内联 SVG；图片用 sentry-images 别名 |
| React Testing | 用户中心测试哲学、Query 优先级、Fixtures 用法 |
| Testing Best Practices | 禁止 mock hooks/functions、用 MockApiClient、用 screen、async 测试 |
| Network Request Testing | MockApiClient.addMockResponse 模式、异步断言、Mutation refetch 处理 |

**核心 UI 规范**：

```
组件使用优先级：
  Core Components (@sentry/scraps/*) > Emotion styled > 原生 HTML

Layout 组件：Grid / Flex / Container / Stack
Typography：Heading / Text（禁止原生 h1-h6, p, span）
Assets：Image / UserAvatar / TeamAvatar / ProjectAvatar / Disclosure
```

---

### 4. `tests/AGENTS.md` — Python 测试指南

**定位**：Python 后端测试的专项指南（116 行）。

| 章节 | 内容 |
|------|------|
| Running Tests Locally | 优先 `make test-selective`，回退 `pytest -svv --reuse-db <path>` |
| 测试文件定位规则 | `src/sentry/foo/bar.py` → `tests/sentry/foo/test_bar.py` |
| Snuba 兼容测试 | 必须放在 `tests/snuba/` |
| Testing Best Practices | pytest fixtures / mock 外部服务 / 数据库事务隔离 / 工厂模式 |
| Test Pattern | APITestCase + endpoint 属性 + self.get_success_response() |
| Date-stable Tests | 禁止使用当前/未来年份作为硬编码时间，用 before_now() |
| 工厂方法优先 | 必须用 self.create_* 工厂方法，禁止 Model.objects.create |
| pytest vs unittest | 必须用 pytest（pytest.raises），禁止 unittest（self.assertRaises） |
| File Location Map | tests/ 镜像 src/ 结构 |

**测试文件定位公式**：

```
源码: src/sentry/foo/bar.py
测试: tests/sentry/foo/test_bar.py

规则: 前缀 tests/ + 模块名前缀 test_
```

---

### 5. `static/app/utils/seer/AGENTS.md` — Seer 模块指南

**定位**：Seer/Autofix 设置工具模块的专项指南（96 行），是一个嵌套深度的模块级 AGENTS.md。

| 章节 | 内容 |
|------|------|
| API Endpoints | 4 个端点：coding-agents 列表、项目设置、Seer 偏好获取/更新 |
| React Query Keys | 3 个查询键：organizationIntegrationsCodingAgents / makeProjectSeerPreferencesQueryKey / bulkAutofixAutomationSettingsInfiniteOptions |
| Core Types | ProjectSeerPreferences / CodingAgentIntegration / UserFacingStoppingPoint |
| Stopping Point 映射 | UI 4 个值 → API 2 个字段（autofixAutomationTuning + automated_run_stopping_point） |
| Preferred Agent 存储 | Seer 选中 vs 外部 Agent 选中的不同存储方式 |
| Auto-Create PR | Seer Agent 和外部 Agent 的不同存储位置 |
| Optimistic Updates | 同时更新 ProjectsStore 和 preferences query cache |

**UI → API 映射表**：

```
UI 值          autofixAutomationTuning   automated_run_stopping_point
'off'         'off'                     (不变)
'root_cause'  'medium'                  'root_cause'
'plan'        'medium'                  'code_changes'
'create_pr'   'medium'                  'open_pr'
```

---

## 四、主题覆盖矩阵

| 主题 | 根 AGENTS.md | src/ | static/ | tests/ | seer/ |
|------|:---:|:---:|:---:|:---:|:---:|
| 项目概览 | **核心** | - | - | - | - |
| 命令执行 | **核心** | - | - | - | - |
| 技术栈 | 简介 | **详细** | **详细** | - | - |
| 安全规范 | - | **详细** | - | - | - |
| API 开发 | - | **详细** | - | - | - |
| 代码模式/模板 | - | **详细** | **详细** | - | - |
| 组件规范 | - | - | **详细** | - | - |
| 测试模式 | 命令 | - | **详细** | **核心** | - |
| 架构规则 | - | **详细** | - | - | - |
| 功能开关 | **详细** | 用法 | - | - | - |
| 调试技巧 | - | **详细** | - | - | - |
| 模块特定 API | - | - | - | - | **核心** |

---

## 五、设计模式总结

### 1. 分层上下文加载

```
根 AGENTS.md (全局通用)
  └── 按工作区域自动加载子 AGENTS.md
        ├── src/ → 后端上下文
        ├── static/ → 前端上下文
        ├── tests/ → 测试上下文
        └── 特定模块/ → 模块上下文 (如 seer/)
```

### 2. 文件大小分布

| 文件 | 行数 | 定位 |
|------|------|------|
| `static/AGENTS.md` | ~789 行 | 前端全量参考手册 |
| `src/AGENTS.md` | ~688 行 | 后端全量参考手册 |
| `AGENTS.md` (根) | ~258 行 | 全局入口 + 命令速查 |
| `tests/AGENTS.md` | ~116 行 | 测试专项指南 |
| `seer/AGENTS.md` | ~96 行 | 模块级工具指南 |

### 3. 内容组织原则

- **根文件**：只放全局通用的命令和规则，不深入具体技术细节
- **子文件**：各自覆盖独立领域，互不重复
- **模块文件**：可嵌套在任意深度的功能模块中，提供模块特定指导
- **交叉引用**：子文件通过 "see `X/AGENTS.md`" 引用根文件，避免内容重复
- **技能系统**：`.agents/skills/` 下存放独立的工作流技能（如 hybrid-cloud-rpc、lint-fix 等），与 AGENTS.md 互补

---

## 六、可借鉴的最佳实践

1. **分层加载**：根据文件路径自动匹配对应 AGENTS.md，减少无关上下文
2. **职责隔离**：每个 AGENTS.md 只负责自己的领域，通过引用而非复制来关联
3. **命令速查集中**：所有执行命令集中在根 AGENTS.md，子文件只放领域知识
4. **模板先行**：提供可直接复制粘贴的代码模板（endpoint / serializer / task）
5. **正反例对比**：每个规范都配有 ❌ 错误示例 和 ✅ 正确示例
6. **Anti-Patterns 清单**：明确列出「永远不要做的事」
7. **决策树**：为常见任务（添加 endpoint / 添加 task）提供快速决策路径
8. **模块级扩展**：支持在任意深度的功能模块中放置 AGENTS.md（如 seer/）
