---
description: git 提交与推送 (git commit and push)
model: opencode/kimi-k2.5
subtask: true
---

提交并推送 (commit and push)

确保其包含类似以下的前缀：
docs:
tui:
core:
ci:
ignore:
wip:

对于 `packages/web` 目录下的任何修改，一律使用 `docs:` 前缀。

优先从最终用户的视角解释“为什么”做此改动，而不是仅仅描述“做了什么”。

不要使用像“提升了 agent 体验”这样空泛的提交消息，对于做出了哪些面向用户的更改，描述务必具体。

如果存在冲突，**切勿自行修复**。请通知我，我将进行修复。

## GIT DIFF

!`git diff`

## GIT DIFF --cached

!`git diff --cached`

## GIT STATUS --short

!`git status --short`
