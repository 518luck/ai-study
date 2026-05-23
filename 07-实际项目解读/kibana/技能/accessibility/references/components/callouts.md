# EUI 提示框：`EuiCallOut` 与 `announceOnMount`

**适用于：** `EuiCallOut`

**有条件显示**（表单校验、异步结果、状态切换、提交后反馈）的提示框，对于辅助技术（如读屏软件）是不可见的，除非您启用 EUI 的 **live-region（活动区域）** 播报行为。

## 标准用法 (Canonical usage)

- **条件渲染**（`condition && <…>`、三元运算符、分支判断、提前返回） → 设置 **`announceOnMount`**，以便在提示框挂载时能对其内容进行无障碍播报。
- **始终挂载的静态提示框** → 省略 **`announceOnMount`**；它不需要配置活动区域（live region）。
- **有条件显示但绝对不能播报**（极少见） → 设置 **`announceOnMount={false}`**，如果原因不明显，请在调用处写明注释进行说明。
- 新的对用户可见的字符串（`title`、正文） → 使用 **`i18n.translate`** 包装（参见 **`../shared_principles.md`** 中的 *国际化 (i18n)* 规范）。

如果 **`EuiCallOut`** 使用了属性展开（**`{...calloutProps}`**），且 **`announceOnMount`** 没有显式写在开始标签上，请在调用处或被展开的属性源对象中合并该属性。

## 代码示例 (Examples)

**条件渲染示例：**

```tsx
{hasError && (
  <EuiCallOut
    announceOnMount
    title={i18n.translate('form.errorTitle', { defaultMessage: 'Error' })}
    color="danger"
  >
    {errorMessage}
  </EuiCallOut>
)}
```

**显式排除播报示例：**

```tsx
{decorativeCondition && (
  <EuiCallOut announceOnMount={false} title="…">
    …
  </EuiCallOut>
)}
```

## 常见错误 (Common mistakes)

```tsx
// 错误案例 — 条件显示的提示框缺失了 announceOnMount
{hasError && <EuiCallOut title="Error" color="danger" />}

// 正确案例
{hasError && <EuiCallOut announceOnMount title="Error" color="danger" />}

// 错误案例 — 在静态提示框上配置了无必要的 announceOnMount
<EuiCallOut announceOnMount title="Note" color="primary" />
```
