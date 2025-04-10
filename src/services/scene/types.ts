/**
 * SceneService类型定义
 */
import Cesium from '../../cesiumLoader'
import { Service } from '../../core/types'

/**
 * 场景模式枚举
 */
export type SceneMode = Cesium.SceneMode

/**
 * 场景配置选项
 */
export interface SceneOptions {
  globe?: boolean
  skyBox?: boolean
  skyAtmosphere?: boolean
  sun?: boolean
  moon?: boolean
  fog?: boolean
  fogDensity?: number
  backgroundColor?: Cesium.Color
  fxaa?: boolean
  msaa?: boolean
  logarithmicDepthBuffer?: boolean
  enableLighting?: boolean
  shadows?: boolean
  softShadows?: boolean
  shadowDarkness?: number
  useRequestRenderMode?: boolean
  maximumRenderTimeChange?: number
}
/**
 * 天空盒选项
 */
export interface SkyBoxOptions {
  show?: boolean
  sources?: {
    positiveX: string
    negativeX: string
    positiveY: string
    negativeY: string
    positiveZ: string
    negativeZ: string
  }
}

/**
 * 大气选项
 */
export interface AtmosphereOptions {
  show?: boolean
  density?: number
  ellipsoidScale?: number
}

/**
 * 场景服务接口
 */
export interface ISceneService extends Service {
  /**
   * 获取Scene实例
   */
  readonly scene: Cesium.Scene

  /**
   * 设置Scene实例
   * @param scene Cesium场景对象
   */
  setScene(scene: Cesium.Scene): void

  /**
   * 配置场景
   * @param options 场景配置选项
   */
  configure(options: SceneOptions): void

  /**
   * 设置天空盒
   * @param options 天空盒配置
   */
  setSkyBox(options: SkyBoxOptions): void

  /**
   * 设置大气
   * @param options 大气配置
   */
  setAtmosphere(options: AtmosphereOptions): void

  /**
   * 设置大气选项
   * @param options 大气选项
   */
  setAtmosphereOptions(options: AtmosphereOptions): void

  /**
   * 设置雾效果
   * @param enabled 是否启用雾
   * @param density 雾密度
   */
  setFog(enabled: boolean, density?: number): void

  /**
   * 设置光照
   * @param enabled 是否启用光照
   */
  setLighting(enabled: boolean): void

  /**
   * 设置阴影
   * @param enabled 是否启用阴影
   * @param options 阴影选项
   */
  setShadows(enabled: boolean, options?: { softShadows?: boolean; darkness?: number }): void

  /**
   * 设置是否对地形进行深度测试
   * @param enabled 是否启用对地形的深度测试
   */
  setDepthTestAgainstTerrain(enabled: boolean): void

  /**
   * 设置场景模式
   * @param mode 场景模式
   * @returns Promise表示模式变化完成
   */
  setSceneMode(mode: Cesium.SceneMode): Promise<void>

  /**
   * 获取当前场景模式
   * @returns 当前场景模式
   */
  getSceneMode(): Cesium.SceneMode

  /**
   * 设置性能模式
   * @param mode 性能模式
   */
  setPerformanceMode(mode: 'high' | 'medium' | 'low'): void

  /**
   * 启用/禁用FXAA抗锯齿
   * @param enabled 是否启用
   */
  enableFxaa(enabled: boolean): void

  /**
   * 注册预渲染回调
   * @param callback 回调函数
   */
  onPreRender(callback: (scene: Cesium.Scene) => void): void

  /**
   * 注册后渲染回调
   * @param callback 回调函数
   */
  onPostRender(callback: (scene: Cesium.Scene) => void): void

  /**
   * 设置地形夸张系数
   * @param scale 夸张系数
   */
  setTerrainExaggeration(scale: number): void

  /**
   * 启用/禁用阳光照明
   * @param enabled 是否启用
   */
  enableSunLighting(enabled: boolean): void

  /**
   * 启用/禁用大气效果
   * @param enabled 是否启用
   */
  enableAtmosphere(enabled: boolean): void

  /**
   * 设置场景背景色
   * @param color 背景色
   */
  setBackgroundColor(color: Cesium.Color): void

  /**
   * 启用/禁用雾效果
   * @param enabled 是否启用
   */
  enableFog(enabled: boolean): void

  /**
   * 截取场景图像
   * @returns 场景图像数据URL的Promise
   */
  captureScreenshot(): Promise<string>
}
