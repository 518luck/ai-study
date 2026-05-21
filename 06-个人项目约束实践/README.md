# 06 - 个人项目约束实践

## 背景

基于对14个大型开源项目AI约束规则的研究，总结出个人/小团队项目搭建AI约束基础设施的方法。

## 约束的6层体系

```
第1层：规则文件（AGENTS.md / CLAUDE.md）
  → 定义编码规范、项目结构、命令清单

第2层：Skill系统（.claude/skills/ / .cursor/skills/）
  → 预定义的工作流，Agent按步骤执行

第3层：自定义脚本（scripts/）
  → 验证、构建、测试的自动化

第4层：MCP服务器（Model Context Protocol）
  → 连接外部工具和数据源

第5层：权限控制（settings.json）
  → 限制Agent能做什么

第6层：CI门禁（GitHub Actions / pre-commit）
  → 提交前自动检查
```

## 第1层：规则文件模板

### AGENTS.md / CLAUDE.md 的最小必要内容

```markdown
# 项目名 Development Guide

## 代码库结构

描述目录结构和关键入口点。

## 构建命令

| 操作 | 命令 |
|------|------|
| 安装依赖 | npm install |
| 开发模式 | npm run dev |
| 构建 | npm run build |
| 测试 | npm run test |
| Lint | npm run lint |
| 类型检查 | npm run typecheck |

## 编码规范

- 命名约定
- 文件组织规则
- 依赖管理规则

## 架构约束

- 公共函数放 utils/
- 状态放 page/model/
- 多层调用用观察者模式
- 不要在组件中直接调用API

## 禁止事项

- 不要修改 xxx 文件
- 不要使用 xxx 模式
- 不要引入 xxx 依赖

## 测试要求

- 测试文件放在 __tests__/ 或 *.test.ts
- 每个公共函数必须有测试
- 测试命令：npm run test
```

### 大型项目的共同做法

1. **先读README**：在编辑任何子目录的文件前，先读该路径上所有README.md
2. **明确构建命令**：列出所有可用的构建、测试、lint命令
3. **定义测试策略**：哪些测试必须通过、覆盖率要求
4. **列出禁止事项**：明确说"不要做什么"比"要做什么"更重要

## 第2层：Skill工作流

Skill是预定义的步骤序列，Agent按步骤执行复杂任务：

```markdown
# .claude/skills/deploy/SKILL.md

## 部署工作流

1. 运行所有测试：npm run test
2. 检查测试覆盖率：npm run coverage
3. 构建项目：npm run build
4. 检查构建产物大小
5. 部署到staging：npm run deploy:staging
6. 运行冒烟测试：npm run smoke-test
7. 确认无误后部署到生产：npm run deploy:prod

## 验证
- 所有测试必须通过
- 覆盖率不低于80%
- 构建产物大小不超过阈值
```

## 第3层：验证脚本

```bash
#!/bin/bash
# scripts/validate.sh
set -e

echo "Running lint..."
npm run lint

echo "Running typecheck..."
npm run typecheck

echo "Running tests..."
npm run test

echo "Checking file structure..."
# 验证公共函数在utils/中
# 验证状态管理在page/model/中
# 验证没有直接API调用

echo "All checks passed!"
```

## 第4层：MCP服务器（按需）

对于需要连接外部系统的项目：
- 数据库：MCP连接数据库，Agent可以直接查询
- API文档：MCP加载OpenAPI spec，Agent知道接口定义
- 监控：MCP连接Datadog/Sentry，Agent可以查日志

## 第5层：权限控制

```json
{
  "permissions": {
    "allow": ["Read", "Glob", "Grep", "Bash", "Edit"],
    "deny": [],
    "sensitivePatterns": [
      ".env",
      "*.key",
      "*.pem",
      "secrets/"
    ]
  }
}
```

## 第6层：CI门禁

```yaml
# .github/workflows/ai-gate.yml
name: AI Code Gate
on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test -- --coverage
      - run: |
          # 检查AI没有修改敏感文件
          git diff --name-only origin/main | grep -E '\.env|\.key|secrets/' && exit 1 || true
```

## 架构约束实践

### 代码放置规则（用户提出，方向正确）

```
公共函数 → utils/
状态管理 → page/model/
多层调用 → 观察者模式/事件总线
```

### 需要扩展到的维度

| 维度 | 示例规则 |
|------|---------|
| 文件放置 | 公共函数放utils/ |
| 代码风格 | 使用函数式组件，不用class |
| 安全红线 | 不许修改.env，不许硬编码密钥 |
| 测试要求 | 每个公共函数有测试，覆盖率>80% |
| 验证命令 | lint → typecheck → test |
| 依赖管理 | 新增依赖需说明理由 |
| 错误处理 | 所有async函数用try-catch包裹 |
| 命名约定 | 文件名kebab-case，组件名PascalCase |
