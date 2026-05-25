# wp-calypso AGENTS.md 结构总览

> 本文件对 WordPress.com Calypso 仓库中全部 24 个 AGENTS.md 文件进行系统性梳理，
> 包括目录层级关系、各文件职责定位、核心内容摘要和文件间的依赖引用。

---

## 一、目录层级结构图

```
wp-calypso/
│
├── AGENTS.md                              # [全局] 仓库根 — 项目总览、开发环境、测试、PR 规范
│
├── client/                                # ─── 客户端层 ───
│   ├── AGENTS.md                          # [层级1] Calypso Client 通用架构、命令、编码规范
│   │
│   ├── dashboard/                         # Dashboard（新版多站点仪表盘）
│   │   ├── AGENTS.md                      # [层级2] Dashboard 总体规范、暗黑模式、AppConfig 规则
│   │   └── me/billing-purchases/
│   │       └── AGENTS.md                  # [层级3] 计费与购买管理（最复杂的业务模块之一）
│   │
│   ├── reader/                            # Reader（信息流阅读器）
│   │   ├── AGENTS.md                      # [层级2] Reader 路由、数据迁移、架构决策、边界约束
│   │   └── social/
│   │       └── AGENTS.md                  # [层级3] 社交功能共享 UI（Bluesky/Mastodon/Fediverse）
│   │
│   ├── my-sites/                          # 经典 Calypso 站点管理（逐步废弃）
│   │   ├── checkout/
│   │   │   └── AGENTS.md                  # [层级2] 结账流程（支付处理器、Thank-you 页面路由）
│   │   ├── stats/
│   │   │   └── AGENTS.md                  # [层级2] 站点统计（与 Odyssey Stats 共享代码）
│   │   └── themes/
│   │       └── AGENTS.md                  # [层级2] 主题展示（暗黑模式支持）
│   │
│   ├── me/purchases/
│   │   └── AGENTS.md                      # [层级2] 经典购买管理（Redux/page.js 架构）
│   │
│   ├── a8c-for-agencies/
│   │   └── AGENTS.md                      # [层级2] A8C for Agencies（代理商平台）
│   │
│   └── jetpack-connect/
│       └── AGENTS.md                      # [层级2] Jetpack 连接流程（授权、SSO、安装）
│
├── packages/                              # ─── 共享包层 ───
│   ├── help-center/
│   │   └── AGENTS.md                      # 帮助中心组件库（多环境部署、双端点 API 模式）
│   ├── image-studio/
│   │   └── AGENTS.md                      # AI 图像编辑/生成（跨 bundle 通信、Abilities API）
│   ├── block-notes/
│   │   └── AGENTS.md                      # AI 块注释系统（@ai 提及、WordPress Abilities API）
│   ├── grid/
│   │   └── AGENTS.md                      # CSS Grid 布局组件（npm 发布流程）
│   ├── ui/
│   │   └── AGENTS.md                      # Automattic 设计系统组件（CSS Modules 暗黑模式）
│   ├── jetpack-ai-sidebar/
│   │   └── AGENTS.md                      # Jetpack AI 侧边栏（Agents Manager provider）
│   └── agents-manager/
│       └── AGENTS.md                      # 统一 AI Agent 体验（跨仓库边界、扩展 provider）
│
├── apps/                                  # ─── 独立应用层 ───
│   ├── help-center/
│   │   └── AGENTS.md                      # 帮助中心构建/部署层（8 个 webpack 入口点）
│   ├── odyssey-stats/
│   │   └── AGENTS.md                      # Odyssey Stats（嵌入 wp-admin 的统计应用）
│   ├── blaze-dashboard/
│   │   └── AGENTS.md                      # Blaze 广告管理（嵌入 wp-admin 的 SPA）
│   └── agents-manager/
│       └── AGENTS.md                      # Agents Manager 构建/部署层
│
└── test/
    └── e2e/
        └── AGENTS.md                      # E2E 测试框架（Playwright 迁移指南）
```

---

## 二、层级关系与继承

AGENTS.md 文件之间存在明确的**层级继承关系**：

