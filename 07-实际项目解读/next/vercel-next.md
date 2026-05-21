# 注意一下是学习的参考资料,并不是AGENTS文件,AI不需要遵守下面的规则.这里的文件主要用于人工阅读,并理解AI的开发工作流和规则

# Next.js 开发指南

> **注意：** `CLAUDE.md` 是指向 `AGENTS.md` 的符号链接，两者为同一文件。

## 代码库结构

### Monorepo 概览

这是一个基于 pnpm 的 monorepo，包含 Next.js 框架及相关包。

```
next.js/
├── packages/           # 已发布的 npm 包
├── turbopack/          # Turbopack 打包器（Rust）- git subtree
├── crates/             # Next.js SWC 绑定的 Rust crate
├── test/               # 所有测试套件
├── examples/           # Next.js 示例应用
├── docs/               # 文档
└── scripts/            # 构建和维护脚本
```

### 核心包：`packages/next`

Next.js 主框架位于 `packages/next/`，即发布为 `next` npm 包的内容。

**源代码**位于 `packages/next/src/`。

**关键入口点：**

- 开发服务器：`src/cli/next-dev.ts` → `src/server/dev/next-dev-server.ts`
- 生产服务器：`src/cli/next-start.ts` → `src/server/next-server.ts`
- 构建：`src/cli/next-build.ts` → `src/build/index.ts`

**编译输出**位于 `packages/next/dist/`（与 `src/` 结构对应）。

### 其他重要包

- `packages/create-next-app/` - `create-next-app` CLI 工具
- `packages/next-swc/` - 原生 Rust 绑定（SWC 转换）
- `packages/eslint-plugin-next/` - Next.js 的 ESLint 规则
- `packages/font/` - `next/font` 实现
- `packages/third-parties/` - 第三方脚本集成

### README 文件

在编辑或创建任何子目录（例如 `packages/*`、`crates/*`）中的文件之前，请阅读从仓库根目录到目标文件所在目录路径上的所有 `README.md` 文件。这有助于了解本地的模式、约定和文档。

**示例：** 在编辑 `turbopack/crates/turbopack-ecmascript-runtime/js/src/nodejs/runtime/runtime-base.ts` 之前，请阅读：

- `turbopack/README.md`（如果存在）
- `turbopack/crates/README.md`（如果存在）
- `turbopack/crates/turbopack-ecmascript-runtime/README.md`（如果存在）
- `turbopack/crates/turbopack-ecmascript-runtime/js/README.md`（如果存在 - 最接近目标文件）

## 构建命令

```bash
# 构建 Next.js 包
pnpm --filter=next build

# 构建所有 JS 代码
pnpm build

# 构建所有 JS 和 Rust 代码
pnpm build-all

# 运行特定任务
pnpm --filter=next exec taskr <task>
```

## 快速本地开发

进行迭代开发时，默认使用监听模式，并配合与所验证模式和打包器对应的测试脚本。

**默认代理规则：** 如果你要修改 Next.js 源码或集成测试，请在编辑之前在单独的终端中启动 `pnpm --filter=next dev`（除非它已经在运行）。如果跳过此步骤，请明确说明原因（例如：仅文档修改、只读调查或仅 CI 分析）。

**1. 在后台启动监听构建：**

```bash
# 文件变更时自动重新构建（每次变更约 1-2 秒，完整构建约 60 秒）
# 迭代代码时保持运行
pnpm --filter=next dev
```

**2. 使用匹配模式的脚本运行聚焦测试：**

```bash
# Turbopack 开发模式
pnpm test-dev-turbo test/path/to/test.ts

# Webpack 开发模式
pnpm test-dev-webpack test/path/to/test.ts

# Turbopack 生产构建+启动
pnpm test-start-turbo test/path/to/test.ts

# Webpack 生产构建+启动
pnpm test-start-webpack test/path/to/test.ts
```

**3. 完成后，终止后台监听进程（如果你启动了的话）。**

**仅用于检查类型错误：** 使用 `pnpm --filter=next types`（约 10 秒）代替 `pnpm --filter=next build`（约 60 秒）。

工作区完成初始化后，如果修改仅限于 Next.js 核心文件，优先使用 `pnpm --filter=next build`。在切换分支/初始化、推送到 CI 之前，或修改跨越多个包时，使用完整的 `pnpm build-all`。

**切换分支后务必执行完整初始化构建：**

```bash
git checkout <branch>
pnpm build-all   # 为依赖包设置输出（Turborepo 会在未变更时进行去重）
```

## 打包器选择

Turbopack 是 `next dev` 和 `next build` 的默认打包器。要强制使用 webpack：

