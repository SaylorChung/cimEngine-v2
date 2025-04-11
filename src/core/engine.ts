import { EventBus } from './eventBus'
import { ApiManager } from './apiManager'
import { container, DependencyContainer } from 'tsyringe'

// 导入所有服务接口
import type { EngineOptions, IEngine, IEventBus } from './types'
import type { ICameraService } from '../services/camera/types'
import type { IViewerService } from '../services/viewer/types'
import type { ISceneService } from '../services/scene/types'
import type { ILayerService } from '../services/layer/types'
import type { ITerrainService } from '../services/terrain/types'
import type { IWidgetService } from '../services/widget/types'
import type { IToolService } from '../services/tool/types'
import type { IDataService } from '../services/data/types'

// 导入服务实现
import { ViewerService } from '../services/viewer/viewerService'
import { SceneService } from '../services/scene/sceneService'
import { CameraService } from '../services/camera/cameraService'
import { LayerService } from '../services/layer/layerService'
import { TerrainService } from '../services/terrain/terrainService'
import { WidgetService } from '../services/widget/widgetService'
import { ToolService } from '../services/tool/toolService'
import { DataService } from '../services/data/dataService'

// 导入 Api服务实现
import { CameraApi } from '../apis/cameraApi'
import { SceneApi } from '../apis/sceneApi'
import { LayerApi } from '../apis/layerApi'
import { ViewerApi } from '../apis/viewerApi'

/**
 * 引擎核心类
 */
export class Engine implements IEngine {
  /**
   * 事件总线
   */
  public readonly events: IEventBus

  /**
   * API管理器
   */
  public readonly api: ApiManager

  /**
   * 依赖注入容器
   */
  private _container: DependencyContainer

  /**
   * 是否已初始化
   */
  private _initialized: boolean = false

  /**
   * 创建引擎实例
   * @param options 引擎选项
   */
  constructor(options: Partial<EngineOptions> = {}) {
    // 创建子容器，确保每个引擎实例有独立的服务集合
    this._container = container.createChildContainer()

    // 创建事件总线 - 作为基础组件直接实例化
    // 事件总线是所有服务的基础依赖，需要在容器初始化前可用
    this.events = new EventBus()

    // 然后将其注册到容器中供其他服务使用
    this._container.registerInstance('EventBus', this.events)

    // 注册服务
    this._registerServices()

    // 创建API管理器
    this.api = this._container.resolve<ApiManager>('ApiManager')

    // 应用用户选项
    this._applyOptions(options as EngineOptions)
  }

  /**
   * 初始化引擎
   */
  public async init(): Promise<void> {
    if (this._initialized) {
      console.warn('Engine already initialized')
      return
    }

    try {
      // 初始化视图服务 (首先初始化)
      if (typeof this.viewerService.init === 'function') {
        await this.viewerService.init()
      }

      // 初始化场景服务
      if (typeof this.sceneService.init === 'function') {
        await this.sceneService.init()
      }

      // 初始化其他服务
      const services = [
        this.cameraService,
        this.layerService,
        this.terrainService,
        this.widgetService,
        this.toolService,
        this.dataService,
      ]

      // 初始化所有服务
      for (const service of services) {
        if (service && typeof service.init === 'function') {
          await service.init()
        }
      }

      // 初始化API
      this.api.init()
      this._initialized = true
      this.events.emit('engine.initialized')
    } catch (error) {
      this.events.emit('engine.error', { error })
      throw error
    }
  }

  /**
   * 销毁引擎
   */
  public async dispose(): Promise<void> {
    if (!this._initialized) {
      return
    }

    try {
      // 以相反的顺序销毁服务
      const services = [
        this.dataService,
        this.toolService,
        this.widgetService,
        this.terrainService,
        this.layerService,
        this.cameraService,
        this.sceneService,
        this.viewerService,
      ]

      // 销毁所有服务
      for (const service of services) {
        if (service && typeof service.dispose === 'function') {
          await service.dispose()
        }
      }

      this._initialized = false
      this.events.emit('engine.disposed')

      // 销毁子容器
      this._container = container.createChildContainer()
    } catch (error) {
      this.events.emit('engine.error', { error })
      throw error
    }
  }

  /**
   * 注册所有服务
   * @private
   */
  private _registerServices(): void {
    // 注册引擎实例
    this._container.registerInstance('Engine', this)

    // 注册事件总线
    this._container.registerInstance('EventBus', this.events)

    // 注册所有服务为单例，但只在这个引擎实例的容器中是单例
    this._container.registerSingleton<IViewerService>('ViewerService', ViewerService)
    this._container.registerSingleton<ISceneService>('SceneService', SceneService)
    this._container.registerSingleton<ICameraService>('CameraService', CameraService)
    this._container.registerSingleton<ILayerService>('LayerService', LayerService)
    this._container.registerSingleton<ITerrainService>('TerrainService', TerrainService)
    this._container.registerSingleton<IWidgetService>('WidgetService', WidgetService)
    this._container.registerSingleton<IToolService>('ToolService', ToolService)
    this._container.registerSingleton<IDataService>('DataService', DataService)

    // 注册API模块
    this._container.registerSingleton('CameraApi', CameraApi)
    this._container.registerSingleton('SceneApi', SceneApi)
    this._container.registerSingleton('LayerApi', LayerApi)
    this._container.registerSingleton('ViewerApi', ViewerApi)

    // 注册API管理器
    this._container.registerSingleton('ApiManager', ApiManager)
  }

  /**
   * 应用用户选项
   * @param options 引擎选项
   * @private
   */
  private _applyOptions(options: EngineOptions): void {
    // 处理容器选项
    if (options.container) {
      // 根据参数设置容器
      let containerElement: HTMLElement
      if (typeof options.container === 'string') {
        containerElement =
          document.getElementById(options.container) || document.createElement('div')
      } else {
        containerElement = options.container
      }
      // 如果需要在创建 ViewerService 之前提供容器
      this._container.registerInstance('Container', containerElement)
    }
    // 处理其他选项...
    if (options.options) {
      const { performance, debug, autoStart } = options.options
      // 应用性能模式
      if (performance) {
        // 配置性能相关设置
      }
      // 应用调试模式
      if (debug) {
        // 开启调试相关功能
      }
      // 处理自动启动
      if (autoStart) {
        setTimeout(() => this.init(), 0)
      }
    }
  }

  /**
   * 获取相机服务
   */
  public get cameraService(): ICameraService {
    return this._container.resolve<ICameraService>('CameraService')
  }

  /**
   * 获取查看器服务
   */
  public get viewerService(): IViewerService {
    return this._container.resolve<IViewerService>('ViewerService')
  }

  /**
   * 获取场景服务
   */
  public get sceneService(): ISceneService {
    return this._container.resolve<ISceneService>('SceneService')
  }

  /**
   * 获取图层服务
   */
  public get layerService(): ILayerService {
    return this._container.resolve<ILayerService>('LayerService')
  }

  /**
   * 获取地形服务
   */
  public get terrainService(): ITerrainService {
    return this._container.resolve<ITerrainService>('TerrainService')
  }

  /**
   * 获取小部件服务
   */
  public get widgetService(): IWidgetService {
    return this._container.resolve<IWidgetService>('WidgetService')
  }

  /**
   * 获取工具服务
   */
  public get toolService(): IToolService {
    return this._container.resolve<IToolService>('ToolService')
  }

  /**
   * 获取数据服务
   */
  public get dataService(): IDataService {
    return this._container.resolve<IDataService>('DataService')
  }
}
