# EUI 交互式组件：无障碍名称

**适用于：** `EuiBetaBadge`、`EuiButtonIcon`、`EuiComboBox`、`EuiSelect`、`EuiSuperSelect`、`EuiPagination`、`EuiTreeView`、`EuiBreadcrumbs`

这些控件会被渲染为交互式元素（按钮、列表框、分页器等）。每一个控件都需要一个**无障碍名称（accessible name）**。关于通用命名规则，请阅读 **`../shared_principles.md`** 中的 *无障碍命名* 规范；本指南补充了特定组件的注意事项。

## 标准用法 (Canonical usage)

按照以下命名层级进行选择，并在遇到第一个合适的选项时停止：

1. 如果已有的 `aria-label` 或 `aria-labelledby` 正确无误 → 保持原样即可。
2. **存在可见标签**（`EuiFormLabel`、`EuiTitle`、`<label>` 标签或邻近的标题） → 使用 **`aria-labelledby`** 将其与一个静态/稳定的 `id` 进行关联绑定（参见 **`../shared_principles.md`** 中的 *HTML ID* 规范）。请勿在 `aria-label` 中重复写入相同的文本。
3. **不存在可见标签** → 使用 **`aria-label={i18n.translate(...)}`**。

每个控件**必须且只能**使用一种命名机制 — 绝不能同时使用 `aria-label` 和 `aria-labelledby`。

- **`EuiFormRow`** 已经自动为其直接子元素命了名 — **切勿**为放置在 `EuiFormRow` 内部 of 的子控件重复添加多余 of 的 `aria-*` 属性（此处可能语义略有歧义，译者注：指嵌套在表单行内部的表单域控件无需重复命名）。
- 当 **`EuiToolTip`** 包裹了 **`EuiButtonIcon`** 且工具提示内容与其文字一致时，请参阅 **`tooltip_icon.md`** 中的规范以避免读屏软件重复输出。

## 代码示例 (Examples)

```tsx
const fieldLabelId = useGeneratedHtmlId();

<EuiFormLabel id={fieldLabelId}>
  Field (using {bucketAggType} buckets)
</EuiFormLabel>
<EuiComboBox aria-labelledby={fieldLabelId} {...rest} />

<EuiSuperSelect
  aria-label={i18n.translate('myView.options.ariaLabel', {
    defaultMessage: 'Fancy options',
  })}
/>

<EuiPagination
  aria-label={i18n.translate('results.pagination', {
    defaultMessage: 'Results pagination',
  })}
  pageCount={pageCount}
  activePage={activePage}
  onPageClick={onPageClick}
/>
```

## 常见错误 (Common mistakes)

```tsx
// 错误案例 — 在同一个控件上使用了两种命名机制
<EuiSelect aria-label="Format" aria-labelledby={labelId} />

// 正确案例 — 在存在可见标签时，优先使用 aria-labelledby
<EuiSelect aria-labelledby={labelId} />

// 错误案例 — EuiFormRow 已经自动提供了无障碍名称，此处配置重复
<EuiFormRow label="Email">
  <EuiFieldText aria-label="Email" />
</EuiFormRow>

// 正确案例
<EuiFormRow label="Email">
  <EuiFieldText />
</EuiFormRow>
```
