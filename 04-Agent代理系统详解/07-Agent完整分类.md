# Agent完整分类总览

## 按执行方式分

| 类型 | 说明 | 代表 |
|------|------|------|
| 交互式Agent | 人在loop中，一问一答 | Claude Code、Codex CLI |
| 自主Agent | 后台运行，完成后通知人 | Cursor Automations |
| 可编程Agent | 你写代码定义它的行为 | Claude Agent SDK、Cursor SDK |

## 按部署位置分

| 类型 | 说明 | 特点 |
|------|------|------|
| 本地Agent | 在你的机器上跑 | 延迟低，直接访问本地文件 |
| 云端Agent | 在独立沙盒VM里跑 | 不受本地网络/断电影响，可并行 |
| 平台Agent | GitHub Copilot、Codex | 集成平台工作流 |

## 按协作方式分

| 类型 | 说明 |
|------|------|
| 单Agent | 自己干所有事 |
| 主Agent + 子Agent | 主Agent分配任务，子Agent独立完成后汇报 |
| 多Agent并行 | 各自独立工作，互不干扰，由协调者分配 |
| 自进化Agent | 旧Agent训练新Agent，逐代提升 |

## 按触发方式分

| 类型 | 说明 | 示例 |
|------|------|------|
| 手动触发 | 人在IDE里问 | "帮我重构这个函数" |
| 事件触发 | 代码/沟通事件驱动 | PR创建、Slack消息 |
| 定时触发 | cron表达式 | 每天早上补测试 |
| API调用 | 程序化触发 | CI/CD流水线中调用 |

## 完整分类矩阵

```
Agent类型
│
├── 云端自动化Agent（Cursor Automations）
│   ├── 安全审查Agent
│   ├── 智能Codeowner Agent
│   ├── 事故响应Agent
│   ├── 周报Agent
│   ├── 测试补充Agent
│   └── Bug分类Agent
│
├── 可编程Agent（SDK）
│   ├── Claude Agent SDK（Python/TypeScript）
│   └── Cursor SDK（TypeScript）
│
├── 子Agent系统（Subagents）
│   ├── code-reviewer（只读）
│   ├── security-scanner（只读）
│   ├── test-writer（读写）
│   └── docs-updater（读写）
│
├── 多Agent协作（前沿研究）
│   ├── Planner Agent（规划者）
│   └── Worker Agents（工作者）
│
└── 自进化Agent（Bootstrapping）
    ├── 目标设定Agent（阶段1）
    └── 执行Agent（阶段2）
```

## 配套基础设施

Agent不是孤立运行的，需要配套系统：

```
规则文件（AGENTS.md）    → 告诉Agent项目规范
Skill系统               → 预定义工作流
MCP服务器               → 连接外部工具和数据
Hook系统                → 生命周期钩子、拦截、审计
权限控制                → 限制Agent的能力范围
CI门禁                  → 提交前自动检查
```
