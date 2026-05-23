# EUI 表单布局：`EuiFormRow` 与无效状态 (invalid state)

**适用于：** `EuiFormRow`、`EuiFieldText`、`EuiFieldNumber`、`EuiFilePicker`、`EuiComboBox`、`EuiTextArea`、`EuiSelect`

`EuiFormRow` 将 **label（标签）**、**hints（提示）** 和 **error（错误信息）** 与其子控件进行关联。只有当**子控件的 `isInvalid`** 属性与**父级表单行（row）的 `isInvalid`** 属性保持一致时，辅助技术和视觉上的错误样式才能保持正常且一致。

## 标准用法 (Canonical usage)

- 当 **`EuiFormRow`** 具有 **`isInvalid={…}`** 属性时，其**直接子元素**也必须使用**相同的表达式**设置 **`isInvalid`**。
- 如果表单行（row）没有设置 **`isInvalid`** → 则子控件同样不需要设置。
- 常见的子控件包括：`EuiFieldText`、`EuiFieldNumber`、`EuiFilePicker`、`EuiComboBox`、`EuiTextArea`、`EuiSelect`、`EuiFormControlLayoutDelimited`、`SingleFieldSelect` 等。
- 对于嵌套的 `EuiFormRow`，请优先同步**最内层**的父子组件对。
- 如果子控件接收了属性展开（**`{...fieldProps}`**），在添加新的属性前，请先确认 `isInvalid` 是否已经存在于被展开的属性对象中。
- **`isInvalid`** 接收的是布尔值 — **不需要对其进行国际化（i18n）**。当添加或修改页面可见的 **`label`** / **`error`** 文本时，才需要使用 `i18n.translate` 进行处理。

## 代码示例 (Examples)

```tsx
<EuiFormRow label="Name" isInvalid={!!errors.name} error={errors.name}>
  <EuiFieldText value={name} onChange={setName} isInvalid={!!errors.name} />
</EuiFormRow>
```

## 常见错误 (Common mistakes)

```tsx
// 错误案例 — 表单行标记了无效，但子输入框没有标记
<EuiFormRow label="Name" isInvalid={!!errors.name} error={errors.name}>
  <EuiFieldText value={name} onChange={setName} />
</EuiFormRow>

// 正确案例 — 双方使用相同的表达式
<EuiFormRow label="Name" isInvalid={!!errors.name} error={errors.name}>
  <EuiFieldText value={name} onChange={setName} isInvalid={!!errors.name} />
</EuiFormRow>
```
