---
name: kbn-ui-package
description: 当用户要求“创建 kbn-ui 包”、“将组件接入（onboard）到 kbn-ui”、“打包 Kibana 组件以供外部发布”、“向 kbn-ui 添加包”、“为 Kibana 组件设置打包”，或者任何提到将 Kibana UI 组件发布给 Cloud UI 或外部消费者时，应使用此技能。引导完整的交互流程：收集输入、移动源文件、构建打包层脚手架，并更新所有 Kibana 的导入。
disable-model-invocation: true
---

# kbn-ui 包接入指南 (kbn-ui Package Onboarding)

## 概述 (Overview)

`kbn-ui` 系统将 Kibana UI 组件作为带有版本号的独立包发布给外部消费者（例如 Cloud UI）。每个包都位于 `src/platform/kbn-ui/` 目录下，并包含以下两层结构：

1. **源文件层 (Source layer)** — Kibana 工作区包（包含 `package.json`、`kibana.jsonc`、`src/`、`index.ts`）
2. **打包层 (Packaging layer)** — 发布脚手架（`packaging/`），通过 webpack 将源文件打包为独立的 `.tgz` 文件

标准参考示例：`src/platform/kbn-ui/side-navigation/`

---

## 第一阶段 — 收集输入 (Phase 1 — Gather Inputs)

使用 `AskUserQuestion` 收集**三个**输入值。`packageName` 始终是自动派生的 — 绝不要向用户询问它。

| 变量 (Variable) | 示例 (Example) | 来源 (Source) |
|---|---|---|
| `sourcePath` | `src/platform/packages/private/kbn-grid-layout` | 用户输入 |
| `folderName` | `grid-layout` | 用户输入 |
| `packageName` | `@kbn/ui-grid-layout` | **自动派生**：`@kbn/ui-{folderName}` |
| `description` | `Standalone Elastic grid layout component for non-Kibana applications` | 用户输入 |

要询问的问题：
1. "现有 Kibana 包的仓库相对路径是什么？"（例如 `src/platform/packages/private/kbn-grid-layout`）
2. "kbn-ui 文件夹的名称应该是什么？"（例如 `grid-layout` — 包名将自动派生为 `@kbn/ui-{你的回答}`）
3. "用于发布包 package.json 中的简短描述是什么？"

---

## 第二阶段 — 分析源文件 (Phase 2 — Analyze Source)

在创建任何内容之前，先阅读以下文件：

- `{sourcePath}/package.json` → 派生出 `oldName`（当前工作区名称，例如 `@kbn/grid-layout`）、`peerDependencies` 和 `dependencies`
- `{sourcePath}/kibana.jsonc` → 派生出 `owner`、`group`
- `{sourcePath}/index.ts` → 列出所有导出的符号（组件、类型、工具函数）

运行以下命令查找源文件使用的所有内部 `@kbn/*` 导入（搜索整个包，而不仅仅是 `src/` 子目录 — 因为源目录可能有任何名称）：
```bash
grep -roh "from '@kbn/[^']*'" {sourcePath} --include="*.ts" --include="*.tsx" \
  --exclude-dir=node_modules --exclude-dir=target --exclude-dir=packaging | sort -u
```

对结果进行分区：
- **外部化 (Externalize)** — 如果该包也出现在 `peerDependencies` 中（消费者会提供它）
- **插桩 (Stub)** — 其他所有内容（在 Kibana 之外不可用；需要在 `packaging/react/services/` 中提供空操作（no-op）实现）

统计有多少个 Kibana 文件需要更新导入路径：
```bash
grep -r "from '{oldName}'" src/ x-pack/ packages/ --include="*.ts" --include="*.tsx" -l | wc -l
```

---

## 第三阶段 — 与用户确认 (Phase 3 — Confirm with User)

在修改任何文件之前，展示摘要并使用 `AskUserQuestion` 与用户进行确认：

```
移动路径:   {sourcePath}/ → src/platform/kbn-ui/{folderName}/
重命名:     {oldName} → {packageName}
要生成的 @kbn/* 桩文件: [根据第二阶段列出]
要更新导入路径的 Kibana 文件数量: [根据第二阶段列出统计数]
```

---

## 第四阶段 — 执行 (Phase 4 — Execute)

### 4a. 移动包并规范化源目录

```bash
git mv {sourcePath} src/platform/kbn-ui/{folderName}
```

移动之后，包内部的源目录名称必须始终为 `src/`。检测实际的源目录名称 — 它应当是非元数据子目录（即不是 `packaging`、`target`、`__tests__` 等）：

```bash
# 列出已移动包中的顶层子目录（排除已知的非源目录）
ls -d src/platform/kbn-ui/{folderName}/*/  | grep -vE "/(packaging|target|node_modules)/$"
```

如果源目录的名称**不是** `src`，请重命名它：

```bash
git mv src/platform/kbn-ui/{folderName}/{actualDirName} src/platform/kbn-ui/{folderName}/src
```

