<!--
  内置技能。名称和描述已在 packages/opencode/src/skill/index.ts 中注册
  （参见 CUSTOMIZE_OPENCODE_SKILL_NAME 和 CUSTOMIZE_OPENCODE_SKILL_DESCRIPTION）。
  下方的正文将成为该技能的具体内容。
-->

# 定制 opencode (Customizing opencode)

opencode 对其自身的配置有着极其严格的校验，一旦任何字段配置错误，它就会拒绝启动。下方的配置结构涵盖了常用的配置项，但它们只是**概要整理，而非最终的官方标准**。

## 完整 Schema 参考 (Full schema reference)

关于每个配置选项的权威定义列表（包含字段类型、枚举值、默认值以及描述信息），均存放在官方发布的 JSON Schema 中：

**<https://opencode.ai/config.json>**

如果某个字段在当前技能中没有详细说明，或者在编写配置前您需要确认确切的结构形态，**请直接获取该 URL 并阅读 Schema，切勿凭空猜测**。opencode 对非法配置会直接报错退出，配置错误的代价将是系统无法正常启动。

此外，建议每个 `opencode.json` 文件都显式声明：
`"$schema": "https://opencode.ai/config.json"`
这样用户的编辑器在编写配置时便能自动捕捉到拼写或格式错误。

## 应用配置变更 (Applying changes)

配置仅在 opencode 启动时加载一次，不支持热重载。在向 `opencode.json`、Agent 文件、技能、插件或任何其他配置层面的文件保存更改后，**请提醒用户退出并重启 opencode** 以使更改生效。在此之前，当前运行中的会话仍将继续使用已加载的旧配置。

## 文件存放位置 (Where files live)

| 配置作用域 (Scope) | 存放路径 (Path) |
| :--- | :--- |
| **项目级配置** | `./opencode.json`、`./opencode.jsonc` 或 `.opencode/opencode.json`（opencode 会从当前工作目录向上查找到工作区根目录） |
| **全局配置** | `~/.config/opencode/opencode.json`（**请注意：不是** `~/.opencode/`） |
| **项目级 Agent** | `.opencode/agent/<name>.md` 或 `.opencode/agents/<name>.md` |
| **全局 Agent** | `~/.config/opencode/agent(s)/<name>.md` |
| **项目级技能 (Skills)** | `.opencode/skill(s)/<name>/SKILL.md` |
| **全局技能 (Skills)** | `~/.config/opencode/skill(s)/<name>/SKILL.md` |
| **外部技能（自动加载）** | `~/.claude/skills/<name>/SKILL.md`，`~/.agents/skills/<name>/SKILL.md` |

各个作用域的配置会被深度合并（deep-merged）。项目级配置会覆盖全局配置。`opencode.json` 中无法识别的顶层键名（key）会被直接拒绝，并抛出 `ConfigInvalidError`。

## opencode.json

每个字段都是可选的（optional）。

```json
{
  "$schema": "https://opencode.ai/config.json",
  "username": "string",
  "model": "provider/model-id",
  "small_model": "provider/model-id",
  "default_agent": "agent-name",
  "shell": "/bin/zsh",
  "logLevel": "DEBUG" | "INFO" | "WARN" | "ERROR",
  "share": "manual" | "auto" | "disabled",
  "autoupdate": true | false | "notify",
  "snapshot": true,
  "instructions": ["AGENTS.md", "docs/style.md"],

  "skills": {
    "paths": [".opencode/skills", "/abs/path/to/skills"],
    "urls": ["https://example.com/.well-known/skills/"]
  },

  "agent": {
    "my-agent": {
      "model": "anthropic/claude-sonnet-4-6",
      "mode": "subagent",
      "description": "...",
      "permission": { "edit": "deny" }
    }
  },

  "command": {
    "deploy": { "description": "...", "prompt": "..." }
  },

  "provider": {
    "anthropic": { "options": { "apiKey": "..." } }
  },
  "disabled_providers": ["openai"],
  "enabled_providers": ["anthropic"],

  "mcp": {
    "playwright": {
      "type": "local",
      "command": ["npx", "-y", "@playwright/mcp"],
      "enabled": true,
      "env": {}
    },
    "remote-thing": {
      "type": "remote",
      "url": "https://...",
      "headers": { "Authorization": "Bearer ..." }
    }
  },

  "plugin": [
    "opencode-gemini-auth",
    "opencode-foo@1.2.3",
    "./local-plugin.ts",
    ["opencode-bar", { "option": "value" }]
  ],

  "permission": {
    "edit": "deny",
    "bash": { "git *": "allow", "*": "ask" }
  },

  "formatter": false,
  "lsp": false,

  "experimental": {
    "primary_tools": ["edit"],
    "mcp_timeout": 30000
  },

  "tool_output": { "max_lines": 200, "max_bytes": 8192 },

  "compaction": { "auto": true, "tail_turns": 15 }
}
```

