# Kibana Skills 全景概述

> 本文档概述了 Kibana 项目中全部 **26 个 Skills** 的作用与分类。Skills 存放于 `.claude/skills/` 和 `.agents/skills/`（两者内容完全一致）。

---

## 一、目录结构

```
skills-md/
├── .claude/skills/          ← 完整复制自 .claude/skills/
│   ├── accessibility/
│   │   ├── SKILL.md
│   │   └── references/      (14 个参考文件)
│   ├── api-authz/
│   │   └── SKILL.md
│   ├── branch-readiness-checks/
│   │   ├── SKILL.md
│   │   └── agents/          (openai.yaml)
│   ├── codeql/
│   │   ├── SKILL.md
│   │   └── scripts/         (fetch_sarif.mjs)
│   ├── cypress-to-scout-migration/
│   │   ├── SKILL.md
│   │   ├── references/      (4 个参考文件)
│   │   └── scripts/         (2 个 shell 脚本)
│   ├── debug-oas/
│   │   ├── SKILL.md
│   │   └── scripts/         (extract_structural_oas_issues.js)
│   ├── encrypted-saved-objects/
│   │   └── SKILL.md
│   ├── enzyme-to-rtl/
│   │   └── SKILL.md
│   ├── evals-create-suite/
│   │   └── SKILL.md
│   ├── evals-write-spec/
│   │   ├── SKILL.md
│   │   └── references/      (evaluator-patterns.md)
│   ├── fix-package-docs/
│   │   └── SKILL.md
│   ├── ftr-testing/
│   │   └── SKILL.md
│   ├── gh-create-issue/
│   │   └── SKILL.md
│   ├── gh-enhance-issue/
│   │   └── SKILL.md
│   ├── improve-oas/
│   │   └── SKILL.md
│   ├── kibana-api/
│   │   └── SKILL.md
│   ├── kibana-i18n/
│   │   └── SKILL.md
│   ├── kibana-privilege-deprecation/
│   │   ├── SKILL.md
│   │   └── references/      (reference.md)
│   ├── optimize-bundle-size/
│   │   └── SKILL.md
│   ├── scout-api-testing/
│   │   ├── SKILL.md
│   │   └── references/      (2 个参考文件)
│   ├── scout-best-practices-reviewer/
│   │   ├── SKILL.md
│   │   └── OUTPUT.md
│   ├── scout-create-scaffold/
│   │   └── SKILL.md
│   ├── scout-migrate-from-ftr/
│   │   ├── SKILL.md
│   │   └── references/      (4 个参考文件)
│   ├── scout-ui-testing/
│   │   ├── SKILL.md
│   │   └── references/      (2 个参考文件)
│   ├── task-manager-registration/
│   │   └── SKILL.md
│   └── validate-oas/
│       └── SKILL.md
│
├── .agents/skills/          ← 完整复制自 .agents/skills/（与 .claude/skills/ 一致）
│
└── SKILLS_OVERVIEW.md       ← 本文件
```

---

## 二、按功能域分类

### 1. 测试框架与迁移 (8 个)

| Skill | 简述 |
|---|---|
| **enzyme-to-rtl** | 将 Enzyme 测试迁移到 React Testing Library，保持 1:1 移植，不改变测试意图 |
| **ftr-testing** | Kibana FTR（功能测试运行器）深度参考，涵盖配置、服务、页面对象、数据加载 |
| **scout-api-testing** | 编写 Scout API 测试（Playwright），包括 apiTest、认证模式、响应断言 |
| **scout-ui-testing** | 编写 Scout UI 测试，包括页面对象、浏览器认证、并行测试（spaceTest）、防抖控制 |
| **scout-create-scaffold** | 生成 Scout 测试脚手架目录结构（api/ui Playwright 配置、fixtures、示例 spec） |
| **scout-migrate-from-ftr** | FTR 测试迁移到 Scout 的统一入口，含五步工作流（计划→审核→执行→运行→审查） |
| **scout-best-practices-reviewer** | 审查 Scout 测试是否符合最佳实践、复用性和迁移对等性 |
| **cypress-to-scout-migration** | 将 Cypress E2E 测试迁移到 Scout（Playwright），含分类门控、模式映射、数据清理 |

### 2. OpenAPI / API 文档 (4 个)

