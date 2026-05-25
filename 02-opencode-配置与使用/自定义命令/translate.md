---
description: 将英文翻译为其他语言 (translate English to other languages)
model: opencode/claude-opus-4-7
---

运行 `git diff`，并将已修改的英文文档和用户界面（UI）文案文件翻译为其他国际语言。为了节省时间，请并行翻译所有语言。

要求：

- 保留原始含义、设计意图、语气和排版格式（包括 Markdown/MDX 的结构）。
- 准确保留所有的技术术语和事物名称：包含产品/公司名称、API 名称、标识符、代码、命令/参数标志（flags）、文件路径、URL、版本号、错误信息、配置键/值，以及任何行内代码或代码块内部的内容。
- 同时准确保留下方“无需翻译（Do-Not-Translate）”术语表中所列的每一项术语。
- 在适用时，应用来自 `.opencode/glossary/<locale>.md`（例如 `zh-cn.md`）的特定区域指南。
- 切勿修改栅栏代码块（fenced code blocks，即 ``` 包裹的代码块）。