需要明确注意的结构特征：

- `model` 参数值必须携带服务商前缀，例如 `"anthropic/claude-sonnet-4-6"`。
- `skills` 是一个包含了 `paths` 和/或 `urls` 的**对象**，而不是数组。
- `agent` 是一个以 Agent 名称作为键（key）的**对象**，而不是数组。
- `plugin` 是一个由字符串或 `[name, options]` 元组构成的**数组**，而不是对象。
- `mcp[name].command` 必须是一个由字符串构成的**数组**，绝不能是单个字符串。此外，`type` 字段是必填项。
- `permission` 既可以是一个表示动作的字符串，也可以是一个以工具名称为键的对象。

## 技能 (Skills)

opencode 的技能加载器会自动扫描技能目录下的 `**/SKILL.md` 文件。文件名称必须为 `SKILL.md`，且存放于以技能名称命名的单独文件夹中：

```
.opencode/skills/my-skill/SKILL.md
```

前置元数据（Frontmatter）格式：

```markdown
---
name: my-skill
description: 用一句话概括此技能的作用以及何时触发它。优先写出用户可能会提到的具体关键字或文件名。
---

# My Skill

（以下为 Markdown 格式的技能主体内容：指令、代码示例、参考规范）
```

- `name` 字段是必填的，使用小写且用连字符连接，长度在 64 字符以内，且必须与所在文件夹名称保持一致。
- `description` 字段实际上也是必填的：缺失描述的技能会被系统过滤，绝不会呈现给大模型。描述应同时说明技能的**作用**以及**何时**使用它。使用第三人称编写（例如使用 “Use when...”，而不是使用 “I help with...”）。优先前置写入具体的触发关键字和文件名；如果该技能在邻近的主题上需要保持静默，请使用 “Use ONLY when...” 进行硬性限制。
- 可选字段：`license`、`compatibility`、`metadata`（键值均是字符串的对象）。

非默认路径下的技能可以通过 `skills.paths`（递归扫描该路径下的 `**/SKILL.md`）和 `skills.urls`（每个 URL 需返回技能列表）进行注册。

## 代理 (Agents)

定义 Agent 有以下两种方式。只要不是非常简单的 Agent，都请优先使用文件方式。

### 行内定义 (在 `opencode.json` 中)

```json
{
  "agent": {
    "my-reviewer": {
      "description": "Reviews PRs for style violations.",
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-4-6",
      "permission": { "edit": "deny", "bash": "ask" },
      "prompt": "You are a strict PR reviewer..."
    }
  }
}
```

### 文件定义

```
.opencode/agent/my-reviewer.md      或     .opencode/agents/my-reviewer.md
```

```markdown
---
description: Reviews PRs for style violations.
mode: subagent
model: anthropic/claude-sonnet-4-6
permission:
  edit: deny
  bash: ask
---

You are a strict PR reviewer. Focus on...
```

Markdown 文件的正文内容将直接作为 Agent 的系统提示词 `prompt`。请勿在前置元数据（frontmatter）中重复添加 `prompt:` 属性。

