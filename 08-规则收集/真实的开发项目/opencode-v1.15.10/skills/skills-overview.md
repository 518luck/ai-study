# opencode-v1.15.10 Skills 概述

## 目录结构

```
skills/
├── skills-overview.md                          ← 本文件
├── .opencode/skills/                           ← 项目级 Skills（运行时使用）
│   ├── effect/
│   │   └── SKILL.md
│   └── improve-codebase-architecture/
│       ├── SKILL.md
│       ├── LANGUAGE.md
│       ├── DEEPENING.md
│       └── INTERFACE-DESIGN.md
└── packages/opencode/test/fixture/skills/      ← 测试 Fixture Skills（测试数据）
    ├── index.json
    ├── agents-sdk/
    │   ├── SKILL.md
    │   └── references/
    │       └── callable.md
    └── cloudflare/
        └── SKILL.md
```

---

## 项目级 Skills（`.opencode/skills/`）

这些是 opencode 在运行时实际加载的技能，用于指导 AI 编码助手在特定领域的行为。

### 1. effect

**路径:** `.opencode/skills/effect/SKILL.md`

**作用:** 指导 AI 正确使用 Effect v4 / effect-smol 编写 TypeScript 代码。

**核心要点:**
- 强制使用 Effect v4 最新 API，禁止依赖记忆中的旧版 Effect v2/v3 示例
- 需要查询 `.opencode/references/effect-smol` 源码验证 API 用法
- 规定 Effect 惯用法：`Effect.gen`、`Effect.fn`、Schema 优先、Layer 显式组合
- HTTP handler 保持薄层，业务逻辑放 service
- 测试使用 `testEffect(...)` 和 `it.live(...)` 等 repo 内置测试工具

---

### 2. improve-codebase-architecture

**路径:** `.opencode/skills/improve-codebase-architecture/SKILL.md`

**作用:** 帮助发现代码库中的架构摩擦，提出「深化」(deepening) 重构建议，提升可测试性和 AI 可导航性。

**核心要点:**
- 定义了一套严格的架构词汇（Module / Interface / Seam / Depth / Adapter / Leverage / Locality），参见 `LANGUAGE.md`
- 三步流程：探索代码 → 呈现候选深化点 → 与用户进行设计对话
- 「删除测试」判断模块是否浅层：删除后复杂度消失 = 透传模块；复杂度分散到 N 个调用方 = 有价值的模块
- 支持接口设计探索：并行生成 3+ 个截然不同的接口方案对比（参见 `INTERFACE-DESIGN.md`）
- 依赖分类决定测试策略：进程内 / 本地可替换 / 远程自有 / 真正外部（参见 `DEEPENING.md`）
- 与 `CONTEXT.md`（领域语言）和 `docs/adr/`（架构决策记录）联动

**附属文件:**
- `LANGUAGE.md` — 统一架构词汇表，定义 Module/Interface/Seam/Depth/Adapter/Leverage/Locality 等核心术语
- `DEEPENING.md` — 深化策略：依赖分类（进程内/本地可替换/远程/外部）和测试策略（替换而非叠加）
- `INTERFACE-DESIGN.md` — 接口设计方法论：并行生成多个截然不同的接口方案进行对比

---

## 测试 Fixture Skills（`packages/opencode/test/fixture/skills/`）

这些是 opencode 测试套件中用于验证 skills 加载/解析功能的测试数据。

### 3. agents-sdk

**路径:** `packages/opencode/test/fixture/skills/agents-sdk/SKILL.md`

**作用:** Cloudflare Agents SDK 的完整开发指南，覆盖 AI Agent 的构建。

**核心要点:**
- 基于Cloudflare Workers 构建有状态的 AI Agent
- 支持：持久化状态（SQLite）、可调用 RPC（`@callable()`）、调度任务、Durable Workflows、MCP 集成、流式聊天、React Hooks
- 强调优先从 GitHub 文档获取最新信息，不依赖预训练知识
- 包含完整的 API 参考表和代码示例

**附属文件:**
- `references/callable.md` — `@callable()` RPC 方法的详细用法（流式响应、超时、内省）

---

### 4. cloudflare

**路径:** `packages/opencode/test/fixture/skills/cloudflare/SKILL.md`

**作用:** Cloudflare 全平台综合技能，覆盖计算、存储、AI、网络、安全等所有产品线。

**核心要点:**
- 通过决策树引导选择正确的 Cloudflare 产品
- 覆盖 6 大领域：计算与运行时（Workers/Pages/DO）、存储（KV/D1/R2）、AI/ML（Workers AI/Vectorize/Agents SDK）、网络（Tunnel/Spectrum）、安全（WAF/DDoS）、媒体（Images/Stream）
- 产品索引表列出 50+ 个 Cloudflare 产品及其参考文档路径
- 综合性最强、覆盖面最广的 skill

---

## Skills 对比总结

| Skill | 类型 | 复杂度 | 关注领域 |
|-------|------|--------|----------|
| effect | 项目级 | 中 | Effect v4 函数式编程 |
| improve-codebase-architecture | 项目级 | 高 | 架构分析与重构 |
| agents-sdk | 测试数据 | 高 | Cloudflare AI Agent 开发 |
| cloudflare | 测试数据 | 极高 | Cloudflare 全平台（50+ 产品） |
