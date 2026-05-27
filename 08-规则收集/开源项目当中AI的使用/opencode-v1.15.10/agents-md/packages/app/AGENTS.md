## 调试

- 绝不要尝试重启应用或服务器进程，任何时候都不要。

## 本地开发

- `opencode dev web` 代理的是 `https://app.opencode.ai`，因此本地 UI/CSS 变更不会在那里显示。
- 对于本地 UI 变更，请分别运行后端和应用开发服务器。
- 后端（在 `packages/opencode` 中）：`bun run --conditions=browser ./src/index.ts serve --port 4096`
- 应用（在 `packages/app` 中）：`bun dev -- --port 4444`
- 打开 `http://localhost:4444` 验证 UI 变更（它会连接到 `http://localhost:4096` 上的后端）。

## SolidJS

- 始终优先使用 `createStore`，而不是多次调用 `createSignal`

## 工具调用

- 适用时始终使用并行工具。

## 浏览器自动化

使用 `agent-browser` 进行 Web 自动化。运行 `agent-browser --help` 查看所有命令。

核心工作流程：

1. `agent-browser open <url>` - 导航到页面
2. `agent-browser snapshot -i` - 获取带有引用的可交互元素（@e1、@e2）
3. `agent-browser click @e1` / `fill @e2 "text"` - 使用引用进行交互
4. 页面变化后重新获取快照
