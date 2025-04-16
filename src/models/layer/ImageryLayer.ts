import Cesium from '../../cesiumLoader'
import { IEventBus } from '../../core/types'
import { ImageryLayerOptions } from '../../services/layer/types'
import { BaseLayer } from './BaseLayer'

/**
 * 影像图层类
 */
export class ImageryLayer extends BaseLayer {
  declare instance: Cesium.ImageryLayer
  declare options: ImageryLayerOptions

  constructor(options: ImageryLayerOptions, instance: Cesium.ImageryLayer, events: IEventBus) {
    super(options, instance, events)
  }

  show(): void {
    super.show()
    this.instance.show = true
  }

  hide(): void {
    super.hide()
    this.instance.show = false
  }

  setOpacity(opacity: number): void {
    super.setOpacity(opacity)
    this.instance.alpha = this._opacity
  }

  destroy(): void {}
}