```
根 AGENTS.md (全局规范)
  └── client/AGENTS.md (客户端通用规范，所有 client/* 子目录继承)
        ├── client/dashboard/AGENTS.md (Dashboard 特定规范)
        │     └── client/dashboard/me/billing-purchases/AGENTS.md (业务模块深潜)
        ├── client/reader/AGENTS.md (Reader 特定规范)
        │     └── client/reader/social/AGENTS.md (社交功能深潜，继承 reader + client 规范)
        ├── client/my-sites/checkout/AGENTS.md
        ├── client/my-sites/stats/AGENTS.md
        ├── client/my-sites/themes/AGENTS.md
        ├── client/me/purchases/AGENTS.md
        ├── client/a8c-for-agencies/AGENTS.md
        └── client/jetpack-connect/AGENTS.md (显式引用 client/AGENTS.md)

packages/* 独立但互相引用：
  packages/ui/AGENTS.md ← 被多个 client 目录引用（暗黑模式 mixin）
  packages/agents-manager/AGENTS.md ← 引用 packages/help-center/AGENTS.md 的 PR 模板

apps/* 通常引用对应的 packages/* 的 AGENTS.md：
  apps/help-center/AGENTS.md → packages/help-center/AGENTS.md
  apps/agents-manager/AGENTS.md → packages/agents-manager/AGENTS.md
```

---

## 三、各文件详细摘要

### 3.1 根目录 — `AGENTS.md` (96 行)

| 属性         | 内容                                                                                |
| ------------ | ----------------------------------------------------------------------------------- |
| **定位**     | 全局入口，给 AI agent 的第一份项目说明书                                            |
| **核心内容** | 仓库布局 (client/packages/apps)、四大客户端介绍、开发命令、测试命令、PR 检查清单    |
| **关键约束** | 不用 `// @ts-expect-error`；PR 用 draft；用 Linear issue ID；不链 wordpress.com URL |

### 3.2 `client/AGENTS.md` (62 行)

| 属性         | 内容                                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **定位**     | Calypso 客户端通用编码规范                                                                                                                             |
| **核心内容** | 双架构并存（Redux + page.js vs TanStack）、文件命名 (kebab-case)、导入规范 (clsx)、TypeScript 严格模式、UI 组件库选择、CSS 逻辑属性、国际化、测试偏好  |
| **关键约束** | 用 `clsx` 不用 `classnames`；用 CSS 逻辑属性；用 `@wordpress/i18n`；测试用 `userEvent` 不用 `fireEvent`；用 `toBeVisible()` 不用 `toBeInTheDocument()` |

### 3.3 `client/dashboard/AGENTS.md` (23 行)

| 属性         | 内容                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| **定位**     | 新版多站点仪表盘规范                                                        |
| **核心内容** | 子模块指引（billing-purchases）、禁止分支 `appConfig.name`、暗黑模式规则    |
| **架构特征** | TanStack Query + TanStack Router，不用 Redux                                |
| **关键约束** | 用 `siteTypeSupportsFeature()` 替代 `appConfig.name` 分支；暗黑模式用 mixin |

### 3.4 `client/dashboard/me/billing-purchases/AGENTS.md` (113 行)

| 属性         | 内容                                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| **定位**     | Dashboard 中最大最复杂的业务模块                                                                                           |
| **核心内容** | 目录结构、兄弟模块陷阱表、数据层（Purchase 类型差异）、架构决策（DataViews/重组件/工厂模式）、取消流程三类型、9 个常见陷阱 |
| **关键约束** | Query key 用 `'upgrades'` 不用 `'purchases'`；snake_case vs camelCase 转换；`flowType` 会被静默覆盖；siteless 临时站点处理 |

### 3.5 `client/reader/AGENTS.md` (270 行)

| 属性         | 内容                                                                                                                                                                         |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **定位**     | Reader 总纲 — 仓库中最大的 AGENTS.md 之一                                                                                                                                    |
| **核心内容** | 完整路由表（50+ 路由入口）、数据迁移策略（Redux → React Query）、Mutation 工厂模式、乐观更新检查清单、Stream/Post 键机制、SSR 文件变体、分析追踪、URL 构建器、帖子规范化管道 |
| **关键约束** | mutation 工厂必须接受消费者 `QueryClient`；用 `recordReaderTracksEvent` 不用 `recordTrack`；新代码必须用 TypeScript + 函数组件                                               |

