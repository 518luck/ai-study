```
AGENTS.md                  ← 主指令（所有工具共用）
   │
   ├── .agents/            ← 中央枢纽
   │     └── skills/       ← 26 个可复用技能
   │
   ├── .claude/            ← Claude Code（通过 symlink 共享）
   │     ├── CLAUDE.md → ../AGENTS.md
   │     ├── skills/ → ../.agents/skills
   │     └── agents/backport-branch-worker.md  ← 子代理
   │
   ├── .codex/             ← OpenAI Codex（通过 symlink 共享）
   │     └── skills/ → ../.agents/skills
   │
   ├── .cursorignore       ← Cursor AI
   ├── .coderabbit.yml     ← AI Code Review Bot
   ├── .github/agents/     ← GitHub Actions AI agent
   └── .macroscope/        ← CI/CD AI 审查提示词

```
