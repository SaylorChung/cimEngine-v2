import Cesium from '../../cesiumLoader'
import { Service } from '../../core/types'

/**
 * 相机位置信息
 */
export interface CameraPosition {
  position: Cesium.Cartesian3
  heading: number
  pitch: number
  roll: number
  timestamp: number
}

/**
 * 相机事件回调
 */
export type CameraEventCallback = (position: CameraPosition) => void

/**
 * 相机缩放限制
 */
export interface CameraZoomLimits {
  minZoomDistance?: number
  maxZoomDistance?: number
}

/**
 * 相机视图选项
 */
export interface CameraViewOptions {
  destination: Cesium.Cartesian3 | Cesium.Rectangle
  orientation?: {
    heading?: number
    pitch?: number
    roll?: number
  }
  endTransform?: Cesium.Matrix4
}

/**
 * 相机飞行选项
 */
export interface CameraFlyToOptions extends CameraViewOptions {
  duration?: number
  maximumHeight?: number
  pitchAdjustHeight?: number
  flyOverLongitude?: number
  flyOverLongitudeWeight?: number
  easingFunction?: (time: number) => number
}

/**
 * 相机限制选项
 */
export interface CameraLimits extends CameraZoomLimits {
  minPitch?: number
  maxPitch?: number
  bounds?: Cesium.Rectangle
}

/**
 * 相机路径点
 */
export interface CameraWaypoint {
  position: Cesium.Cartesian3
  heading?: number
  pitch?: number
  roll?: number
  duration?: number
}

/**
 * 相机动画对象
 */
export interface CameraAnimation {
  id: string
  waypoints: CameraWaypoint[]
  duration: number
  loop: boolean
  easingFunction?: (time: number) => number
}

/**
 * 相机服务接口定义
 */
export interface ICameraService extends Service {
  // 获取Cesium原生相机实例
  getCameraInstance(): Cesium.Camera

  // 基础相机操作
  setView(options: CameraViewOptions): void
  flyTo(options: CameraFlyToOptions): Promise<boolean>
  lookAt(target: Cesium.Cartesian3, offset: Cesium.HeadingPitchRange): void

  // 视角控制
  setHeading(heading: number): void
  setPitch(pitch: number): void
  setRoll(roll: number): void

  // 限制设置
  setLimits(limits: CameraLimits): void

  // 高级相机控制
  enableOrbitControl(): void
  disableOrbitControl(): void
  enableFirstPersonControl(): void
  disableFirstPersonControl(): void

  // 指北功能
  flyToNorth(): Promise<boolean>

  // 位置历史
  savePosition(name?: string): string
  restorePosition(id: string): boolean
  getPositionHistory(): CameraPosition[]

  // 相机路径动画
  createPathAnimation(waypoints: CameraWaypoint[]): CameraAnimation
  playAnimation(animation: CameraAnimation): Promise<void>
  stopAnimation(): void

  // 事件监听
  onMoveEnd(callback: (position: CameraPosition) => void): () => void
  onMoveStart(callback: (position: CameraPosition) => void): () => void
  onViewChanged(callback: (position: CameraPosition) => void): () => void
}
