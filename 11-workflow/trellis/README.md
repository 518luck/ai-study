# Trellis 指令手册

> AI 编码助手的"辅助轮"——通过自动化机制注入项目规范，让 AI 每次都按你的标准写代码

## 📚 目录

- [核心概念](#核心概念)
- [命令参考](#命令参考)
- [技能（Skills）参考](#技能skills参考)
- [子代理（Sub-agents）参考](#子代理sub-agents参考)
- [日常工作流](#日常工作流)
- [初始化流程](#初始化流程)
- [任务管理](#任务管理)
- [常见问题](#常见问题)

---

## 核心概念

| 概念 | 说明 | 存放位置 |
|------|------|----------|
| **Spec（规范）** | 你的编码标准，用 Markdown 写成 | `.trellis/spec/` |
| **Task（任务）** | 带上下文的工作单元 | `.trellis/tasks/` |
| **Workspace（工作区）** | 会话日志，让 AI 记住上次做了什么 | `.trellis/workspace/` |
| **Skill（技能）** | Auto-trigger 工作流模块 | 各平台的 skills 目录 |
| **Sub-agent（子代理）** | 专门角色的 AI 子进程 | 各平台的 agents 目录 |

---

## 命令参考

### 会话边界命令（3 个）

| 命令 | 用途 | 触发方式 |
|------|------|----------|
| `/trellis:start` | 开启会话、加载上下文、任务分类 | 手动（有 hook 的平台会自动注入） |
| `/trellis:continue` | 当前任务内推进下一步工作流 | 手动 |
| `/trellis:finish-work` | 结束会话、归档任务、记录日志 | 手动（Phase 3.4 commit 之后） |

### CLI 命令

| 命令 | 用途 |
|------|------|
| `trellis init -u <name> --zcode` | 初始化项目 |
| `trellis upgrade` | 升级全局 CLI package |
| `trellis update` | 把项目同步到 CLI 版本 |
| `trellis update --migrate` | 执行文件迁移（breaking 变更时） |

### 任务管理命令

| 命令 | 用途 |
|------|------|
| `python3 ./.trellis/scripts/task.py create "<title>"` | 创建任务 |
| `python3 ./.trellis/scripts/task.py start <dir>` | 设置活跃任务 |
| `python3 ./.trellis/scripts/task.py finish` | 清除活跃任务 |
| `python3 ./.trellis/scripts/task.py archive <dir>` | 归档任务 |
| `python3 ./.trellis/scripts/task.py list` | 列出活跃任务 |
| `python3 ./.trellis/scripts/task.py list-archive` | 列出归档任务 |

---

## 技能（Skills）参考

### 开发流程技能

| 技能 | 触发时机 | 用途 |
|------|----------|------|
| `trellis-brainstorm` | 同意创建任务并进入 planning 后 | 澄清需求、查证据、起草 planning artifacts |
| `trellis-before-dev` | task 中动手改代码前 | 先读相关 spec 再写代码 |
| `trellis-check` | 实现完成后自动触发 | 验证 + 自修复循环 |
| `trellis-update-spec` | 有值得沉淀的知识时 | 把经验固化进 `.trellis/spec/` |
| `trellis-break-loop` | 修完棘手 bug 后 | 根因分析 + 预防机制 |

### 辅助技能

| 技能 | 用途 |
|------|------|
| `trellis-channel` | 多 agent 协作、跨 agent review |
| `trellis-meta` | 理解和自定义本地 Trellis 架构 |
| `trellis-session-insight` | 查询历史 AI 对话记录 |
| `trellis-spec-bootstrap` | 从真实代码生成第一版 specs |

---

## 子代理（Sub-agents）参考

| 子代理 | 约束 | 主会话何时 spawn |
|--------|------|------------------|
| `trellis-research` | 只读 | 代码搜索 / 模式发现 / 文档查阅 |
| `trellis-implement` | 写代码，不 commit | 需求 + 计划就绪后的编码阶段 |
| `trellis-check` | 可写（修复） | 验证阶段；内部自带自修复循环 |

---

## 日常工作流

### 完整流程图

```
新开会话 ──→ 描述任务 ──→ AI 自动处理 ──→ /trellis:finish-work
    │            │              │                │
    ▼            ▼              ▼                ▼
加载上下文    创建任务      Plan→Execute    归档+记录日志
```

### 三阶段详解

```
Phase 1 — Plan（和你互动）
 1.0 task.py create 创建任务目录和默认 prd.md
 1.1 激活 trellis-brainstorm skill，和你一问一答澄清需求，迭代 prd.md
 1.2 复杂任务在实现前写 design.md 和 implement.md
 1.3 需要调研时，结论写到 research/
 1.4 Sub-agent mode curate implement.jsonl / check.jsonl
 1.5 Review 后 task.py start 把 status 改成 in_progress

Phase 2 — Execute
 2.1 按 prd.md、design.md、implement.md 和相关 spec 实现
 2.2 运行 trellis-check → 对照 artifacts + spec 审 diff，跑 lint / typecheck / test

Phase 3 — Finish
 3.1 激活 trellis-check skill，做最终验证
 3.2（按需）激活 trellis-break-loop skill 做 debug 复盘
 3.3 激活 trellis-update-spec skill，把新知识写回 .trellis/spec/
 3.4 提出工作 commit 计划，提交确认的批次
 3.5 运行 /trellis:finish-work 做 archive 和 journal 记账
```

---

## 初始化流程

### 步骤 1：安装 CLI 工具

```bash
pnpm add -g @mindfoldhq/trellis@latest
```

### 步骤 2：初始化项目

```bash
trellis init -u <你的名字> --zcode
```

> ⚠️ `<你的名字>` 是**开发者名字**（不是项目名），用于区分团队成员的工作区日志

### 步骤 3：启动 Bootstrap 任务

1. **新开一个 ZCode 会话**（hooks 只在启动时加载）
2. 告诉 AI：`启动 bootstrap 任务，帮我填充项目规范。项目有现成的 AGENTS.md，可以从那里提取规范。`

### 步骤 4：提交规范文件

```bash
git add .trellis/spec/
git commit -m "docs(spec): 按真实技术栈重塑 .trellis/spec 规范"
```

### 步骤 5：归档 Bootstrap 任务

```
/trellis:finish-work
```

---

## 任务管理

### 任务生命周期

```
create → plan artifacts → start → implement/check → finish → archive
```

### 任务状态

| 状态 | 说明 |
|------|------|
| `planning` | 任务创建后，正在规划中 |
| `in_progress` | 任务已开始，正在执行 |
| `completed` | 任务已完成 |
| `archived` | 任务已归档 |

### 任务目录结构

```
.trellis/tasks/{MM-DD-task-name}/
├── task.json              # 任务元信息
├── prd.md                 # 需求文档
├── design.md              # 技术设计（复杂任务）
├── implement.md           # 实施计划（复杂任务）
├── implement.jsonl        # implement agent 上下文
├── check.jsonl            # check agent 上下文
└── research/              # 调研记录
```

---

## 常见问题

### Q: `/trellis:finish-work` 报错"有未提交的代码"

**A**: 这是正常的！finish-work 不负责提交代码。你需要：

1. 先提交代码：`git add . && git commit -m "..."`
2. 再执行：`/trellis:finish-work`

### Q: 如何查看当前活跃任务？

**A**: 执行：
```bash
python3 ./.trellis/scripts/task.py current
```

### Q: 如何手动归档任务？

**A**: 执行：
```bash
python3 ./.trellis/scripts/task.py finish
python3 ./.trellis/scripts/task.py archive <task-name>
```

### Q: Trellis 升级是两步？

**A**: 是的：
1. `trellis upgrade` — 升级全局 CLI
2. `trellis update` — 把项目同步到 CLI 版本

### Q: 如何查看历史会话记录？

**A**: 使用 `trellis-session-insight` 技能，或查看：
```
.trellis/workspace/<developer>/journal-N.md
```

---

## 更多资源

- [官方文档](https://github.com/mindfold-ai/Trellis)
- [知识库](../../docs/trellis-知识库/)
- [项目规范](../../.trellis/spec/)
