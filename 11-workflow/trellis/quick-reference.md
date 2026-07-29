# Trellis 快速参考卡

## 🚀 初始化

```bash
# 1. 安装 CLI
pnpm add -g @mindfoldhq/trellis@latest

# 2. 初始化项目
trellis init -u <你的名字> --zcode

# 3. 新开 ZCode 会话，告诉 AI：
"启动 bootstrap 任务，帮我填充项目规范"

# 4. 提交规范
git add .trellis/spec/
git commit -m "docs(spec): 项目规范"

# 5. 归档 bootstrap 任务
/trellis:finish-work
```

---

## 📋 日常开发

```bash
# 1. 新开 ZCode 会话

# 2. 描述任务
"新增用户登录功能"

# 3. AI 自动处理...

# 4. 结束会话
/trellis:finish-work
```

---

## 🎯 三个核心命令

| 命令                   | 何时用               | 做什么               |
| ---------------------- | -------------------- | -------------------- |
| `/trellis:start`       | 平台没自动注入上下文 | 加载上下文、分类任务 |
| `/trellis:continue`    | 任务进行中           | 推进到下一步         |
| `/trellis:finish-work` | 代码已提交           | 归档任务、记录日志   |

---

## ⚡ 五个核心技能

| 技能                  | 触发时机      | 做什么             |
| --------------------- | ------------- | ------------------ |
| `trellis-brainstorm`  | 创建任务后    | 澄清需求、起草 PRD |
| `trellis-before-dev`  | 写代码前      | 加载相关规范       |
| `trellis-check`       | 写完代码后    | 验证 + 自修复      |
| `trellis-update-spec` | 有新知识时    | 沉淀到规范         |
| `trellis-break-loop`  | 修完难 bug 后 | 根因分析 + 预防    |

---

## 🔧 三个子代理

| 子代理              | 约束            | 用途               |
| ------------------- | --------------- | ------------------ |
| `trellis-research`  | 只读            | 代码搜索、模式发现 |
| `trellis-implement` | 写代码不 commit | 编码实现           |
| `trellis-check`     | 可写可修复      | 验证 + 自修复      |

---

## 📁 目录结构

```
.trellis/
├── spec/                    # 项目规范
│   ├── frontend/            #   前端规范
│   ├── backend/             #   后端规范
│   └── guides/              #   思考指南
├── tasks/                   # 活跃任务
│   └── archive/             #   归档任务
├── workspace/               # 开发者工作区
│   └── <developer>/
│       └── journal-N.md     #   会话日志
└── scripts/                 # 自动化脚本
    ├── task.py              #   任务管理
    ├── get_context.py       #   会话上下文
    └── add_session.py       #   记录会话
```

---

## 🔄 任务生命周期

```
create → plan → start → implement/check → finish → archive
   │       │       │           │              │        │
   ▼       ▼       ▼           ▼              ▼        ▼
 创建    PRD    开始执行    开发+验证      清除指针   移到归档
```

---

## ⚠️ 常见问题速查

| 问题                           | 解决方案                                      |
| ------------------------------ | --------------------------------------------- |
| finish-work 报错"有未提交代码" | 先 `git commit`，再执行                       |
| 想查看当前任务                 | `python3 ./.trellis/scripts/task.py current`  |
| 想手动归档                     | `task.py finish` + `task.py archive <name>`   |
| 升级 Trellis                   | `trellis upgrade` + `trellis update`          |
| 查看历史会话                   | `.trellis/workspace/<developer>/journal-N.md` |

---

## 🎓 工作流示例

### 示例 1：新功能开发

```
你：新增用户登录功能
AI：我来创建一个 Trellis 任务...
    [trellis-brainstorm] 让我问几个问题...
    [trellis-before-dev] 加载前端/后端规范...
    [trellis-implement] 实现代码...
    [trellis-check] 验证 + 修复...
    [trellis-update-spec] 沉淀经验...
你：/trellis:finish-work
```

### 示例 2：Bug 修复

```
你：修复搜索分页 bug
AI：让我先研究一下...
    [trellis-research] 搜索相关代码...
    [trellis-before-dev] 加载规范...
    [trellis-implement] 修复代码...
    [trellis-check] 验证修复...
    [trellis-break-loop] 分析根因...
你：/trellis:finish-work
```

---

## 📖 更多信息

- [完整手册](./README.md)
- [命令与技能详解](./commands-and-skills.md)
- [官方知识库](../../docs/trellis-知识库/)