```bash
next build --webpack        # 使用 webpack 进行生产构建
next dev --webpack          # 使用 webpack 启动开发服务器
```

没有 `--no-turbopack` 标志。

## 测试

```bash
# 运行特定测试文件（Turbopack 开发模式）
pnpm test-dev-turbo test/path/to/test.test.ts

# 运行匹配模式的测试
pnpm test-dev-turbo -t "pattern"

# 运行开发模式测试
pnpm test-dev-turbo test/development/
```

**按模式分类的测试命令：**

- `pnpm test-dev-turbo` - Turbopack 开发模式（默认）
- `pnpm test-dev-webpack` - Webpack 开发模式
- `pnpm test-start-turbo` - Turbopack 生产构建+启动
- `pnpm test-start-webpack` - Webpack 生产构建+启动

**其他测试命令：**

- `pnpm test-unit` - 仅运行单元测试（快速，无需浏览器）
- `pnpm new-test` - 从模板生成新测试文件（交互式）

**非交互式生成测试（适用于 AI 代理）：**

使用 `pnpm new-test` 生成测试是强制要求。

```bash
# 使用 --args 进入非交互模式（使用 `--` 将参数传递给脚本）
# 格式：pnpm new-test -- --args <appDir> <name> <type>
# appDir: true/false（是否用于 app 目录？）
# name: 测试名称（例如 "my-feature"）
# type: e2e | production | development | unit

pnpm new-test -- --args true my-feature e2e
```

**高效分析测试输出：**

不要使用不同的过滤条件重复运行同一测试套件。将输出一次性捕获到文件中，然后从中读取：

```bash
# 运行一次，保存所有输出
HEADLESS=true pnpm test-dev-turbo test/path/to/test.ts > /tmp/test-output.log 2>&1

# 然后分析，无需重新运行
grep "●" /tmp/test-output.log            # 失败的测试名称
grep -A5 "Error:" /tmp/test-output.log   # 错误详情
tail -5 /tmp/test-output.log             # 摘要
```

## 编写测试

**测试编写要求：**

- **使用 `pnpm new-test` 生成新测试套件** - 它会创建包含 fixture 文件的正确结构

- **使用 `next-test-utils` 中的 `retry()` 代替 `setTimeout` 进行等待**

  ```typescript
  // 推荐 - 使用 retry() 进行轮询/等待
  import { retry } from "next-test-utils";
  await retry(async () => {
    const text = await browser.elementByCss("p").text();
    expect(text).toBe("expected value");
  });

  // 不推荐 - 不要使用 setTimeout 进行等待
  await new Promise((resolve) => setTimeout(resolve, 1000));
  ```

- **不要使用 `check()` - 它已弃用。请使用 `retry()` + `expect()` 代替**

  ```typescript
  // 已弃用 - 不要使用 check()
  await check(() => browser.elementByCss("p").text(), /expected/);

  // 推荐 - 使用 retry() 配合 expect()
  await retry(async () => {
    const text = await browser.elementByCss("p").text();
    expect(text).toMatch(/expected/);
  });
  ```

- **优先使用真实的 fixture 目录，而非内联 `files` 对象**

  ```typescript
  // 推荐 - 使用包含 fixture 文件的真实目录
  const { next } = nextTestSetup({
    files: __dirname, // 指向包含测试 fixture 的目录
  });

  // 避免 - 内联文件定义更难维护
  const { next } = nextTestSetup({
    files: {
      "app/page.tsx": `export default function Page() { ... }`,
    },
  });
  ```

## 代码检查和类型

```bash
pnpm lint              # 完整检查（类型、prettier、eslint、ast-grep）
pnpm lint-fix          # 自动修复检查问题
pnpm prettier-fix      # 仅修复格式
pnpm types             # TypeScript 类型检查
```

## PR 状态（CI 失败和审查）

当用户询问 CI 失败、PR 审查或 PR 状态时，运行 pr-status 脚本：

```bash
node scripts/pr-status.js           # 从当前分支自动检测 PR
node scripts/pr-status.js <number>  # 按编号分析特定 PR
```

该脚本会在 `scripts/pr-status/` 中生成分析文件。

通用分流规则（始终适用；`$pr-status-triage` 技能对此有扩展说明）：

- 优先处理阻塞性失败：构建、代码检查、类型，然后是测试。
- 在证明之前，假定失败是真实的；将"已知不稳定测试"作为参考上下文，而非直接忽略的理由。
- 使用相同的 CI 模式/环境变量进行复现（尤其注意存在 `IS_WEBPACK_TEST=1` 的情况）。
- 对于模块解析/构建图相关的修复，使用正常的按模式分类的测试命令，以便正确执行包解析。

