# 前端开发指南

> 有关关键命令和测试规则，请参见仓库根目录 `/AGENTS.md` 中的“Command Execution Guide”部分。

## 前端技术栈

- **语言**: TypeScript
- **框架**: React 19
- **构建工具**: Rspack（Webpack 替代方案）
- **包管理**: pnpm
- **状态管理**: Reflux、React Query（TanStack Query）
- **样式**: Emotion（CSS-in-JS）、Less
- **测试**: Jest、React Testing Library

## 重要文件和目录

- `package.json`: Node.js 依赖和脚本
- `rspack.config.ts`: 前端构建配置
- `tsconfig.json`: TypeScript 配置
- `eslint.config.ts`: ESLint 配置
- `stylelint.config.js`: CSS/样式 lint 配置
- **组件**: `static/app/components/{component}/`
- **视图**: `static/app/views/{area}/{page}.tsx`
- **Stores**: `static/app/stores/{store}Store.tsx`
- **Actions**: `static/app/actionCreators/{resource}.tsx`
- **工具函数**: `static/app/utils/{utility}.tsx`
- **类型**: `static/app/types/{area}.tsx`
- **API 客户端**: `static/app/api.tsx`

### 路由

- 路由定义在 `static/app/routes.tsx`
- 使用 React Router v6 模式
- 尽可能延迟加载路由组件

### 前端 API 调用

将 `apiOptions` 与 TanStack Query 的 `useQuery` 搭配使用。**不要使用 `useApiQuery`、`getApiQueryData` 或 `setApiQueryData`**，它们已经弃用。

```typescript
import { skipToken, useQuery } from "@tanstack/react-query";
import { apiOptions } from "sentry/utils/api/apiOptions";

// Basic usage
const query = useQuery(
  apiOptions.as<ResponseType>()(
    "/organizations/$organizationIdOrSlug/endpoint/",
    {
      path: { organizationIdOrSlug: organization.slug },
      staleTime: 30_000,
    },
  ),
);

// Conditional fetching — pass skipToken as path to disable the query
const query = useQuery(
  apiOptions.as<ResponseType>()(
    "/organizations/$organizationIdOrSlug/items/$itemId/",
    {
      path: itemId
        ? { organizationIdOrSlug: organization.slug, itemId }
        : skipToken,
      staleTime: 30_000,
    },
  ),
);
```

关键规则：

- **`staleTime` 是必填项**，你必须选择一个值（`0`、以毫秒为单位的数字、`Infinity` 或 `'static'`）。
- **基于 `apiOptions` 构建抽象**，而不是基于 `useQuery`。返回 options 对象，以便调用方可以将其传给 `useQuery`、`useQueries`、`prefetchQuery` 等。
- **缓存存储的是 `{json, headers}`**，而不只是响应体。`apiOptions` 默认使用 `select` 提取 `.json`，但 `getQueryData`、`setQueryData`、`retry` 函数和 `predicate` 回调都会接收原始的 `ApiResponse<T>` 形状。
- **永远不要** 将 `api.requestPromise` 用于 Query，它会返回错误的结构。如果必须手动编写 `queryFn`，请使用 `apiFetch`。

#### 访问响应头（分页、命中数）

默认情况下，`apiOptions` 只会从响应中选择 JSON body。如果需要响应头（例如用于分页的 `Link`，或用于总数的 `X-Hits` / `X-Max-Hits`），请用 `selectJsonWithHeaders` 覆盖 `select`：

```typescript
import { useQuery } from "@tanstack/react-query";
import { apiOptions, selectJsonWithHeaders } from "sentry/utils/api/apiOptions";

const { data } = useQuery({
  ...apiOptions.as<Item[]>()("/organizations/$organizationIdOrSlug/items/", {
    path: { organizationIdOrSlug: organization.slug },
    query: { cursor, per_page: 25 },
    staleTime: 0,
  }),
  select: selectJsonWithHeaders,
});

// data is ApiResponse<Item[]> — an object with `json` and `headers`
const items = data?.json ?? [];
const pageLinks = data?.headers.Link; // string | undefined
const totalHits = data?.headers["X-Hits"]; // number | undefined
const maxHits = data?.headers["X-Max-Hits"]; // number | undefined
```

注意，`X-Hits` 和 `X-Max-Hits` 已经解析为 `number | undefined`，不需要 `parseInt`。

## 通用前端规则

1. 不要新增 Reflux stores
2. 不要使用 class components
3. 不要使用 CSS 文件（使用 [core components](./app/components/core/)，或在边缘情况下使用 Emotion）
4. 始终使用 TypeScript
5. 始终将测试与代码放在一起
6. 延迟加载路由：`React.lazy(() => import('...'))`

