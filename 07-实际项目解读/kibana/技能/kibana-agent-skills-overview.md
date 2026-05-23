# Kibana Agent Skills 总览

## 1. 概览

- 来源项目：`/home/duoyun/idea/open-source/kibana`
- 项目技能路径：`/home/duoyun/idea/open-source/kibana/.agents/skills/*/SKILL.md`
- 项目内 skills 数量：26 个
- 当前会话额外可用内置 skill：`customize-opencode`

这里的 `skill` 可以理解为面向特定任务的专用工作说明包。它不是独立项目代码，而是告诉 AI 在处理 Kibana 中某类任务时应该遵循哪些流程、约束、命令和最佳实践。

## 2. 分类索引

| 分类                | 相关 skills                                                                                      | 主要用途                                            |
| ------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| Scout / 测试迁移    | `scout-*`、`ftr-testing`、`cypress-to-scout-migration`、`enzyme-to-rtl`                          | 编写、迁移、评审 Kibana 测试                        |
| OAS / API 文档      | `validate-oas`、`debug-oas`、`improve-oas`、`fix-package-docs`                                   | 校验和改进 API/OpenAPI/JSDoc 文档                   |
| Kibana 平台开发     | `api-authz`、`task-manager-registration`、`encrypted-saved-objects`、`kibana-*`、`accessibility` | Kibana 插件、权限、任务、国际化、可访问性等平台能力 |
| 质量、安全与 CI     | `optimize-bundle-size`、`codeql`、`branch-readiness-checks`                                      | 代码质量、安全扫描、bundle 体积和 PR 前检查         |
| LLM Evals           | `evals-create-suite`、`evals-write-spec`                                                         | 创建和编写 LLM 评测套件                             |
| GitHub Issue 工作流 | `gh-create-issue`、`gh-enhance-issue`                                                            | 创建或增强 GitHub issue                             |

## 3. 项目 Skills 清单

