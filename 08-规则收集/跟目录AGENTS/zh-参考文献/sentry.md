# Sentry AI 代理开发指南

> **重要提示**：AGENTS.md 文件是 AI 代理指令的权威来源。添加或修改代理指导时，始终更新对应的 AGENTS.md 文件。不要添加到 CLAUDE.md 或 Cursor rules 中。

## 概览

Sentry 是一个面向开发者的错误追踪和性能监控平台。本仓库包含 Sentry 主应用，这是一个大规模的 Django 应用，前端使用 React。

## 项目结构

```
sentry/
├── src/
│   ├── sentry/           # 主 Django 应用
│   │   ├── api/          # REST API 端点
│   │   ├── models/       # Django 模型
│   │   ├── tasks/        # Celery 任务
│   │   ├── integrations/ # 第三方集成
│   │   ├── issues/       # Issue 追踪逻辑
│   │   └── web/          # Web 视图和中间件
│   ├── sentry_plugins/   # 插件系统
│   └── social_auth/      # 社交认证
├── static/               # 前端应用
├── tests/                # 后端测试套件
├── fixtures/             # 测试固件
├── devenv/               # 开发环境配置
├── migrations/           # 数据库迁移
└── config/               # 配置文件
```

## 命令执行指南

本节包含适用于所有 Sentry 开发的关键命令执行说明。

### Python 命令执行要求

**关键要求**：运行 Python 命令（pytest、mypy、prek 等）时，必须使用虚拟环境。

#### AI 代理（自动化命令）

使用虚拟环境可执行文件的完整相对路径：

```bash
cd /path/to/sentry && .venv/bin/pytest tests/...
cd /path/to/sentry && .venv/bin/python -m mypy ...
```

或在命令中 source activate 脚本：

```bash
cd /path/to/sentry && source .venv/bin/activate && pytest tests/...
```

**AI 代理注意事项：**

- 运行 Python 命令时始终使用 `required_permissions: ['all']` 以避免沙箱权限问题
- `.venv/bin/` 前缀确保使用正确的 Python 解释器和依赖

### 后端开发命令

#### 环境设置

```bash
# 刷新依赖。
# SENTRY_DEVENV_FRONTEND_ONLY=1 跳过迁移，pytest 不需要。强烈推荐。
SENTRY_DEVENV_FRONTEND_ONLY=1 devenv sync

# 刷新依赖，应用迁移
# 仅在需要可用的开发服务器时才需要。
devenv sync

direnv allow    # 激活环境
devservices up  # 启动服务
```

运行 `pytest` 所需的操作就这些。

`devservices serve` 启动开发服务器。

#### Lint

prek 是所有 lint、格式化和类型检查工具的统一入口。

在认为任务完成之前，运行：

```bash
cd /path/to/sentry && .venv/bin/prek run -q
```

prek 会自动检测已更改的文件。要运行特定的 hook：

```bash
.venv/bin/prek run -q mypy --files src/sentry/foo/bar.py
.venv/bin/prek run -q ruff --files src/sentry/foo/bar.py
```

如果某个 hook 失败，修复问题、暂存更改，然后重新运行直到通过。

#### 测试

对于后端范围的更改，始终先尝试 `make test-selective`。它会检测本地差异影响了哪些测试并仅运行这些测试，使反馈循环快得多。当需要运行特定文件或 `test-selective` 未覆盖你的场景时，再回退到 `pytest`。

```bash
# 运行特定的测试文件。
# 不要直接运行 pytest 本身；那会花费很长时间！
.venv/bin/pytest -n3 -svv --reuse-db tests/sentry/api/test_base.py
```

#### 数据库操作

```bash
# 运行迁移
sentry django migrate

# 创建新迁移
sentry django makemigrations

# rebase 冲突后更新迁移（处理重命名、依赖、锁文件）
./bin/update-migration <migration_name_or_number> <app_label>
# 示例：./bin/update-migration 0101_workflow_when_condition_group_unique workflow_engine

# 重置数据库
make reset-db
```

### 前端开发命令

#### 开发环境设置

```bash
# 启动完整开发服务器（需要 devservices up）
pnpm run dev

# 仅启动带热重载的 UI 开发服务器
# 将 API 请求代理到生产环境 sentry.io
pnpm run dev-ui
```

**开发服务器 URL：**

- 完整开发服务器：http://dev.getsentry.net:8000
- 仅前端（`dev-ui`）：https://sentry.dev.getsentry.net:7999/

#### 类型检查

要类型检查前端代码，运行 `pnpm typecheck` 脚本。
它会检查整个项目且不接受文件路径。
不要直接使用 `tsc`。

