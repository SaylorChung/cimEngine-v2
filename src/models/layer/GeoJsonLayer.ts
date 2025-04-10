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

    // 获取所有实体并设置透明度
    const entities = this.instance.entities.values
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i]

      // 处理多边形
      if (entity.polygon) {
        if (entity.polygon.material instanceof Cesium.ColorMaterialProperty) {
          const color = entity.polygon.material.color.getValue()
          if (color) {
            entity.polygon.material = new Cesium.ColorMaterialProperty(
              new Cesium.Color(color.red, color.green, color.blue, this._opacity)
            )
          }
        }
      }

      // 处理点
      if (entity.point) {
        if (entity.point.color) {
          const color = entity.point.color.getValue()
          if (color) {
            entity.point.color = new Cesium.ConstantProperty(
              new Cesium.Color(color.red, color.green, color.blue, this._opacity)
            )
          }
        }
      }

      // 处理线
      if (entity.polyline) {
        if (entity.polyline.material instanceof Cesium.ColorMaterialProperty) {
          const color = entity.polyline.material.color.getValue()
          if (color) {
            entity.polyline.material = new Cesium.ColorMaterialProperty(
              new Cesium.Color(color.red, color.green, color.blue, this._opacity)
            )
          }
        }
      }
    }
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
