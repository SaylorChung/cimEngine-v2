/**
 * Artis 主入口文件
 */
import { Engine } from './core/engine'
import { Container } from './core/container'
import { EventBus } from './core/eventBus'
import { PluginManager } from './core/pluginManager'
import * as CesiumModule from './cesiumLoader' // 导入Cesium模块

// 创建导出对象接口
interface IArtis {
  CimEngine: typeof Engine
  Container: typeof Container
  EventBus: typeof EventBus
  PluginManager: typeof PluginManager
  VERSION: string
  // 包含 Cesium
  Cesium: typeof CesiumModule
}

// 创建导出对象
const artis: IArtis = {
  CimEngine: Engine,
  Container: Container,
  EventBus: EventBus,
  PluginManager: PluginManager,
  VERSION: '2.0.0',
  Cesium: CesiumModule // 添加Cesium模块到导出对象
}

// 导出默认对象
export default artis

// 导出类型定义
export * from './core/types'
// 导出Cesium类型
export * from './cesiumLoader'