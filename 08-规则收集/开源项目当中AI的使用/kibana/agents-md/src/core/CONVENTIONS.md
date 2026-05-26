- [组织约定](#organisational-conventions)
  - [完成标准](#definition-of-done)
- [技术约定](#technical-conventions)
  - [插件结构](#plugin-structure)
    - [PluginInitializer](#the-plugininitializer)
    - [Plugin 类](#the-plugin-class)
    - [应用](#applications)
    - [服务](#services)
    - [使用统计收集](#usage-collection)
    - [保存对象类型](#saved-objects-types)
  - [命名约定](#naming-conventions)
- [核心 API 约定](#core-api-conventions)
  - [暴露 API 类型](#1-exposing-api-types)
  - [API 结构和嵌套](#2-api-structure-and-nesting)
  - [测试和模拟对象](#3-tests-and-mocks)

## 组织约定
### 完成标准
功能的完成标准：
- 有专门的 GitHub issue 描述问题空间
- 有一个总任务已关闭/更新并附有后续事项
- 所有代码审查评论均已解决
- 至少有一位审查者手动验证过
- 可供第一方和第三方插件使用
- 客户端和服务器端 API 之间无矛盾
- 支持订阅功能
   - 适用于已登录用户
   - 适用于匿名用户
   - 兼容 Spaces
- 公共契约有单元测试和集成测试
- 用户场景有功能测试
- 使用标准工具：
    - 代码 — `TypeScript`
    - UI — `React`
    - 测试 — `jest` 和 `FTR`
- 公共契约有文档，提供使用示例

## 技术约定
### 插件结构

所有 Elastic 构建的 Kibana 插件应遵循相同的结构。

```
my_plugin/
├── kibana.json
├── public
│   ├── applications
│   │   ├── my_app
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── services
│   │   ├── my_service
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── index.ts
│   └── plugin.ts
└── server
    ├── routes
    │   └── index.ts
    ├── collectors
    │   └── register.ts
    ├── saved_objects
    │   ├── index.ts
    │   └── my_type.ts
    ├── services
    │   ├── my_service
    │   │   └── index.ts
    │   └── index.ts
    ├── index.ts
    └── plugin.ts
```
- [清单文件](/docs/development/core/server/kibana-plugin-core-server.pluginmanifest.md) 应定义在顶层。
- `server` 和 `public` 都应有 `index.ts` 和 `plugin.ts` 文件：
  - `index.ts` 应仅包含：
    - `plugin` 导出
    - `config` 导出（仅 server，可选）
    - 你的 Setup 和 Start 接口的类型导出，以及任何相关的子类型
    - 供其他插件使用的静态纯导出
  - `plugin.ts` 应仅导出一个实现 `Plugin` 接口的类（详见下文）
- UI 应用应作为模块放在 `applications` 目录下。
  - 应用应导出一个 `renderApp` 函数。
  - 应用应使用动态异步导入加载（详见下文）
  - 如果只有一个应用，此目录可命名为 `application`，导出 `renderApp` 函数。
- 以 API 形式提供给其他插件的服务应放在 `services` 子目录中。
  - 服务应模拟插件生命周期（详见下文）。
- HTTP 路由应包含在 `server/routes` 目录中。
  - 此处待补充更多内容……
- 用于遥测的使用统计收集器应定义在单独的 `server/collectors/` 目录中。

#### PluginInitializer

```ts
// my_plugin/public/index.ts

import { PluginInitializer } from '../../src/core/public';
import { MyPlugin, MyPluginSetup, MyPluginStart } from './plugin';

export const plugin: PluginInitializer<MyPluginSetup, MyPluginStart> = () => new MyPlugin();
export {
  MyPluginSetup,
  MyPluginStart
}
```

#### Plugin 类

```ts
// my_plugin/public/plugin.ts

import { CoreSetup, CoreStart, Plugin } from '../../src/core/public';
import { OtherPluginSetup, OtherPluginStart } from '../other_plugin';
import { ThirdPluginSetup, ThirdPluginStart } from '../third_plugin';

export interface MyPluginSetup {
  registerThing(...);
}

export interface MyPluginStart {
  getThing(): Thing;
}

export interface MyPluginSetupDeps {
  otherPlugin: OtherPluginSetup;
  thirdPlugin?: ThirdPluginSetup;  // 可选依赖
}

export interface MyPluginStartDeps {
  otherPlugin: OtherPluginStart;
  thirdPlugin?: ThirdPluginStart;  // 可选依赖
}

export class MyPlugin implements Plugin<
  // 所有这些类型都是可选的。如果你的插件不暴露任何内容
  // 或不依赖其他插件，这些可以省略。
  MyPluginSetup,
  MyPluginStart,
  MyPluginSetupDeps,
  MyPluginStartDeps,
> {

  public setup(core: CoreSetup, plugins: MyPluginSetupDeps) {
    // 应返回符合 `MyPluginSetup` 的值
  }

  public start(core: CoreStart, plugins: MyPluginStartDeps) {
    // 应返回符合 `MyPluginStart` 的值
  }

  public stop() { ... }
}
```

`setup` 和 `start` 之间的区别：
- `setup` 用于"注册"相关工作
- `start` 用于插件的"运行"逻辑。这仅在需要开始监听外部事件（轮询工作、监听端口等）时适用。

插件的大部分逻辑通常位于 `setup` 期间注册的_处理器_中。

#### 应用

UI 代码不应包含在插件的主包中。我们的 webpack 配置支持动态异步导入，将导入拆分到单独的包中。每个应用的渲染逻辑和 UI 代码应利用此模式。

```tsx
// my_plugin/public/applications/my_app.ts

import React from 'react';
import ReactDOM from 'react-dom';
import { CoreStart, AppMountParameters } from 'src/core/public';

import { MyAppRoot } from './components/app.ts';

/**
 * 此模块将被异步加载，以减少插件主包的体积。
 */
export const renderApp = (
  core: CoreStart,
  deps: MyPluginDepsStart,
  { element, history }: AppMountParameters
) => {
  ReactDOM.render(<MyAppRoot core={core} deps={deps} routerHistory={history} />, element);
  return () => ReactDOM.unmountComponentAtNode(element);
};
```

```ts
// my_plugin/public/plugin.ts

import { Plugin } from '../../src/core/public';

export class MyPlugin implements Plugin {
  public setup(core) {
    core.application.register({
      id: 'my-app',
      async mount(params) {
        // 加载应用包
        const { renderApp } = await import('./application/my_app');
        // 获取 start 服务
        const [coreStart, depsStart] = core.getStartServices();
        return renderApp(coreStart, depsStart, params);
      }
    });
  }
}
```

推荐使用上面展示的 `core.getStartServices()` 模式，而不是存储从 `start` 获取的本地引用。

**不推荐：**
```ts
export class MyPlugin implements Plugin {
 // 反模式
  private coreStart?: CoreStart;
  private depsStart?: DepsStart;

  public setup(core) {
    core.application.register({
      id: 'my-app',
      async mount(params) {
        const { renderApp } = await import('./application/my_app');
        // 反模式 - 请使用 `core.getStartServices()`！
        return renderApp(this.coreStart, this.depsStart, params);
      }
    });
  }

  public start(core, deps) {
    // 反模式
    this.coreStart = core;
    this.depsStart = deps;
  }
}
```

推荐使用提供的异步访问器的主要原因是，开发者无需理解和推断该函数何时可以被调用。提供一个有时会失败的 API 不是好的 API 设计，并且会使准确测试变得困难。

#### 服务

服务的结构应镜像插件生命周期，以便更清晰地理解服务的执行方式。

```ts
// my_plugin/public/services/my_service.ts

export class MyService {
  private readonly strings$ = new BehaviorSubject<string[]>();

  public setup() {
    return {
      registerStrings: (newString: string) =>
        this.strings$.next([...this.strings$.value, newString]);
    }
  }

  public start() {
    this.strings$.complete();

    return {
      strings: this.strings$.value
    };
  }
}
```

从顶层 Plugin 类中构造和与该服务交互变得非常简单：

```ts
// my_plugin/public/plugin.ts

import { MyService } from './services';

export class Plugin {
  private readonly myService = new MyService();

  public setup() {
    return {
      myService: myService.setup();
    }
  }

  public start() {
    return {
      myService: myService.start();
    }
  }
}
```

#### 使用统计收集

用于创建和注册 Usage Collector。收集器应定义在单独的 `server/collectors/` 目录中。你可以在 `src/platform/plugins/shared/usage_collection/README.mdx` 上阅读更多关于使用统计收集器的内容。

```ts
// server/collectors/register.ts
import { UsageCollectionSetup } from 'src/platform/plugins/shared/usage_collection/server';
import { CallCluster } from 'src/legacy/core_plugins/elasticsearch';

export function registerMyPluginUsageCollector(usageCollection?: UsageCollectionSetup): void {
  // usageCollection 是可选依赖，因此如果未注册则直接返回。
  if (!usageCollection) {
    return;
  }

  // 创建使用统计收集器
  const myCollector = usageCollection.makeUsageCollector({
    type: MY_USAGE_TYPE,
    fetch: async (callCluster: CallCluster) => {

    // 查询 ES 并获取一些数据
    // 将数据汇总为模型
    // 返回包含你想跟踪内容的模型对象

      return {
        my_objects: {
          total: SOME_NUMBER
        }
      };
    },
  });

  // 注册使用统计收集器
  usageCollection.registerCollector(myCollector);
}
```

#### 保存对象类型

保存对象类型定义应定义在自己的 `server/saved_objects` 目录中。

文件夹应包含每个类型的文件，以类型的 snake_case 名称命名，以及一个 `index.ts` 文件导出所有类型。

```typescript
// src/plugins/my-plugin/server/saved_objects/my_type.ts
import { SavedObjectsType } from 'src/core/server';

export const myType: SavedObjectsType = {
  name: 'my-type',
  hidden: false,
  namespaceType: 'single',
  mappings: {
    properties: {
      someField: {
        type: 'text',
      },
      anotherField: {
        type: 'text',
      },
    },
  },
  migrations: {
    '1.0.0': migrateFirstTypeToV1,
    '2.0.0': migrateFirstTypeToV2,
  },
};
```

```typescript
// src/plugins/my-plugin/server/saved_objects/index.ts

export { myType } from './my_type';
```

旧格式的迁移示例可在 `src/core/MIGRATION_EXAMPLES.md#saved-objects-types` 中查看

### 命名约定

将 start 和 setup 契约导出为 `MyPluginStart` 和 `MyPluginSetup`。
如果每个人都简单地导出为 `Start` 和 `Setup`，就会造成命名冲突。

## 核心 API 约定

以下约定适用于 `src/core` 内部的开发。虽然其中许多可能有更广泛的适用性，但在 Kibana 其余部分中的采用并非主要目标。

### 1. 暴露 API 类型

以下内容适用于描述 Core API 完整表面区域的类型，不适用于内部类型。

 - 1.1 所有 API 类型必须从顶层 `server` 或 `public` 目录导出。

   ```ts
   // -- 正确 --
   import { IRouter } from 'src/core/server';

   // -- 错误 --
   import { IRouter } from 'src/core/server/http/router.ts';
   ```

   > 为什么？这是从内联 TypeScript 文档注释生成文档所必需的，使 API 使用者更容易找到相关类型，并在外部和内部类型之间建立清晰的区别。

 - 1.2 类不应直接暴露。相反，使用一个独立类型，以 'I' 为前缀，来描述该类的公共契约。

   ```ts
   // -- 正确 (方案 1) --
   /**
    * @public
    * {@link UiSettingsClient}
    */
   export type IUiSettingsClient = PublicContractOf<UiSettingsClient>;

   /** 仅内部使用 */
   export class UiSettingsClient {
     constructor(private setting: string) {}
     /** 获取所有设置 */
     public getSettings(): { return this.settings; }
   };

   // -- 正确 (方案 2) --
      export interface IUiSettingsClient {
     /** 获取所有设置 */
     public getSettings(): string;
   }

   export class UiSettingsClient implements IUiSettingsClient {
     public getSettings(): string;
   }

   // -- 错误 --
   /** 外部使用 */
   export class UiSettingsClient {
     constructor(private setting: string) {}
     public getSettings(): { return this.settings; }
   }
   ```

   > 为什么？类的私有成员是其类型签名的一部分，这使得无法模拟一个类型为 `class` 的依赖。

### 2. API 结构和嵌套

 - 2.1 仅当我们预计会向该命名空间添加额外方法时，才将 API 方法嵌套到它们自己的命名空间中。

   ```ts
   // 正确
   core.overlays.openFlyout(...);
   core.overlays.openModal(...);
   core.overlays.banners.add(...);
   core.overlays.banners.remove(...);
   core.overlays.banners.replace(...);

   // 错误
   core.overlays.flyouts.open(...);
   core.overlays.modals.open(...);
   ```

   > 为什么？嵌套的命名空间应便于 API 使用者的发现和导航。如果命名空间只有一个方法，实际上是将方法隐藏在一个额外的层级下，而并没有改善组织性。然而，当我们知道将要引入相关的 API 方法时，尽早引入命名空间可以避免 API 的频繁变更。

### 3. 测试和模拟对象

 - 3.1 使用临时变量声明 Jest 模拟对象，以确保类型能被正确推断。

   ```ts
   // -- 正确 --
   const createMock = () => {
     const mocked: jest.Mocked<IContextService> = {
       start: jest.fn(),
     };
     mocked.start.mockReturnValue(createStartContractMock());
     return mocked;
   };
   // -- 错误 --
   const createMock = (): jest.Mocked<ContextServiceContract> => ({
     start: jest.fn().mockReturnValue(createSetupContractMock()),
   });
   ```

   > 为什么？没有临时变量时，Jest 将 `start` 函数类型推断为 `jest<any, any>`，因此无法对模拟返回值进行类型检查。
