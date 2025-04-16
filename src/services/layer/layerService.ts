import type { IEventBus } from '../../core/types'
import type { IViewerService } from '../viewer/types'
import type { ILayerService } from './types'

import { injectable, inject } from 'tsyringe'

/**
 * 图层服务实现
 */
@injectable()
export class LayerService implements ILayerService {
  private _viewerService: IViewerService
  private _events: IEventBus

  constructor(
    @inject('ViewerService') viewerService: IViewerService,
    @inject('EventBus') events: IEventBus
  ) {
    this._viewerService = viewerService
    this._events = events
    console.log(this._viewerService)
  }

  /**
   * 初始化服务
   */
  public init(): Promise<void> {
    // 初始化代码
    this._events.emit('layer.initialized')
    return Promise.resolve()
  }
  /**
   * 销毁服务
   */
  public dispose(): void {
    this._events.emit('layer.disposed')
  }
}
