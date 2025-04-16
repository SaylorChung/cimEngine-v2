/**
 * ViewerService实现
 * 负责创建和管理Cesium Viewer实例
 */
import { injectable, inject } from 'tsyringe'
import type { IViewerService, ViewerOptions } from './types'
import type { EngineOptions, IEventBus } from '../../core/types'
import Cesium from '../../cesiumLoader'

/**
 * Cesium Viewer服务实现
 */
@injectable()
export class ViewerService implements IViewerService {
  private _container!: HTMLElement | string
  private _events: IEventBus
  private _viewer: Cesium.Viewer | null = null
  private _engineOptions: EngineOptions

  /**
   * 构造函数
   * @param events 事件总线
   */
  constructor(
    @inject('EventBus') events: IEventBus,
    @inject('EngineOptions') engineOptions: EngineOptions
  ) {
    this._events = events
    this._engineOptions = engineOptions || {}
    if (!this._engineOptions.container) {
      this._container = this._engineOptions.container
    }
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
    // 检查容器
    if (!this._container && this._engineOptions.container) {
      if (typeof this._engineOptions.container === 'string') {
        const element = document.getElementById(this._engineOptions.container)
        if (element) {
          this._container = element
        }
      } else {
        this._container = this._engineOptions.container
      }
    }

    // 如果没有容器，尝试查找备选容器
    if (!this._container) {
      const mapContainer = document.querySelector('.map-container')
      if (mapContainer instanceof HTMLElement) {
        this._container = mapContainer
      } else {
        throw new Error('无法找到容器元素，Viewer无法创建')
      }
    }

    // 获取Viewer选项
    const viewerOptions = this._engineOptions.viewerOptions || {}

    // 创建Viewer
    this.createViewer(this._container, viewerOptions)

    // 应用性能模式
    if (this._engineOptions.options?.performance) {
      this.setPerformanceMode(this._engineOptions.options.performance)
    }
  }

  /**
   * 服务销毁
   */
  public dispose(): void {
    this.destroyViewer()
    this._events.emit('viewer.service.disposed')
  }
}
