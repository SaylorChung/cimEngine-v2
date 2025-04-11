import type { IService } from '../../core/types'
/**
 * 小部件服务接口
 */
export interface IWidgetService extends IService {
  /**
   * 添加小部件
   * @param widget 小部件实例
   * @param options 小部件选项
   */
  addWidget(widgetId: string, widget: any, options?: WidgetOptions): void

  /**
   * 移除小部件
   * @param widgetId 小部件ID
   */
  removeWidget(widgetId: string): void

  /**
   * 获取小部件
   * @param widgetId 小部件ID
   */
  getWidget(widgetId: string): any

  /**
   * 显示小部件
   * @param widgetId 小部件ID
   */
  showWidget(widgetId: string): void

  /**
   * 隐藏小部件
   * @param widgetId 小部件ID
   */
  hideWidget(widgetId: string): void
}

/**
 * 小部件选项
 */
export interface WidgetOptions {
  /**
   * 小部件容器
   */
  container?: string | HTMLElement

  /**
   * 小部件位置
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'custom'

  /**
   * 是否默认显示
   */
  show?: boolean
}
