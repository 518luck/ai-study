```
AGENTS.md                  ← 主指令（所有工具共用）
   │
   ├── .agents/            ← 中央枢纽
   │     └── skills/       ← 26 个可复用技能
   │
   ├── .claude/            ← Claude Code（通过 symlink 共享）
   │     ├── CLAUDE.md → ../AGENTS.md
   │     ├── skills/ → ../.agents/skills
   │     └── agents/backport-branch-worker.md  ← 子代理
   │
   ├── .codex/             ← OpenAI Codex（通过 symlink 共享）
   │     └── skills/ → ../.agents/skills
   │
   ├── .cursorignore       ← Cursor AI
   ├── .coderabbit.yml     ← AI Code Review Bot
   ├── .github/agents/     ← GitHub Actions AI agent
   └── .macroscope/        ← CI/CD AI 审查提示词

```

## 规则文件作用概览

| 规则文件                                         | 作用 / 描述                                                                                       |
| :----------------------------------------------- | :------------------------------------------------------------------------------------------------ |
| `AGENTS.md`                                      | 全仓库通用规则：Kibana 模块结构、测试命令、TypeScript 风格、插件约定、CI、i18n 等                 |
| `src/core/AGENTS.md`                             | 只针对 Kibana `src/core`：核心包命名、`-server`、`-browser`、`-internal`、`-mocks` 的职责和可见性 |
| `kbn-date-range-picker/AGENTS.md`                | 只针对一个 UI 组件：日期范围选择器的依赖、测试命令、JSDoc 要求、API 中不要暴露 `moment` 等        |
| `observability_agent_builder/AGENTS.md`          | Observability Agent Builder 插件总览：这个插件做什么，以及下面有哪些更细的指南                    |
| `observability_agent_builder/server/AGENTS.md`   | 服务端开发指南：工具设计原则、LLM 工具描述规范、参数命名、ECS/OTel 兼容、APM 数据模型、测试流程   |
| `routes/ai_insights/AGENTS.md`                   | AI Insights 专用：一键生成洞察和对话式 Agent 的区别、上下文预取、固定 prompt、UI 集成、测试方式   |
| `tools/get_service_topology/AGENTS.md`           | 单个工具级别的精确规则：`get_service_topology` 的上下游语义、BFS 深度、图遍历约束、测试覆盖       |
| `synthtrace/.../agent_builder/AGENTS.md`         | 测试数据生成指南：如何为 Agent Builder 工具和 AI Insights 生成合成观测数据                        |
| `test/.../observability_agent_builder/AGENTS.md` | API 集成测试指南：测试命令、测试结构、共享 API client、Synthtrace 使用要求                        |