### 3.6 `client/reader/social/AGENTS.md` (712+ 行)

| 属性         | 内容                                                                                                                                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **定位**     | **仓库中最大最详细的 AGENTS.md** — 社交功能共享 UI 深潜文档                                                                                                                                                          |
| **核心内容** | 目录布局、协议无关 vs Bluesky 特定组件划分、Like/Repost 交互 Provider 模式、Composer 配置系统、通知列表（过滤器/日期分组/堆叠算法）、HTML 净化安全策略、卡片链接无障碍模式、内联视频 HLS 播放、添加新协议的 8 步指南 |
| **架构特征** | Provider-注入适配器模式（LikeProvider/RepostProvider/ComposerProvider）；协议 shell → 共享 UI → per-protocol config                                                                                                  |
| **关键约束** | HTML 净化用 DOMPurify 严格白名单；`data-id` 属性用于 mention 路由；CSP 配置需包含 bsky.app 域名                                                                                                                      |

### 3.7 `client/my-sites/checkout/AGENTS.md` (126 行)

| 属性         | 内容                                                                                                                                                           |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **定位**     | 结账流程 — 另一个高复杂度业务模块                                                                                                                              |
| **核心内容** | 目录结构、三步结账流程、四种状态管理（Redux/@wordpress/data/formStatus/transactionStatus）、支付处理器四路径、包边界表、添加支付方法的 7 步流程、11 个常见陷阱 |
| **关键约束** | 链接必须包含 `redirect_to` 和 `cancel_to`；cart key 很关键；Thank-you 路由 800+ 行 20+ 分支；`navigate()` 对 `/setup/` 路由无效                                |

### 3.8 `client/my-sites/stats/AGENTS.md` (151 行)

| 属性         | 内容                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **定位**     | 经典统计模块（与 Odyssey Stats 共享代码）                                                                                      |
| **核心内容** | 目录结构、混合技术栈（Redux + Data Components + TanStack Query）、状态管理选择器、关键 hooks 表、与 Odyssey Stats 集成注意事项 |
| **关键约束** | 必须用 `useMomentSiteZone()` 不用裸 `moment()`；`Query*` 组件挂载后数据不会立即可用                                            |

### 3.9 `client/my-sites/themes/AGENTS.md` (11 行)

| 属性         | 内容                                             |
| ------------ | ------------------------------------------------ |
| **定位**     | 最小的 AGENTS.md 之一 — 仅暗黑模式规范           |
| **核心内容** | 暗黑模式启用条件、本地覆盖位置 `_dark-mode.scss` |

### 3.10 `client/me/purchases/AGENTS.md` (104 行)

| 属性         | 内容                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| **定位**     | 经典购买管理（与 Dashboard billing-purchases 是兄弟模块，不同架构）                                     |
| **核心内容** | 目录结构、Redux 选择器陷阱、架构上下文（camelCase vs snake_case Purchase 类型差异）、10 个常见陷阱      |
| **关键约束** | `canAutoRenewBeTurnedOff` 名不副实；`isSiteLevel` 改变数据源；`site.wpcom_url` 对 `.home.blog` 站点说谎 |

### 3.11 `client/a8c-for-agencies/AGENTS.md` (42 行)

| 属性         | 内容                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------- |
| **定位**     | A8C for Agencies 代理商平台编码规范                                                            |
| **核心内容** | 代码标准（表单/DataViews/DataForm）、分析追踪（`calypso_a4a_*` 前缀）、样式约定、颜色/排版规范 |
| **关键约束** | 用 `--color*` 不用 `--studio*` token；用句子大小写；用弯引号                                   |

### 3.12 `client/jetpack-connect/AGENTS.md` (50 行)

| 属性         | 内容                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| **定位**     | Jetpack 连接流程路由和信号系统                                                                               |
| **核心内容** | `from` 参数分支表（15+ 种来源）、两个关键 URL 信号（`already_authorized`/`has_connected_owner`）及其消费者表 |
| **关键约束** | 新 `from` 值优先扩展 `jetpack-connector` 统一流程；两个信号相互独立                                          |

