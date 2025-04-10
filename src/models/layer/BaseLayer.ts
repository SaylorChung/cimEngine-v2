import { IEventBus } from '../../core/types'
import { Layer, LayerOptionsUnion, LayerType } from '../../services/layer/types'

/**
 * 基础图层类
 */
export abstract class BaseLayer implements Layer {
  id: string
  name: string
  type: LayerType
  visible: boolean
  protected _opacity: number
  protected _events: IEventBus

  constructor(
    public options: LayerOptionsUnion,
    public instance: any,
    events: IEventBus
  ) {
    this.id = options.id
    this.name = options.name
    this.type = options.type
    this.visible = options.visible !== undefined ? options.visible : true
    this._opacity = options.opacity !== undefined ? options.opacity : 1.0
    this._events = events

    if (!this.visible) {
      this.hide()
    }
  }

  show(): void {
    this.visible = true
    this._events.emit('layer.visibility.changed', {
      id: this.id,
      visible: true,
    })
  }

  hide(): void {
    this.visible = false
    this._events.emit('layer.visibility.changed', {
      id: this.id,
      visible: false,
    })
  }

  setOpacity(opacity: number): void {
    this._opacity = Math.max(0, Math.min(1, opacity))
    this._events.emit('layer.opacity.changed', {
      id: this.id,
      opacity: this._opacity,
    })
  }

  getOpacity(): number {
    return this._opacity
  }

  abstract destroy(): void
}
