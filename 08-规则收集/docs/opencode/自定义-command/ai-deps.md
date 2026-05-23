---
description: "仅升级 AI SDK 依赖的小版本 (minor) 或补丁版本 (patch)"
---

请阅读 `@package.json` 和 `@packages/opencode/package.json`。

你的工作是审查 AI SDK 的依赖项，找出它们是否有可以升级的版本（**仅限**小版本（minor）或补丁版本（patch），不考虑大版本（major），忽略所有大版本变动）。

我需要一份包含每个依赖项及其可升级至的版本的报告。
如果能为每个依赖项提供其变更的简短摘要以及各自变更日志（changelog）的链接，或者至少提供一些参考信息，以便我能了解修复了哪些 bug 或添加了哪些新功能，那就更好了。

为了节省你的上下文窗口，请考虑为每个依赖项使用子代理（subagents）。

以下是部分依赖项的简短列表（但请务必全面）：

- "ai"
- "@ai-sdk/openai"
- "@ai-sdk/anthropic"
- "@openrouter/ai-sdk-provider"
- 等等

**切勿**立即升级依赖项，仅制作一份所有可升级至小版本或补丁版本的依赖项及其版本的列表。

将你的调查发现写入 `ai-sdk-updates.md`。