### 3.13 `packages/help-center/AGENTS.md` (152 行)

| 属性         | 内容                                                                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **定位**     | 帮助中心共享组件库 — 多环境运行                                                                                                              |
| **核心内容** | 四种运行环境、后端边界、架构（@wordpress/data + TanStack Query）、双端点 API 模式（wpcomRequest vs apiFetch）、完整 API 端点表、外部服务集成 |
| **关键约束** | 每次改动必须测试 Calypso 和 Simple/Atomic/CIAB；`canAccessWpcomApis()` 决定 API 路径；API 变更需要 `jetpack-mu-plugin` 后端配合              |

### 3.14 `packages/image-studio/AGENTS.md` (115 行)

| 属性         | 内容                                                                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **定位**     | AI 图像编辑/生成 — 跨 bundle 架构                                                                                                              |
| **核心内容** | 文件导读表、关键模式（单一 store/检查点系统/draft 清理/跨 bundle 通信）、Abilities API 契约、Extensions (HOC 过滤器)、追踪系统、测试覆盖率缺口 |
| **关键约束** | 不创建独立 store 文件；非序列化 store 值是有意为之；`update-canvas-image` 影响 AI agent 契约需协调后端                                         |

### 3.15 `packages/block-notes/AGENTS.md` (235 行)

| 属性         | 内容                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **定位**     | AI 块注释系统 — `@ai` 提及交互                                                                                                       |
| **核心内容** | 数据流 6 步骤、组件层级、Abilities API（get/reply）、文件组织、去重机制（内存 Set + 数据库 meta）、60 秒过期拒绝、手动浏览器测试步骤 |
| **关键约束** | 60 秒过期阈值不可随意增大；双重去重必须同时维护；Abilities API description 是 AI prompt 的一部分                                     |

### 3.16 `packages/grid/AGENTS.md` (49 行)

| 属性         | 内容                                                    |
| ------------ | ------------------------------------------------------- |
| **定位**     | CSS Grid 布局组件 — 最简洁的包                          |
| **核心内容** | 构建/类型检查/测试/Storybook 命令、npm 发布流程（3 步） |

### 3.17 `packages/ui/AGENTS.md` (31 行)

| 属性         | 内容                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------ |
| **定位**     | Automattic 设计系统组件库 — 被多方引用                                                     |
| **核心内容** | CSS Modules 中暗黑模式的 mixin 用法                                                        |
| **引用关系** | 被多个 client AGENTS.md 引用（reader、dashboard、social 等关于暗黑模式的说明都指向此文件） |

### 3.18 `packages/jetpack-ai-sidebar/AGENTS.md` (141 行)

| 属性         | 内容                                                                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **定位**     | Jetpack AI 侧边栏 — Agents Manager provider                                                                                                                                     |
| **核心内容** | AM provider 契约（7 个导出）、关键模式（模块级状态/`returnToAgent:false`/工具 ID 规范化/show-component 模式）、工具表、上下文 provider、检查点/撤销、建议系统、iframe 跨 bundle |
| **关键约束** | `addMessageFn` 等是模块单例不可移入 React state；注入消息用 `'assistant'` 不用 `'agent'`                                                                                        |

### 3.19 `packages/agents-manager/AGENTS.md` (36 行)

| 属性         | 内容                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------- |
| **定位**     | 统一 AI Agent 体验 — 跨仓库边界                                                               |
| **核心内容** | 跨仓库边界（前端在此/后端在 Jetpack monorepo）、扩展 provider 注册机制、测试命令、约定        |
| **关键约束** | 两个部署目标（Calypso SPA + widgets.wp.com）；`extension-types.ts` 变更影响所有 provider 插件 |

### 3.20 `apps/help-center/AGENTS.md` (66 行)

| 属性         | 内容                                                                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **定位**     | 帮助中心构建/部署层                                                                                                                            |
| **核心内容** | 8 个 webpack 入口点表（Gutenberg/wp-admin/CIAB/Customizer/Logged-out，各有 connected/disconnected 变体）、构建同步命令、沙箱测试步骤、部署流程 |