将结果存储为 `srcDir = "src"` — 所有的打包模板都必须从 `packaging/react/` 内部通过 `../../src/` 引用它。

### 4b. 更新工作区 package.json

使用以下内容覆盖写入 `src/platform/kbn-ui/{folderName}/package.json`：

```json
{
  "name": "{packageName}",
  "version": "1.0.0",
  "private": true,
  "license": "Elastic License 2.0 OR AGPL-3.0-only OR SSPL-1.0"
}
```

### 4c. 更新 kibana.jsonc

保留已移动文件中的 `owner`、`group`、`type` 和 `visibility` 字段。仅将 `id` 字段更新为 `{packageName}`。

### 4d. 创建 packaging/ 脚手架

```bash
mkdir -p src/platform/kbn-ui/{folderName}/packaging/scripts
mkdir -p src/platform/kbn-ui/{folderName}/packaging/react/services
```

#### `packaging/package.json`

```json
{
  "name": "{packageName}",
  "version": "0.1.0",
  "private": true,
  "description": "{description}",
  "main": "index.js",
  "types": "index.d.ts",
  "files": [
    "index.js",
    "index.js.map",
    "index.d.ts",
    "metadata.json",
    "package.json"
  ],
  "peerDependencies": {
    "@elastic/eui": ">=112.0.0",
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "license": "Elastic License 2.0 OR AGPL-3.0-only OR SSPL-1.0"
}
```

合并源文件 `package.json` 中发现的任何额外 peerDependencies（例如 `@emotion/react`、`@emotion/css`）。

#### `packaging/webpack.config.js`

从侧边导航组件（side-navigation）的模板开始（`src/platform/kbn-ui/side-navigation/packaging/webpack.config.js`）。进行定制修改：
- **`externals`**：每个同辈依赖（peer dep）对应一个条目 — `'@pkg/name': 'commonjs @pkg/name'`
- **`alias`**：每个被插桩的 `@kbn/*` 包对应一个条目，例如：
  ```js
  '@kbn/i18n$': path.resolve(__dirname, 'react/services/i18n.tsx'),
  ```

#### `packaging/tsconfig.json`

从侧边导航组件的模板开始。更新 `paths` 以匹配 alias 映射关系：
```json
{
  "paths": {
    "@kbn/some-dep": ["./react/services/some-dep.ts"]
  }
}
```
更新 `include`，使其覆盖相对于新包根目录的 `../src/**/*.ts(x)`。

#### `packaging/scripts/build.sh`

完整拷贝 `src/platform/kbn-ui/side-navigation/packaging/scripts/build.sh`。仅将顶部的注释行更新为引用 `{packageName}`。路径解析是完全相对且通用的 — 无需其他修改。

#### `packaging/react/index.tsx`

在适合发布的名称别名下重新导出主组件。始终从 `../../src/` 导入 — 绝不从原始源目录名称导入。根据第二阶段中对 `index.ts` 的分析，派生出组件名称、props 类型以及所有重新导出的类型：

```tsx
/*
 * [Elastic 许可证头部]
 */

// 构建时的类型校验
import './type_validation';

import React from 'react';
import { {SourceComponent}, type {SourceComponentProps} } from '../../src/{path-to-component}';
export type { /* 来自 ../../index.ts 的所有公共类型 */ };

void React;

/** 外部发布包的别名 */
export type {ExportedComponentName}Props = {SourceComponentProps};

export const {ExportedComponentName} = (props: {ExportedComponentName}Props) => {
  return <{SourceComponent} {...props} />;
};
```

#### `packaging/react/types.ts`

编写独立的内联类型定义（不包含 `@kbn/*` 或 `@elastic/eui` 的导入）：
- 镜像 `index.ts` 中每个导出的类型。
- 将复杂的 EUI 类型（例如 `IconType`）替换为 `string`。
- 所有类型必须是自包含的，仅允许 `import type * as React from 'react'`。
- 以 `export declare function {ExportedComponentName}(props: ...): React.ReactNode;` 结尾。

#### `packaging/react/type_validation.ts`

严格遵循侧边导航组件（side-navigation）的模式：
- 使用 `Source` 前缀导入源类型，使用 `Packaged` 前缀导入打包后的类型。
- 结构化赋值检查：`const _foo: PackagedType = {} as SourceType;`。
- 针对有意的简化（例如 `IconType` → `string`），添加 `@ts-expect-error`。
- 导出 `export const TYPE_VALIDATION_PASSED = true;`。

### 4e. 创建 packaging/example/ 脚手架

```bash
mkdir -p src/platform/kbn-ui/{folderName}/packaging/example/src
mkdir -p src/platform/kbn-ui/{folderName}/packaging/example/public
```

该示例是一个最小的可运行应用，它从 `../../target`（构建生成的包）进行导入，以便消费者无需完成完整的 Kibana 设置便能看到该组件在实际运行中的效果。

