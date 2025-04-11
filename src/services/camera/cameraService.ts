/**
 * CameraService实现
 * 负责管理Cesium相机及其相关操作
 */
import Cesium from '../../cesiumLoader'
import type { IEventBus } from '../../core/types'
import type { IViewerService } from '../viewer/types'
import { createState } from '../../core/state/createState'
import type {
  ICameraService,
  CameraPosition,
  CameraViewOptions,
  CameraFlyToOptions,
  CameraLimits,
  CameraWaypoint,
  CameraAnimation,
} from './types'
import { injectable, inject } from 'tsyringe'
/**
 * Cesium Camera服务实现
 */
@injectable()
export class CameraService implements ICameraService {
  private _viewerService: IViewerService
  private _events: IEventBus
  private _positionHistory: Map<string, CameraPosition> = new Map()
  private _activeAnimation: CameraAnimation | null = null
  private _animationCancelled: boolean = false
  private _orbitControlEnabled: boolean = false
  private _firstPersonControlEnabled: boolean = false
  private _limits: CameraLimits = {}

  // 相机状态
  private _cameraState = createState<CameraPosition>({
    position: new Cesium.Cartesian3(),
    heading: 0,
    pitch: 0,
    roll: 0,
    timestamp: 0,
  })

  /**
   * 构造函数
   * @param viewerService Viewer服务
   * @param events 事件总线
   */
  constructor(
    @inject('ViewerService') viewerService: IViewerService,
    @inject('EventBus') events: IEventBus
  ) {
    this._viewerService = viewerService
    this._events = events

    // 初始化
    this._initialize()
  }
  /**
   * 获取Cesium原生相机实例
   */
  public getCameraInstance(): Cesium.Camera {
    return this._viewerService.viewer.camera
  }
  /**
   * 获取当前相机对象
   */
  private get camera(): Cesium.Camera {
    return this._viewerService.viewer.camera
  }

  /**
   * 初始化相机服务
   */
  private _initialize(): void {
    // 设置相机移动事件监听
    this.camera.moveEnd.addEventListener(this._handleMoveEnd, this)
    this.camera.moveStart.addEventListener(this._handleMoveStart, this)
    this.camera.changed.addEventListener(this._handleCameraChanged, this)

    // 更新初始状态
    this._updateCameraState()
  }

  /**
   * 设置相机视角
   */
  public setView(options: CameraViewOptions): void {
    this.camera.setView({
      destination: options.destination,
      orientation: options.orientation,
      endTransform: options.endTransform,
    })
  }

  /**
   * 相机飞行到指定位置
   */
  public async flyTo(options: CameraFlyToOptions): Promise<boolean> {
    return new Promise(resolve => {
      const completeCallback = () => resolve(true)
      const cancelCallback = () => resolve(false)

      this.camera.flyTo({
        destination: options.destination,
        orientation: options.orientation,
        duration: options.duration,
        maximumHeight: options.maximumHeight,
        pitchAdjustHeight: options.pitchAdjustHeight,
        flyOverLongitude: options.flyOverLongitude,
        flyOverLongitudeWeight: options.flyOverLongitudeWeight,
        easingFunction: options.easingFunction,
        complete: completeCallback,
        cancel: cancelCallback,
      })
    })
  }

  /**
   * 相机看向目标点
   */
  public lookAt(target: Cesium.Cartesian3, offset: Cesium.HeadingPitchRange): void {
    this.camera.lookAt(target, offset)
  }

  /**
   * 设置相机heading
   */
  public setHeading(heading: number): void {
    this.camera.setView({
      orientation: {
        heading: Cesium.Math.toRadians(heading),
        pitch: this.camera.pitch,
        roll: this.camera.roll,
      },
    })
  }

  /**
   * 设置相机pitch
   */
  public setPitch(pitch: number): void {
    this.camera.setView({
      orientation: {
        heading: this.camera.heading,
        pitch: Cesium.Math.toRadians(pitch),
        roll: this.camera.roll,
      },
    })
  }