### 3.21 `apps/odyssey-stats/AGENTS.md` (67 行)

| 属性         | 内容                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| **定位**     | 嵌入 wp-admin 的统计应用                                                                             |
| **核心内容** | 目录结构、构建命令、关键约束（配置初始化顺序、bundle 大小限制 495KiB/8KiB、hashbang 路由）、API 差异 |
| **关键约束** | `init-app-config` 必须是第一个 import；用本地 config wrapper 不用 `@automattic/calypso-config`       |

### 3.22 `apps/blaze-dashboard/AGENTS.md` (45 行)

| 属性         | 内容                                                                                                                  |
| ------------ | --------------------------------------------------------------------------------------------------------------------- |
| **定位**     | Blaze 广告管理 — 嵌入 wp-admin 的 SPA                                                                                 |
| **核心内容** | 架构（thin wrapper + page.js hashbang 路由）、外部系统（DSP/Jetpack Blaze/Billing）、三种主题模式、构建部署、开发设置 |

### 3.23 `apps/agents-manager/AGENTS.md` (30 行)

| 属性         | 内容                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| **定位**     | Agents Manager 构建/部署层                                                                                       |
| **核心内容** | 构建/同步命令、沙箱测试、wp-admin 双模式入口点（完整 UI vs headless）、image-studio 和 block-notes 是独立 bundle |

### 3.24 `test/e2e/AGENTS.md` (195 行)

| 属性         | 内容                                                                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **定位**     | E2E 测试框架 — 迁移指南                                                                                                                                           |
| **核心内容** | 双框架并存（Legacy Playwright+Jest → New Playwright Test）、迁移对照表（文件结构/import/测试结构/认证/Page Objects/fixtures/skip/多上下文）、Given/When/Then 模式 |
| **关键约束** | 新测试必须用 `.spec.ts` 格式；必须用 `--reporter=list` 防止 HTML 报告挂起进程                                                                                     |

---

## 四、按维度交叉分析

### 4.1 文件大小分布

| 级别             | 文件                                                                                                                                                                                                                                                                                                                                                                | 行数    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 超大 (500+ 行)   | `client/reader/social/AGENTS.md`                                                                                                                                                                                                                                                                                                                                    | 712+    |
| 大 (100-300 行)  | `client/reader/AGENTS.md`, `client/dashboard/me/billing-purchases/AGENTS.md`, `packages/block-notes/AGENTS.md`, `client/my-sites/checkout/AGENTS.md`, `test/e2e/AGENTS.md`                                                                                                                                                                                          | 100-270 |
| 中等 (50-100 行) | `packages/help-center/AGENTS.md`, `client/me/purchases/AGENTS.md`, `client/my-sites/stats/AGENTS.md`, `packages/jetpack-ai-sidebar/AGENTS.md`, `packages/image-studio/AGENTS.md`                                                                                                                                                                                    | 50-155  |
| 小 (30-50 行)    | 根 `AGENTS.md`, `client/AGENTS.md`, `client/dashboard/AGENTS.md`, `packages/grid/AGENTS.md`, `packages/ui/AGENTS.md`, `packages/agents-manager/AGENTS.md`, `client/a8c-for-agencies/AGENTS.md`, `client/jetpack-connect/AGENTS.md`, `apps/odyssey-stats/AGENTS.md`, `apps/blaze-dashboard/AGENTS.md`, `apps/agents-manager/AGENTS.md`, `apps/help-center/AGENTS.md` | 30-66   |
| 极小 (<30 行)    | `client/my-sites/themes/AGENTS.md`                                                                                                                                                                                                                                                                                                                                  | 11      |

### 4.2 核心主题分布