## UI 模式

- 实现 Markdown 或 JSON 等高级复制到剪贴板功能时，避免使用单独按钮复制不同格式，优先使用 `sentry/components/copyAsDropdown` 并提供不同的格式选项。

### 通用实践

- 尽可能使用 [core components](./app/components/core/)。只有在边缘情况下才使用 Emotion（styled components）。
- 尽可能使用 Text、Heading、Flex、Grid、Stack、Container 以及其他核心排版/布局组件。
- 尽可能添加 stories（\*.stories.mdx）。
- 图标应该属于 `static/app/icons` 中的图标集，绝不能在应用中的任何位置内联。
- 图片应该放在 `static/app/images` 中，并通过 loader 导入。

### Core components

只要可用，就始终使用 Core components。除非绝对必要，否则避免使用 Emotion（styled components）。

#### 布局

##### Grid

对于需要 grid 布局的元素，使用 `@sentry/scraps/layout` 中的 <Grid>，而不是使用带有 `display: grid` 的 styled components。

```tsx
import { Grid } from "@sentry/scraps/layout";

// ❌ Do not use styled and create a new styled component
const Component = styled("div")`
  display: flex;
  flex-directon: column;
`;

// ✅ Use the Grid layout primitive
<Grid direction="column"></Grid>;
```

##### Flex

对于需要 flex 布局的元素，使用 `@sentry/scraps/layout` 中的 <Flex>，而不是使用带有 `display: flex` 的 styled components。

```tsx
import { Flex } from "@sentry/scraps/layout";

// ❌ Do not use styled and create a new styled component
const Component = styled("div")`
  display: flex;
  flex-directon: column;
`;

// ✅ Use the Flex layout primitive
<Flex direction="column"></Flex>;
```

##### Container

对于需要边框或圆角的简单元素，优先使用 `@sentry/scraps/layout` 中的 <Container>。

```tsx
import { Container } from "@sentry/scraps/layout";

// ❌ Do not use styled and create a new styled component
const Component = styled("div")`
  padding: space(2);
  border: 1px solid ${(p) => p.theme.tokens.border.primary};
`;

// ✅ Use the Container primitive
<Container padding="md" border="primary"></Container>;
```

##### 通用指南

优先使用 props，而不是 `style` 属性。

```tsx
// ❌ Do not use style attribute for supported props
<Flex style={{width: "100%", padding: `${space(1)} ${space(1.5)}`}>

// ✅ Use the supported prop
<Flex width="100%" padding="md lg">
```

对于 Flex、Grid 和 Container，使用响应式 props，而不是 styled media queries。

```tsx
import { Flex } from "@sentry/scraps/layout";

// ❌ Do not use styled and create a new styled component
const Component = styled("div")`
  display: flex;
  flex-directon: column;

  @media screen and (min-width: ${(p) => p.theme.breakpoints.md}) {
    flex-direction: row;
  }
`;

// ✅ Use the responsive prop signature
<Flex direction={{ xs: "column", md: "row" }}></Flex>;
```

优先使用 gap 或 padding，而不是 margin。

```tsx
import { Flex } from "@sentry/scraps/layout";

// ❌ Do not use styled and create a new styled component
const Component = styled("div")`
  display: flex;
  flex-directon: column;
  gap: ${(p) => p.theme.spacing.lg};
`;

// ✅ Use the responsive prop signature
<Flex gap="lg">
  <Child1 />
  <Child2 />
</Flex>;
```

#### 排版

##### Heading

标题应使用 `@sentry/scraps/text` 中的 <Heading>，而不是使用 styled components 设置标题排版样式。

```tsx
import { Heading } from "@sentry/scraps/text";

// ❌ Do not use styled and create a new styled component
const Title = styled("h2")`
  font-size: ${(p) => p.theme.fontSize.md};
  font-weight: bold;
`;

// ✅ Use the Heading typography primitive
<Heading as="h2">Heading</Heading>;
```

不要使用或设置 h1、h2、h3、h4、h5、h6 原生元素的样式。优先使用 <Heading as="h1...h6">title</Heading> 组件。

```tsx
import {Heading} from '@sentry/scraps/text';

// ❌ Do not use styled and create a new styled component
const Title = styled('h4')`
  color: ${p => p.theme.tokens.content.secondary};
  font-size: ${p => p.theme.fontSizes.small};
