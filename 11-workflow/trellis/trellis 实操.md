# 步骤

## 1.安装 cli 工具

```shell
pnpm add -g @mindfoldhq/trellis@latest
```

## 2.初始化项目

```shell
trellis init -u duoyun --zcode
```

> duoyun 这个为开发者的名字，主要为了建立多个空间的日志，团队合作使用

## 3.启动 Bootstrap 任务

- Bootstrap 任务会帮你填充 .trellis/spec/ 中的规范。

- 步骤
  1. 新开一个 ZCode 会话（因为 hooks 只在会话启动时加载）
  2. 告诉 AI 你想启动 bootstrap 任务 ： 示例（启动 bootstrap 任务，帮我填充项目规范。项目有现成的 AGENTS.md，可以从那里提取规范。）

## 4.归档 Bootstrap 任务

> 前提：在归档之前，必须先提交工作成果：
>
> ```shell
> git add .trellis/spec/
> git commit -m "docs(spec): 按真实技术栈重塑 .trellis/spec 规范"
> ```

- 执行脚本为
  `python3 ./.trellis/scripts/task.py finish`
  `python3 ./.trellis/scripts/task.py archive 00-bootstrap-guidelines`

- 快捷 ai 指令
  `/trellis:finish-work`：会自动执行这两个步骤

### 3和4步的原因

Trellis 的设计原则：

```text
Phase 3.4 (提交代码) ──→ Phase 3.5 (finish-work)
      │                        │
      ▼                        ▼
   git commit              归档 + 记录日志
```

finish-work 只负责：

- 归档任务
- 记录会话日志
- 不负责提交代码
