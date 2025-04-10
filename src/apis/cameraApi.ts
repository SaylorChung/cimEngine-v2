import { Engine } from '../core/engine'
import {
  CameraPosition,
  CameraViewOptions,
  CameraFlyToOptions,
  CameraLimits,
} from '../services/camera/types'

/**
 * 相机API选项类型
 */
export interface CameraApiOptions {
  // 从相机服务类型中选择需要暴露给用户的选项
  viewOptions?: CameraViewOptions
  flyOptions?: CameraFlyToOptions
  limits?: CameraLimits
}

/**
 * 相机控制API
 */
export class CameraApi {
  private _engine: Engine

  constructor(engine: Engine) {
    this._engine = engine
  }

  /**
   * 设置相机视角
   * @param options 视角选项
   */
  setView(options: CameraViewOptions): void {
    this._engine.cameraService.setView(options)
  }

  /**
   * 飞行到指定位置
   * @param options 飞行选项
   * @returns Promise，飞行完成返回true，取消返回false
   */
  flyTo(options: CameraFlyToOptions): Promise<boolean> {
    return this._engine.cameraService.flyTo(options)
  }

  /**
   * 相机看向目标点
   * @param target 目标位置
   * @param offset 视角偏移
   */
  lookAt(target: any, offset: any): void {
    this._engine.cameraService.lookAt(target, offset)
  }

  /**
   * 设置相机限制
   * @param limits 限制选项
   */
  setLimits(limits: CameraLimits): void {
    this._engine.cameraService.setLimits(limits)
  }

  /**
   * 飞行到正北方向
   * @returns Promise，完成返回true
   */
  flyToNorth(): Promise<boolean> {
    return this._engine.cameraService.flyToNorth()
  }

  /**
   * 保存当前相机位置
   * @param name 可选的位置名称
   * @returns 位置ID
   */
  savePosition(name?: string): string {
    return this._engine.cameraService.savePosition(name)
  }

  /**
   * 恢复已保存的相机位置
   * @param id 位置ID
   * @returns 是否成功恢复
   */
  restorePosition(id: string): boolean {
    return this._engine.cameraService.restorePosition(id)
  }

  /**
   * 获取相机位置历史
   * @returns 相机位置历史记录
   */
  getPositionHistory(): CameraPosition[] {
    return this._engine.cameraService.getPositionHistory()
  }

  /**
   * 启用/禁用轨道控制
   * @param enabled 是否启用
   */
  enableOrbitControl(enabled: boolean = true): void {
    if (enabled) {
      this._engine.cameraService.enableOrbitControl()
    } else {
      this._engine.cameraService.disableOrbitControl()
    }
  }

  /**
   * 启用/禁用第一人称控制
   * @param enabled 是否启用
   */
  enableFirstPersonControl(enabled: boolean = true): void {
    if (enabled) {
      this._engine.cameraService.enableFirstPersonControl()
    } else {
      this._engine.cameraService.disableFirstPersonControl()
    }
  }

  /**
   * 监听相机移动结束事件
   * @param callback 回调函数
   * @returns 取消订阅函数
   */
  onMoveEnd(callback: (position: CameraPosition) => void): () => void {
    return this._engine.cameraService.onMoveEnd(callback)
  }

  /**
   * 监听相机视图变化事件
   * @param callback 回调函数
   * @returns 取消订阅函数
   */
  onViewChanged(callback: (position: CameraPosition) => void): () => void {
    return this._engine.cameraService.onViewChanged(callback)
  }
}
