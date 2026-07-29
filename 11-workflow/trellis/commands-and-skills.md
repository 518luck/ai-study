# Trellis 命令与技能详解

## 命令详解

### `/trellis:start` — 开启会话

**用途**：手动加载 Trellis 上下文

**何时使用**：

- 平台没有自动注入 hook
- 怀疑自动注入没跑
- 想重新加载上下文

**执行步骤**：

1. 读 `.trellis/workflow.md`
2. 跑 `get_context.py` 获取开发者身份、git 状态、活跃任务
3. 读 spec 索引
4. 汇报上下文并询问你想做什么

**AI 任务分类**：

| 类型          | 判断依据                   | 流程                      |
| ------------- | -------------------------- | ------------------------- |
| 简单对话      | 问答、解释、查询           | 默认不建任务              |
| Inline 小任务 | 当前 turn 可完成的局部改动 | 询问是否创建任务          |
| 完整任务      | 多文件改动或需要持久规划   | 询问是否创建 Trellis task |

---

### `/trellis:continue` — 推进下一步

**用途**：在当前任务内推进工作流

**典型场景**：

1. 描述需求 → AI 创建 task 并起草 `prd.md`
2. 输入 `continue` → 判断是否需要 `design.md` 和 `implement.md`
3. 输入 `continue` → start task 并进入 implement/check
4. 输入 `continue` → 走 `trellis-update-spec`，最后 `finish-work`

**优势**：不用记 workflow，一路 `continue` 就能跑完整个流程

---

### `/trellis:finish-work` — 结束会话

**用途**：归档任务 + 记录会话日志

**前提**：代码已经 commit

**执行步骤**：

1. 跑 `get_context.py --mode record`，列出 active tasks、git status、recent commits
2. 跑 `git status --porcelain`，检查是否有未提交的代码
3. 用 `task.py archive <name>` 归档当前 active task
4. 用 `add_session.py --title … --commit …` 追加 journal

**最终 git log 顺序**：

```
<work commits> → chore(task): archive ... → chore: record journal
```

**拒绝执行的情况**：

- 工作区有未提交的代码改动
- 引导用户回到 Phase 3.4 先提交

---

## 技能详解

### `trellis-brainstorm` — 需求澄清

**触发时机**：同意创建任务并进入 planning 后

**功能**：

- 先检查代码、测试、配置、文档、现有 spec 和任务历史
- 一次只问一个问题，并给出推荐答案
- 起草并迭代 `prd.md`，记录需求和验收标准
- 复杂任务在实现前补齐 `design.md` 和 `implement.md`

**产出**：

- 任务名和 slug
- `prd.md`（需求文档）
- `design.md`（技术设计，复杂任务）
- `implement.md`（实施计划，复杂任务）

---

### `trellis-before-dev` — 编码前加载规范

**触发时机**：task 中动手改代码前

**功能**：

- 读受影响 package 的 spec 索引
- 读 Pre-Development Checklist 里引用的具体 guideline 文件
- 确保 AI 在**动手前**就知道约定

**使用场景**：

- 开始新功能开发
- 切换到不同的 package
- 需要刷新项目规范

---

### `trellis-check` — 代码验证

**触发时机**：实现完成后自动触发

**功能**：

1. `git diff --name-only HEAD` 找变更
2. 确认哪些 spec 层适用
3. 对照每层 index 的 quality checklist 比对代码
4. 跑 `pnpm lint` / `pnpm typecheck` / `pnpm test`
5. 在有限循环内自修复违规

**Sub-agent 模式**：

- `trellis-check` sub-agent 把这个 skill 包了一层
- 主会话把验证丢给它就行
- sub-agent 自己有重试循环

---

### `trellis-update-spec` — 经验沉淀

**触发时机**：有值得沉淀的知识时

**功能**：

- 调试完、踩坑后、做了非显而易见的设计决策时
- 挑对应的 spec 文件
- 做一次聚焦更新（decision / convention / pattern / anti-pattern / gotcha）
- 必要时更新索引

**使用场景**：

- 修复 bug 后沉淀经验
- 做了重要的设计决策
- 发现了新的最佳实践

---

### `trellis-break-loop` — Bug 复盘

**触发时机**：修完棘手 bug 后

**功能**：产出 5 维分析

1. **根因分类**
   - 缺 spec
   - 契约违反
   - 变更传播失败
   - 测试缺口
   - 隐式假设

2. **之前修复尝试失败的原因**

3. **预防机制**
   - 更新 spec
   - 类型约束
   - lint 规则
   - 测试
   - CR 清单
   - 文档

4. **系统化扩散**：其他具备同样模式的地方

5. **知识固化**：结果走 `trellis-update-spec`

**核心理念**：

> 调试的价值不是修掉 **这个** bug，而是确保**这一类** bug 不再发生。

---

### `trellis-channel` — 多 Agent 协作

**用途**：

- 实时多 agent 协作
- 跨 agent review
- 进度检查
- 论坛频道
- 频道日志调试

---

### `trellis-meta` — 自定义 Trellis

**用途**：

- 理解本地 Trellis 架构
- 修改 `.trellis` 和平台 hooks
- 自定义 settings、agents、skills、commands
- 管理 workflow 模板
- 处理 registry-backed spec refresh

---

### `trellis-session-insight` — 历史查询

**用途**：

- 查询历史 AI 对话记录
- 回答"上次怎么解的"、"之前讨论过吗"
- 跨会话继续任务
- 做 finish-work review

**返回**：原始历史对话，由你决定是否更新 spec、追加任务笔记、内联引用

---

### `trellis-spec-bootstrap` — Spec 生成

**用途**：

- 从真实代码生成第一版 specs
- 创建或刷新 `.trellis/spec` 指南
- 分析代码库
- 分解 package/layer spec 工作

**特点**：

- 平台中立的单 agent 工作流
- 不用 placeholder text
- 基于真实代码库

---

## 子代理详解

### `trellis-research` — 调研代理

**约束**：只读

**用途**：

- 代码搜索
- 模式发现
- 文档查阅

**产出**：写入任务的 `research/` 目录

---

### `trellis-implement` — 实现代理

**约束**：写代码，不 commit

**用途**：

- 需求 + 计划就绪后的编码阶段
- 通过 `implement.jsonl` 获取 spec/research 上下文

**启动前**：自动拿到 `implement.jsonl`

---

### `trellis-check` — 验证代理

**约束**：可写（修复）

**用途**：

- 验证阶段
- 内部自带自修复循环
- 通过 `check.jsonl` 获取 spec/research 上下文

**启动前**：自动拿到 `check.jsonl`
