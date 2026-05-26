---
name: design-system
description: Sentry 布局和文本原语使用指南。用于实现 UI 组件、布局或排版时。强制使用核心组件，而不是 styled components。
---

# Sentry 中的布局和文本原语

## 核心原则

**始终使用 `@sentry/scraps` 中的核心组件，而不是用 Emotion 创建 styled components。**

核心组件可在整个代码库中提供一致的样式、响应式设计以及更好的可维护性。

## 组件实现参考

如需查看完整的受支持 props 列表及其类型，请参考实现文件：

- **布局组件**：`/static/app/components/core/layout/`
  - `container.tsx` - 带有所有布局 props 的基础容器
  - `flex.tsx` - Flex 布局原语
  - `grid.tsx` - Grid 布局原语
  - `stack.tsx` - Stack 布局原语（默认列方向的 Flex）
- **排版组件**：`/static/app/components/core/text/`
  - `text.tsx` - 文本原语
  - `heading.tsx` - 标题原语

## 布局原语

> **重要**：`Flex`、`Grid` 和 `Stack` 都扩展自 `Container`。这意味着 **Container 上可用的每个 prop 也都可用于 Flex、Grid 和 Stack**。使用 `<Flex>` 时，你会获得所有 Container props（position、padding、border、overflow 等），再加上 Flex 专属 props。同样的规则也适用于 Grid 和 Stack。

### Container

支持所有常见布局属性的基础布局组件。Flex、Grid 和 Stack 扩展自 Container，并继承它的所有 props。

**关键 Props**（完整列表见 `container.tsx`）：

- `position`: "static" | "relative" | "absolute" | "fixed" | "sticky"
- `padding`, `paddingTop`, `paddingBottom`, `paddingLeft`, `paddingRight`: SpaceSize token
- `margin`, `marginTop` 等：SpaceSize token（已废弃，优先使用 gap）
- `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`
- `border`, `borderTop`, `borderBottom`, `borderLeft`, `borderRight`: BorderVariant token
- `radius`: RadiusSize token
- `overflow`, `overflowX`, `overflowY`: "visible" | "hidden" | "scroll" | "auto"
- `background`: SurfaceVariant（"primary" | "secondary" | "tertiary"）
- `display`: 各种 display 类型
- Flex 项 props：`flex`, `flexGrow`, `flexShrink`, `flexBasis`, `alignSelf`, `order`
- Grid 项 props：`area`, `row`, `column`

```tsx
import { Container } from "@sentry/scraps/layout";

// ❌ Don't create styled components
const Component = styled("div")`
  padding: ${(p) => p.theme.space.md};
  border: 1px solid ${(p) => p.theme.tokens.border.primary};
`;

// ✅ Use Container primitive
<Container padding="md" border="primary">
  Content
</Container>;
```

### Flex

使用 `<Flex>` 创建 flex 布局。它扩展自 `Container`，继承所有 Container props，并额外提供 Flex 专属 props。

**Flex 专属 Props**（完整列表见 `flex.tsx`）：

- `direction`: "row" | "row-reverse" | "column" | "column-reverse"
- `align`: "start" | "end" | "center" | "baseline" | "stretch"
- `justify`: "start" | "end" | "center" | "between" | "around" | "evenly" | "left" | "right"
- `gap`: SpaceSize，或用于行/列间距的 `"${SpaceSize} ${SpaceSize}"`
- `wrap`: "nowrap" | "wrap" | "wrap-reverse"
- `display`: "flex" | "inline-flex" | "none"

**以及所有 Container props**：`position`、`padding`、`margin`、`width`、`height`、`border`、`radius`、`overflow`、`background`、flex/grid 项 props 等更多内容（见上方 Container 部分）。

```tsx
import { Flex } from "@sentry/scraps/layout";

// ❌ Don't create styled components
const Component = styled("div")`
  display: flex;
  flex-direction: column;
  position: relative;
`;

// ✅ Use Flex primitive with props
<Flex direction="column" position="relative" gap="md">
  <Child1 />
  <Child2 />
</Flex>;
```

### Grid

使用 `<Grid>` 创建 grid 布局。它扩展自 `Container`，继承所有 Container props，并额外提供 Grid 专属 props。

**Grid 专属 Props**（完整列表见 `grid.tsx`）：

