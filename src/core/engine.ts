import { Container } from './container'
import { EventBus } from './eventBus'
import { PluginManager } from './pluginManager'
import { EngineOptions, IContainer, IEventBus, IPluginManager, Plugin } from './types'

// 引擎默认配置
const DEFAULT_OPTIONS: EngineOptions = {
  container: 'cesiumContainer',
  options: {
    performance: 'high',
    debug: false,
    autoStart: true,
  },
  plugins: [],
  services: {},
}

/**
 * Artis核心引擎类
 */
export class Engine {
  // 静态版本信息
  public static readonly VERSION: string = '2.0.0'

  // 核心系统
  private _container: IContainer
  private _events: IEventBus
  private _plugins: IPluginManager

  // 引擎状态
  private _initialized: boolean = false
  private _running: boolean = false
  private _options: EngineOptions

  // 获取引擎状态
  public get initialized(): boolean {
    return this._initialized
  }
  public get running(): boolean {
    return this._running
  }

  // 获取核心系统
  public get container(): IContainer {
    return this._container
  }
  public get events(): IEventBus {
    return this._events
  }
  public get plugins(): IPluginManager {
    return this._plugins
  }

  // 服务访问快捷方式（后续会添加）
  public viewer: any
  public scene: any
  public camera: any
  public layer: any

  /**
   * 构造函数
   */
  constructor(options: EngineOptions) {
    // 合并配置
    this._options = { ...DEFAULT_OPTIONS, ...options }

    // 初始化核心系统
    this._container = new Container()
    this._events = new EventBus()
    this._plugins = new PluginManager(this)

    // 注册核心组件到容器
    this._container.registerInstance('engine', this)
    this._container.registerInstance('container', this._container)
    this._container.registerInstance('events', this._events)
    this._container.registerInstance('plugins', this._plugins)

    // 如果配置了自动启动，则初始化引擎
    if (this._options.options?.autoStart) {
      this.init()
    }
  }

  /**
   * 初始化引擎
   */
  public async init(): Promise<void> {
    if (this._initialized) {
      console.warn('Engine is already initialized')
      return
    }

    try {
      // 发布初始化开始事件
      this._events.emit('engine.init.start')

      // 注册服务
      this.registerServices()

      // 创建和配置Cesium Viewer
      await this.initViewer()

      // 安装插件
      this.installPlugins()

      // 标记为已初始化
      this._initialized = true

      // 发布初始化完成事件
      this._events.emit('engine.init.complete')

      // 启动引擎
      if (this._options.options?.autoStart) {
        this.start()
      }
    } catch (error) {
      this._events.emit('engine.init.error', error)
      console.error('Engine initialization failed:', error)
      throw error
    }
  }

  /**
   * 启动引擎
   */
  public start(): void {
    if (!this._initialized) {
      throw new Error('Engine must be initialized before starting')
    }

    if (this._running) {
      console.warn('Engine is already running')
      return
    }

    this._running = true
    this._events.emit('engine.start')
  }

  /**
   * 停止引擎
   */
  public stop(): void {
    if (!this._running) {
      return
    }

    this._running = false
    this._events.emit('engine.stop')
  }

  /**
   * 销毁引擎
   */
  public destroy(): void {
    this.stop()

    // 发布销毁开始事件
    this._events.emit('engine.destroy.start')

    // 卸载所有插件
    const pluginNames = Array.from(this._plugins['plugins'].keys())
    for (const name of pluginNames) {
      this._plugins.remove(name)
    }

    // 销毁Viewer
    if (this.viewer) {
      this.viewer.destroy()
      this.viewer = null
    }

    // 发布销毁完成事件
    this._events.emit('engine.destroy.complete')

    // 清除事件总线
    // 注意：不要在此之前清除事件，以确保所有销毁事件都能被处理
    this._events['handlers'].clear()
    this._events['onceHandlers'].clear()

    this._initialized = false
  }

  /**
   * 使用插件
   */
  public use(plugin: Plugin, options?: any): this {
    this._plugins.use(plugin, options)
    return this
  }

  /**
   * 注册服务
   */
  private registerServices(): void {
    const serviceConfigs = this._options.services || {}

    // 注册核心服务，使用正确的类型转换
    this._container.registerInstance('container', this._container)
    this._container.registerInstance('events', this._events)
    this._container.registerInstance('plugins', this._plugins)

    this._events.emit('engine.services.register', {
      serviceCount: Object.keys(serviceConfigs).length,
    })
  }

  /**
   * 初始化Cesium Viewer
   */
  private async initViewer(): Promise<void> {
    // 这里将创建和配置Cesium Viewer
    // 在实际实现时，这部分工作会交给ViewerService处理

    // 简化示例，实际实现会更复杂
    this._events.emit('engine.viewer.creating')

    // 使用DI容器获取ViewerService
    // this.viewer = this._container.resolve('viewerService').createViewer();

    this._events.emit('engine.viewer.created')
  }

  /**
   * 安装配置的插件
   */
  private installPlugins(): void {
    const plugins = this._options.plugins || []
    for (const plugin of plugins) {
      this._plugins.use(plugin)
    }

    this._events.emit('engine.plugins.installed', {
      pluginCount: plugins.length,
    })
  }

  /**
   * 释放引擎资源
   */
  public dispose(): void {
    this.stop()

    // 发布销毁开始事件
    this._events.emit('engine.destroy.start')

    // 卸载所有插件
    const pluginNames = Array.from(this._plugins.plugins.keys())
    for (const name of pluginNames) {
      this._plugins.remove(name)
    }

    // 清理事件
    this._events.clear()

    // 销毁Viewer
    if (this.viewer) {
      this.viewer.destroy()
      this.viewer = null
    }

    // 发布销毁完成事件
    this._events.emit('engine.destroy.complete')

    // 清除事件总线
    // 注意：不要在此之前清除事件，以确保所有销毁事件都能被处理
    this._events['handlers'].clear()
    this._events['onceHandlers'].clear()

    this._initialized = false
  }
}
