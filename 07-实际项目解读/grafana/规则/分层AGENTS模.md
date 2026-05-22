# Grafana 分层 AGENTS.md 模式解读

## 背景

Grafana 仓库在根目录和子目录中各放置了 AGENTS.md 文件，形成分层配置模式。

相关文件：
- 根目录：`/AGENTS.md`（~165 行）
- Alerting 子目录：`/public/app/features/alerting/unified/AGENTS.md`（~588 行）
- 文档子目录：`/docs/AGENTS.md`（文档风格指南）

## 根目录 AGENTS.md vs 子目录 AGENTS.md

| | 根目录 `AGENTS.md` | 子目录 `AGENTS.md` |
|---|---|---|
| **范围** | 整个 Grafana 仓库 | 特定功能域（如 Alerting） |
| **内容** | 项目概览、通用构建/测试命令、整体架构 | 领域特有的模式、约定、测试策略 |
| **行数** | ~165 行 | ~588 行（Alerting 的更详细） |
| **适用** | 所有 AI 操作 | 仅在该目录下工作时 |

## 关键设计

### 根目录主动声明子目录 agent 文件

根目录 AGENTS.md 开头就主动声明了子目录 agent 文件的存在：

> **Directory-scoped agent files exist for specialized areas — read them when working in those directories:**
> - `docs/AGENTS.md` — Documentation style guide (for work under `docs/`)
> - `public/app/features/alerting/unified/AGENTS.md` — Alerting squad patterns

这种做法让 AI 在读取根目录规则时就知道还有更深层的领域规则需要加载。

### Alerting AGENTS.md 的深度内容

Alerting 的 AGENTS.md 比 root 版本更深入，包含：

1. **状态管理模式**：RTK Query vs Redux 的迁移方向
   - 新功能必须使用 RTK Query，不再新增 Redux 代码
   - 优先使用 `@grafana/api-clients` 自动生成的客户端

2. **自动生成 API 客户端的优先使用策略**
   - 优先使用 `@grafana/api-clients` 自动生成的 RTK Query 客户端
   - 仅在自动生成客户端不完整时使用 `enhanceEndpoints` 补丁
   - 禁止手动创建新的 RTKQ endpoint

3. **MSW mock 数据工厂的具体用法**
   - 使用 `alertingFactory` 构建测试数据
   - `mockDataSource()`、`mockPromAlert()` 等工厂函数
   - 自动序列化（如 "Alerting rule 1"、"Alerting rule 2"）

4. **导航/URL 的注意事项**
   - `createRelativeUrl` 仅用于渲染原生 `<a>` 标签的组件（如 `LinkButton`）
   - `locationService`、`TextLink`、React Router `Link` 不需要 `createRelativeUrl`

5. **依赖安全策略**
   - 禁止擅自 `yarn add`，必须先获得批准
   - 7 天隔离期：新发布的包至少等 7 天才能引入
   - 始终使用 `yarn install --immutable`，禁止手动编辑 `yarn.lock`

6. **GitHub CLI 使用场景**
   - 用 `gh issue view`、`gh pr diff` 等命令获取上下文
   - 在处理 issue 和 PR 时主动使用

7. **从纠正中学习**
   - 当用户纠正 AI 的错误时，评估是否值得添加到 AGENTS.md
   - 不要擅自修改，需要获得明确批准

## 适用场景

这种分层 AGENTS.md 模式适合以下情况：

1. **大型 monorepo**：项目包含多个独立领域，每个领域有自己的开发模式和约定
2. **多团队协作**：不同 squad（如 Alerting、Dashboard、Explore）各自维护领域规则
3. **复杂度分层**：全局规则保持简洁，领域规则可以深入细节而不影响其他团队

## 模式总结

```
AGENTS.md（根目录）
├── 全局通用规则（构建、测试、架构概览）
├── 声明子目录 agent 文件的位置和用途
│
├── docs/AGENTS.md
│   └── 文档风格指南
│
├── public/app/features/alerting/unified/AGENTS.md
│   └── Alerting 领域专属规则
│       ├── 状态管理模式
│       ├── API 客户端策略
│       ├── 测试模式
│       ├── 依赖安全策略
│       └── ...
│
└── （其他子目录可按需添加）
```

根目录作为"索引"指向各子目录的 agent 文件，AI 在进入特定目录工作时自动加载对应规则。
