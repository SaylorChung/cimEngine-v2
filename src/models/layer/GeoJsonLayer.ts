import Cesium from '../../cesiumLoader'
import { IEventBus } from '../../core/types'
import { GeoJsonLayerOptions } from '../../services/layer/types'
import { BaseLayer } from './BaseLayer'

/**
 * GeoJSON图层类
 */
export class GeoJsonLayer extends BaseLayer {
  declare instance: Cesium.DataSource
  declare options: GeoJsonLayerOptions

  constructor(options: GeoJsonLayerOptions, instance: Cesium.DataSource, events: IEventBus) {
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
  }

  destroy(): void {
    if (this.instance) {
      // 获取包含此数据源的数据源集合
      const viewer = (this.instance as any)._viewer
      if (viewer && viewer.dataSources) {
        viewer.dataSources.remove(this.instance)
      }
    }
    this._events.emit('layer.destroyed', { id: this.id })
  }
}
