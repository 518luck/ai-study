# Skills 设计模式

> 基于 Sentry（19 个 Skills）、Kibana（26 个 Skills）、opencode（4 个 Skills）、wp-calypso（6 个 Skills）的分析提炼。

## 1. Skill 的核心结构

一个标准 Skill 目录包含：

```
skill-name/
├── SKILL.md              # 主入口（必须）
├── references/           # 详细参考文档（可选）
│   ├── topic-a.md
│   └── topic-b.md
├── scripts/              # 辅助脚本（可选）
└── README.md             # 概览信息（少数 Skill 有）
```

### SKILL.md 内部结构

```markdown
---
name: skill-name
description: 用一句话概括此技能的作用以及何时触发它。
---

# Skill Name

## 触发条件
什么时候应该使用这个 skill

## 工作流
分步骤的操作流程

## 代码模板
可直接复制的代码

## 约束条件
硬性规则和禁止事项

## 参考文档
→ references/ 下的详细指南
```

## 2. Skill 分类模式（跨项目通用）

| 类别 | 说明 | 典型 Skill |
|------|------|-----------|
| **测试框架** | 测试编写/迁移指南 | scout-ui-testing, enzyme-to-rtl, ftr-testing |
| **代码质量** | Lint/格式/审查 | lint-fix, lint-new, sentry-backend-bugs |
| **安全审查** | 安全模式检查 | sentry-security, codeql |
| **迁移指南** | 旧→新迁移工作流 | cypress-to-scout, migrate-frontend-forms |
| **架构专项** | 特定架构的完整指南 | hybrid-cloud-rpc, cell-architecture |
| **开发工具** | 构建/部署/调试辅助 | setup-dev, branch-readiness-checks |
| **文档生成** | API文档/组件文档 | fix-package-docs, react-component-documentation |

## 3. Skill 间依赖关系模式

```
基础 Skill ← 消费者 Skill ← 审查 Skill

示例 (Kibana):
scout-create-scaffold ← scout-migrate-from-ftr ← scout-best-practices-reviewer
validate-oas ─(失败)→ debug-oas ─(修复)→ improve-oas

示例 (Sentry):
django-models → generate-migration → hybrid-cloud-outboxes
hybrid-cloud-rpc → hybrid-cloud-test-gen
lint-new → lint-fix
```

**设计原则**：
- 基础 Skill 提供工具/脚手架，不包含业务判断
- 消费者 Skill 编排工作流，引用基础 Skill
- 审查 Skill 做质量检查，引用消费者 Skill 的输出

## 4. References 文件设计

参考文档用于存放不适合放在 SKILL.md 主文件中的详细内容：

| 模式 | 说明 | 示例 |
|------|------|------|
| **按错误类型拆分** | 每种 bug 类型一个文件 | sentry-backend-bugs: database-integrity, concurrency-bugs, null-and-type-errors |
| **按流程步骤拆分** | 工作流的每个阶段一个文件 | scout-migrate-from-ftr: generate-plan, execute-plan, pick-correct-test-type |
| **按概念拆分** | 每个核心概念一个文件 | hybrid-cloud-rpc: resolvers, rpc-models, service-template, deprecation |
| **按组件拆分** | 每个UI组件一个文件 | accessibility: callouts, data_tables, focus_and_keyboard, overlays |

## 5. description 编写技巧

好的 description 决定了 Skill 何时被触发：

```
好的写法：
"Fix ESLint rule violations from eslintPluginScraps. Use when fixing lint errors related to
no-core-import, no-token-import, use-semantic-token, or restrict-jsx-slot-children."

差的写法：
"Helps with linting."
```

关键要素：
1. **动作动词开头**（Fix/Create/Migrate/Debug/Review）
2. **包含触发关键字**（具体的规则名、工具名、文件模式）
3. **说明使用场景**（"Use when..." / "Use ONLY when..."）
4. **限制范围**（避免在不相关时被误触发）

## 6. 与 AGENTS.md 的分工

| 维度 | AGENTS.md | Skill |
|------|-----------|-------|
| 加载时机 | 始终加载 | 按需加载 |
| 内容定位 | 通用规范和命令 | 专项任务工作流 |
| 体积 | 尽量精简 | 可以详细（含参考文档） |
| 更新频率 | 随项目架构变化 | 随特定任务流程变化 |
| 适用范围 | 该目录下所有工作 | 特定类型的工作 |
