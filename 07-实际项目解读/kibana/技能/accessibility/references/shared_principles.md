# 通用原则（无障碍）

这些通用原则适用于 Kibana 中的每一项无障碍（accessibility）决策 — 无论是在**编写新代码**、**重构**，还是在**修复 Lint 错误**时。在 `components/` 目录下提供的具体组件指南都是本文档在特定组件上的延伸与细化。

**冲突时的优先级：**

1. 任务特定的用户指令或系统指令
2. 本文档
3. 组件指南（`components/*.md`）或 ESLint 规则表（`eslint.md`）

## 标准 (Standards)

- 必须达到 **WCAG 2.2 AA** 级别要求。
- 对于控件模式，请遵循 [WAI-ARIA 无障碍技术最佳实践指南 (APG)](https://www.w3.org/WAI/ARIA/apg/)。
- 优先使用 EUI 组件，而非原生 HTML — EUI 组件开箱即用地处理了 ARIA 属性、焦点管理和键盘交互。只有在不存在合适的 EUI 组件时，才考虑使用原生 HTML。
- 优先使用语义化 HTML，而非 ARIA 属性 — 只有在原生语义不足以表达时，才添加 ARIA 属性。

## 开发决策顺序 (Authoring decision order)

无论是编写新组件还是修改既有代码，都请遵循自上而下的决策顺序，并在遇到第一个能解决需求的层级时停止：

1. **语义（Semantics）。** 选择正确的 HTML 元素或 EUI 组件，并充分利用其内置属性（如 `label`、`htmlFor`、`aria-label`、`aria-labelledby`、`aria-describedby`、以及 `roles` 角色属性）。
2. **结构绑定（Structural wiring）。** 通过静态且稳定的 ID（`id` + `aria-labelledby`）将页面可见文本与控件进行关联，而不是将字符串重复拷贝到隐藏的 label 标签中。
3. **行为（Behavior）。** 仅在语义已经完全正确的前提下，才对键盘交互或焦点行为进行微调。
4. **生命周期 Hook 兜底。** 使用 `useEffect` 来处理焦点切换或状态播报是最后的手段 — 只有在没有声明式替代方案时才可使用。

## 无障碍命名 (Accessible naming)

- 每一个交互式元素都必须有一个无障碍名称 — 包含按钮、链接、输入框、选择器以及自定义控件。
- 优先选择**可见文本**（标签、标题、按钮上的文本）来作为无障碍名称；使用 **`aria-labelledby`** 结合稳定的 ID 与之绑定，而不是直接将文本拷贝到 **`aria-label`** 中。
- 每个控件**必须且只能**使用一种命名机制 — 绝不能同时设置 **`aria-label`** 和 **`aria-labelledby`**。
- 切勿移除 `title`、`alt`、`aria-label` 或 `aria-labelledby` 属性，除非使用更好的替代属性进行替换。
- 传达意义的图片必须配置 `alt` 属性；装饰性图片必须设置 `alt=""` 或 `aria-hidden="true"`。

## 国际化 (i18n)

所有对用户可见的文本以及辅助技术文本（`aria-label`、`tableCaption`、tooltip 的 `content`、`label`、`title`、错误提示、正文文案等）都**必须进行国际化** — 严禁使用硬编码的字符串字面量。而程序内部使用的标识符（如单选框的 `name` 属性、内部 ID）则保持普通字符串。

关于 i18n API、消息 ID 命名规范及校验规则，请遵循 **kibana-i18n** 技能。本技能中的组件指南和示例均假定遵循该规范。

当文件中已经导出了共享文本对象（例如 `i18nTexts.modalTitle`）时，在新增文本时请遵循这一局部约定，而不是在行内直接添加 `i18n.translate` 调用。

## HTML ID (HTML ids)

对于任何 `id` / `aria-labelledby` / `titleProps.id` 的绑定关联，必须使用 EUI 的 ID 生成器。调用一次并将返回值存储在一个具有描述性的变量中（例如 `modalTitleId`、`fieldLabelId`）；当现有 ID 变量已经指向同一个元素时，应直接复用该 ID 变量。

函数组件 — 使用来自 `@elastic/eui` 的 `useGeneratedHtmlId`，在第一个 `return` 语句前进行调用：

```tsx
import { useGeneratedHtmlId } from '@elastic/eui';

const labelId = useGeneratedHtmlId();
```

类组件 — 使用来自 `@elastic/eui` 的 `htmlIdGenerator`，在 `render()` 内部调用并传入一个稳定的后缀：

```tsx
import { htmlIdGenerator } from '@elastic/eui';

render() {
  const labelId = htmlIdGenerator()('myLabel');
}
```

## 键盘与焦点 (Keyboard and focus)

- 每一个交互式元素都必须仅凭键盘即可到达且能够正常操作。
- 优先选择原生可聚焦元素（`<button>`、`<a>`、`<input>`），而非 `div` + `onClick` + `tabIndex`。
- 切勿移除或隐藏可见的焦点指示器（focus ring 焦点环）。
- 焦点顺序必须符合逻辑上的阅读顺序。
- 模态框和侧滑抽屉必须捕获焦点（防逃逸），并在关闭时将焦点归还给触发器。
- 自定义键盘快捷键绝不能与浏览器或屏幕阅读器（读屏软件）的默认快捷键冲突。

## 最小且确定性的改动 (Minimal, deterministic changes)

- 仅应用符合标准模式 the canonical pattern 的最小改动。
- 拒绝任何无关的重构、布局调整、逻辑变动，或是修改开源许可证头（license headers）。
- 严格保留已有的行为和代码设计意图。
- 相同的代码形态 → 带来相同的输出结果（拒绝主观层面的样式微调）。

## 类型安全 (Type safety)

- 严禁拓宽类型（例如将具体的 `string` 拓宽为 `any`），严禁使用注释压制错误（如 `@ts-ignore` 或使用 `as any`）。
- 新增的 props 必须与组件的类型定义保持匹配。

## 何时需要上报 (When to escalate)

在遇到以下情况时，请停下来并标记交由人工审查：

- **属性展开隐藏了 DOM 关联。** 组件使用了 `{...props}`，且您无法追溯 `aria-labelledby`、`aria-label`、`name` 等属性是否已被提供。
- **不存在可见标题**，且添加标题会改动 UX 交互或页面布局 — 这需要设计师或产品经理（PM）的介入。
- **需求冲突**且无法进行清晰的权衡（例如：添加 `aria-label` 会重复播报 `title`，但移除 `title` 又会破坏该组件的另一个使用者）。
- **意图不明。** 您无法从周围的代码中判断出标签（label）、表格标题（caption）或无障碍名称是否准确描述了该元素的真实意图。

## 改动边界 (Change boundaries)

- 请勿在修改的代码行后添加旁白性注释；除非指南中明确指出，否则不要删除既有注释。
- 如果由于 DOM 的结构改变导致测试断言失败，请**仅**更新该测试断言 — 绝对不要删除或跳过（skip）该测试用例。
