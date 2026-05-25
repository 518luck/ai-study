# AGENTS.md 官方标准与工具兼容性

---

## 一、AGENTS.md 背景介绍

**AGENTS.md** 是由 OpenAI Codex、Amp、Google Jules、Cursor、Factory 等多家 AI 编码工具厂商联合发起的**开放格式**，目前由 Linux 基金会旗下的 **Agentic AI Foundation (AAIF)** 管理。

- **创始成员**：Amazon、Anthropic、Block、Bloomberg、Cloudflare、Google、Microsoft、OpenAI 等
- **采用规模**：已有超过 **6万个开源项目** 在使用
- **官方网站**：https://agents.md
- **GitHub 仓库**：https://github.com/agentsmd/agents.md
- **AAIF 基金会**：https://aaif.io

---

## 二、格式规范

### 基本规则

| 规则 | 说明 |
|------|------|
| **格式** | 标准 Markdown，无强制 schema 或字段要求 |
| **文件名** | 必须全大写 `AGENTS.md`（不是 `agents.md` 或 `Agents.md`） |
| **位置** | 仓库根目录 |
| **大小建议** | 控制在 **200 行以内**，过长会消耗上下文并降低遵循率 |
| **嵌套支持** | 大型 monorepo 可在子目录放置子 `AGENTS.md` |
| **优先级** | 距离编辑文件最近的 AGENTS.md 优先；用户聊天提示覆盖一切 |

### 官方最小示例

```markdown
# AGENTS.md
## Setup commands
- Install deps: `pnpm install`
- Start dev server: `pnpm dev`
- Run tests: `pnpm test`

## Code style
- TypeScript strict mode
- Single quotes, no semicolons
- Use functional patterns where possible
```

### 官方 FAQ 核心要点

> "No. AGENTS.md is just standard Markdown. Use any headings you like; the agent simply parses the text you provide."

即：没有强制字段，用任意 Markdown 标题组织内容即可。

---

## 三、推荐章节清单

| 章节 | 重要度 | 说明 |
|------|--------|------|
| **项目概述** | ⭐⭐⭐ | 简述仓库做什么、主要技术栈 |
| **开发环境配置** | ⭐⭐⭐ | 安装依赖、启动开发服务器的命令 |
| **构建与测试** | ⭐⭐⭐ | 构建、测试、lint 的具体命令和顺序 |
| **代码风格** | ⭐⭐ | 缩进、命名规范、语言特性偏好 |
| **测试指南** | ⭐⭐ | 如何运行测试、CI 配置位置、测试覆盖要求 |
| **安全注意事项** | ⭐⭐ | 安全敏感信息、禁止操作 |
| **PR/提交指南** | ⭐⭐ | commit message 格式、PR 标题格式、提交前检查步骤 |
| **项目架构/目录结构** | ⭐⭐ | 关键目录和文件的用途说明 |
| **AI 行为指令** | ⭐ | 并行工具、自动化授权、默认分支声明 |

---

## 四、编写最佳实践

### 核心原则

1. **具体且可验证**
   - ✅ "使用 2 空格缩进" → ❌ "正确格式化代码"
   - ✅ "提交前运行 `npm test`" → ❌ "测试你的更改"
   - ✅ "API 处理器在 `src/api/handlers/`" → ❌ "保持文件有序"

2. **结构清晰**
   - 使用 Markdown 标题和列表分组相关指令
   - 组织良好的章节比密集段落更容易遵循

3. **一致性**
   - 避免互相矛盾的规则
   - 定期审查移除过时指令

4. **视为活文档**
   - 随着项目演进持续更新
   - 特别是当 AI 重复犯错时，将修正规则写入

### 好 vs 坏的 AGENTS.md 对比

**好的示例** ✅：

```markdown
# AGENTS.md
## Dev environment tips
- Use `pnpm dlx turbo run where <project_name>` to jump to a package.
- Run `pnpm install --filter <project_name>` to add the package to workspace.
- Check the name field inside each package's package.json.

## Testing instructions
- Run `pnpm turbo run test --filter <project_name>` to run all checks.
- From package root: `pnpm test`. Must pass all tests before merge.
- To focus on one step: `pnpm vitest run -t "<test name>"`.
- Always run `pnpm lint` before committing.

## PR instructions
- Title format: [<project_name>] <Title>
- Always run `pnpm lint` and `pnpm test` before committing.
```

**坏的示例** ❌：

```markdown
# AGENTS.md
Please write good code. Follow best practices.
Make sure everything works. Use proper naming.
Test your changes. Write clean code.
```

**区别**：好的文件 **具体命令、可验证规则、结构清晰**；坏的文件 **模糊、抽象、缺乏可操作性**。

---

## 五、主流工具兼容性对照表

| 工具 | 原生配置文件 | 支持 AGENTS.md | 备注 |
|------|-------------|---------------|------|
| **OpenAI Codex** | `AGENTS.md` | ✅ 原生 | — |
| **Google Jules** | `AGENTS.md` | ✅ 原生 | — |
| **Amp** | `AGENTS.md` | ✅ 原生 | — |
| **Devin** | `AGENTS.md` | ✅ 原生 | — |
| **GitHub Copilot** | `.github/copilot-instructions.md` | ✅ 原生 | 在目录树中查找最近的 AGENTS.md |
| **Cursor** | `.cursorrules` / Project Rules | ✅ 兼容 | 作为兼容格式之一 |
| **Windsurf** | `.windsurfrules` | ✅ 兼容 | — |
| **Zed** | `.rules` | ✅ 兼容 | 兼容列表：`.rules` > `.cursorrules` > `.windsurfrules` > `.clinerules` > `.github/copilot-instructions.md` > `AGENT.md` > `AGENTS.md` > `CLAUDE.md` > `GEMINI.md` |
| **Warp** | `AGENTS.md` / `WARP.md` | ✅ 原生 | 明确要求全大写文件名 |
| **VS Code** | AI 规则 | ✅ 支持 | — |
| **JetBrains Junie** | `AGENTS.md` | ✅ 原生 | — |
| **Claude Code** | `CLAUDE.md` | ⚠️ 需配置 | 推荐 `CLAUDE.md` 第一行写 `@AGENTS.md` 导入，或创建符号链接 |
| **Cline** | `.clinerules` | ⚠️ 需配置 | 支持 CLAUDE.md、.clinerules 等 |
| **Aider** | `.aider.conf.yml` | ⚠️ 需配置 | 需设置 `read: AGENTS.md` |
| **Gemini CLI** | `.gemini/settings.json` | ⚠️ 需配置 | 需设置 `context.fileName: "AGENTS.md"` |

### 兼容性建议

- **如果只维护一份文件**：创建 `AGENTS.md`，覆盖最广的工具生态
- **如果需要同时支持 Claude Code**：创建 `CLAUDE.md`，第一行写 `@AGENTS.md`
- **大型 monorepo**：利用嵌套能力，在子目录放置领域专用的 `AGENTS.md`

---

## 六、官方文档链接汇总

| 文档 | URL |
|------|-----|
| AGENTS.md 官网 | https://agents.md |
| AGENTS.md GitHub 仓库 | https://github.com/agentsmd/agents.md |
| AAIF 基金会 | https://aaif.io |
| Claude Code CLAUDE.md 文档 | https://docs.anthropic.com/en/docs/claude-code/memory |
| GitHub Copilot 自定义指令 | https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot |
| Zed 编辑器 Rules 文档 | https://zed.dev/docs/ai/rules |
| Warp Rules 文档 | https://docs.warp.dev/agent-platform/capabilities/rules/ |
