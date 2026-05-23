# EUI 数据表格：`EuiBasicTable` 与 `EuiInMemoryTable`

**适用于：** `EuiBasicTable`、`EuiInMemoryTable`

数据表格需要向辅助技术（如读屏软件）暴露一个 **caption（表格标题）**，以便用户能够理解当前网格所代表的含义（这与页面的 `<title>` 是不同的）。EUI 将此属性公开为 **`tableCaption`**。

## 标准用法 (Canonical usage)

- 每个表格实例**必须且只能**传入一个 **`tableCaption`**。
- 表格标题的文本**应明确描述数据集或任务** — 例如“此空间中的用户账号”，而不是宽泛的“表格”或“Table”。
- 如果表格附近已有可见的文本为该表格命名，您的 caption 措辞可以与其保持一致；否则，请使用 **`i18n.translate`** 来包装新的字符串（参见 **`../shared_principles.md`** 中的 *国际化 (i18n)* 规范）。
- 如果 **`tableCaption`** 是通过属性展开（**`{...tableProps}`**）提供的，请在**数据源头**对其进行修复，或在调用处显式合并 — 绝不能产生冲突的重复 caption。

## 代码示例 (Examples)

```tsx
<EuiBasicTable
  tableCaption={i18n.translate('usersList.tableCaption', {
    defaultMessage: 'User accounts list',
  })}
  items={items}
  columns={columns}
/>
```

## 常见错误 (Common mistakes)

```tsx
// 错误案例 — 缺失 caption
<EuiBasicTable items={items} columns={columns} />

// 错误案例 — 使用了无意义的宽泛 caption
<EuiBasicTable tableCaption="Table" items={items} columns={columns} />
```
