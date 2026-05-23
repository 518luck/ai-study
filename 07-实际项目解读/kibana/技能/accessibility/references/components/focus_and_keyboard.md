# EUI 焦点与键盘交互：交互式控件与工具提示锚点

**适用于：** `EuiButton`、`EuiButtonIcon`、`EuiLink`、`EuiToolTip`

内置的交互式 EUI 控件会自动参与**顺序焦点导航**（WCAG 2.1.1） — 请勿手动干预 `tabIndex`。对于 `EuiToolTip` 的非交互式子元素，需要显式设置一个 Tab 停靠点，以便使用键盘的用户能够触发并显示工具提示（tooltip）。

## 标准用法 (Canonical usage)

- **交互式 EUI 控件**（`EuiButton`、`EuiButtonIcon`、`EuiLink`、选项卡等） — **切勿设置 `tabIndex={-1}`**。如需有条件地禁用控件，请使用 **`disabled`** 属性或条件渲染。只有在组件显式支持且有相关文档记录的模式下（例如：巡回 Tab 键顺序 / roving tabindex），才允许设置 `tabIndex`。
- **`EuiToolTip` 锚点** — 它的**直接子元素**即为键盘触发锚点：
  - 如果子元素本身已是交互式的（如 `EuiButton`、`EuiButtonIcon`、`EuiLink`，或者任何带有 `tabIndex` / `href` / `onClick` 的元素） → 保持原样即可。
  - 如果子元素是非交互式的（如 `EuiText`、`EuiImage`、不带 `onClick` 的 `EuiBadge`、普通的 `span`、`EuiIcon`、`EuiHealth`、`EuiAvatar` 等） → 必须添加 **`tabIndex={0}`**。
- 工具提示的 **`content`** 以及任何新的无障碍名称，均必须使用 **`i18n.translate`** 包装（参见 **`../shared_principles.md`** 中的 *国际化 (i18n)* 规范）。

## 代码示例 (Examples)

```tsx
<EuiButton disabled={isDisabled} onClick={onSave}>
  Save
</EuiButton>

<EuiToolTip
  content={i18n.translate('myView.infoTooltip', { defaultMessage: 'Info' })}
>
  <EuiText tabIndex={0}>Read only</EuiText>
</EuiToolTip>
```

## 常见错误 (Common mistakes)

```tsx
// 错误案例 — 将按钮从 Tab 键顺序中移除
<EuiButton tabIndex={-1} onClick={onSave}>Save</EuiButton>

// 错误案例 — 键盘用户无法到达该工具提示
<EuiToolTip content="Details">
  <EuiIcon type="iInCircle" />
</EuiToolTip>

// 正确案例
<EuiToolTip content="Details">
  <EuiIcon type="iInCircle" tabIndex={0} />
</EuiToolTip>
```
