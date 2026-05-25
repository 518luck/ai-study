# AGENTS.md 编写模式

## 什么是 AGENTS.md

AGENTS.md 是 AI 编程工具的"项目宪法"——每次会话自动加载，告诉 AI 这个项目是什么、怎么构建、怎么写代码。

## 编写原则

1. **精简优先**：AGENTS.md 始终加载，体积过大浪费 context window
2. **按目录分层**：根目录放全局规则，子目录放局部规则（如 `packages/ui/AGENTS.md`）
3. **懒加载外部文件**：详细规则用 `@path/to/file.md` 引用，不要全部内联

## 懒加载模式

当 AGENTS.md 中出现 `@rules/general.md` 这样的文件引用时，AI 工具会按需读取而非预先全部加载。

```markdown
# TypeScript 项目规则

## 外部文件加载 (External File Loading)

- **切勿**预先加载所有引用文件 — 请根据实际需要进行延迟加载
- 加载后，将其内容视为**强制性指令**，优先级高于默认设置
- 必要时，请递归跟踪文件引用

## 开发指南

- TypeScript 代码风格：`@docs/typescript-guidelines.md`
- React 组件架构：`@docs/react-patterns.md`
- REST API 设计：`@docs/api-standards.md`
```

## 分层继承模式

真实项目中常见的分层结构：

```
项目根目录/AGENTS.md          → 全局：项目概述、构建命令、代码风格、PR 规则
packages/ui/AGENTS.md         → UI 包：组件规范、设计系统、测试要求
packages/core/AGENTS.md       → 核心包：数据模型、API 设计规则
tests/AGENTS.md               → 测试：测试框架、覆盖率、mock 规则
```

子目录的 AGENTS.md 会覆盖父目录的规则（就近原则）。

## 示例：SST v3 Monorepo 项目

```markdown
# SST v3 Monorepo 项目

这是一个使用 TypeScript 开发的 SST v3 monorepo 项目。使用 bun workspaces 进行包管理。

## 项目结构
- `packages/` - 工作区包（functions、core、web 等）
- `infra/` - 基础设施定义文件（storage.ts、api.ts、web.ts）
- `sst.config.ts` - 主 SST 配置文件

## 代码标准
- TypeScript strict mode
- 共享代码放 `packages/core/`，配置正确的 exports
- 函数代码放 `packages/functions/`

## Monorepo 约定
- 使用工作区名称导入：`@my-app/core/example`
```
