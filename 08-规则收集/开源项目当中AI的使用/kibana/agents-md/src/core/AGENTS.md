# src/core

代码位于 `src/core/packages/`，按领域组织（例如 `http`、`elasticsearch`、`saved-objects`）。每个领域包含遵循命名约定的子包。

## 子包后缀

| 后缀                | 作用                          | 可见性              |
| ------------------- | ----------------------------- | ------------------- |
| `-server`           | 公共服务端类型和契约          | `shared`            |
| `-server-internal`  | 服务端实现                    | `private`           |
| `-server-mocks`     | 服务端契约的 Jest 模拟对象    | `shared`、`devOnly` |
| `-browser`          | 公共浏览器端类型和契约        | `shared`            |
| `-browser-internal` | 浏览器端实现                  | `private`           |
| `-browser-mocks`    | 浏览器端契约的 Jest 模拟对象  | `shared`、`devOnly` |
| `common`            | 服务端和浏览器共享的类型/工具 | `shared`            |

- `-server` / `-browser` 包**仅导出类型和纯工具函数**，不包含实现。
- `-internal` 包包含实现代码，它们依赖于公共 API 包，反之不成立。
- `-mocks` 包依赖公共 API 类型来生成带类型的模拟对象。

## 可见性

每个包在其 `kibana.jsonc` 中声明 `visibility`：

- **`shared`** — Kibana 中任何包都可导入。用于公共 API 类型（`-server`、`-browser`、`common`）和模拟对象（`-mocks`）。
- **`private`** — 仅允许其他 `src/core` 包导入。用于所有 `-internal` 包，因为它们包含不应泄露给插件的实现细节。

## 保持本文档更新

如果你（在 `src/core` 中工作的代理）在 `src/core` 中工作时发现本文档与实际代码存在不一致，请将本次对 AGENTS.md 的修正纳入你的变更集。

## 相关文档

- `src/core/CONVENTIONS.md` — 插件结构、API 设计和模拟模式
