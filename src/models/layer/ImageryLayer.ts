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

  destroy(): void {
    if (this.instance && this.instance.imageryProvider) {
      // 检查是否有 destroy 方法（使用类型安全的方式）
      const provider = this.instance.imageryProvider
      if (provider && typeof (provider as any).destroy === 'function') {
        ;(provider as any).destroy()
      }
      // 如果图层已添加到场景中，需要从场景中移除
      if (this._layerCollection) {
        this._layerCollection.remove(this.instance)
      }
    }

    super.destroy() // 调用父类的销毁方法
    this._events.emit('layer.destroyed', { id: this.id })
  }
}
