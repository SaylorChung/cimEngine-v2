import { injectable, inject } from 'tsyringe'
import type { ISceneService, SceneMode } from '../services/scene/types'
import Cesium from '../cesiumLoader'

/**
 * 场景API
 */
@injectable()
export class SceneApi {
  private _sceneService: ISceneService
  constructor(@inject('SceneService') sceneService: ISceneService) {
    this._sceneService = sceneService
  }

  /**
   * 获取场景实例
   */
  get scene(): Cesium.Scene {
    return this._sceneService.scene
  }

  /**
   * 设置场景模式
   * @param mode 场景模式
   * @returns Promise，表示模式变化完成
   */
  async setMode(mode: SceneMode): Promise<void> {
    return this._sceneService.setSceneMode(mode)
  }

  /**
   * 获取当前场景模式
   */
  getMode(): SceneMode {
    return this._sceneService.getSceneMode()
  }

  /**
   * 设置地形夸张系数
   * @param scale 夸张系数
   */
  setTerrainExaggeration(scale: number): void {
    this._sceneService.setTerrainExaggeration(scale)
  }

  /**
   * 启用/禁用阳光照明
   * @param enabled 是否启用
   */
  enableSunLighting(enabled: boolean): void {
    this._sceneService.enableSunLighting(enabled)
  }

  /**
   * 启用/禁用大气效果
   * @param enabled 是否启用
   */
  enableAtmosphere(enabled: boolean): void {
    this._sceneService.enableAtmosphere(enabled)
  }

  /**
   * 设置场景背景色
   * @param color 背景色
   */
  setBackgroundColor(color: Cesium.Color): void {
    this._sceneService.setBackgroundColor(color)
  }

  /**
   * 启用/禁用雾效果
   * @param enabled 是否启用
   */
  enableFog(enabled: boolean): void {
    this._sceneService.setFog(enabled)
  }

  /**
   * 截取场景图像
   * @returns 图像数据URL的Promise
   */
  async captureScreenshot(): Promise<string> {
    return this._sceneService.captureScreenshot()
  }

  /**
   * 设置场景性能模式
   * @param mode 性能模式：high(高质量)、medium(平衡)、low(高性能)
   */
  setPerformanceMode(mode: 'high' | 'medium' | 'low'): void {
    this._sceneService.setPerformanceMode(mode)
  }
}