`;

// ❌ Do not use intrinsic heading elements directly
function Component(){
  return <h4>Title<h4>
}

// ✅ Use the Heading typography primitive
<Heading as="h4">Title</Heading>;

// ✅ Use the Heading typography primitive
function Component(){
  return <Heading as="h4">Title</Heading>
}
```

##### Text

文本样式应使用 `@sentry/scraps/text` 中的 <Text>，而不是使用 styled components 处理 color、overflow、font-size、font-weight 等排版特性。

```tsx
import { Text } from "@sentry/scraps/text";

// ❌ Do not use styled and create a new styled component
const Label = styled("span")`
  color: ${(p) => p.theme.tokens.content.secondary};
  font-size: ${(p) => p.theme.fontSizes.small};
`;

// ✅ Use the Text typography primitive
<Text variant="muted" size="sm">
  Text
</Text>;
```

不要使用或设置原生元素的样式。优先使用 <Text as="p | span | div">text...</Text> 组件。

```tsx
import { Text } from "@sentry/scraps/text";

// ❌ Do not style intrinsic elements directly
const Paragraph = styled("p")`
  color: ${(p) => p.theme.tokens.content.secondary};
  line-height: 1.5;
`;

const Label = styled("span")`
  font-weight: bold;
  text-transform: uppercase;
`;

// ❌ Do not use raw intrinsic elements
function Content() {
  return (
    <div>
      <p>This is a paragraph of content</p>
      <span>Status: Active</span>
      <div>Container content</div>
    </div>
  );
}

// ✅ Use Text component with semantic HTML via 'as' prop
function Content() {
  return (
    <div>
      <Text as="p" variant="muted" density="comfortable">
        This is a paragraph of content
      </Text>
      <Text as="span" bold uppercase>
        Status: Active
      </Text>
      <Text as="div">Container content</Text>
    </div>
  );
}
```

##### 分离布局和排版

- 将布局和排版分离：直接使用 Flex、Grid、Stack 或 Container，以及 Text 或 Heading 组件。

```tsx
// ❌ Do not couple typography with layout
const Component = styled('div')`
  display: flex;
  flex-directon: column;
  color: ${p => p.theme.tokens.content.secondary};
  font-size: ${p => p.theme.fontSize.lg};
`;

// ✅ Use the Layout primitives and Text component
<Flex direction="column">
  <Text muted size="lg">...</Text>
<Flex>
```

#### 资源

##### Image

使用 `@sentry/scraps/image` 中的核心组件 <Image/>，而不是原生 <img />。

```tsx
// ❌ Do not use raw intrinsic elements or static paths
function Component() {
  return (
    <img src="/path/to/image.jpg" />
  );
}

// ✅ Use Image component and src loader
import {Image} from '@sentry/scraps/image';
import image from 'sentry-images/example.jpg';

function Component() {
  return (
    <Image src={imagePath} alt="Descriptive Alt Attribute">
  );
}
```

##### Avatars

头像应使用 `static/app/components/core/avatar` 中的核心头像组件（<UserAvatar/>、<TeamAvatar/>、<ProjectAvatar/>、<OrganizationAvatar/>、<SentryAppAvatar/>、<DocIntegrationAvatar/>）。

```tsx
// ✅ Use Avatar component and useUser
import {UserAvatar} from '@sentry/scraps/avatar/userAvatar';
import {useUser} from 'sentry/utils/useUser';

<UserAvatar user={user}>

// ❌ Do not use raw intrinsic elements or static paths
function Component() {
  return (
    <img
      src="/path/to/image.jpg"
      style={{
        border,
        width: 20,
        height: 20,
        borderRadius: '50%',
        objectFit: 'cover',
        display: 'inline-block',
      }}
    />
  );
}
```

对于头像列表，使用 <AvatarList>。

##### Disclosure

使用核心 disclosure 组件，而不是自行构建。

```tsx
// ✅ Use Disclosure component
<Disclosure>
  <Disclosure.Title>Title</Disclosure.Title>
  <Disclosure.Content>
    Content that is toggled based on expanded state
  </Disclosure.Content>
</Disclosure>;

// ❌ Do not reimplement disclosure pattern manually
function Component() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        icon={<IconChevron direction={isExpanded ? "down" : "right"} />}
      >
        Title
      </Button>
      {isExpanded && (
        <Container>Content that is toggled based on expanded state</Container>
      )}
    </div>
  );
}
```

### 图片和图标

将所有图标放在 `static/app/icons` 文件夹中。绝不要内联 SVG，也不要将它们添加到任何其他文件夹。使用 svgo 或 svgomg 优化 SVG。

