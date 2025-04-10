import { Container } from './container'
import { EngineOptions } from './types'
import { EventBus } from './eventBus'
import { ApiManager } from './apiManager'
import { ServiceRegistry } from './serviceRegistry' // 添加导入

// 导入所有服务接口
import { ICameraService } from '../services/camera/types'
import { IViewerService } from '../services/viewer/types'
import { ISceneService } from '../services/scene/types'
import { ILayerService } from '../services/layer/types'
import { ITerrainService } from '../services/terrain/types'
import { IWidgetService } from '../services/widget/types'
import { IToolService } from '../services/tool/types'
import { IDataService } from '../services/data/types'

// 导入服务实现
import { ViewerService } from '../services/viewer/viewerService'
import { SceneService } from '../services/scene/sceneService'
import { CameraService } from '../services/camera/cameraService'
import { LayerService } from '../services/layer/layerService'
import { TerrainService } from '../services/terrain/terrainService'
import { WidgetService } from '../services/widget/widgetService'
import { ToolService } from '../services/tool/toolService'
import { DataService } from '../services/data/dataService'

/**
 * 引擎核心类
 */
export class Engine {
  /**
   * 依赖注入容器
   */
  public readonly container: Container

  /**
   * 事件总线
   */
  public readonly events: EventBus

  /**
   * API管理器
   */
  public readonly api: ApiManager

  /**
   * 服务注册表
   */
  private _registry: ServiceRegistry // 添加属性声明

  /**
   * 是否已初始化
   */
  private _initialized: boolean = false

  /**
   * 创建引擎实例
   * @param options 引擎选项
   */
  constructor(options: Partial<EngineOptions> = {}) {
    // 创建容器
    this.container = new Container()

    // 创建事件总线
    this.events = new EventBus()

    // 注册核心服务
    this.container.registerInstance('events', this.events)

    // 创建服务注册表
    this._registry = new ServiceRegistry(this.container, this.events) // 初始化属性

    // 注册默认服务
    this._registerDefaultServices()

    // 创建API管理器
    this.api = new ApiManager(this)

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
      // 初始化所有服务
      await this._registry.initServices()
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
      // 销毁所有服务
      await this._registry.disposeServices()
      this._initialized = false
      this.events.emit('engine.disposed')
    } catch (error) {
      this.events.emit('engine.error', { error })
      throw error
    }
  }

  /**
   * 注册默认服务
   * @private
   */
  private _registerDefaultServices(): void {
    // 注册视图服务 - 假设需要选项参数
    this._registry.registerService(
      'viewerService',
      () => {
        return new ViewerService(this.events)
      },
      async () => {
        const service = this.viewerService
        await service.init?.()
      },
      async () => {
        this.viewerService.dispose?.()
      }
    )

    // 注册场景服务
    this._registry.registerService(
      'sceneService',
      () => {
        return new SceneService(this.events)
      },
      async () => {
        await this.sceneService.init?.()
      },
      async () => {
        this.sceneService.dispose?.()
      }
    )

    // 注册相机服务（依赖于视图服务）
    this._registry.registerService(
      'cameraService',
      () => {
        return new CameraService(this.viewerService, this.events)
      },
      async () => {
        await this.cameraService.init?.()
      },
      async () => {
        this.cameraService.dispose?.()
      }
    )

    // 注册图层服务（依赖于视图服务）
    this._registry.registerService(
      'layerService',
      () => {
        return new LayerService(this.viewerService, this.events)
      },
      async () => {
        await this.layerService.init?.()
      },
      async () => {
        this.layerService.dispose?.()
      }
    )

    // 注册地形服务（依赖于视图服务）
    this._registry.registerService(
      'terrainService',
      () => {
        return new TerrainService(this.viewerService.viewer, this.events)
      },
      async () => {
        await this.terrainService.init?.()
      },
      async () => {
        this.terrainService.dispose?.()
      }
    )

    // 注册小部件服务
    this._registry.registerService(
      'widgetService',
      () => {
        // 安全地获取容器
        const container = this.viewerService.getContainer?.() || document.body
        return new WidgetService(container, this.events)
      },
      async () => {
        await this.widgetService.init?.()
      },
      async () => {
        this.widgetService.dispose?.()
      }
    )

    // 注册工具服务
    this._registry.registerService(
      'toolService',
      () => {
        // 假设 ToolService 需要多个其他服务
        return new ToolService(this.events)
      },
      async () => {
        await this.toolService.init?.()
      },
      async () => {
        this.toolService.dispose?.()
      }
    )

    // 注册数据服务
    this._registry.registerService(
      'dataService',
      () => {
        return new DataService(this.events)
      },
      async () => {
        await this.dataService.init?.()
      },
      async () => {
        this.dataService.dispose?.()
      }
    )
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
      let container: HTMLElement
      if (typeof options.container === 'string') {
        container = document.getElementById(options.container) || document.createElement('div')
      } else {
        container = options.container
      }
      // // 假设 viewerService 需要设置容器
      // if (this.viewerService && typeof this.viewerService.setContainer === 'function') {
      //   this.viewerService.setContainer(container)
      // }
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
    return this.container.resolve<ICameraService>('cameraService')
  }

  /**
   * 获取查看器服务
   */
  public get viewerService(): IViewerService {
    return this.container.resolve<IViewerService>('viewerService')
  }

  /**
   * 获取场景服务
   */
  public get sceneService(): ISceneService {
    return this.container.resolve<ISceneService>('sceneService')
  }

  /**
   * 获取图层服务
   */
  public get layerService(): ILayerService {
    return this.container.resolve<ILayerService>('layerService')
  }

  /**
   * 获取地形服务
   */
  public get terrainService(): ITerrainService {
    return this.container.resolve<ITerrainService>('terrainService')
  }

  /**
   * 获取小部件服务
   */
  public get widgetService(): IWidgetService {
    return this.container.resolve<IWidgetService>('widgetService')
  }

  /**
   * 获取工具服务
   */
  public get toolService(): IToolService {
    return this.container.resolve<IToolService>('toolService')
  }

  /**
   * 获取数据服务
   */
  public get dataService(): IDataService {
    return this.container.resolve<IDataService>('dataService')
  }
}
