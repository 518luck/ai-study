# Redux 框架

Grafana 使用 [Redux Toolkit](https://redux-toolkit.js.org/) 来处理 Redux 模板代码。

> **注意：** 我们的部分 reducers 被 Angular 使用；因此，这些 reducer 的状态应视为可变的。

## 测试功能

以下是测试 Redux reducer 功能的方法。

### reducerTester

使用 Fluent API 框架简化 reducer 测试。

#### 用法

`reducerTester` 使用示例：

```typescript
reducerTester()
  .givenReducer(someReducer, initialState)
  .whenActionIsDispatched(someAction("reducer tests"))
  .thenStateShouldEqual({ ...initialState, data: "reducer tests" });
```

#### 复杂用法

有时遇到的*结果状态*包含难以比较的属性（例如 `Date`），但你仍想验证状态中的其他属性是否正确。

在这种情况下，可以使用 `reducerTester` 的 `thenStatePredicateShouldEqual` 函数对单个属性进行求值，该函数会返回结果状态。例如：

```typescript
reducerTester()
  .givenReducer(someReducer, initialState)
  .whenActionIsDispatched(someAction("reducer tests"))
  .thenStatePredicateShouldEqual((resultingState) => {
    expect(resultingState.data).toEqual("reducer tests");
    return true;
  });
```

### thunkTester

这是一个简化 thunk 测试的 Fluent API 函数。

#### 用法

`thunkTester` 使用示例：

```typescript
const dispatchedActions = await thunkTester(initialState)
  .givenThunk(someThunk)
  .whenThunkIsDispatched(arg1, arg2, arg3);

expect(dispatchedActions).toEqual([someAction("reducer tests")]);
```

## connected props 的类型定义

可以使用 Redux 提供的 `ConnectedProps` 辅助类型，从 `mapStateToProps` 和 `mapDispatchToProps` 自动推断 connected props。为此，需要将 `connect` 调用拆分为两部分：

```typescript
import { connect, ConnectedProps } from "react-redux";

const mapStateToProps = (state: StoreState) => {
  return {
    location: state.location,
    initDone: state.panelEditor.initDone,
    uiState: state.panelEditor.ui,
  };
};

const mapDispatchToProps = {
  updateLocation,
  initPanelEditor,
  panelEditorCleanUp,
  setDiscardChanges,
  updatePanelEditorUIState,
  updateTimeZoneForSession,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = OwnProps & ConnectedProps<typeof connector>;

class PanelEditorUnconnected extends PureComponent<Props> {}

export const PanelEditor = connector(PanelEditorUnconnected);
```

更多示例请参阅 [Redux 文档](https://react-redux.js.org/using-react-redux/static-typing#inferring-the-connected-props-automatically)。