- `columns`: Grid 模板列（数字或 CSS 值）
- `rows`: Grid 模板行
- `areas`: 命名的 grid 区域
- `gap`: SpaceSize，或用于行/列间距的 `"${SpaceSize} ${SpaceSize}"`
- `align`: "start" | "end" | "center" | "baseline" | "stretch" (align-items)
- `alignContent`: "start" | "end" | "center" | "between" | "around" | "evenly" | "stretch"
- `justify`: "start" | "end" | "center" | "between" | "around" | "evenly" | "stretch" (justify-content)
- `justifyItems`: "start" | "end" | "center" | "stretch"
- `flow`: "row" | "column" | "row dense" | "column dense"
- `autoColumns`, `autoRows`: 自动生成轨道的尺寸

**以及所有 Container props**：`position`、`padding`、`margin`、`width`、`height`、`border`、`radius`、`overflow`、`background`、flex/grid 项 props 等更多内容（见上方 Container 部分）。

```tsx
import { Grid } from "@sentry/scraps/layout";

// ❌ Don't create styled components
const Component = styled("div")`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${(p) => p.theme.space.md};
`;

// ✅ Use Grid primitive
<Grid columns="repeat(3, 1fr)" gap="md">
  <Item1 />
  <Item2 />
  <Item3 />
</Grid>;
```

### Stack

使用 `<Stack>` 创建垂直布局。Stack 本质上是默认带有 `direction="column"` 的 `Flex`。它还提供 `Stack.Separator`，用于在项目之间添加分隔线。

**Props**（完整列表见 `stack.tsx`）：

- 与 Flex props 相同（继承所有 Flex 和 Container props）
- `direction` 默认为 "column"（但可以覆盖）
- `Stack.Separator` 组件用于在 stack 项之间添加分隔线

```tsx
import { Stack } from "@sentry/scraps/layout";

// ❌ Don't create styled components for vertical layouts
const Component = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.space.md};
`;

// ✅ Use Stack primitive (automatically column direction)
<Stack gap="md">
  <Item1 />
  <Item2 />
  <Item3 />
</Stack>;

// ✅ With separators between items
<Stack gap="md">
  <Item1 />
  <Stack.Separator />
  <Item2 />
  <Stack.Separator />
  <Item3 />
</Stack>;

// ✅ Stack supports all Flex and Container props
<Stack gap="md" padding="lg" position="relative" border="primary">
  <Item1 />
  <Item2 />
</Stack>;
```

## 排版原语

### Text

所有文本内容都使用 `<Text>`。不要使用带文本样式的原始 `<p>`、`<span>` 或 `<div>` 元素。

**关键 Props**（完整列表见 `text.tsx`）：

- `as`: "span" | "p" | "label" | "div"（语义化 HTML 元素）
- `size`: TextSize ("xs" | "sm" | "md" | "lg" | "xl" | "2xl")
- `variant`: ContentVariant | "muted"（见下方 Content Variant Tokens）
- `align`: "left" | "center" | "right" | "justify"
- `bold`: boolean
- `italic`: boolean
- `uppercase`: boolean
- `monospace`: boolean
- `tabular`: boolean（等宽数字）
- `ellipsis`: boolean（用省略号截断）
- `wrap`: "nowrap" | "normal" | "pre" | "pre-line" | "pre-wrap"
- `textWrap`: "wrap" | "nowrap" | "balance" | "pretty" | "stable"
- `wordBreak`: "normal" | "break-all" | "keep-all" | "break-word"
- `density`: "compressed" | "comfortable"（line-height）
- `underline`: boolean | "dotted"
- `strikethrough`: boolean

```tsx
import {Text} from '@sentry/scraps/text';

// ❌ Don't create styled text components
const Label = styled('span')`
  color: ${p => p.theme.tokens.content.secondary};
  font-size: ${p => p.theme.font.size.sm};
`;

// ❌ Don't use raw elements
<p>This is a paragraph</p>
<span>Status: Active</span>

// ✅ Use Text primitive with semantic 'as' prop
<Text as="p" variant="muted" density="comfortable">
  This is a paragraph
</Text>
<Text as="span" bold uppercase>
  Status: Active
</Text>
```

### Heading

所有标题都使用 `<Heading>`。不要使用原始 `<h1>`、`<h2>` 等元素。

**关键 Props**（完整列表见 `heading.tsx`）：

- `as`: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"（必需）
- `size`: HeadingSize ("xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl")
- `variant`: 与 Text 相同
- `align`: 与 Text 相同
- `italic`, `monospace`, `tabular`: 与 Text 相同
- `ellipsis`, `wrap`, `textWrap`, `wordBreak`: 与 Text 相同
- `density`: 与 Text 相同
- `underline`, `strikethrough`: 与 Text 相同

注意：Heading 不支持 `bold` 和 `uppercase`（标题始终为粗体）。

```tsx
import {Heading} from '@sentry/scraps/text';

