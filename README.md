# cimEngine-v2

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.0%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)

cimEngine-v2 是一个现代化、高度可扩展的 Cesium 地理信息引擎，基于 TypeScript 与模块化架构设计，提供简洁易用的 API 与丰富的功能扩展。

## 特性

- **现代化架构** - 基于依赖注入、事件总线和插件系统的模块化设计
- **类型安全** - 完整的 TypeScript 类型定义和编译时检查
- **灵活配置** - 简单易用的配置系统，支持链式调用
- **高性能** - 针对 Cesium 的性能优化与渲染增强
- **可扩展** - 统一的插件机制，便于功能扩展
- **完整功能** - 覆盖场景控制、相机管理、图层控制等全方位功能

## 安装
```bash
# npm
npm install cim-engine-v2

# yarn
yarn add cim-engine-v2

# pnpm
pnpm add cim-engine-v2


## 快速开始

```typescript
import { Engine } from 'cim-engine-v2';

// 创建引擎实例
const engine = new Engine({
  container: 'cesiumContainer',  // 容器ID或DOM元素
  options: {
    performance: 'high',         // 性能模式：high/medium/low
    debug: true,                 // 调试模式
    autoStart: true              // 自动启动
  }
});

// 添加图层
engine.layer.addImagery({
  name: 'osm',
  type: 'osm'
});

// 设置相机位置
engine.camera.flyTo({
  longitude: 104.06,
  latitude: 30.67,
  height: 10000,
  duration: 2
});

// 注册事件
engine.events.on('scene.click', (event) => {
  const position = event.position;
  console.log('点击位置:', position);
});

// 使用插件
import { measurePlugin } from 'cim-engine-v2/plugins';
engine.use(measurePlugin);

// 开始测量距离
engine.measure.distance.start();
```

## 架构设计


### 架构设计核心

cimEngine-v2 采用分层架构设计，通过清晰的职责分配和模块化组织提供灵活、可扩展的系统框架：

#### 1. 依赖注入模式

替换 v1 中广泛使用的单例模式，改用依赖注入容器管理服务实例：

```typescript
// v2 的依赖注入示例
const container = new Container();
container.register(IViewerService, ViewerService);
container.register(ILayerService, LayerService);

// 获取服务
const viewerService = container.resolve(IViewerService);

// 插件注册示例
engine.use(terrainPlugin);
engine.use(weatherPlugin);
engine.use(measurePlugin);

// 类型安全的事件系统
eventBus.on<CameraChangedEvent>('camera.changed', (event) => {
  console.log(event.position, event.heading);
});
eventBus.on
```


## 功能模块

### 核心模块 (Core)
- **Engine**: 引擎入口，管理整体生命周期
- **Container**: 依赖注入容器
- **EventBus**: 事件总线
- **PluginManager**: 插件管理器
### 服务模块 (Services)
- **ViewerService**: 管理 Cesium Viewer 实例
- **SceneService**: 场景管理
- **CameraService**: 相机控制
- **LayerService**: 图层管理
- **EntityService**: 实体管理
- **TerrainService**: 地形管理
- **WeatherService**: 天气系统
- **AnalysisService**: 空间分析
- **InteractionService**: 交互管理
### 数据处理模块 (Data)
- **DataManager**: 数据管理核心
- **Adapters**: 数据适配器 (替代旧版解码器)
  - TilesetAdapter
  - GltfAdapter
  - ImageryAdapter
  - TerrainAdapter
  - VectorAdapter
### 工具模块 (Utils)
- **CoordinateUtils**: 坐标转换工具
- **MathUtils**: 数学计算工具
- **StyleUtils**: 样式工具
- **LoaderUtils**: 资源加载工具
- **DomUtils**: DOM 操作工具
### 组件模块 (Components)
- **UI**: 用户界面组件
- **Controls**: 控制组件
- **Widgets**: 小部件
- **Visualizations**: 可视化组件

### 状态管理

#### 内置状态管理

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


### 外部状态管理集成

支持与 Pinia/Vuex/Zustand 等状态管理库集成。

###

### 插件开发

#### 插件接口示例

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

## 性能优化策略

- **资源懒加载**：按需加载资源
- **实例池**：复用频繁创建的对象
- **计算缓存**：缓存复杂计算结果
- **渲染优化**：细粒度控制渲染更新
- **WebWorker**：将耗时操作移至后台线程
- **内存管理**：及时释放不再使用的资源

## 贡献指南

我们欢迎所有形式的贡献，包括但不限于：

- 提交bug报告和问题
- 提交功能请求
- 提交代码修复
- 提交新功能实现
- 完善文档

请查看 CONTRIBUTING.md 获取详细信息。

## 许可证
MIT License