完整的分流工作流（失败优先级排序、模式选择、CI 环境复现和常见失败模式），请使用 `$pr-status-triage` 技能：

- 技能文件：`.agents/skills/pr-status-triage/SKILL.md`

**使用 `$pr-status-triage` 进行自动化分析** - 完整的逐步工作流请参见 `.agents/skills/pr-status-triage/SKILL.md`。

**CI 分析提示：**

- CI 失败优先于审查评论
- 优先处理阻塞性任务：构建、代码检查、类型，然后是测试任务
- 常见快速检查项：
  - `rust check / build` → 运行 `cargo fmt -- --check`，然后 `cargo fmt`
  - `lint / build` → 对 prettier 错误运行 `pnpm prettier --write <file>`
  - 测试失败 → 在本地运行具体的失败测试路径

**以正确的模式运行测试：**

```bash
# 开发模式（Turbopack）
pnpm test-dev-turbo test/path/to/test.ts

# 生产模式
pnpm test-start-turbo test/path/to/test.ts
```

## PR 描述

编写 PR 描述时，必须在描述底部包含以下 HTML 注释：

```
<!-- NEXT_JS_LLM_PR -->
```

## 关键目录（快速参考）

详细说明请参见上方[代码库结构](#代码库结构)。

- `packages/next/src/` - Next.js 主源代码
- `packages/next/src/server/` - 服务器运行时（大部分修改发生在这里）
- `packages/next/src/client/` - 客户端运行时
- `packages/next/src/build/` - 构建工具
- `test/e2e/` - 端到端测试
- `test/development/` - 开发服务器测试
- `test/production/` - 生产构建测试
- `test/unit/` - 单元测试（快速，无需浏览器）

## 开发提示

- 开发服务器入口点：`packages/next/src/cli/next-dev.ts`
- 路由服务器：`packages/next/src/server/lib/router-server.ts`
- 使用 `DEBUG=next:*` 查看调试日志
- 本地测试时使用 `NEXT_TELEMETRY_DISABLED=1`

### `NODE_ENV` 与 `__NEXT_DEV_SERVER`

`next dev` 和 `next build --debug-prerender` 都会生成 `NODE_ENV=development` 的包。使用 `process.env.__NEXT_DEV_SERVER` 来区分它们：

- `process.env.NODE_ENV !== 'production'` — 应包含在开发包中但从生产包中移除的代码。这是一个构建时检查。
- `process.env.__NEXT_DEV_SERVER` — 仅在开发服务器（`next dev`）中运行的代码，不在 `next build --debug-prerender` 或 `next start` 期间运行。

## 密钥和环境安全

始终将环境变量的值视为敏感信息，除非它们是已知的测试模式标志。

- 绝不在聊天回复、提交或共享日志中打印或粘贴密钥值（令牌、API 密钥、Cookie）。
- 完全照搬 CI 环境的**名称和模式**，但不要在命令中内联实际的密钥值。
- 如果本地缺少所需密钥，停止并向用户询问，而不是编造占位凭据。
- 绝不提交本地密钥文件；如果需要记录环境配置，仅使用占位符示例。
- 分享命令输出时，进行摘要并隐去看起来敏感的值。

## 专用技能

技能用于有条件的深度工作流。本文件中保留基础的迭代/构建/测试策略。

- `$pr-status-triage` - CI 失败和 PR 审查分流，使用 `scripts/pr-status.js`
- `$create-pr` - 分支、提交、推送和创建草稿 PR 的工作流
- `$backport-pr` - 将已合并的 PR 从 `canary` 分支 cherry-pick 到发布分支
- `$flags` - 功能标志在 config/schema/define-env/运行时环境中的配置
- `$dce-edge` - DCE 安全的 `require()` 模式及 edge/runtime 约束
- `$react-vendoring` - `entry-base.ts` 边界和 vendored React 类型/运行时规则
- `$runtime-debug` - 运行时包/模块解析回归问题的复现和验证
- `$authoring-skills` - 如何在 `.agents/skills/` 中创建和维护技能

## 上下文高效工作流

**读取大文件**（>500 行，例如 `app-render.tsx`）：

- 先用 grep 查找相关行号，然后用 `offset`/`limit` 读取目标范围
- 中途没有代码变更时，不要重复读取文件的同一部分
- 对于生成文件（`dist/`、`node_modules/`、`.next/`）：仅搜索，不读取

**构建和测试输出：**

- 一次性捕获到文件中，然后分析：例如 `pnpm build 2>&1 | tee /tmp/build.log`
- 没有代码变更时不要重复运行同一测试命令；改为分析已保存的输出

**批量编辑后再构建：**

- 将跨文件的相关编辑分组，然后运行一次构建，而不是每次编辑都构建
- 使用 `pnpm --filter=next types`（约 10 秒）检查类型错误，无需完整重建

**外部 API 调用（gh、curl）：**

- 将响应保存到变量或文件：`JOBS=$(gh api ...) && echo "$JOBS" | jq '...'`
- 不要重新获取同一 API 数据来从不同角度分析

## 提交和 PR 风格

- 不要在提交或 PR 中添加 "Generated with Claude Code" 或共同作者署名
- 保持提交信息简洁且具描述性
- PR 描述应聚焦于变更内容和原因
- 不要将 PR 标记为"准备审查"（`gh pr ready`）- 将 PR 保留为草稿状态，让用户决定何时标记为准备审查

## 任务分解与验证

- **将工作拆分为更小的、可独立验证的任务。** 开始之前，将整体目标分解为增量步骤，每个步骤产生可独立检查的结果。
- **在进入下一步之前验证当前任务。** 完成一个步骤后，确认其正确运行（例如，运行相关测试、检查类型、构建或手动检查输出）。在当前任务验证通过之前，不要进入下一个任务。
- **为每次变更选择合适的验证方法。** 根据变更内容，可能包括运行单元测试、集成测试、类型检查、代码检查、构建项目或检查运行时行为。
- **当不清楚如何验证变更时，向用户询问。** 如果特定变更没有明显的测试或验证方法，在继续之前先询问用户希望如何验证。

**提交前预验证**，以避免缓慢的 lint-staged 失败（每次约 2 分钟）：

```bash
# 运行 pre-commit 钩子对你的变更文件执行的完全相同操作：
pnpm prettier --with-node-modules --ignore-path .prettierignore --write <files>
npx eslint --config eslint.config.mjs --fix <files>
```

## 运行测试前重新构建

运行 Next.js 集成测试时，如果源文件发生变更，必须重新构建：

- **分支切换/初始化后的首次运行（或不确定时）？** → `pnpm build-all`
- **初始化后仅编辑了 Next.js 核心文件（`packages/next/**`）？** → `pnpm --filter=next build`
- **编辑了 Next.js 代码或 Turbopack（Rust）？** → `pnpm build-all`

## 开发反模式

对于运行时内部机制，使用专项技能：

- 功能标志配置和运行时包绑定：`$flags`（`.agents/skills/flags/SKILL.md`）
- DCE 和 edge/runtime 约束：`$dce-edge`（`.agents/skills/dce-edge/SKILL.md`）
- React vendoring 和 `entry-base.ts` 边界：`$react-vendoring`（`.agents/skills/react-vendoring/SKILL.md`）
- 调试和验证工作流：`$runtime-debug`（`.agents/skills/runtime-debug/SKILL.md`）

请牢记以下高频注意事项：

- 使用正常的按模式分类的测试命令复现模块解析和打包问题，以便正确执行包解析。
- 使用 `pnpm test-start-webpack test/e2e/app-dir/app/standalone.test.ts` 验证 edge 打包回归问题。
- 需要完整的内部堆栈跟踪时，使用 `__NEXT_SHOW_IGNORE_LISTED=true`。

核心运行时/打包规则（始终适用；上述技能包含验证步骤和示例的扩展说明）：

- 新标志：在 `config-shared.ts` 中添加类型，在 `config-schema.ts` 中添加 schema，在用户打包代码中使用时还需在 `define-env.ts` 中添加。
- 如果标志在预编译的运行时内部代码中被消费，还需配置运行时环境值（根据需要在 `next-server.ts`/`export/worker.ts` 中添加）。
- `define-env.ts` 影响用户代码的打包；它不控制预编译的运行时包内部逻辑。
- 将 `require()` 保持在编译时的 `if/else` 分支中，以实现 DCE（避免使用提前返回/抛出异常的模式）。
- 在 edge 构建中，将控制 Node 专用导入的功能标志在 `define-env.ts` 中强制设为 `false`。
- `react-server-dom-webpack/*` 的导入必须留在 `entry-base.ts` 中；在其他地方通过组件模块导出来消费。

### 测试注意事项

- **缓存组件默认启用 PPR**：当 `__NEXT_CACHE_COMPONENTS=true` 时，大多数 app-dir 页面隐式使用 PPR。专门的 `ppr-full/` 和 `ppr/` 测试套件大部分为 `describe.skip`（正在迁移到缓存组件）。要测试 PPR 代码路径，应在 `__NEXT_CACHE_COMPONENTS=true` 下运行普通的 app-dir e2e 测试，而非查找显式的 PPR 测试套件。
  -- **使用简易应用快速冒烟测试**：要获得快速反馈，可使用 `pnpm new-test -- --args true <name> e2e` 生成最小测试 fixture，然后使用 `node packages/next/dist/bin/next dev --port <port>` 直接运行开发服务器，配合 `curl --max-time 10`。这避免了完整测试工具链的开销，并对挂起/崩溃给出即时反馈。
- 特定模式的测试需要 `skipStart: true` + 在模式检查后的 `beforeAll` 中手动调用 `next.start()`
- 不要依赖精确的日志消息 - 按内容模式过滤，查找序列而非位置
- **快照测试因环境标志而异**：使用内联快照的测试可能因环境标志不同而产生不同输出。更新快照时，务必使用 CI 任务所用完全相同的环境标志运行测试（查看 `.github/workflows/build_and_test.yml` 的 `afterBuild:` 部分）。Turbopack 解析的是 `react-dom/server.edge`（无 Node API，如 `renderToPipeableStream`），而 webpack 解析的是 `.node` 构建（包含这些 API）。
- **`app-page.ts` 是由用户打包器编译的构建模板**：此文件中的任何 `require()` 都会在 `next build` 时被 webpack/turbopack 追踪。你不能使用相对路径 require 内部模块，因为它们无法从用户项目中解析。正确的做法是从 `entry-base.ts` 导出新的辅助函数，然后在模板中通过 `entryBase.*` 访问。
- **在本地复现 CI 失败**：始终匹配 CI 的确切环境变量（查看 `pr-status` 输出中的"Job Environment Variables"）。关键差异如 `IS_WEBPACK_TEST=1` 会改变打包器选择和快照输出，因此在验证模块解析修复时，请使用 CI 命令和模式。
- **显示完整堆栈跟踪**：设置 `__NEXT_SHOW_IGNORE_LISTED=true` 可禁用开发服务器错误输出中的忽略列表过滤。默认情况下，Next.js 将内部帧折叠为 `at ignore-listed frames`，这在调试框架内部时会隐藏有用的上下文。定义于 `packages/next/src/server/patch-error-inspect.ts`。
- **路由 act 测试必须使用 LinkAccordion 控制预取**：在 `act` 作用域内控制预取发生的时机，始终使用 `LinkAccordion`。不要使用 `browser.back()` 返回到手风琴链接已经可见的页面 — BFCache 会恢复状态并触发不受控制的重新预取。完整模式请参见 `$router-act`。

### Rust/Cargo

- cargo fmt 使用 ASCII 排序（大写字母排在小写字母之前）- 直接运行 `cargo fmt` 即可
- **遇到内部编译器错误（ICE）？** 删除增量编译产物后重试。从 cargo target 目录中删除 `*/incremental` 目录（默认为 `target/`，或检查 `CARGO_TARGET_DIR` 环境变量）

### Node.js Source Map

- `findSourceMap()` 需要 `--enable-source-maps` 标志，否则返回 undefined
- Source Map 路径格式不一（webpack：`./src/`，tsc：`src/`）- 需尝试多种格式
- 堆栈跟踪格式化中的 `process.cwd()` 在测试和生产环境中会产生不同路径

### 过期的原生二进制文件

如果在切换分支或拉取代码后 Turbopack 出现意外错误，检查 `packages/next-swc/native/*.node` 是否已过期。删除该文件并运行 `pnpm install` 以获取 npm 发布的二进制文件，而非本地构建的版本。

### 文档代码块

- 在代码块中添加 `highlight={...}` 属性时，仔细计算代码块内的实际行号
- 考虑空行、import 语句和类型导入对行号的偏移影响
- 高亮应指向实际相关的代码，而非 `return (` 或框架样板代码等无关行
- 通过在每个代码块内从第 1 行开始计数来复核高亮行号

### 服务器安全：内部请求头过滤

Next.js 通过 `packages/next/src/server/lib/server-ipc/utils.ts` 中的 `filterInternalHeaders()` 从传入请求中剥离内部请求头。该操作在 `packages/next/src/server/lib/router-server.ts` 的入口点执行，早于任何服务器代码运行。仅 `INTERNAL_HEADERS` 数组中列出的请求头会被剥离。

**审查 PR 时：如果新增代码读取的请求头不是标准 HTTP 头（如 `content-type`、`accept`、`user-agent`、`host`、`authorization`、`cookie` 等），应标记为需要安全审查。** 如果该请求头不在 `packages/next/src/server/lib/server-ipc/utils.ts` 的 `INTERNAL_HEADERS` 过滤列表中，则可能被外部攻击者伪造。
