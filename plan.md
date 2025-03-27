# cimEngine-v2 开发计划

## 项目概述

cimEngine-v2 是对 cimEngine-v1 的全面升级，旨在构建一个更加现代化、可扩展、高性能的 Cesium 二次封装引擎。通过采用最新的架构设计模式和技术栈，提高开发效率和用户体验。

## 设计目标

1. **模块化设计**：采用更清晰的模块化结构，降低耦合度
2. **可扩展性**：统一的插件系统，使功能扩展更加简便
3. **类型安全**：完全基于 TypeScript，提供更好的类型定义和编译时检查
4. **性能优化**：优化渲染性能和资源管理
5. **易用性**：简化 API 设计，提高开发效率
6. **可测试性**：改善代码结构，使单元测试更加容易
7. **文档完善**：提供完整的 API 文档和示例

## 技术栈

- TypeScript 5.0+
- Vite 5.0+ (构建工具)
- Cesium 最新版
- Pinia/Zustand (可选的状态管理)
- Jest/Vitest (单元测试)
- JSDoc/TypeDoc (文档生成)

## 架构设计

### 1. 核心架构

cimEngine-v2 将采用以下核心架构设计：

#### 1.1 依赖注入模式

替换 v1 中广泛使用的单例模式，改用依赖注入容器管理服务实例：

```typescript
// v2 的依赖注入示例
const container = new Container();
container.register(IViewerService, ViewerService);
container.register(ILayerService, LayerService);

// 获取服务
const viewerService = container.resolve(IViewerService);
```

#### 1.2 插件系统

统一的插件机制，允许功能以插件形式扩展：

```typescript
// 插件注册示例
engine.use(terrainPlugin);
engine.use(weatherPlugin);
engine.use(measurePlugin);
```

#### 1.3 事件总线

改进的事件系统，支持类型安全的事件订阅和发布：

```typescript
// 类型安全的事件系统
eventBus.on<CameraChangedEvent>('camera.changed', (event) => {
  console.log(event.position, event.heading);
});
```

### 2. 模块设计

cimEngine-v2 将划分为以下核心模块：

#### 2.1 核心模块 (Core)

- **Engine**: 引擎入口，管理整体生命周期
- **Container**: 依赖注入容器
- **EventBus**: 事件总线
- **PluginManager**: 插件管理器

#### 2.2 服务模块 (Services)

- **ViewerService**: 管理 Cesium Viewer 实例
- **SceneService**: 场景管理
- **CameraService**: 相机控制
- **LayerService**: 图层管理
- **EntityService**: 实体管理
- **TerrainService**: 地形管理
- **WeatherService**: 天气系统
- **AnalysisService**: 空间分析
- **InteractionService**: 交互管理

#### 2.3 数据处理模块 (Data)

- **DataManager**: 数据管理核心
- **Adapters**: 数据适配器 (替代旧版解码器)
  - TilesetAdapter
  - GltfAdapter
  - ImageryAdapter
  - TerrainAdapter
  - VectorAdapter
  - ...

#### 2.4 工具模块 (Utils)

- **CoordinateUtils**: 坐标转换工具
- **MathUtils**: 数学计算工具
- **StyleUtils**: 样式工具
- **LoaderUtils**: 资源加载工具
- **DomUtils**: DOM 操作工具

#### 2.5 组件模块 (Components)

- **UI**: 用户界面组件
- **Controls**: 控制组件
- **Widgets**: 小部件
- **Visualizations**: 可视化组件

### 3. 状态管理

使用响应式状态管理方案，提供两种可选方式：

#### 3.1 内置状态管理

简单的响应式状态管理，支持状态订阅：

```typescript
const cameraState = createState({
  position: [0, 0, 0],
  heading: 0,
  pitch: 0
});

cameraState.subscribe((state) => {
  console.log('Camera state changed:', state);
});

cameraState.update({ heading: 45 });
```

#### 3.2 外部状态管理集成

