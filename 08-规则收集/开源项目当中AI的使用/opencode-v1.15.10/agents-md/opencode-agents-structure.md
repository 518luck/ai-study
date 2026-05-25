# opencode-v1.15.10 AGENTS.md 结构总结

## 一、文件分布树形图

```
opencode-v1.15.10/
├── AGENTS.md                                          [L0] 项目全局规范
├── packages/
│   ├── app/
│   │   └── AGENTS.md                                  [L1] Web 前端包规范
│   ├── desktop/
│   │   └── AGENTS.md                                  [L1] Electron 桌面包规范
│   ├── effect-drizzle-sqlite/
│   │   └── AGENTS.md                                  [L1] Drizzle-Effect-SQLite 适配器包规范
│   ├── llm/
│   │   └── AGENTS.md                                  [L1] LLM 核心包规范（最大、最详细）
│   └── opencode/
│       ├── AGENTS.md                                  [L1] 核心业务包规范
│       ├── src/
│       │   ├── server/
│       │   │   └── routes/
│       │   │       └── instance/
│       │   │           └── httpapi/
│       │   │               └── AGENTS.md              [L2] HTTP API 路由层规范
│       │   └── session/
│       │       └── llm/
│       │           └── AGENTS.md                      [L2] Session LLM 适配器层规范
│       └── test/
│           ├── AGENTS.md                              [L2] 测试框架与 Fixture 规范
│           └── server/
│               └── AGENTS.md                          [L3] 服务端测试规范
```

**层级说明:**
- **L0** — 项目全局，覆盖整个 monorepo
- **L1** — 包级别，覆盖单个 `packages/*` 包
- **L2** — 模块/子目录级别，覆盖包内特定子系统
- **L3** — 子模块级别，覆盖模块内的细分领域

---

## 二、各文件详细总结

### 1. `AGENTS.md`（根目录 · L0 · 全局规范）

**职责:** 项目范围的通用开发规范，所有包共享。

**核心规则:**

| 主题 | 规则 |
|------|------|
| 仓库操作 | 默认分支 `dev`；SDK 重新生成用 `./packages/sdk/js/script/build.ts` |
| Commit 规范 | `type(scope): summary`，类型: feat/fix/docs/chore/refactor/test |
| 变量 | 优先 `const`；三元/early return 代替 `let` 赋值 |
| 解构 | 避免不必要的解构，用 `obj.a` 保持上下文 |
| 控制流 | 避免 `else`，用 early return |
| 函数设计 | 保持单函数内聚，不过早提取 helper；helper 放主函数下方 |
| Effect | 不要从同步 helper 返回 Effect；优先 `Schema.UnknownFromJsonString` |
| 类型 | 避免 `any`；依赖类型推断 |
| Drizzle Schema | 字段用 snake_case，列名不需要重复定义 |
| 测试 | 避免 mock；测实际实现；不能从 repo 根运行测试 |
| 类型检查 | 用 `bun typecheck`，不用 `tsc` |
| 内联 | 值只用一次就直接内联，减少变量数量 |

---

### 2. `packages/app/AGENTS.md`（L1 · Web 前端包）

**职责:** Web 前端（SolidJS）开发规范。

**核心规则:**

| 主题 | 规则 |
|------|------|
| 调试 | 绝不重启 app 或 server 进程 |
| 本地开发 | UI 变更需分别启动后端(4096)和前端(4444)；`opencode dev web` 代理远程不会显示本地 UI |
| SolidJS | 优先 `createStore` 而非多个 `createSignal` |
| 浏览器自动化 | 用 `agent-browser`：open → snapshot → click/fill → re-snapshot |

---

### 3. `packages/desktop/AGENTS.md`（L1 · Electron 桌面包）

**职责:** Electron 桌面应用架构约束。

**核心规则:**

| 主题 | 规则 |
|------|------|
| Renderer 进程 | 只调用 `window.api`（来自 `src/preload`） |
| Main 进程 | IPC handlers 统一注册在 `src/main/ipc.ts` |

---

### 4. `packages/effect-drizzle-sqlite/AGENTS.md`（L1 · Drizzle 适配器包）

**职责:** Vendored 的 Drizzle + Effect + SQLite 适配器。

**核心规则:**

| 主题 | 规则 |
|------|------|
| 包定位 | 保持通用，不加 opencode 业务逻辑（表、路径、迁移、hooks） |
| 运行时依赖 | 依赖通用 `effect/unstable/sql/SqlClient`，具体驱动放 tests/examples |
| 上游兼容 | 尽量保持 Drizzle 命名和行为，便于将来被上游 `drizzle-orm/effect-sqlite` 替代 |
| 关键入口 | `src/effect-sqlite/driver.ts`（make/makeWithDefaults）、`session.ts`（适配 SqlClient）、`src/sqlite-core/effect/*`（查询构建器） |

