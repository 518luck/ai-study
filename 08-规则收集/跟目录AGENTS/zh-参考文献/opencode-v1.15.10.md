- 要重新生成 JavaScript SDK，运行 `./packages/sdk/js/script/build.ts`。
- 适用时始终使用并行工具（ALWAYS USE PARALLEL TOOLS WHEN APPLICABLE）。
- 本仓库的默认分支是 `dev`。
- 本地可能不存在 `main` 引用；使用 `dev` 或 `origin/dev` 进行差异比较。
- 优先自动化执行：除非因缺少信息或安全/不可逆操作受阻，否则直接执行请求的操作而无需确认。

## 提交与 PR 标题

使用约定式提交风格的消息和 PR 标题：`type(scope): summary`。

有效类型为 `feat`、`fix`、`docs`、`chore`、`refactor` 和 `test`。scope 是可选的；有帮助时使用受影响的包或区域，例如 `core`、`opencode`、`tui`、`app`、`desktop`、`sdk` 或 `plugin`。

示例：`fix(tui): simplify thinking toggle styling`、`docs: update contributing guide`、`chore(sdk): regenerate types`。

## 风格指南

### 通用原则

- 保持在同一个函数内，除非需要组合或复用
- 不要预先提取只用一次的辅助函数。在调用处内联逻辑，除非辅助函数被复用、隐藏了真正复杂的边界，或具有能改善调用方可读性的清晰独立名称。
- 尽可能避免 `try`/`catch`
- 避免使用 `any` 类型
- 尽可能使用 Bun API，例如 `Bun.file()`
- 尽可能依赖类型推断；除非导出或清晰性需要，避免显式类型注解或接口
- 优先使用函数式数组方法（flatMap、filter、map）而非 for 循环；在 filter 上使用类型守卫以维持下游类型推断
- 在 `src/config` 中添加新配置模块时，遵循文件顶部的现有自导出模式（例如 `export * as ConfigAgent from "./agent"`）。

通过内联仅使用一次的值来减少变量总数。

```ts
// Good
const journal = await Bun.file(path.join(dir, "journal.json")).json()

// Bad
const journalPath = path.join(dir, "journal.json")
const journal = await Bun.file(journalPath).json()
```

### 解构

避免不必要的解构。使用点表示法保留上下文。

```ts
// Good
obj.a
obj.b

// Bad
const { a, b } = obj
```

### 变量

优先使用 `const` 而非 `let`。使用三元表达式或提前返回代替重新赋值。

```ts
// Good
const foo = condition ? 1 : 2

// Bad
let foo
if (condition) foo = 1
else foo = 2
```

### 控制流

避免 `else` 语句。优先使用提前返回。

```ts
// Good
function foo() {
  if (condition) return 1
  return 2
}

// Bad
function foo() {
  if (condition) return 1
  else return 2
}
```

### 复杂逻辑

当函数有多个验证分支或支撑细节时，让主函数呈现为快乐路径，将支撑细节移到下方的小型辅助函数中。

```ts
// Good
export function loadThing(input: unknown) {
  const config = requireConfig(input)
  const metadata = readMetadata(input)
  return createThing({ config, metadata })
}

function requireConfig(input: unknown) {
  ...
}
```

- 将辅助函数保持在它们所支撑的代码附近，当主导出下方排列有助于可读性时放在其下方。
- 不要将简单表达式过度抽象为多个只用一次的辅助函数；仅在能命名真实概念（如 `requireConfig` 或 `readMetadata`）时才提取。
- 除非辅助函数确实执行有副作用的工作，否则不要从辅助函数返回 `Effect`。同步的解析、验证和选项构建应保持同步。
- 解析不受信任的 JSON 字符串时，优先使用 Effect schema 辅助函数如 `Schema.UnknownFromJsonString` 和 `Schema.decodeUnknownOption`，而非手动用 `Effect.try` 包装 `JSON.parse`。
- 为非显而易见的约束和令人惊讶的行为添加注释，而非为显而易见的赋值或控制流添加注释。

### Schema 定义（Drizzle）

字段名使用 snake_case，这样列名就不需要重新定义为字符串。

```ts
// Good
const table = sqliteTable("session", {
  id: text().primaryKey(),
  project_id: text().notNull(),
  created_at: integer().notNull(),
})

// Bad
const table = sqliteTable("session", {
  id: text("id").primaryKey(),
  projectID: text("project_id").notNull(),
  createdAt: integer("created_at").notNull(),
})
```

## 测试

- 尽可能避免 mock
- 测试实际实现，不要将逻辑复制到测试中
- 测试不能从仓库根目录运行（守卫：`do-not-run-tests-from-root`）；需从包目录（如 `packages/opencode`）运行。

## 类型检查

- 始终从包目录（如 `packages/opencode`）运行 `bun typecheck`，永远不要直接运行 `tsc`。
