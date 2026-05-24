# wp-calypso Skills 总览

> 本文件对 WordPress.com Calypso 仓库中全部 6 个 Skills（共 16 个文件）进行概述，
> 说明每个 Skill 的作用、所属位置、文件组成和使用场景。

---

## 一、目录结构

```
skills/
├── .claude/skills/                                    # Claude Code 使用的 skills（5 个）
│   ├── calypso-react-query-migration/
│   │   ├── SKILL.md                                    # 主文件 — 迁移工作流
│   │   ├── mutations.md                                # 子文档 — Mutation 编写指南
│   │   ├── redux-cleanup.md                            # 子文档 — Redux 清理指南
│   │   └── test-scaffolding.md                         # 子文档 — 测试脚手架模板
│   ├── reader-protocol-pr-review/
│   │   ├── SKILL.md                                    # 主文件 — PR 审查流程
│   │   └── references/
│   │       └── common-smells.md                        # 参考 — 9+ 类常见代码异味
│   ├── dashboard-create-screen/
│   │   └── SKILL.md                                    # 主文件 — 创建 Dashboard 页面
│   ├── fix-e2e-tests/
│   │   ├── SKILL.md                                    # 主文件 — E2E 测试修复流程
│   │   ├── setup-token.sh                              # 脚本 — TeamCity token 配置
│   │   └── baseline-failures.sh                        # 脚本 — 基线失败收集
│   └── help-center-ui-test/
│       └── SKILL.md                                    # 主文件 — Help Center UI 测试
│
└── packages/image-studio/.agents/skills/              # Agents Manager 使用的 skills（1 个）
    └── ui-testing/
        ├── SKILL.md                                    # 主文件 — Image Studio UI 测试
        └── references/
            ├── selectors.md                            # 参考 — CSS 选择器表
            ├── troubleshooting.md                      # 参考 — 常见问题排查
            └── output-template.md                      # 参考 — 测试报告模板
```

---

## 二、各 Skill 概述

### 1. calypso-react-query-migration（Calypso React Query 迁移）

| 属性 | 内容 |
|------|------|
| **位置** | `.claude/skills/calypso-react-query-migration/` |
| **文件数** | 4 个（SKILL.md + 3 个子文档） |
| **总行数** | ~704 行 |
| **触发条件** | 编辑或迁移 Reader 数据获取代码（`query-reader-*` 组件、`data-stores` hooks、新的 queries/mutations） |

**作用**：指导 AI agent 将 Reader 模块的数据获取从 Redux data-layer 迁移到 React Query（TanStack Query）。这是一个完整的多步骤工作流 Skill：

- **SKILL.md**（312 行）：核心迁移工作流 — 审计 CRUD 覆盖、决定是否保留 Bridge 组件、构建 fetcher → query → bridge 链路、清理 Redux。包含严格的命名规范、红牌警告列表和常见错误表。
- **mutations.md**（196 行）：Mutation（增删改）的编写指南 — mutator 编写、`mutationOptions` 配置、缓存失效规则、乐观更新模式（默认推荐）、副作用归属（consumer vs api-queries）、Redux 清理。
- **redux-cleanup.md**（111 行）：迁移后的 Redux 清理清单 — 移除 REQUEST action/reducer/selector、将 `isRequesting*` 替换为 React Query 状态、函数组件 `connect()` → hooks 转换、类组件 HOC 桥接模式。
- **test-scaffolding.md**（85 行）：测试脚手架 — 完整的测试文件模板（`createTestStore`、`renderWithProviders`、nock 配置）、nock URL 模式、运行命令。

**核心模式**：`fetchers in @automattic/api-core` → `query/mutation options in @automattic/api-queries` → `components use useQuery()/useMutation() directly`

---

### 2. reader-protocol-pr-review（Reader 协议 PR 审查）

| 属性 | 内容 |
|------|------|
| **位置** | `.claude/skills/reader-protocol-pr-review/` |
| **文件数** | 2 个（SKILL.md + 1 个参考文档） |
| **总行数** | ~256 行 |
| **触发条件** | 审查涉及 Reader 社交协议（Bluesky/ATmosphere、Mastodon、Fediverse）的 PR |

**作用**：为 AI agent 提供一套结构化的 PR 审查框架，专注于 Reader 多协议社交表面的代码质量：

