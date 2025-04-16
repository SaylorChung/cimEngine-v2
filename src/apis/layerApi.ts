import type { ILayerService } from '../services/layer/types'
import { injectable, inject } from 'tsyringe'

/**
 * 图层API
 */
@injectable()
export class LayerApi {
  private _layerService: ILayerService
  constructor(@inject('LayerService') layerService: ILayerService) {
    this._layerService = layerService
    console.log(this._layerService)
  }
}