| Skill | 简述 |
|---|---|
| **api-authz** | Kibana API 路由授权模式（requiredPrivileges、authzResult、自定义权限命名） |
| **validate-oas** | 快速校验指定 API 区域的 OpenAPI 规范是否合法，返回 VALID / NOT VALID |
| **debug-oas** | 调试 OpenAPI 问题，按路径过滤输出，区分结构性错误和文档质量缺陷 |
| **improve-oas** | 为 API 区域补充描述、示例、代码片段等 OpenAPI 文档内容 |

### 3. 代码质量 (2 个)

| Skill | 简述 |
|---|---|
| **accessibility** | 无障碍开发指南，包括 ARIA 属性、焦点管理、键盘交互、EUI 组件规范 |
| **optimize-bundle-size** | 优化插件页面加载包大小，避免 CI 指标超限 |

### 4. 文档与国际化 (2 个)

| Skill | 简述 |
|---|---|
| **fix-package-docs** | 使用 check_package_docs 系统化修复插件/包的 API 文档问题（JSDoc 规范） |
| **kibana-i18n** | 使用 @kbn/i18n 和 @kbn/i18n-react 为 React 组件和服务端代码添加国际化 |

### 5. 安全与数据 (2 个)

| Skill | 简述 |
|---|---|
| **encrypted-saved-objects** | 加密保存对象（ESO）的注册、AAD 属性选择、模型版本迁移、Serverless 约束 |
| **codeql** | 在 Kibana 中编写、测试、调试 CodeQL 查询，获取扫描结果，验证抑制注释 |

### 6. DevOps / GitHub (3 个)

| Skill | 简述 |
|---|---|
| **branch-readiness-checks** | 推送/PR 前验证分支就绪状态（基于 diff 和 check_changes） |
| **gh-create-issue** | 通过交互式访谈收集信息，按 Kibana 模板创建结构化 GitHub Issue |
| **gh-enhance-issue** | 获取已有 GitHub Issue 并按 Kibana 模板重格式化，自动分类并更新 |

### 7. 基础设施 (3 个)

| Skill | 简述 |
|---|---|
| **kibana-api** | 与本地 Kibana 实例交互的 Shell 工具（自动检测 URL/认证，kibana_curl 封装） |
| **task-manager-registration** | 注册和调度 Kibana 后台任务（Task Manager），涵盖超时/成本/优先级/重试配置 |
| **kibana-privilege-deprecation** | 实现功能权限的向后兼容弃用（重命名、拆分、合并、replacedBy 映射） |

### 8. LLM 评估 (2 个)

| Skill | 简述 |
|---|---|
| **evals-create-suite** | 搭建新的 LLM 评估套件包（Playwright 配置、evaluate fixture、包文件） |
| **evals-write-spec** | 编写 LLM 评估规格文件，包括数据集、任务、评估器（CODE/LLM-as-Judge/RAG/Trace） |

---

## 三、各 Skill 详细说明

### 1. accessibility
**路径**: `accessibility/SKILL.md`
**作用**: 提供无障碍开发指导。当编写或重构 EUI 组件、修复 `@elastic/eui/*` ESLint 错误、或需要 ARIA 属性/焦点/键盘/命名约定时使用。包含 12 个组件级参考文档（callouts、data_tables、form_layout、overlays 等）和 ESLint 规则映射。

### 2. api-authz
**路径**: `api-authz/SKILL.md`
**作用**: 指导 Kibana API 路由的授权配置。所有 API 路由必须有授权检查（包括 internal 路由）。涵盖 `requiredPrivileges` 声明、`authzResult` 权限分支、自定义权限命名规范、以及如何选择退出授权。

### 3. branch-readiness-checks
**路径**: `branch-readiness-checks/SKILL.md`
**作用**: 在推送代码或创建 PR 前执行聚焦检查。使用有界轮询（非固定超时），运行 `git diff`、`check_changes.ts` 等命令验证分支状态。内含 OpenAI agent 定义文件。

### 4. codeql
**路径**: `codeql/SKILL.md`
**作用**: 指导在 Kibana 中使用 CodeQL 进行安全查询。涵盖项目布局、编写/测试自定义查询、从 GitHub 获取扫描结果（SARIF）、验证内联抑制注释。包含 `fetch_sarif.mjs` 脚本。