| 分类           | Skill 名称                      | 功能概括                                                                                              |
| -------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 可访问性       | `accessibility`                 | 指导 Kibana/EUI 组件的无障碍实现，处理 ARIA、焦点、键盘交互、可访问名称和 a11y ESLint 问题。          |
| API 授权       | `api-authz`                     | 指导 Kibana API 路由授权配置，包括 `requiredPrivileges`、`authzResult`、权限命名和授权豁免。          |
| 分支检查       | `branch-readiness-checks`       | 在 push 或创建 PR 前检查分支状态、变更范围、测试、类型检查、CODEOWNERS 和 CI 风险。                   |
| 安全扫描       | `codeql`                        | 指导编写、测试和调试 Kibana 自定义 CodeQL 查询，并分析 SARIF 结果和 suppression 注释。                |
| 测试迁移       | `cypress-to-scout-migration`    | 将 Kibana Cypress E2E 测试迁移到 Scout/Playwright，并在迁移前评估覆盖、层级和测试价值。               |
| OAS 调试       | `debug-oas`                     | 针对指定 API 路径调试 OpenAPI 问题，区分结构性 invalid OAS 与描述、示例等文档质量问题。               |
| 加密对象       | `encrypted-saved-objects`       | 指导 Encrypted Saved Objects 的注册、AAD 属性选择、部分更新安全、模型版本迁移和 Serverless 限制。     |
| 测试迁移       | `enzyme-to-rtl`                 | 将 Enzyme React 测试迁移到 React Testing Library，替换 shallow/mount、选择器和断言方式。              |
| LLM Evals      | `evals-create-suite`            | 创建新的 LLM evaluation suite 包，包含 Playwright 配置、evaluate fixture 和 package 元数据。          |
| LLM Evals      | `evals-write-spec`              | 编写 LLM evaluation spec，包括 datasets、tasks、evaluators 和 `@kbn/evals` fixture 使用。             |
| API 文档       | `fix-package-docs`              | 修复 Kibana 插件或 package 的公共 API JSDoc/API 文档问题，通常用于 `check_package_docs` 失败场景。    |
| FTR 测试       | `ftr-testing`                   | 解释和指导 Kibana Functional Test Runner 的配置、服务、page objects、数据加载、标签和常见测试模式。   |
| GitHub Issue   | `gh-create-issue`               | 根据用户的非结构化描述判断 bug/feature 类型，补全 Kibana issue 模板并通过 GitHub CLI 创建 issue。     |
| GitHub Issue   | `gh-enhance-issue`              | 读取已有 GitHub issue，自动分类并按 Kibana bug report 或 feature request 模板重写完善。               |
| OAS 改进       | `improve-oas`                   | 为 Kibana API 补充或改进 OpenAPI 描述、字段说明、示例、代码样例和响应 schema。                        |
| Kibana API     | `kibana-api`                    | 提供本地 Kibana API 调用辅助能力，包括自动识别 Kibana URL、认证信息和封装 `kibana_curl`。             |
| 国际化         | `kibana-i18n`                   | 指导 Kibana React 和服务端代码国际化，包括 `i18n.translate`、`FormattedMessage` 和 message ID 命名。  |
| 权限弃用       | `kibana-privilege-deprecation`  | 指导 Kibana feature privilege 的弃用、重命名、拆分、合并和 `replacedBy` 映射。                        |
| Bundle 优化    | `optimize-bundle-size`          | 分析和降低插件 page load bundle 体积，避免不必要修改 `packages/kbn-optimizer/limits.yml`。            |
| Scout API 测试 | `scout-api-testing`             | 指导创建、调试和评审 Scout API 测试，包括 `apiTest`、`apiClient`、认证选择和响应断言。                |
| Scout 评审     | `scout-best-practices-reviewer` | 对 Scout UI/API 测试做最佳实践评审，关注复用、隔离、权限、稳定性和迁移等价性。                        |
| Scout 脚手架   | `scout-create-scaffold`         | 为 Kibana 插件或 package 生成或修复 Scout API/UI 测试脚手架、Playwright 配置和示例 spec。             |
| FTR 迁移       | `scout-migrate-from-ftr`        | 将 Functional Test Runner 测试迁移到 Scout，强调先制定迁移计划、人工确认、再执行和运行测试。          |
| Scout UI 测试  | `scout-ui-testing`              | 指导编写、更新、调试和评审 Scout UI 测试，包括 Playwright fixture、页面对象、登录、空间和 a11y 检查。 |
| 后台任务       | `task-manager-registration`     | 指导注册和调度 Kibana Task Manager 后台任务，覆盖 schema、超时、取消、重试、优先级和资源成本。        |
| OAS 校验       | `validate-oas`                  | 对指定 Kibana OAS 区域做快速校验，确保生成输入最新，并给出 VALID 或 NOT VALID 结果。                  |

## 4. 内置 Skill 说明

| Skill 名称           | 来源                                               | 功能概括                                                                                                                      |
| -------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `customize-opencode` | OpenCode 内置，不在 Kibana `.agents/skills` 目录中 | 用于编辑或创建 OpenCode 自身配置，例如 `opencode.json`、`.opencode/`、agent、subagent、skill、plugin、MCP server 和权限规则。 |

## 5. 使用建议

| 任务场景           | 优先查看的 skills                                                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 新增或迁移测试     | `scout-ui-testing`、`scout-api-testing`、`scout-create-scaffold`、`scout-migrate-from-ftr`、`cypress-to-scout-migration`、`enzyme-to-rtl` |
| 维护旧 FTR 测试    | `ftr-testing`、`scout-migrate-from-ftr`                                                                                                   |
| API 路由权限       | `api-authz`                                                                                                                               |
| OpenAPI 校验或修复 | `validate-oas`、`debug-oas`、`improve-oas`                                                                                                |
| 公共 API 文档问题  | `fix-package-docs`                                                                                                                        |
| Saved Objects 加密 | `encrypted-saved-objects`                                                                                                                 |
| 后台任务注册       | `task-manager-registration`                                                                                                               |
| 国际化和无障碍     | `kibana-i18n`、`accessibility`                                                                                                            |
| PR 前质量检查      | `branch-readiness-checks`、`codeql`、`optimize-bundle-size`                                                                               |
| LLM 评测           | `evals-create-suite`、`evals-write-spec`                                                                                                  |
| GitHub issue 整理  | `gh-create-issue`、`gh-enhance-issue`                                                                                                     |

