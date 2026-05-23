# EUI 图标按钮上的工具提示 (EUI tooltip on an icon button)

**适用于：** `EuiToolTip`、`EuiButtonIcon`

当 **`EuiToolTip`** 包裹 **`EuiButtonIcon`** 且工具提示的 **`content`** 与按钮的 **`aria-label`** 完全一致时，辅助技术（如读屏软件）可能会将该文本重复播报两次。使用 **`disableScreenReaderOutput`** 属性，可以使工具提示依然对视障用户可见，同时让读屏软件仅对其名称播报一次。

**相关指南：** **`focus_and_keyboard.md`**（工具提示锚点 / `tabIndex`） · **`icons_and_tooltips.md`**（`EuiIconTip` 对比 `EuiToolTip` + `EuiIcon`）。

## 标准用法 (Canonical usage)

- 当 **`content`** 等于 **`aria-label`** 时（相同的字符串、同一个变量、或同一个 `i18n` 翻译调用） → 在 **`EuiToolTip`** 上设置 **`disableScreenReaderOutput`**。
- 当 **`content`** 与 **`aria-label`** 存在差异时 → 不需要设置此属性；两者都将按预期正常播报。
- 当子组件不是 **`EuiButtonIcon`** 时 → 此规则不适用；请检查上方列出的相关指南。

建议为 **`content`** 和 **`aria-label`** 使用同一个 **`i18n.translate`** 调用（相同的 ID 和 `defaultMessage`），以确保两者文本不会产生差异。

在遇到属性展开 `{...tooltipProps}` 时，请在调用处或被展开的属性源对象中合并 **`disableScreenReaderOutput`** 属性。

## 代码示例 (Examples)

```tsx
<EuiToolTip
  content={i18n.translate('filter.add', { defaultMessage: 'Add filter' })}
  disableScreenReaderOutput
>
  <EuiButtonIcon
    iconType="plusInCircle"
    aria-label={i18n.translate('filter.add', { defaultMessage: 'Add filter' })}
    onClick={onAdd}
  />
</EuiToolTip>
```

## 常见错误 (Common mistakes)

```tsx
// 错误案例 — 读屏软件会播报 "Add filter" 两次
<EuiToolTip content={label}>
  <EuiButtonIcon iconType="plusInCircle" aria-label={label} onClick={onAdd} />
</EuiToolTip>

// 正确案例
<EuiToolTip content={label} disableScreenReaderOutput>
  <EuiButtonIcon iconType="plusInCircle" aria-label={label} onClick={onAdd} />
</EuiToolTip>

// 错误案例 — 使用了不同的翻译 ID，导致后续文本可能产生漂移
content={i18n.translate('a.tooltip', { defaultMessage: 'Add' })}
aria-label={i18n.translate('a.button', { defaultMessage: 'Add' })}

// 正确案例 — 相同的 ID 保持它们始终一致
content={i18n.translate('a.add', { defaultMessage: 'Add' })}
aria-label={i18n.translate('a.add', { defaultMessage: 'Add' })}
```