---

### 5. `packages/llm/AGENTS.md`（L1 · LLM 核心包 — 最详细）

**职责:** `@opencode-ai/llm` 包的完整架构指南，是所有 AGENTS.md 中内容最丰富的文件。

**核心规则按主题:**

#### Effect 惯用法
- 优先 `HttpClient` / `Stream` / Effect Schema codec
- `Effect.gen` 中用 `yield* new MyError(...)` 而非 `Effect.fail`
- 用 `Effect.void` 代替 `Effect.succeed(undefined)`

#### 构造器约定
- 类型构造器挂在类型上：`Message.user(...)` / `Model.make(...)`
- 顶层 `LLM` 命名空间只留给 request 形 API：`LLM.request` / `LLM.stream` / `LLM.generate`

#### 四轴路由分解架构
- **Protocol** — 语义 API 契约（body 构建、stream 事件解析、状态机）
- **Endpoint** — URL 构建（host、path、query）
- **Auth** — 认证（bearer、header、签名）
- **Framing** — 字节→帧（SSE、AWS event-stream）
- 组合: `Route.make({ protocol, endpoint, auth, framing })`
- 使得 DeepSeek/TogetherAI/Cerebras 等复用 OpenAIChat.protocol 只需 5-15 行

#### Provider Facade 模式
- `OpenAI.configure({ apiKey }).responses("gpt-4o-mini")` 配置式 API
- `apiKey` 和 `auth` 互斥，用 `ProviderAuthOption`

#### 文件夹布局
```
src/
  schema/          — Schema 模型（ids, options, messages, events, errors）
  llm.ts           — 请求构造器
  route/           — 路由核心（client, executor, protocol, endpoint, auth, framing, transport/）
  protocols/       — 协议实现（openai-chat, openai-responses, anthropic, gemini, bedrock...）
  providers/       — Provider facade（openai, azure, anthropic, google, xai...）
  tool.ts          — 工具 helper
  tool-runtime.ts  — 工具执行运行时
```

#### 工具运行时
- `LLM.stream({ request, tools })` 执行工具循环
- `ToolFailure` 是唯一可恢复错误类型
- Provider 执行的工具（`providerExecuted: true`）跳过客户端分发

#### Protocol 文件风格
- 固定节顺序：Public model → Body schema → Event schema → Parser state → fromRequest → step → Protocol/route → Export
- Provider 特殊逻辑放 `protocols/utils/*`
- 每个完成的响应只发射一个 terminal `finish` 事件

#### 录制测试
- 每个场景一个 cassette 文件（JSON 数组）
- `RECORD=true` 录制新 cassette，默认回放
- 支持按 provider/prefix/tags/name 过滤
- Bedrock 二进制 body 用 base64 编码

---

### 6. `packages/opencode/AGENTS.md`（L1 · 核心业务包）

**职责:** opencode 核心包的数据库、模块结构、Effect 规范。

**核心规则:**

#### 数据库
- Schema 在 `src/**/*.sql.ts`
- 表/列 snake_case；索引 `<table>_<column>_idx`
- 迁移: `bun run db generate --name <slug>`

#### 开发服务器
- `bun dev` 在 tmux 中运行：`tmux new-session -d -s opencode-dev 'bun dev'`
- 捕获输出：`tmux capture-pane -pt opencode-dev`

#### 模块结构
- 禁止 `export namespace Foo {}`
- 使用自导出模式: `export * as Foo from "./foo"`
- 消费端: `import { Foo } from "@/foo/foo"`
- `index.ts` 中用 `export * as Foo from "."`
- 多兄弟目录不加 barrel `index.ts`

#### Effect 规则
- `Effect.gen` 组合；`Effect.fn` 命名追踪
- `Schema.Class` 多字段 / `Schema.brand` 单值 / `Schema.TaggedErrorClass` 错误
- `makeRuntime` 全局服务 / `InstanceState` 按 directory 隔离
- Effect v4: 无 `Effect.fork`/`forkDaemon`，用 `Effect.forkIn(scope)`
- 优先 Effect 服务：`FileSystem` > `fs/promises`、`HttpClient` > `fetch`
- `Effect.cached` 用于去重并发计算
- `EffectBridge` 用于外部回调边界

---

### 7. `packages/opencode/src/server/routes/instance/httpapi/AGENTS.md`（L2 · HTTP API 路由）

**职责:** HTTP API 路由层的编码模式。

**核心规则:**

