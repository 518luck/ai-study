# AGENTS.md 通用编写模式

> 基于 Sentry、Kibana、opencode、wp-calypso 四个真实开源项目的 AGENTS.md 规则文件分析提炼。

## 1. 分层继承（所有项目共性）

所有项目都采用 **根 → 子目录** 的分层继承结构，核心原则是"子层只补充，不重复"：

```
项目根/AGENTS.md              → 全局：项目概述、构建命令、代码风格、PR 规则
packages/ui/AGENTS.md         → 包级：UI 组件规范
packages/core/src/api/AGENTS.md → 模块级：API 开发模式
tests/AGENTS.md               → 测试级：测试框架和最佳实践
```

| 项目 | 层级数 | 最大深度 | 根文件行数 | 最大子文件行数 |
|------|--------|----------|-----------|---------------|
| Sentry | 3 层 | 模块级 (seer/) | ~258 行 | ~789 行 (前端) |
| Kibana | 6 层 (0-5) | 工具级 (get_service_topology/) | ~30 条规则 | ~40 条规则 (server/) |
| opencode | 4 层 (L0-L3) | 子模块级 (test/server/) | ~135 行 | ~500+ 行 (llm/) |
| wp-calypso | 4 层 | 子子模块 (social/) | ~96 行 | ~712 行 (social/) |

## 2. 根文件应该包含什么

| 内容 | 出现率 | 说明 |
|------|--------|------|
| 项目概述 | 4/4 | 一句话说清楚项目是什么 |
| 目录结构 | 4/4 | 顶层目录及其职责 |
| 构建/运行命令 | 4/4 | 开发、测试、lint、类型检查命令 |
| PR 规范 | 3/4 | draft PR、前后端分离、检查清单 |
| 代码风格 | 3/4 | TypeScript/Python 基本规范 |
| 上下文加载路由 | 2/4 | Sentry 和 Kibana 有显式路径匹配规则 |

## 3. 子目录 AGENTS.md 应该包含什么

| 内容 | 说明 |
|------|------|
| 技术栈详情 | 该目录用到的具体框架、库、版本 |
| 代码模板 | 可直接复制的 endpoint/serializer/task 模板 |
| 正反例对比 | 每个规范配 ❌ 错误 + ✅ 正确示例 |
| 常见陷阱清单 | 编号的坑点，来自实战经验 |
| 决策树 | "添加 API endpoint" → 步骤 1/2/3... |
| Anti-Patterns | "永远不要做的事"列表 |
| 文件位置表 | Models/Endpoints/Tests 等文件的目录映射 |

## 4. 命名与格式规范（跨项目共识）

### TypeScript 通用规范
- 避免 `any`，依赖类型推断
- 公共 API 显式声明返回类型
- 用 `import type` 导入纯类型
- 不用 `@ts-ignore` / `@ts-expect-error`，修根因
- 函数组件 + 显式 props 类型

### 代码风格通用规范
- 优先 `const`，early return 替代 `else`
- 描述性命名，避免单字母
- 聚焦变更，不做无关重构
- 不删测试、不跳测试、不注释测试

### 测试通用规范
- 测实际实现，避免 mock
- 测试文件镜像源码结构（`src/foo/bar.py` → `tests/foo/test_bar.py`）
- 明确测试框架选择（Jest/pytest/Playwright）

## 5. 关键差异点

| 维度 | Sentry (Django+React) | Kibana (TypeScript) | opencode (Effect+TypeScript) | wp-calypso (React) |
|------|------|------|------|------|
| 特色章节 | Silo 架构规则 | 插件生命周期规则 | Effect 惯用法 | 陷阱表 (Pitfalls) |
| 安全重点 | IDOR 防护、组织隔离 | API 授权、加密存储 | 权限管理 | HTML 净化、CSP |
| 测试策略 | pytest + factory | Jest + Scout + FTR | Effect 测试 fixture | Playwright E2E |
| 架构概念 | Cell/Region Silo | 插件可见性 | 四轴路由分解 | 跨 bundle 通信 |
