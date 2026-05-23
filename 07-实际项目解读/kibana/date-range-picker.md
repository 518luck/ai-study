# AGENTS.md

本文件为 agent 在此文件夹下处理代码时提供指导。

## 项目概览 (Project Overview)

这是一个 UI 组件，是一个带有“智能输入”的日期范围选择器。

- **唯一依赖项**：`@elastic/eui`、`@elastic/datemath`、`@kbn/i18n`、`moment` 和 `react-day-picker`

## 命令 (Commands)

请在 Kibana 根目录下运行。
在 agent shell 中运行 `node`/`yarn` 命令前，请先在同一命令中加载 nvm：
- `[ -s "$HOME/.nvm/nvm.sh" ] && source "$HOME/.nvm/nvm.sh" && nvm use --silent`

```bash
# 单元测试
yarn test:jest src/platform/packages/shared/shared-ux/datetime/kbn-date-range-picker

# Linter 检查 (ESLint) — 检查
node scripts/eslint.js src/platform/packages/shared/shared-ux/datetime/kbn-date-range-picker

# Linter 检查 (ESLint) + 格式化 (Prettier) — 修复
node scripts/eslint.js --fix src/platform/packages/shared/shared-ux/datetime/kbn-date-range-picker

# 类型检查
yarn test:type_check --project src/platform/packages/shared/shared-ux/datetime/kbn-date-range-picker/tsconfig.json

# Storybook
yarn storybook shared_ux
```

## 规则 (Rules)

1. 避免过于复杂的 TypeScript 类型。
2. 为每个顶层函数添加 JSDoc 注释块。
3. 在导出的类型中，使用 JSDoc 对所有 props 进行描述，若不为 undefined，应包含 `@default` 说明。
4. 切勿在公共 API 中暴露 `moment` 对象，因为我们未来可能会替换它。
5. 保持测试代码简洁。

## 哲学 (Philosophy)

- 正确性 > 奇技淫巧 (Correctness > cleverness)
- 仅解决真实存在的问题 (Real problems only)
- 具描述性的命名 > 简短的命名 (Descriptive names > brevity)
- 保持 PR 体量小巧 (控制在 1000 行以内，Keep PRs small)
