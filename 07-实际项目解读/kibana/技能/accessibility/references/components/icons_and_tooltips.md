# EUI 图标与图标提示：`EuiIcon`、`EuiIconTip` 与 `EuiToolTip`

**适用于：** `EuiIcon`、`EuiIconTip`、`EuiToolTip`

每个 `EuiIcon` **要么是装饰性的，要么是具有实际含义的** — 请选择其中一种并进行相应配置。当工具提示（tooltip）仅包裹单个图标时，官方标准组件应使用 `EuiIconTip`。

## 场景选择指南 (When to use which)

- **仅使用 `EuiIcon`** — 适用于装饰性场景（其含义已由邻近的可见文本重复表达），或具有独立无障碍名称的实际含义场景。
- **使用 `EuiIconTip`** — 图标需要工具提示（帮助、提示、提示信息）。相较于 `EuiToolTip` + `EuiIcon`，该单一组件具有更清晰的语义和更好的默认设置。
- **使用 `EuiToolTip` + `EuiIcon`** — 仅在 `EuiIconTip` 无法满足需求时使用：如存在多个工具提示子元素、子元素具有 `EuiIconTip` 不支持的 `onClick` 或其他事件处理器，或者工具提示使用了 `EuiIconTip` 无法接收的 props。否则，均应迁移至 `EuiIconTip`。

## 标准用法 (Canonical usage)

- **装饰性图标** → 设置 **`aria-hidden={true}`**。**切勿**将 `aria-hidden` 与 `tabIndex` 结合使用；因为可聚焦的节点必须是能够被感知的。
- **具义性图标** → 给图标指定一个**无障碍名称**（`aria-label` 或 `aria-labelledby`）。请参阅 **`../shared_principles.md`** 中的 *无障碍命名*、*国际化 (i18n)* 和 *HTML ID* 规范。
- **`title` 不能作为替代属性。** 原生浏览器工具提示仅对内置的图标类型生效 — **对于作为 `type` 传入的 SVG React 组件并不支持**。
- **迁移至 `EuiIconTip`** — 移动受支持的 props（`content`、`position`、`delay`、`title`、`id`、`aria-label`、`data-test-subj`、以及图标的 `type` / `color` / `size`）。但**不要**将 `tabIndex` 迁移过去。

## 代码示例 (Examples)

```tsx
<EuiIcon
  type="warning"
  color="danger"
  aria-label={i18n.translate('myFeature.warningIcon', {
    defaultMessage: 'Warning',
  })}
/>

<EuiFlexItem>
  <EuiIcon type="check" color="success" aria-hidden={true} />
  <span>Completed</span>
</EuiFlexItem>

<EuiIconTip
  content={i18n.translate('myFeature.helpTip', { defaultMessage: 'Help info' })}
  position="right"
  type="questionInCircle"
  aria-label={i18n.translate('myFeature.helpAria', { defaultMessage: 'Help' })}
/>
```

## 常见错误 (Common mistakes)

```tsx
// 错误案例 — 具有实际含义的图标没有设置无障碍名称
<EuiIcon type="warning" color="danger" />

// 错误案例 — 可聚焦但被辅助技术屏蔽
<EuiIcon type="help" tabIndex={0} aria-hidden={true} />

// 错误案例 — 对于单个图标使用了冗余的包装
<EuiToolTip content="Help">
  <EuiIcon type="questionInCircle" />
</EuiToolTip>

// 正确案例
<EuiIconTip content="Help" type="questionInCircle" />
```