| 主题                        | 涉及的 AGENTS.md                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **暗黑模式**                | `client/dashboard/`, `client/reader/`, `client/reader/social/`, `client/my-sites/themes/`, `packages/ui/`     |
| **TanStack Query 迁移**     | `client/reader/`, `client/dashboard/`, `client/my-sites/stats/`, `packages/help-center/`                      |
| **支付/计费**               | `client/dashboard/me/billing-purchases/`, `client/me/purchases/`, `client/my-sites/checkout/`                 |
| **跨 bundle 通信**          | `packages/image-studio/`, `packages/block-notes/`, `packages/jetpack-ai-sidebar/`, `packages/agents-manager/` |
| **WordPress Abilities API** | `packages/image-studio/`, `packages/block-notes/`, `packages/jetpack-ai-sidebar/`                             |
| **多环境部署**              | `packages/help-center/`, `apps/help-center/`, `packages/agents-manager/`, `apps/agents-manager/`              |
| **测试框架**                | `test/e2e/`, 根 `AGENTS.md`, 各 `client/*/AGENTS.md`                                                          |
| **CSS/SCSS 规范**           | `client/AGENTS.md`, `client/a8c-for-agencies/`, `client/reader/social/`, `packages/ui/`                       |

### 4.3 架构风格对比

| 架构                   | 模块                                                                                                     | 状态管理               | 路由               |
| ---------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------ |
| **经典 Calypso**       | `client/me/purchases/`, `client/my-sites/stats/`, `client/my-sites/checkout/`, `client/jetpack-connect/` | Redux + data-layer     | page.js            |
| **新版 Dashboard**     | `client/dashboard/`                                                                                      | TanStack Query         | TanStack Router    |
| **混合迁移中**         | `client/reader/`                                                                                         | Redux → TanStack Query | page.js            |
| **独立 wp-admin 嵌入** | `apps/odyssey-stats/`, `apps/blaze-dashboard/`                                                           | Redux                  | page.js (hashbang) |
| **跨 bundle AI**       | `packages/image-studio/`, `packages/block-notes/`, `packages/jetpack-ai-sidebar/`                        | @wordpress/data        | 无（被动注册）     |
| **部署/构建层**        | `apps/help-center/`, `apps/agents-manager/`                                                              | N/A                    | N/A                |

---

## 五、AGENTS.md 编写模式总结

### 5.1 常见章节结构

wp-calypso 的 AGENTS.md 文件普遍遵循以下结构模式（按出现频率排序）：

1. **标题 + 一句话描述** — 100% 的文件包含
2. **目录结构 (Directory Structure)** — ~60% 的文件包含
3. **架构决策 (Architecture Decisions)** — ~50% 的文件包含
4. **命令 (Commands)** — ~70% 的文件包含
5. **约定/规范 (Conventions)** — ~80% 的文件包含
6. **常见陷阱 (Common Pitfalls)** — ~40% 的文件包含（业务复杂模块必有）
7. **测试 (Testing)** — ~50% 的文件包含
8. **PR 指南 (PR Guidelines)** — ~25% 的文件包含
9. **边界约束 (Boundaries)** — ~20% 的文件包含

### 5.2 编写特点

- **陷阱优先**：复杂业务模块都包含编号的陷阱清单，每个陷阱都是实战中踩过的坑
- **引用链**：子目录 AGENTS.md 显式引用父目录的 AGENTS.md，形成继承链
- **代码示例**：关键模式（如 mutation 工厂）直接给出代码模板
- **表格驱动**：大量使用表格展示路由、API 端点、信号、hooks 等结构化信息
- **决策记录**：不仅说"做什么"，还说"为什么这样做"（如 social/AGENTS.md 中的 Bluesky vs Mastodon 抽象策略）
- **精确到文件**：引用路径精确到具体文件（如 `client/lib/color-scheme/dark-theme.scss`）

---

## 六、关键教训

1. **层级递进**：根 → client → 子模块 → 子子模块，信息密度递增，通用性递减
2. **最大文件最深层**：`client/reader/social/AGENTS.md` (712+ 行) 是最详细的，因为它管理三个社交协议的共享 UI
3. **业务复杂度决定文件长度**：支付/结账/计费相关模块普遍 100+ 行，简单 UI 模块可以只有 11 行
4. **跨仓库边界需特别标注**：`packages/agents-manager/`、`packages/help-center/` 明确标注后端在其他仓库
5. **AI 相关包深度最高**：`image-studio`、`block-notes`、`jetpack-ai-sidebar` 的 AGENTS.md 覆盖了从数据流到跨 bundle 调试的全链路
