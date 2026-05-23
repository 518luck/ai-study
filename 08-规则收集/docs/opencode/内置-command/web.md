# Web 内置 / 命令

| 命令 | 作用 |
| :--- | :--- |
| `/share` | 分享当前 session / 复制分享链接 |
| `/unshare` | 取消分享 |
| `/new` | 新建 session |
| `/undo` | 撤回上一条用户消息 |
| `/redo` | 重做 |
| `/compact` | 压缩/总结 session |
| `/fork` | fork session |
| `/open` | 打开文件选择 |
| `/terminal` | 打开/切换 terminal |
| `/model` | 选择模型 |
| `/mcp` | 选择/切换 MCP |
| `/agent` | 切换 agent |
| `/workspace` | 切换 workspace 面板，git 项目可用 |

## Web 动态 / 命令

Web 还会把后端返回的 `sync.data.command` 全部放进 `/` 菜单，来源是：[packages/app/src/components/prompt-input.tsx](file:///home/duoyun/idea/open-source/opencode-v1.15.10/packages/app/src/components/prompt-input.tsx)

对应代码：
```typescript
const custom = sync.data.command.map((cmd) => ({
  trigger: cmd.name,
  source: cmd.source,
}))
```

所以 Web 还会显示：

| 类型 | 例子 | 来源 |
| :--- | :--- | :--- |
| 后端内置 command | `/init`, `/review` | [packages/opencode/src/command/index.ts](file:///home/duoyun/idea/open-source/opencode-v1.15.10/packages/opencode/src/command/index.ts) |
| 项目自定义 command | `/commit`, `/learn`, `/changelog` 等 | `.opencode/command/\*.md` |
| skill command | `/customize-opencode`, `/effect`, `/improve-codebase-architecture` | skill 系统 |
| MCP prompt | 取决于 MCP server | MCP 动态提供 |

当前这个仓库里，Web 额外应该能看到这些项目自定义命令：
- `/rmslop`
- `/ai-deps`
- `/commit`
- `/issues`
- `/spellcheck`
- `/translate`
- `/learn`
- `/changelog`

当前可用的 skill 也会在 Web 里直接作为 `/` 命令出现：
- `/customize-opencode`
- `/effect`
- `/improve-codebase-architecture`

## 和 TUI 的关键区别

- Web 不过滤 skill，所以能直接看到 `/customize-opencode`。
- TUI 过滤了 `source === "skill"`，所以 TUI 要通过 `/skills` 选择。
