## 工作流/流程类：

Andrej Karpathy's Guidelines — 144K stars，四条行为准则（先想再写、简洁优先、精准修改、目标驱动），最火爆的行为规范 skill
Caveman — 68.1K stars，砍掉 65% 输出 token，只保留技术事实
Plannotator — 可视化计划审查，类似 Google Antigravity 的方案审批流
Shipyard — Superpowers 的企业版扩展，加了 IaC 验证和安全审计

## 能力增强类：

Firecrawl — 给 agent 可靠的网页抓取能力
Handoff — 也是 Matt Pocock 的，跨 session 传递上下文
Context Mode — 长 session 不丢上下文，16.3K stars
Claude-Mem — 跨 session 长期记忆

## 代码质量类：

Local-Review — 5 个 agent 并行做 code review
Agent-Peer-Review — 让 Claude 和 Codex 互相审查
Trail of Bits Security — 专业级安全审计

## 收集工具

| 工具        | 做什么                                             | 类比             |
| ----------- | -------------------------------------------------- | ---------------- |
| grill-me    | 需求阶段：通过追问把模糊需求变成清晰方案           | 产品经理面试你   |
| Trellis     | 执行阶段：读上下文、加载 spec、跑测试、做 review   | 项目经理跟进执行 |
| Superpowers | 交付阶段：完整流程（头脑风暴→计划→执行→测试→审查） | 整个研发团队协作 |

# 知识点整理

### oh-my-openagent

OmO 是一个多模型 AI Agent 编排框架
Agent 编排系统，把多个 Agent 组成团队