// ❌ Don't style heading elements
const Title = styled('h2')`
  font-size: ${p => p.theme.font.size.md};
  font-weight: bold;
`;

// ❌ Don't use raw heading elements
<h2>My Title</h2>

// ✅ Use Heading primitive with semantic 'as' prop
<Heading as="h2">My Title</Heading>

// ✅ With custom size
<Heading as="h3" size="xl">Large H3</Heading>
```

## 信息组件

> **重要**：始终优先使用 `InfoTip` 和 `InfoText`，而不是原始 `<Tooltip>` 组件。它们为上下文帮助提供了一致且无障碍的模式。

### InfoTip

使用 `<InfoTip>` 在标签或标题旁添加带 tooltip 的信息图标。它支持键盘访问，并为补充性帮助提供一致模式。

```tsx
import {InfoTip} from '@sentry/scraps/info';
import {Flex} from '@sentry/scraps/layout';
import {Text} from '@sentry/scraps/text';

// ❌ Don't use Tooltip with arbitrary icons
<Flex gap="xs" align="center">
  <Text>Retention Period</Text>
  <Tooltip title="The number of days...">
    <IconInfo size="xs" />
  </Tooltip>
</Flex>

// ✅ Use InfoTip for contextual help icons
<Flex gap="xs" align="center">
  <Text>Retention Period</Text>
  <InfoTip title="The number of days event data is stored before being automatically deleted." />
</Flex>
```

**关键 Props**：

- `title`: Tooltip 内容（必需）
- `size`: "xs" | "sm"（默认）| "md"

**使用场景**：

- 为标题或章节标题补充上下文
- 在不添加行内文本的情况下显示补充信息
- 解释设置或配置选项

### InfoText

使用 `<InfoText>` 创建带 tooltip 的行内文本。它会渲染带虚线下划线的文本，并在 hover/focus 时显示 tooltip。

```tsx
import {InfoText} from '@sentry/scraps/info';

// ❌ Don't wrap text with raw Tooltip
<Tooltip title="Time to First Byte measures the time...">
  <span style={{textDecoration: 'underline dotted'}}>TTFB</span>
</Tooltip>

// ✅ Use InfoText for inline explanations
<InfoText title="Time to First Byte measures the time from the request start until the first byte of the response is received.">
  TTFB
</InfoText>
```

**关键 Props**：

- `title`: Tooltip 内容（必需）
- 扩展自 `Text`，因此支持所有 Text props：`size`、`variant`、`bold` 等

```tsx
// With Text styling props
<InfoText title="Small muted text" size="sm" variant="muted">
  Hint text
</InfoText>
<InfoText title="Bold text" bold>
  Important term
</InfoText>
```

**使用场景**：

- 在行内定义技术术语或缩写词
- 在不增加视觉杂乱的情况下提供额外上下文
- 创建一致且无障碍的行内帮助模式

## 创建轻量抽象

> **⚠️ 关键：当目的是对重复 props 进行 DRY（Don't Repeat Yourself，不要重复自己）处理时，在为布局原语（`Container`、`Flex`、`Grid`、`Stack`、`Text`、`Heading`）创建抽象之前，始终必须先提示用户确认。**

你可以基于原语创建轻量抽象，目的是通过有意义的名称（例如 `TableCell` 而不是泛泛的 `Flex`）改善语义结构，并提供一些默认 props。非常重要的是，你应该谨慎这么做，并且只在它确实能提升可读性时这样做。例如，如果重复 props 只有两处实例，而且它们彼此相邻，那么抽象带来的代价会超过简洁性收益。

**创建抽象之前，你必须：**

1. 请求用户确认
2. 说明你计划创建什么抽象
3. 解释为什么该抽象值得增加复杂度
4. 等待明确批准后再继续

```tsx
import {Flex, type FlexProps} from '@sentry/scraps/layout';

// ❌ Don't repeat the same props everywhere
<Flex align="center" gap="xs" flex="1" padding="sm">Content 1</Flex>
<Flex align="center" gap="xs" flex="1" padding="sm">Content 2</Flex>
<Flex align="center" gap="xs" flex="1" padding="sm">Content 3</Flex>
<Flex align="center" gap="xs" flex="1" padding="sm">Content 4</Flex>

// ✅ Create a thin wrapper with default props (AFTER USER CONFIRMATION)
function TableCell(props: FlexProps) {
  return <Flex align="center" gap="md" {...props} />;
}

