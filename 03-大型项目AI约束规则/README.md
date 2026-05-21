# 03 - 大型项目AI约束规则

## 约束的6层基础设施

大项目约束AI不只是写个规则文件，而是搭建6层体系：

```
第1层：规则文件（AGENTS.md / CLAUDE.md）
  └── 定义编码规范、项目结构、命令清单

第2层：Skill系统（.claude/skills/ / .cursor/skills/）
  └── 预定义的工作流，Agent按步骤执行复杂任务

第3层：自定义脚本（scripts/）
  └── 验证、构建、测试的自动化脚本

第4层：MCP服务器（Model Context Protocol）
  └── 连接外部工具和数据源（数据库、API、文档）

第5层：权限控制（settings.json / 权限白名单）
  └── 限制Agent能调用哪些工具、能修改哪些文件

第6层：CI门禁（GitHub Actions / pre-commit hooks）
  └── 提交前自动检查，不合格则拒绝合并
```

## 规则文件的作用

规则文件是**第1层**，告诉AI：
- 代码库结构是什么
- 构建和测试命令是什么
- 编码规范和禁忌是什么
- 重要的架构决策是什么

## 已收集的14个项目规则文件

完整内容见本目录下的 `ai-coding-rules-collection.md`。

| 项目 | 文件 | 重点约束 |
|------|------|---------|
| Vercel Next.js | AGENTS.md | Monorepo结构、pnpm命令、测试要求 |
| LangChain | CLAUDE.md | Python虚拟环境、poetry依赖、类型检查 |
| Azure SDK for .NET | AGENTS.md | CI管道要求、API设计规范 |
| Azure SDK for .NET | copilot-instructions.md | 补充Copilot专用指令 |
| Azure REST API Specs | copilot-instructions.md | OpenAPI规范约束 |
| Electron | settings.json | 权限白名单（允许/禁止的工具列表） |
| Electron | skills/electron-chromium-upgrade | Chromium升级工作流 |
| Electron | skills/electron-node-upgrade | Node.js升级工作流 |
| SvelteKit | AGENTS.md | 测试策略、包管理器约定 |
| pnpm | AGENTS.md | pnpm自身开发的规范 |
| Facebook React | CLAUDE.md | React代码库约束 |
| Docusaurus | AGENTS.md | 文档站点开发规范 |
| Cypress | AGENTS.md | 测试框架开发规范 |
| MUI (Material UI) | AGENTS.md | 组件库开发约束 |

## 规则文件的共同模式

### 1. 必须包含的信息

```markdown
# 项目名 Development Guide

## 代码库结构
- 目录说明
- 关键入口点

## 构建命令
- 构建：xxx
- 测试：xxx
- Lint：xxx

## 编码规范
- 命名约定
- 文件组织
- 依赖管理

## 禁止事项
- 不要修改 xxx 文件
- 不要使用 xxx 模式

## 测试要求
- 测试文件放在 xxx
- 运行测试的命令
- 覆盖率要求
```

### 2. Electron的权限白名单示例

```json
{
  "permissions": {
    "allow": ["Read", "Glob", "Grep", "Bash"],
    "deny": ["Write"],
    "allowPatterns": ["packages/xxx/**"]
  }
}
```

### 3. Electron的Skill工作流示例

Skill是一组预定义步骤，Agent按步骤执行复杂任务：

```markdown
# Skill: Chromium升级

## 步骤
1. 检查当前Chromium版本
2. 下载新版本
3. 更新DEPS文件中的版本号
4. 运行 gclient sync
5. 解决冲突
6. 运行构建测试
7. 创建PR

## 验证
- 构建必须通过
- 所有测试必须通过
```

## 详细规则合集

完整的14个项目规则文件内容，请查看 `ai-coding-rules-collection.md`。
