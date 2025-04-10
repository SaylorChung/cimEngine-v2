import Cesium from '../../cesiumLoader'
import { IEventBus } from '../../core/types'
import { TilesetLayerOptions } from '../../services/layer/types'
import { BaseLayer } from './BaseLayer'

/**
 * 3DTiles图层类
 */
export class TilesetLayer extends BaseLayer {
  declare instance: Cesium.Cesium3DTileset
  declare options: TilesetLayerOptions

  constructor(options: TilesetLayerOptions, instance: Cesium.Cesium3DTileset, events: IEventBus) {
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
    // 对于3DTiles，需要设置每个瓦片的样式
    if (this.instance.style) {
      // 如果已有样式，合并而非覆盖
      const styleConfig = {
        color: {
          conditions: [['true', `color('white', ${this._opacity})`]],
        },
      }
      this.instance.style = new Cesium.Cesium3DTileStyle(styleConfig)
    } else {
      this.instance.style = new Cesium.Cesium3DTileStyle({
        color: `color('white', ${this._opacity})`,
      })
    }
  }

  destroy(): void {
    if (this.instance) {
      this.instance.destroy()
    }
    this._events.emit('layer.destroyed', { id: this.id })
  }
}
