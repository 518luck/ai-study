---
model: opencode/gpt-5.4
---

根据下方结构化的变更日志输入内容，创建 `UPCOMING_CHANGELOG.md`。
如果 `UPCOMING_CHANGELOG.md` 已经存在，请完全忽略其当前内容。
切勿保留、合并或复用已有文件中的文本。

输入内容已经包含了自上一个非草稿（non-draft）发布版本以来的确切 commit 范围。
Commits 已经根据与发布相关的包进行了过滤，并归类到各个发布板块中。不要获取 GitHub releases、PR，或者自己构建 commit 列表。
输入内容可能还包含一个 `## Community Contributors Input`（社区贡献者输入）板块。

在写入您保留的任何条目之前，请使用 `git show --stat --format='' <hash>` 或 `git show --format='' <hash>` 检查真实的 diff，以便了解实际的代码更改，而不仅仅是看 commit 消息（commit 消息可能有误导性）。
在决定贡献归属时，不要使用 `git log` 或作者元数据。

规则：

- 写入最终文件时，发布板块按以下顺序排列：
  `## Core`、`## TUI`、`## Desktop`、`## SDK`、`## Extensions`
- 仅保留至少包含一个显著条目的板块。
- 在每个发布板块中，将 Bug 修复归类在 `### Bugfixes` 标题下。
- 当一个板块同样包含 Bug 修复时，将其他显著的条目归类在 `### Improvements` 标题下。
- 省略空的子板块。
- 每个您保留的 commit 对应一个列表项目（bullet）。
- 跳过完全属于内部逻辑、CI、测试、重构或其他对用户不可见的 commits。
- 每个列表项目（bullet）均以大写字母开头。
- 优先描述对用户而言改变了什么，而不是内部代码改变了什么。
- 不要拷贝诸如 `fix:` 或 `feat:` 之类的原始 commit 前缀，也不要保留结尾的 PR 编号（如 `(#123)`）。
- 社区归属是确定性的：仅保留变更日志输入内容中已有的 `(@username)` 后缀。
- 如果输入的列表项目没有 `(@username)` 后缀，不要自行添加。
- 绝不要根据 `git show`、commit 作者、姓名或电子邮件地址来添加新的 `(@username)` 后缀。
- 如果没有留下任何显著条目且没有贡献者区块，请确切地写入 `No notable changes.`。
- 如果没有留下显著条目但存在贡献者区块，请省略所有发布板块，仅返回贡献者区块。
- 如果输入包含 `## Community Contributors Input`，请将该标题下方的区块逐字附加到最终文件的末尾。
- 切勿在该区块中添加、删除、重写或重新排序贡献者姓名或 commit 标题。
- 不要从主摘要的列表中派生出感谢（thank-you）板块。
- 最终文件中不要包含标题 `## Community Contributors Input`。
- 专注于用最少的文字来表达您的观点 — 用户会粗略浏览变更日志，因此我们应当保持精准。

**重要提示：变更日志是面向用户的（他们至少具备一点技术背景），他们可能会使用 TUI、Desktop、SDK、插件等等。请彻底理解那些可能不会立刻显现的连带影响。例如，一个依赖包升级看起来属于内部改动，但它可能修补了某个 bug；或者某次重构可能同时稳定了某些竞争条件（race condition），从而为用户修复了 bug。PR 的标题/正文 + commit 消息会为您提供作者的上下文信息，其中通常包含最终结果，而不仅仅是技术细节。**

<changelog_input>

!`bun script/raw-changelog.ts $ARGUMENTS`

</changelog_input>
