import { injectable, inject } from 'tsyringe'
import type { ICameraService } from '../services/camera/types'
import type {
  CameraPosition,
  CameraViewOptions,
  CameraFlyToOptions,
  CameraLimits,
} from '../services/camera/types'

/**
 * 相机API选项类型
 */
export interface CameraApiOptions {
  viewOptions?: CameraViewOptions
  flyOptions?: CameraFlyToOptions
  limits?: CameraLimits
}

/**
 * 相机控制API
 */
@injectable()
export class CameraApi {
  private _cameraService: ICameraService
  constructor(@inject('CameraService') cameraService: ICameraService) {
    this._cameraService = cameraService
  }

  /**
   * 设置相机视角
   * @param options 视角选项
   */
  setView(options: CameraViewOptions): void {
    this._cameraService.setView(options)
  }

  /**
   * 飞行到指定位置
   * @param options 飞行选项
   * @returns Promise，飞行完成返回true，取消返回false
   */
  flyTo(options: CameraFlyToOptions): Promise<boolean> {
    return this._cameraService.flyTo(options)
  }

  /**
   * 相机看向目标点
   * @param target 目标位置
   * @param offset 视角偏移
   */
  lookAt(target: any, offset: any): void {
    this._cameraService.lookAt(target, offset)
  }

  /**
   * 设置相机限制
   * @param limits 限制选项
   */
  setLimits(limits: CameraLimits): void {
    this._cameraService.setLimits(limits)
  }

  /**
   * 飞行到正北方向
   * @returns Promise，完成返回true
   */
  flyToNorth(): Promise<boolean> {
    return this._cameraService.flyToNorth()
  }

  /**
   * 保存当前相机位置
   * @param name 可选的位置名称
   * @returns 位置ID
   */
  savePosition(name?: string): string {
    return this._cameraService.savePosition(name)
  }

  /**
   * 恢复已保存的相机位置
   * @param id 位置ID
   * @returns 是否成功恢复
   */
  restorePosition(id: string): boolean {
    return this._cameraService.restorePosition(id)
  }

  /**
   * 获取相机位置历史
   * @returns 相机位置历史记录
   */
  getPositionHistory(): CameraPosition[] {
    return this._cameraService.getPositionHistory()
  }

  /**
   * 启用/禁用轨道控制
   * @param enabled 是否启用
   */
  enableOrbitControl(enabled: boolean = true): void {
    if (enabled) {
      this._cameraService.enableOrbitControl()
    } else {
      this._cameraService.disableOrbitControl()
    }
  }

  /**
   * 启用/禁用第一人称控制
   * @param enabled 是否启用
   */
  enableFirstPersonControl(enabled: boolean = true): void {
    if (enabled) {
      this._cameraService.enableFirstPersonControl()
    } else {
      this._cameraService.disableFirstPersonControl()
    }
  }

  /**
   * 监听相机移动结束事件
   * @param callback 回调函数
   * @returns 取消订阅函数
   */
  onMoveEnd(callback: (position: CameraPosition) => void): () => void {
    return this._cameraService.onMoveEnd(callback)
  }

  /**
   * 监听相机视图变化事件
   * @param callback 回调函数
   * @returns 取消订阅函数
   */
  onViewChanged(callback: (position: CameraPosition) => void): () => void {
    return this._cameraService.onViewChanged(callback)
  }
}
