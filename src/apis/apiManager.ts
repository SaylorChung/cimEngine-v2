import { Engine } from '../core/engine'
import { CameraApi } from './cameraApi'
import { SceneApi } from './sceneApi'
import { LayerApi } from './layerApi'
import { ViewerApi } from './viewerApi'

/**
 * API管理器，提供对所有API模块的访问
 */
export class ApiManager {
  // API模块实例
  public camera: CameraApi
  public scene: SceneApi
  public layer: LayerApi
  public viewer: ViewerApi

  constructor(engine: Engine) {
    // 初始化API模块
    this.camera = new CameraApi(engine)
    this.scene = new SceneApi(engine)
    this.layer = new LayerApi(engine)
    this.viewer = new ViewerApi(engine)
  }

  /**
   * 初始化所有API
   * @internal 内部使用，由引擎自动调用
   */
  public init(): void {
    // API初始化逻辑
  }
}