<TableCell>Content 1</TableCell>
<TableCell>Content 2</TableCell>
<TableCell align="start">Content 3</TableCell>{/* Can override defaults */}
```

**要点：**

- **创建抽象之前始终先提示用户确认**
- 扩展原语的 props 类型（`extends FlexProps`）
- 在 JSX 组件上设置默认值，并展开 `{...props}` 以允许覆盖
- 不要使用 styled components，而是组合原语

## 通用指南

### 1. 使用响应式 Props

大多数 props 支持使用断点键的响应式语法。

```tsx
// ❌ Don't use styled media queries
const Component = styled('div')`
  display: flex;
  flex-direction: column;

  @media screen and (min-width: ${p => p.theme.breakpoints.md}) {
    flex-direction: row;
  }
`;

// ✅ Use responsive prop signature
<Flex direction={{xs: 'column', md: 'row'}}>
```

### 2. 优先使用 Gap/Padding，而不是 Margin

Container 支持 `margin` props，但它们已废弃。请改用父容器上的 `gap`。

```tsx
// ❌ Don't use margin between children
const Child = styled("div")`
  margin-right: ${(p) => p.theme.space.lg};
`;

// ✅ Use gap on parent container
<Flex gap="lg">
  <Child1 />
  <Child2 />
</Flex>;
```

### 3. 将布局与排版拆分

不要在单个 styled component 中耦合布局和排版。使用独立的原语。

```tsx
// ❌ Don't couple layout and typography
const Component = styled("div")`
  display: flex;
  flex-direction: column;
  color: ${(p) => p.theme.tokens.content.secondary};
  font-size: ${(p) => p.theme.font.size.lg};
`;

// ✅ Split into layout and typography primitives
<Flex direction="column">
  <Text variant="muted" size="lg">
    Content
  </Text>
</Flex>;
```

### 4. 查看实现文件以了解所有 Props

实现文件包含完整且最新的受支持 props 列表，以及 TypeScript 类型。拿不准时：

- 阅读 `/static/app/components/core/layout/container.tsx` 了解基础布局 props
- 阅读 `/static/app/components/core/layout/flex.tsx` 了解 Flex 专属 props
- 阅读 `/static/app/components/core/layout/grid.tsx` 了解 Grid 专属 props
- 阅读 `/static/app/components/core/layout/stack.tsx` 了解 Stack 专属 props
- 阅读 `/static/app/components/core/text/text.tsx` 了解 Text props
- 阅读 `/static/app/components/core/text/heading.tsx` 了解 Heading props

## Token 参考

### 间距 Tokens (SpaceSize)

用于 `gap`、`padding`：

- `"0"`, `"2xs"`, `"xs"`, `"sm"`, `"md"`, `"lg"`, `"xl"`, `"2xl"`, `"3xl"`
- 多值：`"md lg"`（垂直 水平）
- 响应式：`{{xs: "sm", md: "lg"}}`

### 边框 Tokens (BorderVariant)

用于 `border` prop：

- `"primary"`, `"muted"`, `"accent"`, `"danger"`, `"promotion"`, `"success"`, `"warning"`

### 圆角 Tokens (RadiusSize)

用于 `radius` prop：

- `"0"`, `"2xs"`, `"xs"`, `"sm"`, `"md"`, `"lg"`, `"xl"`, `"2xl"`, `"full"`

### 文本尺寸 Tokens

- **TextSize**: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
- **HeadingSize**: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"

### 表面变体 Tokens (SurfaceVariant)

用于布局组件上的 `background` prop：

- `"primary"`, `"secondary"`, `"tertiary"`

### 内容变体 Tokens (ContentVariant)

用于 Text 和 Heading 上的 `variant` prop：

- **ContentVariant**: "primary" | "secondary" | "accent" | "danger" | "promotion" | "success" | "warning"
- **再加上 "muted"**：Text 和 Heading 除了 ContentVariant 值外，也接受 "muted"

## 快速参考检查清单

创建 styled component 之前，先问：

- ✅ 我可以使用 `<Flex>`、`<Grid>` 或 `<Stack>` 做布局吗？
- ✅ 我可以使用默认列方向的 `<Stack>` 做垂直布局吗？
- ✅ 我可以使用 `<Container>` 处理边框、padding 或定位吗？
- ✅ 我可以使用 `<Text>` 或 `<Heading>` 做排版吗？
- ✅ 我可以使用 `<InfoTip>` 或 `<InfoText>` 代替 `<Tooltip>` 吗？
- ✅ 我可以使用响应式 props 代替 media queries 吗？
- ✅ 我可以使用 `gap` 代替 `margin` 吗？
- ✅ 原语支持我需要的 prop 吗？（查看实现文件）

如果任一问题的答案是肯定的，**就改用该原语**。
