/**
 * ViewerService类型定义
 */
import Cesium from '../../cesiumLoader'
import { Service } from '../../core/types'

/**
 * Viewer服务选项
 */
export interface ViewerOptions {
  // 基本UI选项
  timeline?: boolean
  animation?: boolean
  baseLayerPicker?: boolean
  fullscreenButton?: boolean
  geocoder?: boolean
  homeButton?: boolean
  infoBox?: boolean
  sceneModePicker?: boolean
  navigationHelpButton?: boolean

  // 性能相关选项
  shadows?: boolean
  terrainShadows?: Cesium.ShadowMode
  requestRenderMode?: boolean
  maximumRenderTimeChange?: number

  // 场景选项
  skyBox?: Cesium.SkyBox | false
  skyAtmosphere?: Cesium.SkyAtmosphere | false

  // 其他Cesium Viewer选项...
}

/**
 * ViewerService接口
 */
export interface IViewerService extends Service {
  // Viewer实例
  readonly viewer: Cesium.Viewer

  // 创建/销毁
  createViewer(container: string | HTMLElement, options?: ViewerOptions): Cesium.Viewer
  destroyViewer(): void

  // 获取/设置容器
  getContainer(): HTMLElement | null
  resize(): void

  // 视图模式
  switchTo2D(): void
  switchTo3D(): void
  switchToColumbus(): void

  // UI控制
  showTimeline(visible: boolean): void
  showAnimation(visible: boolean): void

  // 性能设置
  setPerformanceMode(mode: 'high' | 'medium' | 'low'): void

  // UI visibility control
  setTimelineVisibility(visible: boolean): void
  setAnimationVisibility(visible: boolean): void
}
