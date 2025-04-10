import { Engine } from './engine'
import { CameraApi } from '../apis/cameraApi'
import { SceneApi } from '../apis/sceneApi'
import { TerrainApi } from '../apis/terrainApi'
import { LayerApi } from '../apis/layerApi'
import { ViewerApi } from '../apis/viewerApi'

/**
 * API管理器 - 为引擎提供统一的API访问点
 */
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
   * 构造函数
   * @param engine 引擎实例
   */
  constructor(engine: Engine) {
    this.camera = new CameraApi(engine)
    this.scene = new SceneApi(engine)
    this.terrain = new TerrainApi(engine)
    this.layer = new LayerApi(engine)
    this.viewer = new ViewerApi(engine)
  }

  /**
   * 初始化所有API
   * @internal 内部使用，由引擎自动调用
   */
  init(): void {
    // 如果API有需要初始化的逻辑，在这里执行
  }
}
