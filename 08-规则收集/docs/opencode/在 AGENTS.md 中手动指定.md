# TypeScript 项目规则

## 外部文件加载 (External File Loading)

**极其重要**：当您遇到文件引用（例如 `@rules/general.md`）时，请使用您的读取工具按需进行加载。这些文件与当前处理的**具体任务**密切相关。

指令：

- **切勿**预先加载所有引用文件 — 请根据实际需要进行延迟加载（按需加载）。
- 加载后，将其内容视为**强制性指令**，且其优先级高于默认设置（覆盖默认值）。
- 必要时，请递归跟踪文件引用。

## 开发指南 (Development Guidelines)

- 关于 TypeScript 代码风格和最佳实践：`@docs/typescript-guidelines.md`
- 关于 React 组件架构和 hooks 模式：`@docs/react-patterns.md`
- 关于 REST API 设计和错误处理：`@docs/api-standards.md`
- 关于测试策略和覆盖率要求：`@test/testing-guidelines.md`

## 通用指南 (General Guidelines)

请立即阅读以下文件，因为它与所有的工作流相关：`@rules/general-guidelines.md`。
