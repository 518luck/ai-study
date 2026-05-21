# 云端自动化Agent（Cursor Automations）

## 是什么

始终在线的云端Agent，按计划或事件触发，在独立沙盒VM中自主运行。

## 触发方式

| 触发类型 | 说明 |
|---------|------|
| 定时（cron） | 如每天早上9点、每2小时 |
| GitHub事件 | PR创建、推送、合并、打标签 |
| GitLab事件 | 同上 |
| Slack消息 | 新消息出现在频道 |
| Webhook | 任何HTTP POST请求 |
| Linear | Issue创建、状态变更、周期结束 |
| Sentry | 新bug创建、更新 |
| PagerDuty | 事故触发、确认、解决 |

## 可执行的操作

| 工具 | 说明 |
|------|------|
| Open PR | 写代码、创建分支、开PR |
| Comment on PR | 审查评论、内联代码评论、approve |
| Request reviewers | 根据git/memory识别领域专家 |
| Send to Slack | 发消息到指定或动态频道 |
| Read Slack channels | 只读访问公开频道消息 |
| MCP server | 连接任何外部工具/数据源 |
| Memories | 跨次运行的持久化笔记（存储为MEMORIES.md） |

## Cursor内部实际使用的自动化Agent

### 1. 安全审查Agent

```
触发：每次push到main
行为：
  1. 审查diff中的安全漏洞
  2. 跳过PR讨论中已涉及的issue
  3. 发Slack通知
效果：已捕获真实安全漏洞
```

### 2. 智能Codeowner Agent

```
触发：PR创建/推送
行为：
  1. 分类风险（爆炸半径、复杂度、基础设施影响）
  2. 低风险 → 自动approve
  3. 高风险 → 根据贡献历史分配审查人
  4. 通过MCP记录到Notion
```

### 3. 事故响应Agent

```
触发：PagerDuty告警
行为：
  1. 通过Datadog MCP调查日志
  2. 搜索代码库最近变更
  3. 发Slack消息附带监控信息
  4. 开PR提出修复方案
```

### 4. 周报Agent

```
触发：每周cron
行为：
  1. 汇合并并的PR
  2. 统计bug修复、技术债、安全更新
  3. 发Slack摘要
```

### 5. 测试补充Agent

```
触发：每天早上
行为：
  1. 审查昨天合并的代码
  2. 按项目规范补充测试
  3. 运行测试验证
  4. 开PR
```

### 6. Bug分类Agent

```
触发：Slack消息
行为：
  1. 检查是否重复
  2. 创建Linear工单
  3. 调查根因
  4. 尝试修复
  5. 在Slack线程中回复
```

## 权限范围

| 范围 | 说明 |
|------|------|
| Private | 仅创建者管理，费用计入创建者 |
| Team Visible | 团队可见，创建者管理 |
| Team Owned | 共享团队服务账号运行，团队管理员管理 |

## 多仓库支持

- 单仓库环境
- 多仓库环境（multi-repo）
- 无仓库（纯Slack/MCP工作流）