`mode` 可选的值为：`"primary"`、`"subagent"`、`"all"` 之一。

支持的前置元数据顶层字段包含：`name, model, variant, description, mode, hidden, color, steps, options, permission, disable, temperature, top_p`。任何未知的属性字段都将被自动路由归类到 `options` 属性中。

若要禁用内置的 Agent，可以设置：`agent: { build: { disable: true } }`，或者在对应的 Agent 文件中设置 `disable: true`。

`default_agent` 指向的 Agent 必须是未隐藏（non-hidden）且为 primary（主代理）模式的 Agent。

### 内置 Agent

opencode 内置集成了 `build`、`plan`、`general`、`explore`，以及可选的 `scout`（依赖于开启了 `OPENCODE_EXPERIMENTAL_SCOUT`）。隐藏的内部 Agent 包括：`compaction`、`title`、`summary`。如需重写内置 Agent 的字段，只需在 `opencode.json` 的 `agent: { <name>: { ... } }` 中重新声明同名键（key）即可。

## 插件 (Plugins)

`plugin` 配置项是一个数组。每个成员格式为以下之一：

```json
"plugin": [
  "opencode-gemini-auth",            // npm 包规范，加载最新版本
  "opencode-foo@1.2.3",              // npm 包规范，锁定具体版本
  "./local-plugin.ts",               // 文件路径，相对于当前声明的配置文件
  "file:///abs/path/plugin.js",      // 绝对路径文件 URL
  ["opencode-bar", { "key": "val" }] // 元组形式，附带插件选项
]
```

自动发现的插件（无需显式写入配置）：存放在 `.opencode/plugin/` 或 `.opencode/plugins/` 目录下的任何 `*.ts` 或 `*.js` 文件。

一个插件模块必须导出 `default` 导出（或任何具名导出），其类型定义满足：
`Plugin = (input: PluginInput, options?) => Promise<Hooks>`。该导出必须是一个函数，而不能是纯对象字面量，且该函数必须返回一个 Hooks 对象（如果没有需要注册的钩子，返回 `{}` 即可）。

```ts
import type { Plugin } from "@opencode-ai/plugin"

export default (async ({ client, project, directory, $ }) => {
  return {
    config: (cfg) => {
      // cfg 是系统实时合并后的配置对象；您可以在此直接修改各个配置字段。
    },
    "tool.execute.before": async (input, output) => {
      // 在工具运行前，直接修改传入的 output.args 参数
    },
  }
}) satisfies Plugin
```

可供拦截的 Hook 生命周期（直接在原处修改传入的 `output`；返回 `void`）：

- `event(input)`：捕获总线上的每一个事件
- `config(cfg)`：初始化时运行一次，传入合并后的完整配置对象
- `chat.message`、`chat.params`、`chat.headers`
- `tool.execute.before`、`tool.execute.after`
- `tool.definition`
- `command.execute.before`
- `shell.env`
- `permission.ask`
- `experimental.chat.messages.transform`、`experimental.chat.system.transform`、
  `experimental.session.compacting`、`experimental.compaction.autocontinue`、
  `experimental.text.complete`

非回调函数的特殊对象类 Hook（直接传入配置对象）：`tool: { my_tool: { ... } }`、`auth: { ... }`、`provider: { ... }`。

## MCP 服务 (MCP servers)

`mcp` 配置项是一个对象，其以服务名称作为键（key）。每个 MCP 服务必须由 `type` 字段进行类型区分：

```json
{
  "mcp": {
    "playwright": {
      "type": "local",
      "command": ["npx", "-y", "@playwright/mcp"],
      "enabled": true,
      "env": { "BROWSER": "chromium" }
    },
    "github": {
      "type": "remote",
      "url": "https://...",
      "enabled": true,
      "headers": { "Authorization": "Bearer ${GITHUB_TOKEN}" }
    },
    "old-server": { "enabled": false }
  }
}
```

`command` 属性必须是由字符串构成的**数组**。`type` 属性是必须填写的。若要禁用从父级配置继承下来的某个 MCP 服务，可以设置 `"enabled": false`。

