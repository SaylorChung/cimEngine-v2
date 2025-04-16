import { injectable, inject } from 'tsyringe'
import type { ViewerOptions, IViewerService } from '../services/viewer/types'
import Cesium from '../cesiumLoader'

/**
 * 查看器API
 */
@injectable()
export class ViewerApi {
  private _viewerService: IViewerService
  constructor(@inject('ViewService') viewerService: IViewerService) {
    this._viewerService = viewerService
  }

  /**
   * 获取查看器实例
   */
  get viewer(): Cesium.Viewer {
    return this._viewerService.viewer
  }

  /**
   * 销毁查看器
   */
  destroy(): void {
    this._viewerService.destroyViewer()
  }

  /**
   * 设置查看器选项
   * @param _options 查看器选项
   */
  setOptions(_options: ViewerOptions): void {}

  /**
   * 获取查看器画布元素
   */
  getCanvas(): HTMLCanvasElement {
    return this._viewerService.viewer.canvas
  }

  /**
   * 调整查看器大小
   */
  resize(): void {
    this._viewerService.resize()
  }

  /**
   * 切换到2D模式
   */
  switchTo2D(): void {
    this._viewerService.switchTo2D()
  }

  /**
   * 切换到3D模式
   */
  switchTo3D(): void {
    this._viewerService.switchTo3D()
  }

  /**
   * 切换到哥伦布视图
   */
  switchToColumbus(): void {
    this._viewerService.switchToColumbus()
  }

  /**
   * 显示/隐藏时间轴控件
   * @param visible 是否可见
   */
  showTimeline(visible: boolean): void {
    this._viewerService.showTimeline(visible)
  }

  /**
   * 显示/隐藏动画控件
   * @param visible 是否可见
   */
  showAnimation(visible: boolean): void {
    this._viewerService.showAnimation(visible)
  }

  /**
   * 设置时间轴可见性
   * @param visible 是否可见
   */
  setTimelineVisibility(visible: boolean): void {
    this._viewerService.setTimelineVisibility(visible)
  }

  /**
   * 设置动画控件可见性
   * @param visible 是否可见
   */
  setAnimationVisibility(visible: boolean): void {
    this._viewerService.setAnimationVisibility(visible)
  }

  /**
   * 设置性能模式
   * @param mode 性能模式：high(高质量)、medium(平衡)、low(高性能)
   */
  setPerformanceMode(mode: 'high' | 'medium' | 'low'): void {
    this._viewerService.setPerformanceMode(mode)
  }
}