  /**
   * 设置相机roll
   */
  public setRoll(roll: number): void {
    this.camera.setView({
      orientation: {
        heading: this.camera.heading,
        pitch: this.camera.pitch,
        roll: Cesium.Math.toRadians(roll),
      },
    })
  }

  /**
   * 设置相机限制
   */
  public setLimits(limits: CameraLimits): void {
    this._limits = { ...this._limits, ...limits }

    // 应用限制
    if (limits.minZoomDistance !== undefined) {
      // Cesium Camera 的这些属性实际存在但类型定义可能缺失，使用类型断言
      const camera = this.camera as any
      camera.minimumZoomDistance = limits.minZoomDistance
    }

    if (limits.maxZoomDistance !== undefined) {
      const camera = this.camera as any
      camera.maximumZoomDistance = limits.maxZoomDistance
    }

    // 注册相机限制事件
    if (limits.bounds || limits.minPitch !== undefined || limits.maxPitch !== undefined) {
      // 先移除之前可能存在的事件监听器
      this.camera.changed.removeEventListener(this._enforceLimits, this)
      // 添加新的监听器
      this.camera.changed.addEventListener(this._enforceLimits, this)
    }
  }

  public setZoomLimits(limits: CameraLimits): void {
    if (limits.minZoomDistance !== undefined) {
      ;(this.camera as any).minimumZoomDistance = limits.minZoomDistance
    }
    if (limits.maxZoomDistance !== undefined) {
      ;(this.camera as any).maximumZoomDistance = limits.maxZoomDistance
    }
  }

  /**
   * 强制执行相机限制
   */
  private _enforceLimits(): void {
    // 限制俯仰角
    if (
      this._limits.minPitch !== undefined &&
      Cesium.Math.toDegrees(this.camera.pitch) < this._limits.minPitch
    ) {
      this.camera.setView({
        orientation: {
          heading: this.camera.heading,
          pitch: Cesium.Math.toRadians(this._limits.minPitch),
          roll: this.camera.roll,
        },
      })
    }

    if (
      this._limits.maxPitch !== undefined &&
      Cesium.Math.toDegrees(this.camera.pitch) > this._limits.maxPitch
    ) {
      this.camera.setView({
        orientation: {
          heading: this.camera.heading,
          pitch: Cesium.Math.toRadians(this._limits.maxPitch),
          roll: this.camera.roll,
        },
      })
    }

    // 限制边界
    if (this._limits.bounds) {
      // 获取相机当前位置的经纬度
      const ellipsoid =
        this.camera.frustum.near > 0 ? Cesium.Ellipsoid.WGS84 : new Cesium.Ellipsoid(1, 1, 1)

      const cameraPosition = this.camera.positionWC
      const cartographic = ellipsoid.cartesianToCartographic(cameraPosition)

      if (cartographic) {
        const longitude = Cesium.Math.toDegrees(cartographic.longitude)
        const latitude = Cesium.Math.toDegrees(cartographic.latitude)

        // 检查是否超出边界
        const bounds = this._limits.bounds
        let needAdjust = false
        let newLon = longitude
        let newLat = latitude

        if (longitude < bounds.west) {
          newLon = Cesium.Math.toDegrees(bounds.west)
          needAdjust = true
        } else if (longitude > bounds.east) {
          newLon = Cesium.Math.toDegrees(bounds.east)
          needAdjust = true
        }

        if (latitude < bounds.south) {
          newLat = Cesium.Math.toDegrees(bounds.south)
          needAdjust = true
        } else if (latitude > bounds.north) {
          newLat = Cesium.Math.toDegrees(bounds.north)
          needAdjust = true
        }

        // 如果需要调整，则设置新的相机位置
        if (needAdjust) {
          const newPosition = Cesium.Cartesian3.fromDegrees(newLon, newLat, cartographic.height)
          this.camera.position = newPosition
        }
      }
    }
  }

