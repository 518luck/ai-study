---
name: accessibility
disable-model-invocation: true
description: Kibana 的无障碍（accessibility，简称 a11y）指南。在处理或审查 EUI 组件、解决与 a11y 相关的 (@elastic/eui) ESLint 问题，以及确保正确使用 ARIA 属性、焦点管理、键盘交互和无障碍命名规范时，请使用此技能。
---

# Kibana 无障碍 (Kibana Accessibility)

> 无障碍设计是编写组件过程中必不可少的一部分，而不是在 linter 报错之后才去补救的步骤。在开始编写 JSX **之前**，请先打开 `references/components/index.md` 中对应的指南，并首先阅读 `references/shared_principles.md`。

## 何时使用 (When to Use)

- **编写或重构 EUI 组件时**：打开 `references/components/index.md` 中对应的指南，并遵循其标准模式（包含 props、无障碍名称、焦点管理、id 命名）。
- **修复 `@elastic/eui/*` 相关的 ESLint 错误时**：参考 `references/eslint.md`，根据规则 ID 跳转到解释了标准修复方案的对应组件指南。
- **遇到通用的 a11y 或非 EUI 问题时**：阅读 `references/shared_principles.md`。

## 参考资料 (References)

仅打开您需要的资料：

- 标准、决策顺序、无障碍命名、i18n、HTML ID、键盘/焦点、上报流程：`references/shared_principles.md`
- 组件指南主题索引表：`references/components/index.md`
- ESLint 规则 ID 与组件指南映射关系（附手动审查说明）：`references/eslint.md`
