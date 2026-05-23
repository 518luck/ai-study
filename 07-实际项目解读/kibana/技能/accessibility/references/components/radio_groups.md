# EUI 单选框组：`EuiRadio` 与 `EuiRadioGroup`

**适用于：** `EuiRadio`、`EuiRadioGroup`

单选按钮在**无障碍树（accessibility tree）**中是通过共享相同的 **`name`** 属性值来进行分组的。如果缺失了 `name`，浏览器和辅助技术就无法将这些选项视为互斥的单选集合。

## 标准用法 (Canonical usage)

- 每一个 **`EuiRadio`** 和 **`EuiRadioGroup`** 实例都**必须设置 `name` 属性**。
- 归属于同一个单选集合的选项，必须共享**相同**的 `name` 值；而在同一页面中属于不同业务集合的单选组，则必须使用**不同**的 `name` 值。
- `name` 属性是**编程式的标识符** — **切勿**对其包裹 `i18n` 翻译（参见 **`../shared_principles.md`** 中的 *国际化 (i18n)* 规范）。页面上可见的 **`label`** 文本在新增或修改时，**必须**使用 `i18n.translate` 进行翻译。
- 命名规则：根据表单字段、模块板块或状态名称采用 **`camelCase`** 格式进行命名（如 `paymentMethod`、`alertSeverity`）。避免使用 `radio1`、`group1` 或 `options` 这种无意义名称。如果业务上下文确实完全无法确定，退而求其次也可以使用 `optionGroup` — 这依然优于不设置 `name`。
- 如果组件使用了属性展开 `{...groupProps}`，请在添加新属性前先验证被展开的属性对象中是否已包含 `name`。

## 代码示例 (Examples)

```tsx
<EuiRadio
  name="paymentMethod"
  label={i18n.translate('payment.creditCard', { defaultMessage: 'Credit Card' })}
  checked={selected === 'credit'}
  onChange={setSelected}
/>
```

```tsx
<EuiRadioGroup
  name="alertSeverity"
  options={severityOptions}
  idSelected={selectedId}
  onChange={onSeverityChange}
/>
```

## 常见错误 (Common mistakes)

```tsx
// 错误案例 — 辅助技术无法将这些单选框识别为同一组
<EuiRadio label="Option A" checked={selected === 'a'} onChange={onChange} />

// 正确案例
<EuiRadio name="myChoice" label="Option A" checked={selected === 'a'} onChange={onChange} />

// 错误案例 — name 属性是程序内部使用的，不是用户可见的，不应使用翻译
<EuiRadio name={i18n.translate('x.name', { defaultMessage: 'paymentMethod' })} />

// 正确案例
<EuiRadio name="paymentMethod" />
```