  /**
   * 启用轨道控制器
   */
  public enableOrbitControl(): void {
    if (this._orbitControlEnabled) return

    // 实现轨道控制器
    this._orbitControlEnabled = true
    const scene = this._viewerService.viewer.scene
    scene.screenSpaceCameraController.enableRotate = true
    scene.screenSpaceCameraController.enableTranslate = true
    scene.screenSpaceCameraController.enableZoom = true
    scene.screenSpaceCameraController.enableTilt = true

    // 如果启用了第一人称控制，则关闭它
    if (this._firstPersonControlEnabled) {
      this.disableFirstPersonControl()
    }

    // 发布事件
    this._events.emit('camera.orbitControlEnabled', {})
  }

  /**
   * 禁用轨道控制器
   */
  public disableOrbitControl(): void {
    if (!this._orbitControlEnabled) return

    this._orbitControlEnabled = false

    // 发布事件
    this._events.emit('camera.orbitControlDisabled', {})
  }

  /**
   * 启用第一人称控制
   */
  public enableFirstPersonControl(): void {
    if (this._firstPersonControlEnabled) return

    // 实现第一人称控制器
    this._firstPersonControlEnabled = true

    // 如果启用了轨道控制，则关闭它
    if (this._orbitControlEnabled) {
      this.disableOrbitControl()
    }

    // 设置第一人称相机参数
    const scene = this._viewerService.viewer.scene
    scene.screenSpaceCameraController.enableRotate = true
    scene.screenSpaceCameraController.enableTranslate = true
    scene.screenSpaceCameraController.enableZoom = true
    scene.screenSpaceCameraController.enableTilt = true
    scene.screenSpaceCameraController.enableLook = true

    // 设置合适的近裁剪面距离
    this.camera.frustum.near = 0.1

    // 发布事件
    this._events.emit('camera.firstPersonControlEnabled', {})
  }

  /**
   * 禁用第一人称控制
   */
  public disableFirstPersonControl(): void {
    if (!this._firstPersonControlEnabled) return

    this._firstPersonControlEnabled = false

    // 恢复默认相机参数
    const scene = this._viewerService.viewer.scene
    scene.screenSpaceCameraController.enableLook = false

    // 恢复默认近裁剪面距离
    this.camera.frustum.near = 1.0

    // 发布事件
    this._events.emit('camera.firstPersonControlDisabled', {})
  }

  /**
   * 相机指北
   */
  public async flyToNorth(): Promise<boolean> {
    // 获取当前相机位置
    const currentPosition = this.camera.position

    // 保持相机位置不变，只调整heading为0（北向）
    return this.flyTo({
      destination: currentPosition,
      orientation: {
        heading: 0,
        pitch: this.camera.pitch,
        roll: this.camera.roll,
      },
      duration: 1.5,
    })
  }

  /**
   * 保存当前相机位置
   */
  public savePosition(name?: string): string {
    const position: CameraPosition = {
      position: this.camera.position.clone(),
      heading: this.camera.heading,
      pitch: this.camera.pitch,
      roll: this.camera.roll,
      timestamp: Date.now(),
    }

    const id = name || `position_${Date.now()}`
    this._positionHistory.set(id, position)

    // 发布事件
    this._events.emit('camera.positionSaved', { id, position })

    return id
  }

  /**
   * 恢复之前保存的相机位置
   */
  public restorePosition(id: string): boolean {
    const savedPosition = this._positionHistory.get(id)
    if (!savedPosition) return false

    this.setView({
      destination: savedPosition.position,
      orientation: {
        heading: savedPosition.heading,
        pitch: savedPosition.pitch,
        roll: savedPosition.roll,
      },
    })

    // 发布事件
    this._events.emit('camera.positionRestored', { id, position: savedPosition })

    return true
  }

  /**
   * 获取位置历史记录
   */
  public getPositionHistory(): CameraPosition[] {
    return Array.from(this._positionHistory.values())
  }

  /**
   * 创建相机路径动画
   */
  public createPathAnimation(waypoints: CameraWaypoint[]): CameraAnimation {
    const animation: CameraAnimation = {
      id: `animation_${Date.now()}`,
      waypoints: waypoints,
      duration: waypoints.reduce((sum, wp) => sum + (wp.duration || 2), 0),
      loop: false,
    }

    return animation
  }

