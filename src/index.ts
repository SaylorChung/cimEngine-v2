/**
 * Artis 主入口文件
 */
import { Engine } from './core/engine'
import { Container } from './core/container'
import { EventBus } from './core/eventBus'
import { PluginManager } from './core/pluginManager'

// 导入 Cesium 以确保它被打包
import 'cesium';

// 创建导出对象
interface ArtisExports {
  engine: typeof Engine
  Container: typeof Container
  EventBus: typeof EventBus
  PluginManager: typeof PluginManager
  VERSION: string
  Cesium: typeof Cesium // 添加 Cesium
}

// 导入 Cesium
import Cesium from './cesium';

// 将 Cesium 添加到导出对象
const artis: ArtisExports = {
  engine: Engine,
  Container: Container,
  EventBus: EventBus,
  PluginManager: PluginManager,
  VERSION: '2.0.0',
  Cesium: Cesium // 添加 Cesium
}

// 导出默认对象
export default artis

// 为了保持兼容性，也单独导出这些模块
export { Engine } from './core/engine'
export { Container } from './core/container'
export { EventBus } from './core/eventBus'
export { PluginManager } from './core/pluginManager'

// 导出类型定义
export * from './core/types'