支持与 Pinia/Vuex/Zustand 等状态管理库集成。

### 4. 配置系统

更加灵活的配置系统：

```typescript
const engine = new CimEngine({
  container: 'cesiumContainer',
  options: {
    performance: 'high',
    debug: true,
    autoStart: true
  },
  plugins: [terrainPlugin, weatherPlugin],
  services: {
    viewer: {
      timeline: false,
      animation: false
    },
    camera: {
      defaultView: {
        longitude: 104.06,
        latitude: 30.67,
        height: 10000
      }
    }
  }
});
```


## API 设计

### 1. 统一API风格

```typescript
// 链式调用
engine.scene
  .addTileset('buildings', url)
  .addImagery('satellite', url)
  .setViewpoint({longitude, latitude, height});

// 异步操作
await engine.data
  .load('model', url)
  .then(model => engine.scene.add(model));
```

### 2. 资源管理

```typescript
// 资源管理示例
const layer = engine.scene.addTileset('buildings', url);

// 更新配置
layer.config.update({
  maximumScreenSpaceError: 16,
  dynamicScreenSpaceError: true
});

// 移除资源
engine.scene.remove(layer);
```

### 3. 事件处理

```typescript
// 事件处理示例
engine.events.on('scene.click', (event) => {
  const pickedObject = event.pickedObject;
  // 处理点击事件
});

// 特定对象的事件
layer.on('visible.changed', (visible) => {
  console.log('Layer visibility changed:', visible);
});
```

## 插件开发

### 1. 插件接口

```typescript
// 插件接口示例
interface Plugin {
  name: string;
  install(engine: CimEngine, options?: any): void;
  uninstall?(engine: CimEngine): void;
}

// 插件实现示例
const weatherPlugin: Plugin = {
  name: 'weather',
  install(engine, options) {
    const weatherService = new WeatherService(engine, options);
    engine.container.register('weather', weatherService);
    
    // 扩展引擎API
    engine.weather = {
      setRain(intensity) {
        return weatherService.setRain(intensity);
      },
      setSnow(intensity) {
        return weatherService.setSnow(intensity);
      },
      setFog(density) {
        return weatherService.setFog(density);
      }
    };
  },
  uninstall(engine) {
    // 清理资源
  }
};
```

### 2. 插件开发指南

为开发者提供详细的插件开发指南，包括：

- 插件生命周期
- 服务注册
- API扩展
- 资源管理
- 事件处理

## 开发路线图

### 阶段1：基础架构（1个月）

1. 设置项目结构和构建流程
2. 实现核心模块（Engine、Container、EventBus）
3. 实现基础服务（ViewerService、SceneService、CameraService）
4. 开发插件系统

### 阶段2：数据处理（1个月）

1. 实现数据管理核心
2. 开发基础适配器（TilesetAdapter、ImageryAdapter、TerrainAdapter）
3. 实现资源加载和管理系统

### 阶段3：功能实现（2个月）

1. 迁移和重构v1中的主要功能
2. 实现天气系统、测量工具、绘图工具等
3. 开发UI组件和控件

### 阶段4：优化和完善（1个月）

1. 性能优化
2. 完善文档和示例
3. 单元测试和集成测试
4. 向后兼容层完善

### 阶段5：发布和维护

1. 发布v2.0版本
2. 收集反馈并迭代改进
3. 发布周期性更新


## 性能优化策略

1. **资源懒加载**：按需加载资源
2. **实例池**：复用频繁创建的对象
3. **计算缓存**：缓存复杂计算结果
4. **渲染优化**：细粒度控制渲染更新
5. **WebWorker**：将耗时操作移至后台线程
6. **内存管理**：及时释放不再使用的资源

## 总结

cimEngine-v2 将在保留 v1 所有功能的基础上，通过现代化的架构设计和开发实践，提供更加灵活、高效、易用的 Cesium 二次开发框架。这种改进不仅能够满足当前项目需求，还能为未来的扩展和维护奠定坚实基础。