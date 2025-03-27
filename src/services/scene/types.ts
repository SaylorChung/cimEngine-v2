/**
 * SceneService类型定义
 */
import Cesium from '../../cesium'
import { Service } from '../../core/types'

/**
 * 场景配置选项
 */
export interface SceneOptions {
  // 基础场景属性
  globe?: boolean
  skyBox?: boolean
  skyAtmosphere?: boolean
  sun?: boolean
  moon?: boolean

  // 环境设置
  fog?: boolean
  fogDensity?: number
  backgroundColor?: Cesium.Color

  // 渲染设置
  fxaa?: boolean
  msaa?: boolean
  logarithmicDepthBuffer?: boolean

  // 光照设置
  enableLighting?: boolean

  // 阴影设置
  shadows?: boolean
  softShadows?: boolean
  shadowDarkness?: number

  // 性能设置
  useRequestRenderMode?: boolean
  maximumRenderTimeChange?: number
}

/**
 * 天空盒配置
 */
export interface SkyBoxOptions {
  show?: boolean
  sources?: {
    positiveX?: string
    negativeX?: string
    positiveY?: string
    negativeY?: string
    positiveZ?: string
    negativeZ?: string
  }
}

/**
 * 大气配置
 */
export interface AtmosphereOptions {
  show?: boolean
  density?: number
  ellipsoidScale?: number
}

/**
 * SceneService接口
 */
export interface ISceneService extends Service {
  // 场景实例
  readonly scene: Cesium.Scene

  // 场景配置
  configure(options: SceneOptions): void

  // 天空盒配置
  setSkyBox(options: SkyBoxOptions): void

  // 大气配置
  setAtmosphere(options: AtmosphereOptions): void

  // 雾效果
  setFog(enabled: boolean, density?: number): void

  // 光照控制
  setLighting(enabled: boolean): void

  // 阴影控制
  setShadows(enabled: boolean, options?: { softShadows?: boolean; darkness?: number }): void

  // 深度检测
  setDepthTestAgainstTerrain(enabled: boolean): void

  // 场景模式
  setSceneMode(mode: Cesium.SceneMode): void

  // 性能相关
  setPerformanceMode(mode: 'high' | 'medium' | 'low'): void
  enableFxaa(enabled: boolean): void

  // 事件
  onPreRender(callback: (scene: Cesium.Scene) => void): void
  onPostRender(callback: (scene: Cesium.Scene) => void): void
}
