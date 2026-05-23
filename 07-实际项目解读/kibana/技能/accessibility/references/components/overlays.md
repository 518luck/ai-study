# EUI 覆盖物：模态框、侧滑抽屉与气泡卡片

**适用于：** `EuiModal`、`EuiFlyout`、`EuiFlyoutResizable`、`EuiConfirmModal`、`EuiPopover`

会捕获（trap）或转移焦点的分层 UI，需要一个**编程式的无障碍名称（programmatic accessible name）**，且该名称必须与可见的标题保持一致。

## 场景选择指南 (When to use which)

- **`EuiModal`** — 用于阻断式的确认框或表单；用户必须在关闭或完成操作后才能继续其他工作。
- **`EuiFlyout` / `EuiFlyoutResizable`** — 非阻断式的详情面板或设置面板，通常与列表或页面的选中项配合使用。
- **`EuiConfirmModal`** — 用于“是/否”或毁灭性的操作；它使用 `title` 属性 API 传入标题。
- **`EuiPopover`** — 上下文菜单、过滤器或较短的锚定内容；它可以有可见的标题，也可以没有。

## 标准用法 (Canonical usage)

优先使用 **`aria-labelledby`** 指向**可见标题**，以便读屏软件播报的名称与视障用户所见的内容完全匹配。

1. 在覆盖物（overlay）内部渲染一个真实的标题元素（如 `EuiModalTitle`、`EuiFlyoutTitle`、`EuiPopoverTitle`、`EuiTitle`，或一个标题标签 `<h1-6>`）。
2. 给该标题元素赋予一个稳定的 **`id`** — 使用 `useGeneratedHtmlId()`（在类组件中使用 `htmlIdGenerator()`），详情请参阅 **`../shared_principles.md`** 中的 *HTML ID* 规范。
3. 将覆盖物容器上的 **`aria-labelledby`** 设置为该 `id`。
4. 将同一个 ID 变量同时赋值给标题和 `aria-labelledby` — 绝对不要遗漏任何一处的引用关联。
5. **`EuiConfirmModal`** 将标题作为一个属性（prop）公开 — 请通过 **`titleProps={{ id }}`** 对其渲染的 DOM 进行绑定，从而让生成的 ID 与 `aria-labelledby` 保持一致。
6. **无合适的可见标题**（在 popover 中较少见） → 则退而求其次，使用 **`aria-label`** 并配合 `i18n.translate` 来命名。

建议的变量命名：`modalTitleId`、`flyoutTitleId`、`confirmModalTitleId`、`popoverTitleId`。

## 代码示例 (Examples)

**`EuiModal` / `EuiFlyout` / `EuiFlyoutResizable` 示例** — 标题元素设置 `id={...TitleId}`，容器设置对应的 `aria-labelledby`：

```tsx
const flyoutTitleId = useGeneratedHtmlId();

<EuiFlyout aria-labelledby={flyoutTitleId}>
  <EuiFlyoutTitle id={flyoutTitleId}>My title</EuiFlyoutTitle>
</EuiFlyout>
```

**`EuiConfirmModal` 示例** — `aria-labelledby` 与匹配的 `titleProps.id`：

```tsx
const confirmModalTitleId = useGeneratedHtmlId();

return (
  <EuiConfirmModal
    aria-labelledby={confirmModalTitleId}
    title={i18nTexts.modalTitle}
    titleProps={{ id: confirmModalTitleId }}
  >
    <p>{i18nTexts.modalDescription}</p>
  </EuiConfirmModal>
);
```

**`EuiPopover` 示例（含可见标题）**：

```tsx
const popoverTitleId = useGeneratedHtmlId();

<EuiPopover aria-labelledby={popoverTitleId}>
  <EuiPopoverTitle>
    <h2 id={popoverTitleId}>Title</h2>
  </EuiPopoverTitle>
</EuiPopover>
```

**`EuiPopover` 示例（不含标题，退而使用 `aria-label`）**：

```tsx
<EuiPopover
  aria-label={i18n.translate('myFeature.filterPopover', {
    defaultMessage: 'Filter options',
  })}
>
  {popoverContent}
</EuiPopover>
```

## 常见错误 (Common mistakes)

```tsx
// 错误案例 — aria-label 属性以不可见字符串的形式重复了已有的可见标题
<EuiModal aria-label="Settings">
  <EuiModalTitle>Settings</EuiModalTitle>
</EuiModal>

// 错误案例 — aria-labelledby 指向了空处（缺少对 titleProps.id 的绑定）
<EuiConfirmModal aria-labelledby={id} title="Delete?" />

// 正确案例
<EuiConfirmModal aria-labelledby={id} title="Delete?" titleProps={{ id }} />
```