| 主题 | 规则 |
|------|------|
| 标准 endpoint | 用 `HttpApiBuilder.group(...)`，在 handler layer 中 yield 服务 |
| SSE endpoint | 同样用 `group(...)`，返回 `HttpServerResponse.stream(...)` |
| Raw route | 仅 WebSocket/fallback 用 `HttpRouter.use(...)` |
| Layer 提供 | 不在 handler 内 `Effect.provide`；stable layer 在应用层提供一次 |
| 错误 | 公开 JSON 错误用 `Schema.ErrorClass` 声明在 endpoint 上 |
| 中间件 | 在 layer 边界组合，路由树在 `server.ts` 中保持显式 |

---

### 8. `packages/opencode/src/session/llm/AGENTS.md`（L2 · Session LLM 适配器）

**职责:** Session LLM 层的运行时边界与适配器职责划分。

**核心规则:**

#### 三文件适配器架构
- `ai-sdk.ts` — AI SDK fullStream → LLMEvent 转换（默认路径）
- `native-request.ts` — opencode 输入 → LLMRequest 转换（不执行请求）
- `native-runtime.ts` — 原生运行时网关（模型支持判断 + 工具桥接 + LLMClient 委托）

#### 运行时选择
```
LLM.Service (llm.ts) → native gate
  ├── YES → native-runtime.ts → native-request.ts → LLMClient
  └── NO  → AI SDK streamText → ai-sdk.ts
  两者都产出 → LLMEvent stream → session processor
```

#### 安全边界
- AI SDK 是默认路径
- `OPENCODE_EXPERIMENTAL_NATIVE_LLM=true` 选择原生路径
- 不支持的 provider 自动回退 AI SDK

#### 文件职责约束
- 只有 `native-request.ts` 构造 `@opencode-ai/llm` 值
- session 服务不导入到 `native-request.ts`
- `ai-sdk.ts` 和 `native-runtime.ts` 都产出相同的 `LLMEvent`

---

### 9. `packages/opencode/test/AGENTS.md`（L2 · 测试框架）

**职责:** 测试 fixture、Effect 测试模式、并发同步策略。

**核心规则:**

#### 临时目录 Fixture
- `tmpdir()` 创建自动清理的临时目录
- 支持 `git`、`config`、`init`、`dispose` 选项
- 用 `await using` 自动清理

#### Effect 测试
- `testEffect(...)` 构建 Effect 测试运行器
- `it.effect` — TestClock/TestConsole
- `it.live` — 真实 OS 行为
- `it.instance` — 带 scoped 临时目录和实例上下文
- Fixture: `tmpdirScoped` / `provideInstance` / `provideTmpdirInstance` / `provideTmpdirServer`

#### Partial Service Stub
- 用 `Layer.mock` 只覆盖需要的方法，其余抛 `UnimplementedError`

#### 并发同步
- 禁止 `Effect.sleep(N)` 等待（anti-pattern）
- 必须用发布信号：`pollWithTimeout` / `awaitWithTimeout` / `llm.wait(n)` / `SessionStatus` / `Deferred` / `Latch`
- 固定 sleep 仅用于测试 debounce/throttle、mtime 粒度、网络延迟

---

### 10. `packages/opencode/test/server/AGENTS.md`（L3 · 服务端测试）

**职责:** 服务端和 HTTP API 中间件测试模式。

**核心规则:**

| 主题 | 规则 |
|------|------|
| 测试路由 | 优先小 fake route 而非完整 API 路由树 |
| 测试服务器 | `testEffect(...)` + `NodeHttpServer.layerTest` |
| Probe 路由 | `HttpRouter.add(...)` 暴露待测上下文 |
| 中间件组合 | 按生产顺序组合 |
| 上游服务器 | 用 Effect `NodeHttpServer.layer(...)` 构建到 test scope |
| 禁止 | 不用 `Bun.serve` 测试 Effect HTTP 中间件 |
| WebSocket | 用 `Socket.makeWebSocket(...)` 测试 |
| 项目状态 | `tmpdirScoped({ git: true })` + `Project.use.fromDirectory(dir)` |

---

## 三、层级关系图