## 6. 哪些 Skills 真正和开发相关

这些 skills 不是通用的“功能开发指南”。它们更像 Kibana 项目里的专项操作手册：当开发过程中遇到权限、后台任务、加密对象、国际化、测试迁移、API 文档、CI 检查等具体问题时，才加载对应 skill。

### 6.1 直接服务于功能开发

| Skill 名称                     | 适用开发场景                                                       |
| ------------------------------ | ------------------------------------------------------------------ |
| `api-authz`                    | 开发 Kibana API route 时配置接口权限、权限分支和授权豁免。         |
| `task-manager-registration`    | 开发后台任务、定时任务、异步任务 runner。                          |
| `encrypted-saved-objects`      | 开发需要加密存储配置、密钥、连接信息等 Saved Objects 的功能。      |
| `kibana-i18n`                  | 开发 UI 或服务端文案时做国际化。                                   |
| `accessibility`                | 开发 React/EUI UI 时处理无障碍、键盘操作、ARIA 和 a11y lint 问题。 |
| `kibana-privilege-deprecation` | 修改 Kibana feature privilege、权限模型或做权限迁移。              |
| `kibana-api`                   | 本地开发和调试 Kibana API 时快速发请求、处理 URL 和认证。          |

### 6.2 开发辅助类

| Skill 名称                | 辅助作用                                               |
| ------------------------- | ------------------------------------------------------ |
| `scout-ui-testing`        | 为新 UI 功能补充 Scout/Playwright UI 测试。            |
| `scout-api-testing`       | 为新 API 功能补充 Scout API 测试。                     |
| `scout-create-scaffold`   | 给插件或 package 初始化 Scout 测试目录和配置。         |
| `validate-oas`            | 开发或修改 API 后快速确认 OAS 是否有效。               |
| `debug-oas`               | API OAS 校验失败时定位 schema 或文档问题。             |
| `improve-oas`             | 为新 API 或已有 API 补充 OpenAPI 描述、示例和 schema。 |
| `fix-package-docs`        | package 公共 API 文档不完整时补 JSDoc。                |
| `optimize-bundle-size`    | 前端改动导致页面 bundle 变大时定位和优化依赖。         |
| `branch-readiness-checks` | 开发完成后做提交或 PR 前检查。                         |
| `codeql`                  | 涉及安全规则、CodeQL 查询或安全扫描结果时使用。        |

### 6.3 偏迁移、维护或流程类

| Skill 名称                      | 主要用途                                           |
| ------------------------------- | -------------------------------------------------- |
| `ftr-testing`                   | 理解和维护旧 FTR 测试，或为迁移 Scout 做准备。     |
| `scout-migrate-from-ftr`        | 把旧 FTR 测试迁移到 Scout。                        |
| `cypress-to-scout-migration`    | 把 Cypress E2E 测试迁移到 Scout。                  |
| `enzyme-to-rtl`                 | 把 Enzyme React 测试迁移到 React Testing Library。 |
| `scout-best-practices-reviewer` | 评审 Scout 测试质量、稳定性和迁移等价性。          |
| `evals-create-suite`            | 创建 LLM evaluation suite，不是普通业务功能开发。  |
| `evals-write-spec`              | 编写 LLM eval spec，不是普通业务功能开发。         |
| `gh-create-issue`               | 创建 GitHub issue。                                |
| `gh-enhance-issue`              | 整理和增强已有 GitHub issue。                      |

### 6.4 结论

如果目标是“学习 Kibana 怎么开发一个新功能”，这些 skills 只能覆盖一部分专项环节。真正需要看的仍然是 Kibana 的插件结构、`kibana.jsonc`、`public`/`server` 目录、setup/start 生命周期、route 注册、service 注入、UI app 注册、现有测试和相邻功能实现。

这些 skills 的价值在于：当你已经在做某个具体开发任务时，它们能提醒你 Kibana 项目在该领域的规范和踩坑点。
