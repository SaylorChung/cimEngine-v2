/**
 * 插件管理器实现
 * 负责管理插件的注册和卸载
 */
import { Engine, IPluginManager, Plugin } from './types'

/**
 * 插件管理器
 */
export class PluginManager implements IPluginManager {
  private plugins: Map<string, Plugin> = new Map()
  private engine: Engine

  /**
   * 构造函数
   * @param engine 引擎实例
   */
  constructor(engine: Engine) {
    this.engine = engine
  }

  /**
   * 使用插件
   * @param plugin 插件对象
   * @param options 插件选项
   */
  use(plugin: Plugin, options?: any): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin "${plugin.name}" is already registered`)
      return
    }

    // 安装插件
    try {
      plugin.install(this.engine, options)
      this.plugins.set(plugin.name, plugin)
    } catch (error) {
      console.error(`Error installing plugin "${plugin.name}":`, error)
      throw error
    }
  }

  /**
   * 移除插件
   * @param pluginName 插件名称
   */
  remove(pluginName: string): void {
    const plugin = this.plugins.get(pluginName)
    if (!plugin) {
      console.warn(`Plugin "${pluginName}" not found`)
      return
    }

    // 卸载插件
    if (plugin.uninstall) {
      try {
        plugin.uninstall(this.engine)
      } catch (error) {
        console.error(`Error uninstalling plugin "${pluginName}":`, error)
      }
    }

    this.plugins.delete(pluginName)
  }

  /**
   * 检查插件是否已注册
   * @param pluginName 插件名称
   * @returns 是否已注册
   */
  has(pluginName: string): boolean {
    return this.plugins.has(pluginName)
  }

  /**
   * 获取插件实例
   * @param pluginName 插件名称
   * @returns 插件实例
   */
  get(pluginName: string): Plugin | undefined {
    return this.plugins.get(pluginName)
  }
}
