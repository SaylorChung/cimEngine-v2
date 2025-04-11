import { injectable, inject } from 'tsyringe'
import type { IEventBus } from './types'
import type { ICameraService } from '../services/camera/types'
import type { ISceneService } from '../services/scene/types'
import type { ITerrainService } from '../services/terrain/types'
import type { ILayerService } from '../services/layer/types'
import type { IViewerService } from '../services/viewer/types'

import { CameraApi } from '../apis/cameraApi'
import { SceneApi } from '../apis/sceneApi'
import { TerrainApi } from '../apis/terrainApi'
import { LayerApi } from '../apis/layerApi'
import { ViewerApi } from '../apis/viewerApi'

/**
 * API管理器 - 为引擎提供统一的API访问点
 */
@injectable()
export class ApiManager {
  /**
   * 相机API
   */
  public readonly camera: CameraApi

  /**
   * 场景API
   */
  public readonly scene: SceneApi

  /**
   * 地形API
   */
  public readonly terrain: TerrainApi

  /**
   * 图层API
   */
  public readonly layer: LayerApi

  /**
   * 查看器API
   */
  public readonly viewer: ViewerApi

  /**
   * 构造函数 - 通过依赖注入接收所需的服务
   */
  constructor(
    @inject('CameraService') cameraService: ICameraService,
    @inject('SceneService') sceneService: ISceneService,
    @inject('TerrainService') terrainService: ITerrainService,
    @inject('LayerService') layerService: ILayerService,
    @inject('ViewerService') viewerService: IViewerService,
    @inject('EventBus') events: IEventBus
  ) {
    this.camera = new CameraApi(cameraService)
    this.scene = new SceneApi(sceneService)
    this.terrain = new TerrainApi(terrainService)
    this.layer = new LayerApi(layerService)
    this.viewer = new ViewerApi(viewerService)
  }

  /**
   * 初始化所有API
   * @internal 内部使用，由引擎自动调用
   */
  init(): void {
    // 如果API有需要初始化的逻辑，在这里执行
  }
}
