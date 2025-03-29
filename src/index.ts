/**
 * Artis 主入口文件
 */
import { Engine } from './core/engine'
import { Container } from './core/container'
import { EventBus } from './core/eventBus'
import { PluginManager } from './core/pluginManager'

// 创建导出对象接口
interface IArtis {
  CimEngine: typeof Engine
  Container: typeof Container
  EventBus: typeof EventBus
  PluginManager: typeof PluginManager
  VERSION: string
}

// 创建导出对象
const artis: IArtis = {
  CimEngine: Engine,
  Container: Container,
  EventBus: EventBus,
  PluginManager: PluginManager,
  VERSION: '2.0.0'
}

// 导出默认对象
export default artis

// 导出类型定义
export * from './core/types'
