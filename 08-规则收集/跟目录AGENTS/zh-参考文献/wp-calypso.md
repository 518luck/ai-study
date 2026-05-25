# AGENTS.md

## 仓库布局

- client/ — 主应用客户端，以单页 React 应用形式部署。
- packages/ — 跨客户端共享库。
- apps/ — 独立小程序，单独部署。

## 客户端

- **Calypso** — 经典 WordPress.com 托管仪表盘，使用 Redux 共享数据，通过 Webpack section chunks 拆分。
  - client/my-sites — 按站点管理；已弃用，推荐使用 Dashboard 客户端
  - client/my-sites/checkout — 结账流程
  - client/me/purchases — 购买管理
  - client/landing/stepper — 引导/注册流程（站点创建、域名购买、迁移向导）
  - client/reader — WordPress.com 阅读器：信息流、发现、对话、点赞、列表、关注管理
  - 共享基础设施：client/components、client/state、client/lib、client/layout
- **Jetpack Cloud**（client/jetpack-cloud）— 复用 Calypso 共享基础设施（client/state、client/components）。
- **A8C for Agencies**（client/a8c-for-agencies）— 复用 Calypso 共享基础设施。
- **Dashboard**（client/dashboard）— 新的多站点仪表盘。自包含：不复用 Calypso 客户端代码。拥有自己的组件、数据获取（TanStack Query）和路由（TanStack Router）。
  - client/dashboard/me/billing-purchases — 账单和购买管理

## 包

- **Help Center**（`packages/help-center`）— WordPress.com 支持的共享组件库。也通过 `apps/help-center/` 部署到 `widgets.wp.com`。
- **Image Studio**（`packages/image-studio`）— AI 驱动的图片编辑和生成
- **Block Notes**（`packages/block-notes`）— WordPress 的 AI 驱动块评论系统

## 应用

- **Help Center**（`apps/help-center`）— 构建/部署层，将 `packages/help-center` 打包为从 `widgets.wp.com` 提供服务的 webpack 入口点。

## 开发

> **注意**：Calypso 开发服务器使用 `PORT` 环境变量（检查仓库根目录的 `.env`），默认端口为 `3000`。除非明确要求，否则不要创建或修改 `.env`。

```bash
# 安装
yarn install

# 构建并启动开发服务器
yarn start

# 仅构建并启动 Dashboard 客户端的开发服务器
yarn start-dashboard
```

## 测试说明

> **注意**：E2E 测试需要本地 Calypso 开发实例处于运行状态。

```bash
# JavaScript 测试
yarn test                                       # 运行 client、packages、server 和 build-tools 的单元测试
yarn test-build-tools                           # 运行 build-tools 的单元测试
yarn test-client                                # 运行 client 的单元测试
yarn test-integration                           # 运行集成测试
yarn test-apps                                  # 运行 apps 的单元测试
yarn test-packages                              # 运行 packages 的单元测试
yarn test-server                                # 运行 server 的单元测试
yarn test-server:coverage                       # 运行带覆盖率信息的 server 单元测试

yarn test-client:watch                          # 以 watch 模式运行 client 单元测试
yarn test-client <path_to_test_directory>       # 从指定目录运行 client 单元测试
yarn test-client --testNamePattern="<TestName>" # 运行特定的 client 单元测试

# E2E 测试 - 参见：test/e2e/AGENTS.md

# 代码质量
yarn lint             # Lint 所有内容
yarn lint:css         # Lint CSS
yarn lint:js          # Lint JavaScript
yarn reformat-files   # 使用 Prettier 修复格式
yarn typecheck-client # 类型检查 client
```

## Pre-PR 检查

在推送分支或运行 `gh pr create` 之前，先运行 CI 将执行的那些类型检查。涉及 `client/` 的 PR 可能在打开后未通过 `type_check_client` CI 检查，因此先在本地验证：

```bash
yarn               # 如果尚未安装依赖，先安装
yarn typecheck-client
```

如果失败，在源头修复类型错误——不要使用 `// @ts-expect-error`、`// @ts-ignore` 或 `as any` 来消除错误，除非你能在 PR 描述中说明理由。其他相关时值得运行的 CI 类型检查：`yarn typecheck-packages`、`yarn typecheck-apps`。

## 创建 Pull Requests

- 以 Draft 状态创建 PR。遵循 .github/PULL_REQUEST_TEMPLATE.md 中的模板。
- 遵循 docs/git-workflow.md 中的分支命名约定。
- 在 PR 描述中：
  - 使用 Linear issue ID（例如 `LIN-123`）而非完整的 Linear URL。
  - 避免提及人名。
  - 不要链接到 wordpress.com URL。
  - 包含 .github/PULL_REQUEST_TEMPLATE.md 中的所有检查项。仅在实际适用时将项目标记为已完成（`[x]`）；不适用的项目保持未勾选（`[ ]`）。