```tsx
// ❌ Never inline SVGs
function Component(){
  return (
    <Button icon={
      <svg viewbox="0 0 16 16>"}>
        // ❌ paths have excessive precision, optimize them with SVGO
        <circle cx="8.00134" cy="8.4314" r="5.751412" />
        <circle cx="8.00134" cy="8.4314" r="12.751412" />
        <line x1="8.41334" y1="5.255361" x2="8" y2="8.255421" />
      </svg>
    </Button>
  )
}

// ❌ Never place SVGs outside of icons folder.
import {CustomIcon} from "./customIcon"

// ✅ Import icon from our icon set
import {IconExclamation} from "sentry/icons"
```

```tsx
// ❌ All images belong inside static/app/images

// ✅ Images are imported from sentry-images alias
import image from "sentry-images/example.png";

import image from "./image.png";

function Component() {
  return <Image src={image} />;
}

// ❌ All images need to be imported usign the webpack loader!
function Component() {
  return <Image src="/path/to/image.png" />;
}

function Component() {
  return <Image src={image} />;
}
```

## React 测试指南

### 测试理念

- **以用户为中心的测试**: 编写接近用户与应用交互方式的测试。
- **避免实现细节**: 关注行为，而不是组件内部结构。
- **不要在测试之间共享状态**: 行为不应受到同一测试套件中其他测试的影响。

### 导入

**始终** 从 `sentry-test/reactTestingLibrary` 导入，而不是直接从 `@testing-library/react` 导入：

```tsx
import {
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from "sentry-test/reactTestingLibrary";
```

### 查询优先级（按优先顺序）

1. **`getByRole`** - 大多数元素的首选选择器

   ```tsx
   screen.getByRole("button", { name: "Save" });
   screen.getByRole("textbox", { name: "Search" });
   ```

2. **`getByLabelText`/`getByPlaceholderText`** - 用于表单元素

   ```tsx
   screen.getByLabelText("Email Address");
   screen.getByPlaceholderText("Enter Search Term");
   ```

3. **`getByText`** - 用于非交互元素

   ```tsx
   screen.getByText("Error Message");
   ```

4. **`getByTestId`** - 仅作为最后手段
   ```tsx
   screen.getByTestId("custom-component");
   ```

### 最佳实践

#### 避免 mock hooks、函数或组件

不要使用 `jest.mocked()`。

```tsx
// ❌ Don't mock hooks
jest.mocked(useDataFetchingHook)

// ✅ Set the response data
MockApiClient.addMockResponse({
    url: '/data/',
    body: DataFixture(),
})

// ❌ Don't mock contexts
jest.mocked(useOrganization)

// ✅ Use the provided organization config on render()
render(<Component />, {organization: OrganizationFixture({...})})

// ❌ Don't mock router hooks
jest.mocked(useLocation)

// ✅ Use the provided router config
render(<TestComponent />, {
  initialRouterConfig: {
    location: {
      pathname: "/foo/",
    },
  },
});

// ❌ Don't mock page filters hook
jest.mocked(usePageFilters)

// ✅ Update the corresponding data store with your data
PageFiltersStore.onInitializeUrlState(
    PageFiltersFixture({ projects: [1]}),
)

// ❌ Don't recreate the basic context providers
renderHook(useNavigate, {
  wrapper: (children) => (<AllTheProviders>{children}</AllTheProviders>),
})

// ✅ Use the provided helpers that mock everything
renderHookWithProviders(useNavigate)
```

#### 使用 fixtures

Sentry fixtures 位于 `tests/js/fixtures/`，GetSentry fixtures 位于 `tests/js/getsentry-test/fixtures/`。

```tsx

// ❌ Don't import type and initialize it
import type {Project} from 'sentry/types/project';
const project: Project = {...}

// ✅ Import a fixture instead
import {ProjectFixture} from 'sentry-fixture/project';

const project = ProjectFixture(partialProject)

```

#### 使用 `screen` 而不是解构

```tsx
// ❌ Don't do this
const { getByRole } = render(<Component />);

// ✅ Do this
render(<Component />);
const button = screen.getByRole("button");
```

#### 查询选择指南

- 对应该存在的元素使用 `getBy...`
- 仅在检查不存在时使用 `queryBy...`
- 等待元素出现时使用 `await findBy...`

```tsx
// ❌ Wrong
expect(screen.queryByRole("alert")).toBeInTheDocument();

// ✅ Correct
expect(screen.getByRole("alert")).toBeInTheDocument();
expect(screen.queryByRole("button")).not.toBeInTheDocument();
```

