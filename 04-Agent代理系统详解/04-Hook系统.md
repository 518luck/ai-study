# Hook系统（Agent生命周期钩子）

## 是什么

在Agent执行的关键节点插入自定义逻辑，实现拦截、审计、修改行为。

## 可用的Hook事件

| 事件 | 触发时机 | 典型用途 |
|------|---------|---------|
| `PreToolUse` | Agent即将执行工具调用 | 拦截危险命令、修改参数 |
| `PostToolUse` | 工具执行完毕返回结果 | 记录审计日志 |
| `PostToolUseFailure` | 工具执行失败 | 错误处理 |
| `PostToolBatch` | 一批工具调用全部完成 | 注入规范提醒 |
| `UserPromptSubmit` | 用户提交prompt | 注入上下文 |
| `Stop` | Agent执行结束 | 保存会话状态 |
| `SubagentStart` | 子Agent初始化 | 追踪并行任务 |
| `SubagentStop` | 子Agent完成 | 聚合结果 |
| `PreCompact` | 对话压缩前 | 归档记录 |
| `PermissionRequest` | 权限对话框出现 | 自定义处理 |
| `SessionStart` | 会话开始 | 初始化 |
| `SessionEnd` | 会话结束 | 清理 |
| `Notification` | Agent状态消息 | 转发到Slack/PagerDuty |

## Hook回调结构

```typescript
const hook: HookCallback = async (input, toolUseID, { signal }) => {
  return {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",      // deny | allow | ask | defer
      permissionDecisionReason: "不能修改.env文件",
      updatedInput: { ... }            // 可以修改工具输入参数
    },
    systemMessage: "已拦截：安全原因",
    continue: true                      // 是否继续Agent循环
  };
};
```

## 权限决策优先级

```
deny > defer > ask > allow
```

任何一个Hook返回deny，操作即被阻止。

## 实际用例

### 1. 审计日志（所有文件修改记录）

```typescript
const logFileChange: HookCallback = async (input) => {
  const filePath = input.tool_input?.file_path;
  await appendFile(
    "./audit.log",
    `${new Date().toISOString()}: modified ${filePath}\n`
  );
  return {};
};
```

### 2. 安全红线（禁止修改敏感文件）

```typescript
const blockEnv: HookCallback = async (input) => {
  return {
    hookSpecificOutput: {
      permissionDecision: "deny",
      permissionDecisionReason: "不能修改环境变量文件",
    },
  };
};
```

### 3. 异步通知（不阻塞Agent执行）

```typescript
const notifySlack: HookCallback = async (input) => {
  await fetch("https://hooks.slack.com/...", {
    method: "POST",
    body: JSON.stringify({ text: "Agent修改了文件" }),
  });
  return { async: true };  // Agent继续执行，不等通知完成
};
```

## 匹配器（Matchers）

用正则表达式过滤Hook触发的范围：

- 工具Hook：匹配工具名
- MCP工具：使用模式 `mcp__<server>__<action>`

## 异步Hook

返回 `{ async: true }` 让Agent继续执行而不等待Hook完成，适用于日志、通知等副作用场景。
