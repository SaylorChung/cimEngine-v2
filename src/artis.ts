/**
 * Artis 主入口文件
 */
import 'reflect-metadata'
import { Engine } from './core/engine'
import { IEngine } from './core/types' // 显式导入接口
import { PluginManager } from './core/pluginManager'
import * as CesiumModule from './cesiumLoader'

// 定义版本号常量
const VERSION = '2.0.1'

/**
 * Artis 声明接口
 */
interface IArtis {
  Engine: typeof Engine // 名称统一为 Engine
  PluginManager: typeof PluginManager
  VERSION: string
  Cesium: typeof CesiumModule
}

// 创建导出对象
const artis: IArtis = {
  Engine, // 使用简写语法
  PluginManager,
  VERSION: '2.0.1',
  Cesium: CesiumModule,
}

// 导出默认对象
export default artis

// 命名导出主要组件
export { Engine, PluginManager, VERSION }
export type { IEngine } // 显式导出接口

// 导出类型定义
export * from './core/types'

// 导出Cesium类型
export * from './cesiumLoader'