- **SKILL.md**（76 行）：审查框架 — 严重性标签定义（blocker/important/nit）、审查报告格式（表格 + 判定行）、何时派发 `code-reviewer` agent、PR 回复约定、跨 PR 交叉修复流程、文件形态检查表（6 个关键文件模式）。
- **common-smells.md**（180 行）：9+ 类常见代码异味清单 — 每条包含症状、具体案例（CM-625/658/660/662 切片周期）、修复方案、检查位置。覆盖：Provider 缺失时的空单元格回归、跨租户缓存投毒、`cancelQueries` 过宽、路径注入、switch 缺少 default 分支、错误日志缺失、rkey 提取静默失败、wire-shape 强制转换、接口死字段。另含 4 条架构级后续跟进建议。

---

### 3. dashboard-create-screen（创建 Dashboard 页面）

| 属性 | 内容 |
|------|------|
| **位置** | `.claude/skills/dashboard-create-screen/` |
| **文件数** | 1 个 |
| **总行数** | 254 行 |
| **触发条件** | 在 Multi-site Dashboard 中创建新页面/屏幕 |

**作用**：自动化在 `client/dashboard` 中创建新页面的完整流程（7 步）：

1. 发现现有路由（扫描 router 文件、提取 `createRoute` 常量和父子关系）
2. 发现导航菜单（基于父路由位置查找 menu 文件）
3. 收集用户输入（父路由、屏幕名、路由路径、标题、描述、是否加入导航）
4. 确定文件位置（基于父路由的 import 路径推导）
5. 创建组件文件（使用 `PageLayout` + `PageHeader` 模板）
6. 注册路由（添加 `createRoute` 定义并接入路由树）
7. 添加导航菜单项（可选，匹配现有菜单项模式）

**特点**：高度结构化的交互式 Skill，每步都有明确的工具使用说明和正则匹配模式。

---

### 4. fix-e2e-tests（修复 E2E 测试）

| 属性 | 内容 |
|------|------|
| **位置** | `.claude/skills/fix-e2e-tests/` |
| **文件数** | 3 个（SKILL.md + 2 个脚本） |
| **总行数** | ~475 行 |
| **触发条件** | 给定 PR 号，定位并修复失败的 E2E 测试 |

**作用**：最复杂的 Skill 之一，端到端自动化 E2E 测试修复流程（5 步）：

1. **验证 GitHub CLI** — 检查 `gh` 安装和认证状态
2. **验证 TeamCity 访问** — 自动检测直连/SOCKS5 代理、管理 token（`~/.config/teamcity-access-token`）
3. **解析 PR** — 从 PR 号或 URL 提取元数据（分支、SHA、检查状态）
4. **定位失败测试** — 从 TeamCity REST API 获取失败测试列表，过滤 muted 项，展示候选表
5. **生成修复并开 PR** — 创建 git worktree、派发 Playwright Test Healer agent、审查 diff、提交推送、创建 ready-for-review PR

**脚本文件**：
- `setup-token.sh`：交互式配置 TeamCity 访问 token（防止在 Claude Code 中泄露）
- `baseline-failures.sh`：收集基线失败信息

**特点**：极度关注安全性（token 不进聊天记录、不进 repo）、Claude Code 权限启发式绕过技巧（单行命令、避免变量展开）、worktree 自动清理。

---

### 5. help-center-ui-test（Help Center UI 测试）

| 属性 | 内容 |
|------|------|
| **位置** | `.claude/skills/help-center-ui-test/` |
| **文件数** | 1 个 |
| **总行数** | 232 行 |
| **触发条件** | 测试 WordPress.com Help Center 的 UI |

**作用**：使用 Chrome 自动化（Claude in Chrome 扩展）对 Help Center 进行系统性浏览器 UI 审查：

- **测试表面**：Calypso Dashboard、WP Admin、Editor（3 个环境）
- **测试清单**（7 类）：Home Screen、Search、Article Rendering、AI Chat、Live Support Handoff、Navigation、Support History
- **视口测试**：Desktop (1280x800) + Mobile (375x812)
- **错误监控**：Console errors + Network errors，在 6 个关键节点检查
- **报告**：结构化测试结果表格（PASS/FAIL/错误）
- **证据采集**：使用 GIF 录制器捕获问题演示
- **后续**：可自动提交 Linear issue 或直接修复代码