#### 异步测试

```tsx
// ❌ Don't use waitFor for appearance
await waitFor(() => {
  expect(screen.getByRole("alert")).toBeInTheDocument();
});

// ✅ Use findBy for appearance
expect(await screen.findByRole("alert")).toBeInTheDocument();

// ✅ Use waitForElementToBeRemoved for disappearance
await waitForElementToBeRemoved(() => screen.getByRole("alert"));
```

#### 避免等待加载指示器

不要对加载指示器使用带有 `.not.toBeInTheDocument()` 的 `findBy`。如果找不到元素，`findBy` 会报错，但我们断言的是它不应该存在。加载指示器也不稳定，因为它们只会在屏幕上出现很短的几个 tick。

```tsx
// ❌ Wrong - findBy errors if element not found, and loading indicators are flakey
expect(await screen.findByTestId("loading-indicator")).not.toBeInTheDocument();

// ✅ Correct - wait for the actual content you care about
await waitFor(() => {
  expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
});

// ✅ Also correct - use findBy on the content that appears after loading
expect(
  await screen.findByRole("button", { name: "Submit" }),
).toBeInTheDocument();
```

#### 用户交互

```tsx
// ❌ Don't use fireEvent
fireEvent.change(input, { target: { value: "text" } });

// ✅ Use userEvent
await userEvent.click(input);
await userEvent.keyboard("text");
```

#### 测试路由

```tsx
const { router } = render(<TestComponent />, {
  initialRouterConfig: {
    location: {
      pathname: "/foo/",
      query: { page: "1" },
    },
  },
});
// Uses passes in config to set initial location
expect(router.location.pathname).toBe("/foo");
expect(router.location.query.page).toBe("1");
// Clicking links goes to the correct location
await userEvent.click(screen.getByRole("link", { name: "Go to /bar/" }));
// Can check current route on the returned router
expect(router.location.pathname).toBe("/bar/");
// Can test manual route changes with router.navigate
router.navigate("/new/path/");
router.navigate(-1); // Simulates clicking the back button
```

如果组件使用 `useParams()`，可以使用 `route` 属性：

```tsx
function TestComponent() {
  const { id } = useParams();
  return <div>{id}</div>;
}
const { router } = render(<TestComponent />, {
  initialRouterConfig: {
    location: {
      pathname: "/foo/123/",
    },
    route: "/foo/:id/",
  },
});
expect(screen.getByText("123")).toBeInTheDocument();
```

#### 测试发起网络请求的组件

```tsx
// Simple GET request
MockApiClient.addMockResponse({
  url: "/projects/",
  body: [{ id: 1, name: "my project" }],
});

// POST request
MockApiClient.addMockResponse({
  url: "/projects/",
  method: "POST",
  body: { id: 1, name: "my project" },
});

// Complex matching with query params and request body
MockApiClient.addMockResponse({
  url: "/projects/",
  method: "POST",
  body: { id: 2, name: "other" },
  match: [
    MockApiClient.matchQuery({ param: "1" }),
    MockApiClient.matchData({ name: "other" }),
  ],
});

// Error responses
MockApiClient.addMockResponse({
  url: "/projects/",
  body: {
    detail: "Internal Error",
  },
  statusCode: 500,
});
```

##### 始终 Await 异步断言

网络请求是异步的。始终使用 `findBy` 查询，或正确 await 断言：

```tsx
// ❌ Wrong - will fail intermittently
expect(screen.getByText("Loaded Data")).toBeInTheDocument();

// ✅ Correct - waits for element to appear
expect(await screen.findByText("Loaded Data")).toBeInTheDocument();
```

##### 处理 Mutations 中的 Refetches

测试会触发数据重新获取的 mutations 时，请在 refetch 发生前更新 mocks：

```tsx
it("adds item and updates list", async () => {
  // Initial empty state
  MockApiClient.addMockResponse({
    url: "/items/",
    body: [],
  });

  const createRequest = MockApiClient.addMockResponse({
    url: "/items/",
    method: "POST",
    body: { id: 1, name: "New Item" },
  });

  render(<ItemList />);

  await userEvent.click(screen.getByRole("button", { name: "Add Item" }));

  // CRITICAL: Override mock before refetch happens
  MockApiClient.addMockResponse({
    url: "/items/",
    body: [{ id: 1, name: "New Item" }],
  });

  await waitFor(() => expect(createRequest).toHaveBeenCalled());
  expect(await screen.findByText("New Item")).toBeInTheDocument();
});
```