### 5. cypress-to-scout-migration
**路径**: `cypress-to-scout-migration/SKILL.md`
**作用**: 将 Cypress E2E 测试迁移到 Scout（Playwright）。包含分类门控（重复检测、层级分析、价值评估）、Cypress-Scout 模式映射、数据清理审计、PR 工作流。含 4 个参考文档和 2 个辅助脚本。

### 6. debug-oas
**路径**: `debug-oas/SKILL.md`
**作用**: 调试特定 API 区域的 OpenAPI 问题。使用 `--path` 过滤验证输出，将问题分为 `structural`（结构性错误）和 `quality`（文档质量缺陷）两类。含 JS 脚本用于提取结构性问题。

### 7. encrypted-saved-objects
**路径**: `encrypted-saved-objects/SKILL.md`
**作用**: 指导加密保存对象（ESO）的使用。ESO 保护凭据、API 密钥、PII 等敏感数据。涵盖注册、AAD 属性选择、部分更新安全、`createModelVersion` 版本迁移、`canEncrypt` 检查和 Serverless 约束。错误的 ESO 变更可能导致对象永久无法解密。

### 8. enzyme-to-rtl
**路径**: `enzyme-to-rtl/SKILL.md`
**作用**: 将 Enzyme 测试迁移到 React Testing Library。核心原则是 1:1 移植——保持原有测试意图，不重写逻辑。指导如何替换 enzyme 选择器为 RTL 查询、处理快照测试、添加缺失的 provider/context mock。

### 9. evals-create-suite
**路径**: `evals-create-suite/SKILL.md`
**作用**: 搭建新的 LLM 评估套件。评估套件是独立的 Playwright 项目，使用 `@kbn/evals` 的 `evaluate` fixture 运行 LLM 实验。收集套件名称、父目录、owner、group、visibility 等输入参数来生成脚手架。

### 10. evals-write-spec
**路径**: `evals-write-spec/SKILL.md`
**作用**: 编写 LLM 评估规格文件。使用 `evaluate` Playwright fixture 定义数据集（datasets）、任务（tasks）和评估器（evaluators）。支持 CODE、LLM-as-Judge、RAG、Trace 四种评估器模式。

### 11. fix-package-docs
**路径**: `fix-package-docs/SKILL.md`
**作用**: 系统化修复插件/包的 API 文档问题。使用 `check_package_docs` 工具验证，确保 JSDoc 只添加到导出的公共 API，不改变运行时行为，遵循 `/** */` 风格和 `@param name - Description.` 格式。

### 12. ftr-testing
**路径**: `ftr-testing/SKILL.md`
**作用**: FTR（功能测试运行器）的深度参考。FTR 是 Kibana 的传统端到端测试框架，基于 Mocha。涵盖 Provider 上下文、配置解剖、服务发现、页面对象、`loadTestFile` 模式、数据加载、标签系统、CI 接线和常见惯用法。

### 13. gh-create-issue
**路径**: `gh-create-issue/SKILL.md`
**作用**: 通过交互式访谈引导用户创建结构化 GitHub Issue。先收集非结构化描述，分类为 Bug 报告或功能请求，按 Kibana 模板填充，通过追问改善弱项，最后通过 GitHub CLI 提交。

### 14. gh-enhance-issue
**路径**: `gh-enhance-issue/SKILL.md`
**作用**: 获取已有 GitHub Issue 并重格式化。通过 Issue 编号或 URL 获取，自动分类为 Bug/功能请求，按 Kibana 模板重写正文，通过 GitHub CLI 更新。

### 15. improve-oas
**路径**: `improve-oas/SKILL.md`
**作用**: 为 API 区域补充 OpenAPI 文档内容。自动检测插件的 OAS 贡献方式，先运行 `debug-oas` 获取当前问题列表，然后系统化添加描述、示例、代码片段和弃用标记。

### 16. kibana-api
**路径**: `kibana-api/SKILL.md`
**作用**: 提供 Shell 工具函数，供其他 skill 调用 Kibana API。自动检测本地 Kibana URL 和认证信息，提供 `kibana_curl` 封装器。不是独立使用的 skill，而是被其他 skill 引用的基础工具。

### 17. kibana-i18n
**路径**: `kibana-i18n/SKILL.md`
**作用**: 指导 Kibana 国际化实现。所有用户可见文本必须国际化。涵盖 `i18n.translate()` 调用、`FormattedMessage` 使用、消息 ID 命名规范（`插件名.领域.描述`）、翻译文件管理。