**特点**：使用自然语言元素搜索（`find` 命令）替代固定 CSS 选择器，更健壮。

---

### 6. image-studio-ui-tests（Image Studio UI 测试）

| 属性 | 内容 |
|------|------|
| **位置** | `packages/image-studio/.agents/skills/ui-testing/` |
| **文件数** | 4 个（SKILL.md + 3 个参考文档） |
| **总行数** | ~484 行 |
| **触发条件** | 运行 Image Studio 的完整 UI 冒烟测试 |

**作用**：使用 Playwright MCP 对 Image Studio 功能进行全面 UI 测试（12 个测试区段）：

- **Section 1**：Media Library 入口点（Generate Image 按钮、Edit with AI 行操作）
- **Section 2-4**：Edit Mode（模态框、侧边栏元数据、未保存更改对话框）
- **Section 5-6**：Generate Mode（样式/比例选择器、AI 提示与生成 — 唯一触发真实 AI 生成的区段）
- **Section 7**：保存流程
- **Section 8**：Hash Deep-Link 入口
- **Section 9-10**：Block Editor 集成（Generate/Edit 入口，仅 DOM 验证）
- **Section 11-12**：导航箭头、永久删除

**参考文档**：
- `selectors.md`（77 行）：完整的 CSS 选择器 + ARIA 标签参考表（按页面区域分组）
- `troubleshooting.md`（31 行）：已知不稳定区域 + 常见问题排查表
- `output-template.md`（54 行）：测试报告输出模板

**策略亮点**：仅 Section 6 触发真实 AI 生成（控制测试时间在 5 分钟内），其余区段全部通过 DOM 断言验证。

---

## 三、按维度分析

### 3.1 Skill 类型分布

| 类型 | Skills | 数量 |
|------|--------|------|
| **代码迁移** | calypso-react-query-migration | 1 |
| **PR 审查** | reader-protocol-pr-review | 1 |
| **代码生成** | dashboard-create-screen | 1 |
| **测试修复** | fix-e2e-tests | 1 |
| **UI 测试** | help-center-ui-test, image-studio-ui-tests | 2 |

### 3.2 复杂度对比

| Skill | 行数 | 步骤数 | 外部依赖 | 交互级别 |
|-------|------|--------|----------|----------|
| fix-e2e-tests | 471 | 5（含多个子步骤） | GitHub CLI, TeamCity, Playwright Healer Agent | 高（多步确认） |
| calypso-react-query-migration | 312+197+111+85=705 | 4 | 无 | 中（需写计划） |
| image-studio-ui-tests | 322+162=484 | 12 个 Section | Playwright MCP, 沙箱站点 | 高（浏览器操作） |
| help-center-ui-test | 232 | 7 类检查 × 3 表面 | Claude in Chrome 扩展 | 高（浏览器操作） |
| dashboard-create-screen | 254 | 7 | 无 | 中（交互式输入） |
| reader-protocol-pr-review | 76+180=256 | 1（审查） | GitHub CLI, code-reviewer agent | 低（审查报告） |

### 3.3 Skill 存放位置的含义

| 位置 | 含义 |
|------|------|
| `.claude/skills/` | Claude Code 工具链使用的 Skill，在开发时触发 |
| `packages/*/.agents/skills/` | Agents Manager 运行时使用的 Skill，嵌入到产品中 |

---

## 四、编写模式总结

1. **frontmatter 元数据**：每个 SKILL.md 都有 YAML frontmatter，包含 `name`、`description`、可选 `allowed-tools`
2. **分步工作流**：复杂 Skill（fix-e2e-tests、calypso-react-query-migration、dashboard-create-screen）采用编号步骤，每步有明确的输入/输出
3. **子文档拆分**：超过 300 行的 Skill 将关注点分离到子文档（mutations.md、redux-cleanup.md、common-smells.md 等）
4. **参考文档**：测试类 Skill 配套 selectors/references/troubleshooting 文档
5. **红牌/警告**：关键 Skill 包含"停止并重新考虑"清单，防止 AI 犯系统性错误
6. **精确的工具指令**：明确指定可用的工具、命令格式，甚至考虑 Claude Code 的权限启发式行为
