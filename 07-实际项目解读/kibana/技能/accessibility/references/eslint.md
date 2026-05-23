# `@elastic/eui` 无障碍 ESLint 规则

辅助路径：当您从某个特定的规则 ID 开始排查时，可以直接跳转到解释了该模式的**标准组件指南**。请首先阅读 **`shared_principles.md`**；“手动审查注意事项”一列列出了规则无法自动修复的代码形态。

| 规则 ID (Rule id) | 组件指南 (Component guide) | 手动审查注意事项 (Manual review) |
|---|---|---|
| `@elastic/eui/accessible-interactive-element` | [`components/focus_and_keyboard.md`](components/focus_and_keyboard.md) | 仅在使用 `{...props}` 展开或高阶组件（HOC）时检查 `tabIndex`；请勿重新设计已有的巡回 Tab 键顺序（roving tabindex）。 |
| `@elastic/eui/badge-accessibility-rules` | [`components/interactive_components.md`](components/interactive_components.md) | 作为 `EuiFormRow` 直接子元素时（表单行会自动提供无障碍名称）；以及使用了包含未知 `aria-*` 属性的 `{...props}`。 |
| `@elastic/eui/callout-announce-on-mount` | [`components/callouts.md`](components/callouts.md) | 在 `EuiCallOut` 上使用 `{...props}` 且缺少显式 `announceOnMount`；或是始终挂载的静态提示框（该规则不应被触发）。 |
| `@elastic/eui/consistent-is-invalid-props` | [`components/form_layout.md`](components/form_layout.md) | 嵌套的 `EuiFormRow`（优先同步最内层父子组件对）；子组件使用了 `{...fieldProps}` — 请先确认 `isInvalid` 属性是否已经存在于被展开的属性对象中。 |
| `@elastic/eui/icon-accessibility-rules` | [`components/icons_and_tooltips.md`](components/icons_and_tooltips.md) | 传入的 `{...iconProps}` 中可能已经包含 a11y 相关属性。 |
| `@elastic/eui/no-unnamed-interactive-element` | [`components/interactive_components.md`](components/interactive_components.md) | 作为 `EuiFormRow` 直接子元素时（表单行会自动提供无障碍名称）；以及使用了包含未知 `aria-*` 属性的 `{...props}`。 |
| `@elastic/eui/no-unnamed-radio-group` | [`components/radio_groups.md`](components/radio_groups.md) | 使用了 `{...groupProps}` — 请先确认 `name` 属性是否已经存在于被展开的属性对象中。 |
| `@elastic/eui/prefer-eui-icon-tip` | [`components/icons_and_tooltips.md`](components/icons_and_tooltips.md) | 子元素不是单 `EuiIcon` 图标；或图标拥有 `onClick` 事件处理器/其他不支持的 props — 此时应跳过或进行上报。 |
| `@elastic/eui/require-aria-label-for-modals` | [`components/overlays.md`](components/overlays.md) | 属性展开 `{...props}` 隐藏了 DOM 关联；或是无需改变 UX 交互便没有可见标题的场景 — 此时应进行上报。 |
| `@elastic/eui/require-table-caption` | [`components/data_tables.md`](components/data_tables.md) | `tableCaption` 仅通过 `{...tableProps}` 提供时 — 需在数据源头修复它；绝不出现冲突的重复 caption。 |
| `@elastic/eui/sr-output-disabled-tooltip` | [`components/tooltip_icon.md`](components/tooltip_icon.md) | `EuiToolTip` 的 props 来源于属性展开；或其子元素不是 `EuiButtonIcon`。 |
| `@elastic/eui/tooltip-focusable-anchor` | [`components/focus_and_keyboard.md`](components/focus_and_keyboard.md) | 使用了 `{...anchorProps}` 或未知的自定义锚点。 |
