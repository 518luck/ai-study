## 全局类

| 命令        | 别名                   | 作用                                  |
| :---------- | :--------------------- | :------------------------------------ |
| `/sessions` | `/resume`, `/continue` | 切换/继续会话                         |
| `/new`      | `/clear`               | 新建会话                              |
| `/models`   |                        | 切换模型                              |
| `/agents`   |                        | 切换 agent                            |
| `/mcps`     |                        | 开关 MCP                              |
| `/variants` |                        | 切换模型 variant，有 variant 时才显示 |
| `/connect`  |                        | 连接 provider                         |
| `/org`      | `/orgs`, `/switch-org` | 切换 org，仅有多个 org 时显示         |
| `/status`   |                        | 查看状态                              |
| `/themes`   |                        | 切换主题                              |
| `/help`     |                        | 打开帮助                              |
| `/exit`     | `/quit`, `/q`          | 退出 TUI                              |

## 会话类

| 命令          | 别名                 | 作用                         |
| :------------ | :------------------- | :--------------------------- |
| `/share`      |                      | 分享当前会话                 |
| `/unshare`    |                      | 取消分享，已有分享链接时可用 |
| `/rename`     |                      | 重命名会话                   |
| `/timeline`   |                      | 跳转到消息                   |
| `/fork`       |                      | fork 当前会话                |
| `/compact`    | `/summarize`         | 压缩/总结会话                |
| `/undo`       |                      | 撤回上一条用户消息           |
| `/redo`       |                      | 重做                         |
| `/timestamps` | `/toggle-timestamps` | 显示/隐藏时间戳              |
| `/thinking`   | `/toggle-thinking`   | 展开/折叠 thinking           |
| `/copy`       |                      | 复制会话 transcript          |
| `/export`     |                      | 导出会话 transcript          |

## 输入框/工作区类

| 命令      | 作用                                        |
| :-------- | :------------------------------------------ |
| `/editor` | 用外部编辑器编辑输入内容                    |
| `/skills` | 打开 skills 选择器                          |
| `/warp`   | 切换 workspace，实验性 workspace 开启时可用 |

## VCS 类

| 命令    | 作用             |
| :------ | :--------------- |
| `/diff` | 打开 diff viewer |

## 后端动态 / 命令

TUI 还会把后端返回的 command 加进 `/` 菜单，来源是：[packages/opencode/src/cli/cmd/tui/component/prompt/autocomplete.tsx](file:///home/duoyun/idea/open-source/opencode-v1.15.10/packages/opencode/src/cli/cmd/tui/component/prompt/autocomplete.tsx)

包括：

| 类型               | 例子                                 | 来源                                                                                                                                    |
| :----------------- | :----------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| 后端内置 command   | `/init`, `/review`                   | [packages/opencode/src/command/index.ts](file:///home/duoyun/idea/open-source/opencode-v1.15.10/packages/opencode/src/command/index.ts) |
| 项目自定义 command | `/commit`, `/learn`, `/changelog` 等 | `.opencode/command/\*.md`                                                                                                               |
| MCP prompt         | 取决于 MCP server                    | MCP 动态提供                                                                                                                            |

当前这个仓库的自定义 command 有：

- `/rmslop`
- `/ai-deps`
- `/commit`
- `/issues`
- `/spellcheck`
- `/translate`
- `/learn`
- `/changelog`

> **注意：** TUI 当前不会把 skill 直接显示成 `/customize-opencode`，因为这里过滤了 `source === "skill"`。所以 skill 要通过： `/skills`
