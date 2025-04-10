import { Engine } from '../core/engine'
import { ViewerOptions } from '../services/viewer/types'
import Cesium from '../cesiumLoader'

/**
 * 查看器API
 */
export class ViewerApi {
  private _engine: Engine

  constructor(engine: Engine) {
    this._engine = engine
  }

  /**
   * 获取查看器实例
   */
  get viewer(): Cesium.Viewer {
    return this._engine.viewerService.viewer
  }

  /**
   * 创建查看器
   * @param container 容器元素或ID
   * @param options 查看器选项
   * @returns Cesium Viewer实例
   */
  createViewer(container: string | HTMLElement, options?: ViewerOptions): Cesium.Viewer {
    return this._engine.viewerService.createViewer(container, options)
  }

  /**
   * 销毁查看器
   */
  destroy(): void {
    this._engine.viewerService.destroyViewer()
  }

  /**
   * 设置查看器选项
   * @param options 查看器选项
   */
  setOptions(options: ViewerOptions): void {
    // 暂时实现，需要在ViewerService中添加对应方法
    if (this._engine.viewerService.viewer) {
      // 应用选项
      const viewer = this._engine.viewerService.viewer
      // 可以在此处实现选项设置逻辑
    }
  }

  /**
   * 获取查看器容器元素
   */
  getContainer(): HTMLElement {
    return this._engine.viewerService.getContainer()!
  }

  /**
   * 获取查看器画布元素
   */
  getCanvas(): HTMLCanvasElement {
    return this._engine.viewerService.viewer.canvas
  }

  /**
   * 调整查看器大小
   */
  resize(): void {
    this._engine.viewerService.resize()
  }

  /**
   * 切换到2D模式
   */
  switchTo2D(): void {
    this._engine.viewerService.switchTo2D()
  }

  /**
   * 切换到3D模式
   */
  switchTo3D(): void {
    this._engine.viewerService.switchTo3D()
  }

  /**
   * 切换到哥伦布视图
   */
  switchToColumbus(): void {
    this._engine.viewerService.switchToColumbus()
  }

  /**
   * 显示/隐藏时间轴控件
   * @param visible 是否可见
   */
  showTimeline(visible: boolean): void {
    this._engine.viewerService.showTimeline(visible)
  }

  /**
   * 显示/隐藏动画控件
   * @param visible 是否可见
   */
  showAnimation(visible: boolean): void {
    this._engine.viewerService.showAnimation(visible)
  }

  /**
   * 设置时间轴可见性
   * @param visible 是否可见
   */
  setTimelineVisibility(visible: boolean): void {
    this._engine.viewerService.setTimelineVisibility(visible)
  }

  /**
   * 设置动画控件可见性
   * @param visible 是否可见
   */
  setAnimationVisibility(visible: boolean): void {
    this._engine.viewerService.setAnimationVisibility(visible)
  }

  /**
   * 设置性能模式
   * @param mode 性能模式：high(高质量)、medium(平衡)、low(高性能)
   */
  setPerformanceMode(mode: 'high' | 'medium' | 'low'): void {
    this._engine.viewerService.setPerformanceMode(mode)
  }
}