```bash
pnpm run typecheck
```

#### Lint

```bash
# JavaScript/TypeScript lint
pnpm run lint:js

# 对特定文件运行 lint
pnpm run lint:js components/avatar.tsx [...其他文件]

# 修复 lint 问题
pnpm run fix
```

#### 测试

```bash
# 运行 JavaScript 测试
pnpm test-ci <file_path>

# 运行特定的测试文件
pnpm test-ci components/avatar.spec.tsx
```

### Git worktrees

每个 worktree 都有自己的 `.venv`。当你使用 `git worktree add` 创建新 worktree 时，post-checkout hook 会在新 worktree 中运行 `devenv sync` 来设置开发环境。否则在新 worktree 中手动运行一次 `devenv sync`，然后运行 `direnv allow` 来验证并激活开发环境。

### 上下文感知加载

根据你正在工作的区域使用对应的 AGENTS.md：

- **后端**（`src/**/*.py`）→ `src/AGENTS.md`（后端模式）
- **测试**（`tests/**/*.py`、`src/**/tests/**/*.py`）→ `tests/AGENTS.md`（测试模式）
- **前端**（`static/**/*.{ts,tsx,js,jsx,css,scss}`）→ `static/AGENTS.md`（前端模式）
- **通用** → 本文件（`AGENTS.md`）用于 Sentry 概览和命令

工作流引导（提交、pre-commit、混合云等）位于 **skills**（`.agents/skills/`）中。在对应目录树中工作时，附加或阅读对应区域的 `AGENTS.md`。在适当的 AGENTS.md 或 skill 中添加或更新指导——不要在编辑器特定的规则文件中重复冗长的指导。

## 查看者/组织上下文

- 查看者身份通过 `ViewerContext` contextvar 在应用中传递；当当前查看者在作用域内时，使用 `sentry.viewer_context.get_viewer_context()` 而非显式传递组织/用户身份。

## 代理技能

`.agents/skills/` 下的技能应遵循与仓库其余部分相同的现有惯例：

- 优先使用基于差异的评审工作流。当没有提供明确的文件或补丁时，默认使用当前分支差异。
- 保持技能描述与自然用户请求对齐，如 PR 评审、分支审计和 Warden 跟进。
- 如果下游评审工具控制最终响应格式，不要在技能中硬编码竞争的输出格式。改为指定所需的证据。

## 后端

后端开发模式、安全指南和架构说明，参见 `src/AGENTS.md`。
后端测试模式和最佳实践，参见 `tests/AGENTS.md`。

## 前端

前端开发模式、设计系统指南和 React 测试最佳实践，参见 `static/AGENTS.md`。

## Feature Flags（FlagPole）

新功能应通过 feature flag 控制。

1. **注册** flag，在 `src/sentry/features/temporary.py` 中：

   ```python
   manager.add("organizations:my-feature", OrganizationFeature, FeatureHandlerStrategy.FLAGPOLE, api_expose=True)
   ```

   如果前端需要检查 flag，使用 `api_expose=True`。项目范围的 flag 使用 `ProjectFeature` 和 `projects:` 前缀。

2. **Python 检查**：

   ```python
   if features.has("organizations:my-feature", organization, actor=user):
   ```

3. **前端检查**（需要 `api_expose=True`）：

   ```typescript
   organization.features.includes('my-feature');
   ```

4. **测试**：

   ```python
   with self.feature("organizations:my-feature"):
       ...
   ```

5. **灰度发布**：FlagPole YAML 配置位于 `sentry-options-automator` 仓库中，不在此处。

完整文档参见 https://develop.sentry.dev/feature-flags/。

## 客户信息

**绝不在 pull request、提交或代码中包含客户信息。** 这包括组织 slug、用户邮箱、账户名称、与特定客户关联的内部 ID、支持工单详情，以及任何其他识别 Sentry 客户的数据。在 PR 描述、提交消息、代码注释、测试和固件中使用匿名化或合成的示例（`org-slug`、`user@example.com`）。如果调试需要真实标识符，将其保留在内部工具中（Slack、工单、私人笔记）——不要放入公共 git 历史中。

## Pull Requests

前端（`static/`）和后端（`src/`、`tests/`）**不是原子部署的**。CI 检查会强制执行此规则。

- 如果你的更改同时涉及前端和后端，请拆分为**独立的 PR**。
- 当前端依赖新的 API 更改时，先合并后端 PR。
- 纯测试添加与 `src/` 更改在同一 PR 中是可以的。