```
┌──────────────────────────────────────────────────────────────┐
│  L0: AGENTS.md (全局)                                        │
│  · Commit 规范 · 代码风格 · 类型 · 测试原则 · Drizzle Schema │
│  · 适用于整个 monorepo                                       │
└────────────────────┬─────────────────────────────────────────┘
                     │ 继承/覆盖
      ┌──────────────┼──────────────────┬───────────────────┐
      ▼              ▼                  ▼                   ▼
┌───────────┐ ┌────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ L1: app   │ │ L1: desktop│ │ L1: effect-     │ │ L1: llm         │
│ · SolidJS │ │ · Electron │ │   drizzle-sqlite│ │ · Effect 惯用法  │
│ · 调试    │ │ · IPC 架构 │ │ · 通用性约束    │ │ · 四轴路由架构   │
│ · 浏览器  │ │            │ │ · 上游兼容      │ │ · Provider 模式  │
│   自动化  │ │            │ │                 │ │ · 工具运行时     │
└───────────┘ └────────────┘ └─────────────────┘ │ · 录制测试       │
                                                 │ · 文件夹布局     │
                                                 └────────┬────────┘
                                                          │
      ┌───────────────────────────────────────────────────┘
      ▼
┌──────────────────────────────┐
│ L1: opencode                 │
│ · 数据库 · 模块结构          │
│ · Effect 规则 · Runtime      │
│ · 开发服务器                 │
└──────┬───────────┬───────────┘
       │           │
  ┌────┘      ┌────┘
  ▼           ▼
┌────────────────────┐  ┌──────────────────────┐
│ L2: httpapi        │  │ L2: session/llm      │
│ · HttpApiBuilder   │  │ · 三适配器架构        │
│ · SSE · Raw route  │  │ · 运行时选择门        │
│ · Layer/中间件     │  │ · AI SDK vs Native    │
└────────────────────┘  └──────────────────────┘
       │
  ┌────┴─────────────────────┐
  ▼                          ▼
┌─────────────────┐  ┌─────────────────────┐
│ L2: test        │  │ L3: test/server     │
│ · tmpdir fixture│  │ · fake route 模式   │
│ · Effect 测试   │  │ · 中间件测试        │
│ · 并发同步      │  │ · WebSocket 测试    │
│ · Layer.mock    │  └─────────────────────┘
└─────────────────┘
```

---

## 四、主题覆盖矩阵

| 主题 | L0 全局 | app | desktop | effect-drizzle | llm | opencode | httpapi | session/llm | test | test/server |
|------|---------|-----|---------|----------------|-----|----------|---------|-------------|------|-------------|
| Effect | ● | | | ● | ●●● | ●●● | | ●● | ●● | |
| 代码风格 | ●● | | | | | ● | | | | |
| 测试 | ● | | | | ●● | | | | ●●● | ●● |
| 数据库 | ● | | | ● | | ● | | | | |
| HTTP/API | | | | | | | ●●● | | | ●● |
| LLM/AI | | | | | ●●● | | | ●●● | | |
| 架构/模块 | | | ● | ● | ●● | ●● | ● | ● | | |
| 工具运行时 | | | | | ●● | | | ● | | |
| Commit 规范 | ● | | | | | | | | | |
| 浏览器自动化 | | ● | | | | | | | | |
| Provider 路由 | | | | | ●●● | | | | | |

> ● 提及 ●● 重点 ●●● 核心主题

---

## 五、文件大小与复杂度

| 文件 | 行数(约) | 复杂度 | 定位 |
|------|----------|--------|------|
| `AGENTS.md` (根) | ~135 | 中 | 全局编码规范 |
| `packages/app/AGENTS.md` | ~30 | 低 | 前端开发指南 |
| `packages/desktop/AGENTS.md` | ~5 | 极低 | 架构约束 |
| `packages/effect-drizzle-sqlite/AGENTS.md` | ~25 | 低 | 包边界约束 |
| `packages/llm/AGENTS.md` | ~500+ | 极高 | LLM 完整架构文档 |
| `packages/opencode/AGENTS.md` | ~130 | 高 | 核心 Effect + 数据库规范 |
| `packages/opencode/src/server/routes/instance/httpapi/AGENTS.md` | ~40 | 中 | HTTP 路由模式 |
| `packages/opencode/src/session/llm/AGENTS.md` | ~120 | 高 | LLM 运行时边界 |
| `packages/opencode/test/AGENTS.md` | ~204 | 高 | 测试框架完整指南 |
| `packages/opencode/test/server/AGENTS.md` | ~15 | 低 | 服务端测试模式 |

---

## 六、关键设计模式总结

1. **分层 AGENTS.md:** 全局 → 包级 → 模块级 → 子模块级，每层只管自己领域的规则，不重复上层内容
2. **Effect-first:** 从 L0 到各 L1/L2 贯穿 Effect 惯用法（Schema Class、gen、fn、Stream、Layer）
3. **四轴路由分解:** LLM 包的 Protocol/Endpoint/Auth/Framing 架构实现了高复用
4. **双运行时网关:** session/llm 的 AI SDK vs Native 选择门，per-request 切换
5. **自导出模块:** 禁止 namespace，用 `export * as Foo from "./foo"` 投影
6. **信号同步而非 sleep:** 测试中必须用 published readiness signal，禁止 wall-clock 等待
7. **InstanceState 隔离:** 按 directory 的 ScopedCache，每个项目独立状态
8. **录制测试:** cassette-based，按 provider/prefix/tag 过滤，二进制 body base64 编码