### 18. kibana-privilege-deprecation
**路径**: `kibana-privilege-deprecation/SKILL.md`
**作用**: 指导功能权限的向后兼容弃用。使用 `replacedBy` 映射系统实现重命名、拆分、合并、能力迁移。弃用的功能在角色管理 UI 中隐藏，但权限仍在 Elasticsearch 中注册以保持兼容性。

### 19. optimize-bundle-size
**路径**: `optimize-bundle-size/SKILL.md`
**作用**: 优化插件页面加载包大小。先建立基线，再通过懒加载、代码分割、tree-shaking 等手段将非关键代码移出入口 bundle，避免增加 `limits.yml` 中的限制。

### 20. scout-api-testing
**路径**: `scout-api-testing/SKILL.md`
**作用**: 指导编写 Scout API 测试。涵盖 `apiTest` 使用、认证模式选择（requestAuth/samlAuth/apiKey）、API 服务模式、响应断言。API 测试禁用浏览器 fixture，专注 HTTP 层验证。

### 21. scout-best-practices-reviewer
**路径**: `scout-best-practices-reviewer/SKILL.md`
**作用**: 对 Scout 测试进行静态 PR 审查。检查是否符合最佳实践、是否复用已有抽象（fixtures、页面对象、API helpers），产出可操作的审查反馈。可被解决方案特定的扩展 skill 增强。

### 22. scout-create-scaffold
**路径**: `scout-create-scaffold/SKILL.md`
**作用**: 生成 Scout 测试目录脚手架。优先使用 `node scripts/scout.js generate` 命令。收集模块根路径、测试类型（api/ui/both）、Scout 目录名等参数，生成 Playwright 配置、fixtures 和示例 spec。

### 23. scout-migrate-from-ftr
**路径**: `scout-migrate-from-ftr/SKILL.md`
**作用**: FTR 到 Scout 迁移的统一入口。执行五步工作流：分析 FTR 套件→生成迁移计划→用户审核→执行转换→验证最佳实践。计划阶段前置所有决策（UI/API/RTL、并行性、认证、批处理）。

### 24. scout-ui-testing
**路径**: `scout-ui-testing/SKILL.md`
**作用**: 指导编写 Scout UI 测试。涵盖顺序/并行测试模式（spaceTest + scoutSpace 空间隔离）、页面对象编写、浏览器认证、a11y 检查和防抖控制。

### 25. task-manager-registration
**路径**: `task-manager-registration/SKILL.md`
**作用**: 指导注册和调度 Kibana 后台任务。涵盖 `registerTaskDefinitions`、`ensureScheduled`/`schedule`/`bulkSchedule`、`createTaskRunner`/`cancel`、`timeout`/`cost`/`priority`/`maxAttempts` 配置、`paramsSchema`/`stateSchemaByVersion` 定义。错误配置可能导致阻塞关机、耗尽池、无限重试。

### 26. validate-oas
**路径**: `validate-oas/SKILL.md`
**作用**: 对指定 API 区域快速验证 OpenAPI 规范合法性。仅返回 VALID 或 NOT VALID。先确保生成的 `oas_docs` 是最新的（避免过时快照），验证失败时建议使用 `debug-oas` 进一步诊断。

---

## 四、Skill 间依赖关系

```
scout-create-scaffold ←── scout-migrate-from-ftr ←── cypress-to-scout-migration
                                      │
                                      └──→ scout-best-practices-reviewer
                                              ↑
                                      scout-api-testing / scout-ui-testing

validate-oas ──(失败时)──→ debug-oas ──(修复时)──→ improve-oas

kibana-api ←── (被多个 skill 引用的基础工具)
```

---

## 五、统计

| 指标 | 值 |
|---|---|
| **Skill 总数** | 26 |
| **功能域分类** | 8 类 |
| **附带的参考文档** | 27 个 .md 文件 |
| **附带的脚本/配置** | 5 个（2 个 shell 脚本、2 个 JS 脚本、1 个 YAML） |
| **总文件数（每目录）** | 58 个 |
| **最大 Skill** | task-manager-registration（457 行） |
| **最小 Skill** | kibana-api（49 行，工具型 skill） |
