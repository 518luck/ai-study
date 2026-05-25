# Kibana

## 环境设置
- 初始化设置、切换分支后或遇到依赖错误时，运行 `yarn kbn bootstrap`

## 概览
- Kibana 按模块组织，每个模块由 `kibana.jsonc` 定义：核心模块、包和插件包。除工具和测试外，大部分代码位于这些模块中。
- 包是具有明确边界和单一公共入口点的可复用单元（不支持子路径导入），通常具有聚焦的用途。
- 插件是一种包类型（`type: "plugin"`），包含带有 setup/start/stop 生命周期的插件类，由核心平台调用以启用应用。
- **服务器插件入口（`server/index.ts`）** 不应在插件可能运行之前加载 `./plugin`。对 `./plugin` 中的类型使用 `import type`（和 `export type`），将共享配置保留在 `config.ts` / `../common/config` 中（不要从 `./plugin` 重新导出运行时值），并在异步 `plugin` 初始化器中使用 `await import('./plugin')` 来实例化实现。该入口中的静态值导入、`export { … }` / `export *` 值导出、`import './plugin'` 和 `require('./plugin')` 会强制 Node 即使在插件被禁用时也解析并执行 `plugin.ts`。`@kbn/eslint-config` 中的 `@kbn/eslint/no_sync_import_from_plugin` 会在插件 `server/index.ts` 文件上强制执行此规则（参见 [PR #170856](https://github.com/elastic/kibana/pull/170856) 和 [issue #171080](https://github.com/elastic/kibana/issues/171080)）。
- 依赖其他插件的插件依赖于这些生命周期返回的契约，因此必须避免循环依赖。
- 模块 ID（通常为 `@kbn/...`）定义在 `kibana.jsonc` 中；`package.json` 名称在存在时从其派生。
- 插件 ID 是 `kibana.jsonc` 中 `plugin.id` 下的额外 camelCase ID，由核心平台和其他插件使用。
- 模块按领域分组（平台 vs 解决方案），并通过可见性规则（`shared` vs `private`）限制跨组访问。
- 工具脚本位于 `scripts/`（例如 `node scripts/generate.js`）。
- 如果用户修正与此文档或你遵循的任何技能相矛盾，或缺少指导导致了可避免的工作，请提交 DevEx 反馈：`echo "..." | scripts/devex_feedback.sh`（包含差距和建议的修复方案）。

## 测试
始终运行 `node scripts/check_changes.ts` 来验证你的更改

### Jest 单元测试
`node scripts/jest [--config=<pathToConfigFile>] [TestPathPattern]`
- 配置根据测试文件路径自动发现（向上查找最近的 `jest.config.js`）。最简单的用法：
  `node scripts/jest src/core/packages/http/server-internal/src/http_server.test.ts`
- 每次运行只能指定一个 `--config`。要测试多个包，需分别运行命令。

### Jest 集成测试
`node scripts/jest_integration [--config=<pathToConfigFile>] [TestPathPattern]`
- 自动发现 `jest.integration.config.js`（而非 `jest.config.js`）。与上述相同的单配置约束。

### 功能测试运行器 (FTR)
`node scripts/functional_tests [--config <file1> [--config <file2> ...]]`
- 新测试推荐使用 Scout

### Scout（基于 Playwright 的 UI/API 测试）
`node scripts/scout run-tests --arch stateful --domain classic --config <scoutConfigPath>`（或 `--testFiles <specPath1,specPath2>`）

## 代码风格指南
优先遵循目标区域中已有的模式；以下为通用默认规则。

### 类型检查
`node scripts/type_check [--project path/to/tsconfig.json]`
- 不带 `--project` 参数时会检查**所有**项目（非常慢）。始终限定到单个项目：
  `node scripts/type_check --project src/core/packages/http/server-internal/tsconfig.json`
- 每次运行只能指定一个 `--project`。要检查多个包，需分别运行命令。
- `.buildkite/` **不是** `scripts/type_check` 的有效目标。Buildkite 脚本位于独立的工作空间中；需在 `.buildkite/` 目录内使用 `npm run typecheck`（或 `yarn typecheck`）进行类型检查。

### TypeScript 与类型
- 所有新代码使用 TypeScript；避免使用 `any` 和 `unknown`。
- 公共 API 和导出函数优先使用显式返回类型。
- 类型专用导入使用 `import type`。
- 除非局部合理，避免非空断言（`!`）。
- 不可变结构优先使用 `readonly` 和 `as const`。
- 优先使用 const 箭头函数。
- 优先使用显式 import/export，而非 `*`。
- 优先使用变量解构，而非属性访问。
- 绝不使用 `@ts-ignore`、`@ts-expect-error` 抑制类型错误；修复根因。

### Lint
`node scripts/eslint --fix $(git diff --name-only)`
- 绝不使用 `eslint-disable` 抑制 lint 错误；修复根因。
- 插件 `server/index.ts` 文件由 `@kbn/eslint/no_sync_import_from_plugin` 检查（参见上方的插件服务器入口说明）。

### 格式化
- 遵循文件中已有的格式；不要重新格式化无关代码。
- TS/JS 中优先使用单引号，除非文件使用双引号。

### 命名
- 类、类型和 React 组件使用 `PascalCase`。
- 函数、变量和对象键使用 `camelCase`。
- 新文件名必须使用 `snake_case`（带下划线的小写），除非已有约定要求其他格式。
- 使用描述性名称；避免在紧凑循环之外使用单字母名称。

### 控制流与错误处理
- 优先使用提前返回和正向条件。
- 显式处理错误；API 尽可能返回有类型的错误。
- 保持异步逻辑线性；尽量避免嵌套的 `try` 块。

### React / UI 约定
- 使用函数式组件；显式声明 props 类型。
- 将 hooks 保持在顶层；避免条件式 hooks。
- 除非与文件约定一致，避免内联样式。
- 使用 `@elastic/eui` 组件配合 Emotion（`@emotion/react`）进行样式编写。

## 国际化 (i18n)
- 指导文档见 src/platform/packages/shared/kbn-i18n/GUIDELINE.md
- 运行 `node scripts/i18n_check --fix` 检查并修复错误。

## CI
- 与 Buildkite 交互时使用 `bk` CLI。

## 贡献规范
- 不确定时：多读代码；仍然无法解决时，提供简短的选项后提问。绝不猜测。
- 修复根因（而非表面修补）。
- 聚焦变更；避免无关重构。
- 行为或用法变更时，同步更新文档和测试。
- 绝不通过删除、跳过或注释掉测试来使其通过；修复底层代码。
- 始终以 Draft 状态创建 PR。
