import { Engine } from '../core/engine'
import { SceneMode } from '../services/scene/types'
import Cesium from '../cesiumLoader'

/**
 * 场景API
 */
export class SceneApi {
  private _engine: Engine

  constructor(engine: Engine) {
    this._engine = engine
  }

  /**
   * 获取场景实例
   */
  get scene(): Cesium.Scene {
    return this._engine.sceneService.scene
  }

  /**
   * 设置场景模式
   * @param mode 场景模式
   * @returns Promise，表示模式变化完成
   */
  async setMode(mode: SceneMode): Promise<void> {
    return this._engine.sceneService.setSceneMode(mode)
  }

  /**
   * 获取当前场景模式
   */
  getMode(): SceneMode {
    return this._engine.sceneService.getSceneMode()
  }

  /**
   * 设置地形夸张系数
   * @param scale 夸张系数
   */
  setTerrainExaggeration(scale: number): void {
    this._engine.sceneService.setTerrainExaggeration(scale)
  }

  /**
   * 启用/禁用阳光照明
   * @param enabled 是否启用
   */
  enableSunLighting(enabled: boolean): void {
    this._engine.sceneService.enableSunLighting(enabled)
  }

  /**
   * 启用/禁用大气效果
   * @param enabled 是否启用
   */
  enableAtmosphere(enabled: boolean): void {
    this._engine.sceneService.enableAtmosphere(enabled)
  }

  /**
   * 设置场景背景色
   * @param color 背景色
   */
  setBackgroundColor(color: Cesium.Color): void {
    this._engine.sceneService.setBackgroundColor(color)
  }

  /**
   * 启用/禁用雾效果
   * @param enabled 是否启用
   */
  enableFog(enabled: boolean): void {
    this._engine.sceneService.setFog(enabled)
  }

  /**
   * 截取场景图像
   * @returns 图像数据URL的Promise
   */
  async captureScreenshot(): Promise<string> {
    return this._engine.sceneService.captureScreenshot()
  }

  /**
   * 设置场景性能模式
   * @param mode 性能模式：high(高质量)、medium(平衡)、low(高性能)
   */
  setPerformanceMode(mode: 'high' | 'medium' | 'low'): void {
    this._engine.sceneService.setPerformanceMode(mode)
  }
}
