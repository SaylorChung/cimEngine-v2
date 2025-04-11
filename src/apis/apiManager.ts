import { CameraApi } from './cameraApi'
import { SceneApi } from './sceneApi'
import { LayerApi } from './layerApi'
import { ViewerApi } from './viewerApi'
import { injectable, inject } from 'tsyringe'

/**
 * API管理器，提供对所有API模块的访问
 */
@injectable()
export class ApiManager {
  constructor(
    @inject('CameraApi') public readonly camera: CameraApi,
    @inject('SceneApi') public readonly scene: SceneApi,
    @inject('LayerApi') public readonly layer: LayerApi,
    @inject('ViewerApi') public readonly viewer: ViewerApi
  ) {}

  /**
   * 初始化所有API
   * @internal 内部使用，由引擎自动调用
   */
  public init(): void {
    // API初始化逻辑
  }
}
