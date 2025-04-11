/**
 * ViewerService实现
 * 负责创建和管理Cesium Viewer实例
 */
import { injectable, inject } from 'tsyringe'
import type { IViewerService, ViewerOptions } from './types'
import type { IEventBus } from '../../core/types'
import Cesium from '../../cesiumLoader'

/**
 * Cesium Viewer服务实现
 */
@injectable()
export class ViewerService implements IViewerService {
  private _container: HTMLElement | null = null
  private _events: IEventBus // 使用接口类型
  private _viewer: Cesium.Viewer | null = null

  /**
   * 构造函数
   * @param events 事件总线
   */
  constructor(@inject('EventBus') events: IEventBus) {
    // 注入接口类型
    this._events = events
  }

  /**
   * 获取Viewer实例
   */
  public get viewer(): Cesium.Viewer {
    if (!this._viewer) {
      throw new Error('Viewer is not created yet')
    }
    return this._viewer
  }

  /**
   * 创建Viewer
   * @param container 容器元素或ID
   * @param options Viewer选项
   * @returns Cesium Viewer实例
   */
  public createViewer(container: string | HTMLElement, options?: ViewerOptions): Cesium.Viewer {
    if (this._viewer) {
      this.destroyViewer()
    }

    // 准备容器元素
    if (typeof container === 'string') {
      const element = document.getElementById(container)
      if (!element) {
        throw new Error(`Container element with id "${container}" not found`)
      }
      this._container = element
    } else {
      this._container = container
    }

    // 发布事件
    this._events.emit('viewer.creating', { container, options })

    // 创建Viewer实例
    this._viewer = new Cesium.Viewer(this._container, {
      timeline: options?.timeline ?? false,
      animation: options?.animation ?? false,
      baseLayerPicker: options?.baseLayerPicker ?? false,
      fullscreenButton: options?.fullscreenButton ?? false,
      geocoder: options?.geocoder ?? false,
      homeButton: options?.homeButton ?? false,
      infoBox: options?.infoBox ?? false,
      sceneModePicker: options?.sceneModePicker ?? false,
      navigationHelpButton: options?.navigationHelpButton ?? false,
      shadows: options?.shadows ?? false,
      terrainShadows: options?.terrainShadows ?? Cesium.ShadowMode.DISABLED,
      requestRenderMode: options?.requestRenderMode ?? true,
      maximumRenderTimeChange: options?.maximumRenderTimeChange ?? 0.0,
      // 应用其他选项...
    })

    // 配置性能优化
    this._viewer.scene.logarithmicDepthBuffer = true
    this._viewer.scene.postProcessStages.fxaa.enabled = true

    // 发布事件
    this._events.emit('viewer.created', { viewer: this._viewer })

    return this._viewer
  }

  /**
   * 销毁Viewer
   */
  public destroyViewer(): void {
    if (!this._viewer) {
      return
    }

    // 发布事件
    this._events.emit('viewer.destroying', { viewer: this._viewer })

    // 销毁Viewer
    this._viewer.destroy()
    this._viewer = null

    // 发布事件
    this._events.emit('viewer.destroyed')
  }

  /**
   * 获取容器元素
   * @returns 容器元素
   */
  public getContainer(): HTMLElement | null {
    return this._container
  }

  /**
   * 调整Viewer大小
   */
  public resize(): void {
    if (this._viewer) {
      this._viewer.resize()
      this._events.emit('viewer.resized')
    }
  }

  /**
   * 切换到2D模式
   */
  public switchTo2D(): void {
    if (this._viewer) {
      this._viewer.scene.morphTo2D(1.0)
      this._events.emit('viewer.modeChanged', { mode: '2D' })
    }
  }

  /**
   * 切换到3D模式
   */
  public switchTo3D(): void {
    if (this._viewer) {
      this._viewer.scene.morphTo3D(1.0)
      this._events.emit('viewer.modeChanged', { mode: '3D' })
    }
  }

  /**
   * 切换到哥伦布视图
   */
  public switchToColumbus(): void {
    if (this._viewer) {
      this._viewer.scene.morphToColumbusView(1.0)
      this._events.emit('viewer.modeChanged', { mode: 'Columbus' })
    }
  }

  /**
   * 显示/隐藏时间轴控件
   * @param visible 是否可见
   */
  public showTimeline(visible: boolean): void {
    if (this._viewer && this._viewer.timeline) {
      const container = this._viewer.timeline.container as HTMLElement
      container.style.visibility = visible ? 'visible' : 'hidden'
      this._events.emit('viewer.ui.timeline', { visible })
    }
  }

  /**
   * 显示/隐藏动画控件
   * @param visible 是否可见
   */
  public showAnimation(visible: boolean): void {
    if (this._viewer && this._viewer.animation) {
      const container = this._viewer.animation.container as HTMLElement
      container.style.visibility = visible ? 'visible' : 'hidden'
      this._events.emit('viewer.ui.animation', { visible })
    }
  }

  public setTimelineVisibility(visible: boolean): void {
    if (!this._viewer) return
    const container = this._viewer.timeline.container as HTMLElement
    container.style.visibility = visible ? 'visible' : 'hidden'
  }

  public setAnimationVisibility(visible: boolean): void {
    if (!this._viewer) return
    const container = this._viewer.animation.container as HTMLElement
    container.style.visibility = visible ? 'visible' : 'hidden'
  }

  /**
   * 设置性能模式
   * @param mode 性能模式
   */
  public setPerformanceMode(mode: 'high' | 'medium' | 'low'): void {
    if (!this._viewer) {
      return
    }

    const scene = this._viewer.scene

    switch (mode) {
      case 'high':
        // 高性能模式
        scene.fog.enabled = true
        scene.fog.density = 0.0002
        scene.skyAtmosphere.show = true
        scene.globe.enableLighting = true
        scene.shadowMap.enabled = true
        scene.shadowMap.softShadows = true
        scene.postProcessStages.fxaa.enabled = true
        break

      case 'medium':
        // 中等性能模式
        scene.fog.enabled = true
        scene.fog.density = 0.0001
        scene.skyAtmosphere.show = true
        scene.globe.enableLighting = false
        scene.shadowMap.enabled = false
        scene.postProcessStages.fxaa.enabled = true
        break

      case 'low':
        // 低性能模式
        scene.fog.enabled = false
        scene.skyAtmosphere.show = false
        scene.globe.enableLighting = false
        scene.shadowMap.enabled = false
        scene.postProcessStages.fxaa.enabled = false
        break
    }

    this._events.emit('viewer.performance.changed', { mode })
  }

  /**
   * 服务初始化
   */
  public init(): void {
    // 初始化逻辑
    this._events.emit('viewer.service.initialized')
  }

  /**
   * 服务销毁
   */
  public dispose(): void {
    this.destroyViewer()
    this._events.emit('viewer.service.disposed')
  }
}
