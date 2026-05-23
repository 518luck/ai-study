# src/core

代码存放在 `src/core/packages/` 中，按领域进行组织（例如 `http`、`elasticsearch`、`saved-objects`）。每个领域包含遵循特定命名约定的子包（sub-packages）。

## 子包后缀（Sub-package suffixes）

| 后缀 (Suffix) | 角色/职责 (Role) | 可见性 (Visibility) |
|---|---|---|
| `-server` | 公共服务端类型与契约 | `shared` |
| `-server-internal` | 服务端实现 | `private` |
| `-server-mocks` | 针对服务端契约的 Jest mock | `shared`, `devOnly` |
| `-browser` | 公共浏览器端类型与契约 | `shared` |
| `-browser-internal` | 浏览器端实现 | `private` |
| `-browser-mocks` | 针对浏览器端契约的 Jest mock | `shared`, `devOnly` |
| `common` | 服务端与浏览器端共享的类型/工具函数 | `shared` |

- `-server` / `-browser` 包**仅导出类型和纯工具函数**，不包含具体实现。
- `-internal` 包包含具体实现。它们依赖公共 API 包，绝对不能反向依赖。
- `-mocks` 包依赖公共 API 类型以生成类型化的 mock 对象。

## 可见性（Visibility）

每个包在其 `kibana.jsonc` 中声明 `visibility`：

- **`shared`** — Kibana 中的任何包都可以导入它。用于公共 API 类型（`-server`、`-browser`、`common`）和 mock（`-mocks`）。
- **`private`** — 仅允许其他 `src/core` 中的包导入它。用于所有 `-internal` 包，因为它们包含不应泄露给插件的实现细节。

## 保持此文件最新

如果您（在 `src/core` 中工作的 agent）在 `src/core` 中工作时发现本文档与实际代码之间存在不一致，请将对本 `AGENTS.md` 的修复作为变更集的一部分一同提交。

## 相关文档

- `src/core/CONVENTIONS.md` — 插件结构、API 设计以及 mock 模式