**`packaging/example/package.json`** — 替换 `{folderName}`：
```json
{
  "name": "{folderName}-example",
  "version": "1.0.0",
  "private": true,
  "license": "SEE LICENSE IN LICENSE.txt",
  "description": "展示 {ExportedComponentName} 用法的示例应用。使用来自 Kibana 根目录的依赖项。",
  "scripts": {
    "start": "./start.sh"
  }
}
```

**`packaging/example/tsconfig.json`** — 完整拷贝自侧边导航组件（它是完全通用的）。

**`packaging/example/webpack.config.js`** — 拷贝自侧边导航组件，仅更新别名：
```js
alias: {
  '{packageName}': path.resolve(__dirname, '../../target'),
},
```

**`packaging/example/start.sh`** — 完整拷贝自侧边导航组件（完全相对路径，无需任何替换）。

**`packaging/example/public/index.html`** — 拷贝自侧边导航组件，仅将 `<title>` 更新为 `{ExportedComponentName} Example`。

**`packaging/example/src/index.tsx`** — 完整拷贝自侧边导航组件（通用的 React 引导程序）。

**`packaging/example/src/app.tsx`** — 根据组件的公共 API 生成一个最小的可运行 Demo（源自步骤 4d 中的 `packaging/react/types.ts`）：
- 裹在 `EuiProvider` 内部。
- 从 `'{packageName}'` 导入组件及其所需的类型（webpack 别名会解析到 `../../target`）。
- 使用合理且最小化的值初始化必需的 props。
- 结合 `useState` 绑定任何回调 props（例如 `onChange`、`onItemClick`）并显示其当前值。
- 添加一个 `<EuiText>` 代码块，列出与该组件相关的各个手动测试用例。

**`packaging/example/README.md`** — 拷贝自侧边导航组件，并替换其中的 `{packageName}` 和 `{folderName}`。

### 4f. 生成 @kbn/* 服务桩文件 (service stubs)

针对第二阶段中确定的每个需要插桩的 `@kbn/*` 包：

**已知桩文件 (Known stubs)** — 直接拷贝自侧边导航组件（side-navigation）：
- `@kbn/i18n` 与 `@kbn/i18n-react` → 完整拷贝 `src/platform/kbn-ui/side-navigation/packaging/react/services/i18n.tsx`。

**未知桩文件 (Unknown stubs)** — 针对每个不熟悉的 `@kbn/*` 包：
1. 寻找并阅读其 `index.ts`（在 `src/platform/packages/` 下搜索）以列出具名导出符号。
2. 创建 `packaging/react/services/{package-slug}.ts` 文件：
   - 函数 → `export const fnName = (..._args: unknown[]) => undefined as unknown as ReturnType;`
   - 字符串常量 → `export const CONST_NAME = '';`
   - 数值常量 → `export const CONST_NAME = 0;`
   - 布尔常量 → `export const CONST_NAME = false;`
   - 对象/数组常量 → `export const CONST_NAME = {};` / `[]`
   - 类 (Classes) → 提供带有构造函数和必需公共方法的最小桩实现。
   - 类型/接口 (Types/interfaces) → 跳过（仅编译时有效，无运行时表示）。
3. 顶部注释：`// Stub for @kbn/{name} — no-op implementation for standalone bundle`。

### 4g. 更新所有 Kibana 导入路径

查找并更新每个导入旧包名称的文件：

```bash
# 收集受影响的文件
grep -rl "from '${oldName}'" src/ x-pack/ packages/ --include="*.ts" --include="*.tsx"

# 替换静态导入
find src/ x-pack/ packages/ -name "*.ts" -o -name "*.tsx" | \
  xargs grep -l "from '${oldName}'" | \
  xargs sed -i "s|from '${oldName}'|from '${packageName}'|g"

# 替换动态导入
find src/ x-pack/ packages/ -name "*.ts" -o -name "*.tsx" | \
  xargs grep -l "import('${oldName}')" | \
  xargs sed -i "s|import('${oldName}')|import('${packageName}')|g"
```

同时更新 `tsconfig.json` 文件中的 `kbn_references`：
```bash
grep -rl '"${oldName}"' src/ x-pack/ packages/ --include="tsconfig.json" | \
  xargs sed -i "s|\"${oldName}\"|\"${packageName}\"|g"
```

### 4h. 验证旧位置已被清除

```bash
ls {sourcePath} 2>/dev/null && echo "ERROR: old path still exists" || echo "OK: old path removed"
```

检查是否还残留有指向旧路径的 tsconfig.json 复合项目引用（composite project references）：
```bash
grep -rl '{sourcePath}' . --include="tsconfig.json" | head -5
```
移除发现的所有过期无效引用。

提醒工程师：
- **审查 `packaging/react/types.ts`** — EUI 或复杂类型的简化处理需要进行人工验证。
- **审查生成的服务桩文件** — 确认空操作（no-op）的默认值在消费端上下文中是安全的。
- **检查 BUILD.md 和 I18N.md** — 如果该发布包需要，请从侧边导航组件中拷贝作为参考。
- **在合并之前，先在消费端应用（如 Cloud UI）中测试生成的 `.tgz` 包**。