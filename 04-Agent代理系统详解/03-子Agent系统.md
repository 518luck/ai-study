# 子Agent系统（Subagents）

## 是什么

主Agent将任务分配给专门的子Agent执行，子Agent独立完成后只返回最终结果。

## 架构

```
主Agent
  ├── code-reviewer Agent（只读，审查代码质量）
  ├── security-scanner Agent（只读，扫描安全漏洞）
  ├── test-writer Agent（读写，生成测试）
  └── docs-updater Agent（读写，更新文档）
```

## 定义方式（Claude Agent SDK）

```python
agents = {
    "code-reviewer": AgentDefinition(
        description="专家级代码审查",
        prompt="你是一个代码审查专家...",
        tools=["Read", "Grep", "Glob"],      # 只读
        disallowedTools=["Edit", "Write"],    # 不能改文件
        model="sonnet",
    ),
    "test-runner": AgentDefinition(
        description="运行和分析测试套件",
        prompt="...",
        tools=["Bash", "Read", "Grep"],
        model="sonnet",
    ),
    "security-scanner": AgentDefinition(
        description="安全漏洞扫描",
        prompt="...",
        tools=["Read", "Grep", "Glob"],
        model="sonnet",
    ),
}
```

## AgentDefinition字段

| 字段 | 说明 |
|------|------|
| description | 子Agent的能力描述（主Agent据此决定是否调用） |
| prompt | 子Agent的系统提示词 |
| tools | 允许使用的工具列表 |
| disallowedTools | 明确禁止的工具 |
| model | 使用的模型 |
| skills | 预加载的技能 |
| memory | 是否启用记忆 |
| mcpServers | 可连接的MCP服务器 |
| maxTurns | 最大执行轮次 |
| background | 是否后台运行 |
| effort | 投入的推理努力程度 |
| permissionMode | 权限模式 |

## 关键特性

- **上下文隔离**：每个子Agent有独立的新会话，不会互相干扰
- **并行执行**：多个子Agent可以同时运行
- **最多一层**：子Agent不能再派生子Agent
- **结果回传**：子Agent只返回最终消息给主Agent

## 子Agent继承什么

| 继承 | 不继承 |
|------|--------|
| 自己的系统提示词 | 父Agent的对话历史 |
| Agent工具提示词 | 父Agent的工具结果 |
| 项目的CLAUDE.md | 父Agent的系统提示词 |
| 工具定义 | 预加载的Skills（除非显式列出） |

## 调用方式

- **自动**：Claude根据description自行判断是否调用
- **显式**：在prompt中指名（"使用code-reviewer agent来..."）
- **动态**：运行时根据条件创建定义

## 恢复子Agent

捕获session_id和agentId，后续可用 `resume: sessionId` 从中断处继续。
