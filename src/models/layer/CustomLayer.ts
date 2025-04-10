import { CustomLayerOptions } from '../../services/layer/types'
import { BaseLayer } from './BaseLayer'

/**
 * 自定义图层类
 */
export class CustomLayer extends BaseLayer {
  declare options: CustomLayerOptions

  destroy(): void {
    const instance = this.instance

    // 尝试调用实例的销毁方法
    if (instance) {
      if (typeof instance.destroy === 'function') {
        instance.destroy()
      } else if (typeof instance.dispose === 'function') {
        instance.dispose()
      }
    }

    this._events.emit('layer.destroyed', { id: this.id })
  }
}
