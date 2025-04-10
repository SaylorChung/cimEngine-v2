import { IWidgetService, WidgetOptions } from './types'
import { EventBus } from '../../core/eventBus'

/**
 * 小部件服务实现
 */
export class WidgetService implements IWidgetService {
  private _events: EventBus
  private _widgets: Map<string, any> = new Map()
  private _widgetOptions: Map<string, WidgetOptions> = new Map()

  /**
   * 构造函数
   * @param container 主容器元素
   * @param events 事件总线
   */
  constructor(container: HTMLElement, events: EventBus) {
    this._events = events
  }

  /**
   * 添加小部件
   * @param widgetId 小部件ID
   * @param widget 小部件实例
   * @param options 小部件选项
   */
  addWidget(widgetId: string, widget: any, options: WidgetOptions = {}): void {
    if (this._widgets.has(widgetId)) {
      console.warn(`小部件 ${widgetId} 已存在`)
      return
    }

    this._widgets.set(widgetId, widget)
    this._widgetOptions.set(widgetId, options)

    if (options.show !== false) {
      this.showWidget(widgetId)
    }

    this._events.emit('widget.added', { widgetId, widget })
  }

  /**
   * 移除小部件
   * @param widgetId 小部件ID
   */
  removeWidget(widgetId: string): void {
    if (!this._widgets.has(widgetId)) {
      return
    }

    const widget = this._widgets.get(widgetId)

    // 调用部件销毁方法(如果有)
    if (typeof widget.destroy === 'function') {
      widget.destroy()
    }

    this._widgets.delete(widgetId)
    this._widgetOptions.delete(widgetId)
    this._events.emit('widget.removed', { widgetId })
  }

  /**
   * 获取小部件
   * @param widgetId 小部件ID
   */
  getWidget(widgetId: string): any {
    return this._widgets.get(widgetId)
  }

  /**
   * 显示小部件
   * @param widgetId 小部件ID
   */
  showWidget(widgetId: string): void {
    const widget = this._widgets.get(widgetId)
    if (!widget) return

    if (typeof widget.show === 'function') {
      widget.show()
    }

    this._events.emit('widget.shown', { widgetId })
  }

  /**
   * 隐藏小部件
   * @param widgetId 小部件ID
   */
  hideWidget(widgetId: string): void {
    const widget = this._widgets.get(widgetId)
    if (!widget) return

    if (typeof widget.hide === 'function') {
      widget.hide()
    }

    this._events.emit('widget.hidden', { widgetId })
  }
}