  /**
   * 播放相机动画
   */
  public async playAnimation(animation: CameraAnimation): Promise<void> {
    if (this._activeAnimation) {
      this.stopAnimation()
    }

    this._activeAnimation = animation
    this._animationCancelled = false

    // 发布动画开始事件
    this._events.emit('camera.animationStarted', { animation })

    try {
      for (let i = 0; i < animation.waypoints.length; i++) {
        if (this._animationCancelled) break

        const waypoint = animation.waypoints[i]
        await this.flyTo({
          destination: waypoint.position,
          orientation: {
            heading: waypoint.heading,
            pitch: waypoint.pitch,
            roll: waypoint.roll,
          },
          duration: waypoint.duration || 2,
          easingFunction: animation.easingFunction,
        })

        // 发布路径点到达事件
        this._events.emit('camera.waypointReached', {
          animation,
          waypointIndex: i,
          waypoint,
        })
      }

      // 如果动画设置为循环，且未被取消，则递归调用
      if (animation.loop && !this._animationCancelled) {
        return this.playAnimation(animation)
      }
    } finally {
      if (!this._animationCancelled) {
        // 只有在动画未被取消的情况下才发布完成事件
        this._events.emit('camera.animationCompleted', { animation })
      }

      this._activeAnimation = null
    }
  }

  /**
   * 停止当前动画
   */
  public stopAnimation(): void {
    if (!this._activeAnimation) return

    this._animationCancelled = true
    this.camera.cancelFlight()

    // 发布动画取消事件
    this._events.emit('camera.animationCancelled', {
      animation: this._activeAnimation,
    })

    this._activeAnimation = null
  }

  /**
   * 相机移动结束事件处理
   */
  private _handleMoveEnd(): void {
    this._updateCameraState()

    const position = this._cameraState.get()
    this._events.emit('camera.moveEnd', position)
  }

  /**
   * 相机移动开始事件处理
   */
  private _handleMoveStart(): void {
    this._updateCameraState()

    const position = this._cameraState.get()
    this._events.emit('camera.moveStart', position)
  }

  /**
   * 相机变化事件处理
   */
  private _handleCameraChanged(): void {
    this._updateCameraState()

    const position = this._cameraState.get()
    this._events.emit('camera.changed', position)
  }

  /**
   * 更新相机状态
   */
  private _updateCameraState(): void {
    this._cameraState.update({
      position: this.camera.position.clone(),
      heading: this.camera.heading,
      pitch: this.camera.pitch,
      roll: this.camera.roll,
      timestamp: Date.now(),
    })
  }

  /**
   * 注册相机移动结束事件
   */
  public onMoveEnd(callback: (position: CameraPosition) => void): () => void {
    const unsubscribe = this._events.on('camera.moveEnd', callback)
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }

  /**
   * 注册相机移动开始事件
   */
  public onMoveStart(callback: (position: CameraPosition) => void): () => void {
    const unsubscribe = this._events.on('camera.moveStart', callback)
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }

  /**
   * 注册相机视图变化事件
   */
  public onViewChanged(callback: (position: CameraPosition) => void): () => void {
    return this._events.on('camera.changed', callback)
  }

  public onCameraChanged(callback: (position: CameraPosition) => void): () => void {
    const unsubscribe = this._events.on('camera.changed', callback)
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }

  /**
   * 服务初始化
   */
  public init(): void {
    // 初始化相机默认配置
    this._events.emit('camera.service.initialized')
  }

  /**
   * 服务销毁
   */
  public dispose(): void {
    // 移除事件监听
    if (this.camera) {
      this.camera.moveEnd.removeEventListener(this._handleMoveEnd, this)
      this.camera.moveStart.removeEventListener(this._handleMoveStart, this)
      this.camera.changed.removeEventListener(this._handleCameraChanged, this)
      this.camera.changed.removeEventListener(this._enforceLimits, this)
    }

    // 清理资源
    this._positionHistory.clear()
    this._activeAnimation = null

    // 发布事件
    this._events.emit('camera.service.disposed')
  }
}
