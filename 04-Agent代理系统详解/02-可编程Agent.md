# 可编程Agent（Claude Agent SDK / Cursor SDK）

## Claude Agent SDK

用Python或TypeScript写代码定义Agent行为。核心原语是 `query()`，启动一个Agent循环。

### 基本架构

```python
from claude_code_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="审查这个PR的代码质量",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Grep", "Glob"],
        permission_mode="dontAsk",
        system_prompt="你是一个代码审查专家...",
        mcp_servers={...}
    ),
):
    print(message)
```

### 权限模式

| 模式 | 行为 | 适用场景 |
|------|------|---------|
| `acceptEdits` | 自动批准文件编辑，其他操作询问 | 可信开发环境 |
| `dontAsk` | 拒绝不在allowedTools中的所有操作 | 锁定的无头Agent |
| `auto` | 模型分类器自动批准/拒绝每个调用 | 自主运行+安全 |
| `bypassPermissions` | 运行所有工具不提示 | 沙盒CI环境 |
| `default` | 需要canUseTool回调 | 自定义审批流程 |

### 认证方式

- Anthropic API密钥（直接）
- Amazon Bedrock（`CLAUDE_CODE_USE_BEDROCK=1`）
- Google Vertex AI（`CLAUDE_CODE_USE_VERTEX=1`）
- Microsoft Azure（`CLAUDE_CODE_USE_FOUNDRY=1`）

---

## Cursor SDK（TypeScript）

```typescript
import { Agent } from "@cursor/sdk";

const agent = await Agent.create({
  apiKey: process.env.CURSOR_API_KEY!,
  model: { id: "composer-2" },
  local: { cwd: process.cwd() },  // 本地运行
  // 或 cloud: { repos: [...], autoCreatePR: true }  // 云端运行
});

const run = await agent.send("重构auth模块，提取公共逻辑");
for await (const event of run.stream()) {
  console.log(event);
}
```

### 运行时选项

| 模式 | 说明 |
|------|------|
| Local | 在你的机器上运行 |
| Cloud | 独立VM沙盒，支持断点续跑，可开PR |
| Self-hosted | 在你自己的网络内运行 |

### Harness功能

- 智能上下文管理（索引、语义搜索、grep）
- MCP服务器（stdio或HTTP）
- Skills（从.cursor/skills/加载）
- Hooks（从.cursor/hooks.json加载）
- 子Agent（通过Agent工具调用）
- 支持Cursor所有模型包括Composer 2