## 权限管理 (Permissions)

```json
"permission": {
  "edit": "deny",
  "bash": { "git *": "allow", "rm *": "deny", "*": "ask" },
  "external_directory": { "~/secrets/**": "deny", "*": "allow" }
}
```

动作类型支持：`"allow"`（允许）、`"ask"`（询问用户）、`"deny"`（直接拒绝）。

具体工具的权限设置支持：简写的 `"allow"`（系统会自动解析为 `{"*": "allow"}`），或者是一个 `{ 规则匹配模式: 动作 }` 的键值对对象。在编写规则对象时，**声明的先后顺序至关重要**。opencode 会采用**最后一个成功匹配的规则**进行权限计算，因此请确保将宽泛的规则写在前面，将精确的限制规则写在最后。

顶层直接配置的字符串如 `permission: "allow"` 是“允许任何操作”的简写形式，这通常并不安全，也很少是用户真正期望的行为。

支持的权限控制键（Keys）包含：`read, edit, glob, grep, list, bash, task, external_directory, todowrite, question, webfetch, websearch, repo_clone, repo_overview, lsp, doom_loop, skill`。其中的一部分权限（如 `todowrite, question, webfetch, websearch, doom_loop`）仅支持配置为简写式的直接动作，而不能配置为带正则匹配的对象。

`external_directory`（外部可访问目录）匹配规则支持使用系统路径格式（如 `~/`、绝对路径，或者 `~/projects/**` 这类 glob 通配符）。

具体的 Agent 中的 `permission:` 配置在被调用时会直接覆盖顶层的全局 `permission:`。例如 Plan 规划模式实际上就是直接应用了内置 `plan` 代理中的权限校验规则（其将 edit 工具锁定为了全局 `edit: deny *`）。

## 紧急恢复/环境变量避难所 (Escape hatches)

当用户的本地配置因书写错误导致 opencode 报错无法启动时，可以通过设置以下环境变量进行修复和恢复：

- `OPENCODE_DISABLE_PROJECT_CONFIG=1`：直接跳过加载当前项目本地的 `opencode.json`，仅基于系统全局配置启动。用户可以在该目录下运行 opencode 启动后，利用运行中的会话重新编辑修复损坏的配置文件，然后重新正常启动即可。
- `OPENCODE_CONFIG=/path/to/file.json`：强制指定加载额外的其他配置文件。
- `OPENCODE_CONFIG_CONTENT='{"$schema":"https://opencode.ai/config.json"}'`：直接注入行内 JSON 字符串，作为最终本地作用域合并的参数。
- `OPENCODE_DISABLE_DEFAULT_PLUGINS=1`：禁用默认安装的内置插件。
- `OPENCODE_PURE=1`：完全跳过加载任何外部插件。
- `OPENCODE_DISABLE_EXTERNAL_SKILLS=1` 和 `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1`：禁用扫描位于 `~/.claude/` 和 `~/.agents/` 目录下的外部技能文件。

## 提议修改时的注意事项 (When proposing edits)

- 在编写修改前，请务必参照 Schema 进行严格验证。如果您对某些配置字段的确切结构拿不准，或者当前指南中没有描述该字段，请通过直接请求 `https://opencode.ai/config.json` 读取 Schema 的真实结构，不要盲目猜测。
- 保留 `opencode.json` 中的 `$schema` 头，以及任何用户没有要求去修改的已有其他字段。
- 对于复杂的 Agent、技能（Skill）以及插件（Plugin）定义，优先提议在相应的目录下创建独立的文件（如 `.opencode/skills/`），而不是将所有复杂的配置强行塞在单体 `opencode.json` 内部。
- 如果用户当前的配置文件已损坏导致进程拒绝启动，请通过向他们推荐上方的紧急恢复环境变量（Escape hatches），以确保他们能在 AI 的辅助下完成修复。
- 在保存完配置文件的修改后，请始终提醒用户退出并重新启动 opencode，以使配置最终生效。
