/**
 * SceneService实现
 * 负责管理Cesium场景和环境设置
 */
import Cesium from '../../cesiumLoader'
import { IEventBus } from '../../core/types'
import { AtmosphereOptions, ISceneService, SceneOptions, SkyBoxOptions } from './types'

/**
 * Scene服务实现
 */
export class SceneService implements ISceneService {
  private _scene: Cesium.Scene | null = null
  private _events: IEventBus
  private _preRenderCallbacks: ((scene: Cesium.Scene) => void)[] = []
  private _postRenderCallbacks: ((scene: Cesium.Scene) => void)[] = []

  /**
   * 构造函数
   * @param events 事件总线
   */
  constructor(events: IEventBus) {
    this._events = events
  }

  /**
   * 获取Scene实例
   */
  public get scene(): Cesium.Scene {
    if (!this._scene) {
      throw new Error('Scene is not available')
    }
    return this._scene
  }

  /**
   * 设置Scene实例
   */
  public setScene(scene: Cesium.Scene): void {
    this._scene = scene

    // 监听渲染事件
    this._scene.preRender.addEventListener(this.handlePreRender, this)
    this._scene.postRender.addEventListener(this.handlePostRender, this)

    this._events.emit('scene.set', { scene })
  }

  /**
   * 配置场景
   * @param options 场景配置选项
   */
  public configure(options: SceneOptions): void {
    if (!this._scene) {
      throw new Error('Scene is not available')
    }

    const scene = this._scene

    // 应用配置
    if (options.globe !== undefined) {
      scene.globe.show = options.globe
    }

    if (options.skyBox !== undefined) {
      scene.skyBox.show = options.skyBox
    }

    if (options.skyAtmosphere !== undefined) {
      scene.skyAtmosphere.show = options.skyAtmosphere
    }

    if (options.sun !== undefined) {
      scene.sun.show = options.sun
    }

    if (options.moon !== undefined) {
      scene.moon.show = options.moon
    }

    // 雾设置
    if (options.fog !== undefined) {
      scene.fog.enabled = options.fog
    }

    if (options.fogDensity !== undefined) {
      scene.fog.density = options.fogDensity
    }

    // 背景色
    if (options.backgroundColor) {
      scene.backgroundColor = options.backgroundColor
    }

    // 渲染设置
    if (options.fxaa !== undefined) {
      scene.postProcessStages.fxaa.enabled = options.fxaa
    }

    if (options.msaa !== undefined && options.msaa) {
      scene.msaaSamples = 4
    } else if (options.msaa === false) {
      scene.msaaSamples = 1
    }

    if (options.logarithmicDepthBuffer !== undefined) {
      scene.logarithmicDepthBuffer = options.logarithmicDepthBuffer
    }

    // 光照设置
    if (options.enableLighting !== undefined) {
      scene.globe.enableLighting = options.enableLighting
    }

    // 阴影设置
    if (options.shadows !== undefined) {
      scene.shadowMap.enabled = options.shadows
    }

    if (options.softShadows !== undefined) {
      scene.shadowMap.softShadows = options.softShadows
    }

    if (options.shadowDarkness !== undefined) {
      scene.shadowMap.darkness = options.shadowDarkness
    }

    // 性能设置
    if (options.useRequestRenderMode !== undefined) {
      scene.requestRenderMode = options.useRequestRenderMode
    }

    if (options.maximumRenderTimeChange !== undefined) {
      scene.maximumRenderTimeChange = options.maximumRenderTimeChange
    }

    this._events.emit('scene.configured', { options })
  }

  /**
   * 设置天空盒
   * @param options 天空盒配置
   */
  public setSkyBox(options: SkyBoxOptions): void {
    if (!this._scene) {
      throw new Error('Scene is not available')
    }

    const scene = this._scene

    if (options.show !== undefined) {
      scene.skyBox.show = options.show
    }

    if (options.sources) {
      const sources = options.sources

      // 只有当所有必要的贴图都提供时才创建新的天空盒
      if (
        sources.positiveX &&
        sources.negativeX &&
        sources.positiveY &&
        sources.negativeY &&
        sources.positiveZ &&
        sources.negativeZ
      ) {
        scene.skyBox = new Cesium.SkyBox({
          sources: {
            positiveX: sources.positiveX,
            negativeX: sources.negativeX,
            positiveY: sources.positiveY,
            negativeY: sources.negativeY,
            positiveZ: sources.positiveZ,
            negativeZ: sources.negativeZ,
          },
        })
      }
    }

    this._events.emit('scene.skybox.changed', { options })
  }

  /**
   * 设置大气
   * @param options 大气配置
   */
  public setAtmosphere(options: AtmosphereOptions): void {
    if (!this._scene) {
      throw new Error('Scene is not available')
    }

    const atmosphere = this._scene.skyAtmosphere as any

    if (options.show !== undefined) {
      atmosphere.show = options.show
    }

    if (options.density !== undefined) {
      // 调整大气密度相关参数
      atmosphere.atmosphereDensity = options.density
    }

    if (options.ellipsoidScale !== undefined) {
      atmosphere.atmosphereEllipsoidScale = options.ellipsoidScale
    }

    this._events.emit('scene.atmosphere.changed', { options })
  }

  setAtmosphereOptions(options: AtmosphereOptions): void {
    const atmosphere = this.scene.skyAtmosphere
    if (!atmosphere) return

    if (options.ellipsoidScale !== undefined) {
      // 使用类型断言来处理 atmosphereHueShift 属性
      const skyAtmosphere = atmosphere as any
      skyAtmosphere.atmosphereHueShift = options.ellipsoidScale
    }
  }

  /**
   * 设置雾效果
   * @param enabled 是否启用雾
   * @param density 雾密度
   */
  public setFog(enabled: boolean, density?: number): void {
    if (!this._scene) {
      throw new Error('Scene is not available')
    }

    const fog = this._scene.fog
    fog.enabled = enabled

    if (density !== undefined) {
      fog.density = density
    }

    this._events.emit('scene.fog.changed', { enabled, density })
  }

  /**
   * 设置光照
   * @param enabled 是否启用光照
   */
  public setLighting(enabled: boolean): void {
    if (!this._scene) {
      throw new Error('Scene is not available')
    }

    this._scene.globe.enableLighting = enabled
    this._events.emit('scene.lighting.changed', { enabled })
  }

  /**
   * 设置阴影
   * @param enabled 是否启用阴影
   * @param options 阴影选项
   */
  public setShadows(
    enabled: boolean,
    options?: { softShadows?: boolean; darkness?: number }
  ): void {
    if (!this._scene) {
      throw new Error('Scene is not available')
    }

    const shadowMap = this._scene.shadowMap
    shadowMap.enabled = enabled

    if (options) {
      if (options.softShadows !== undefined) {
        shadowMap.softShadows = options.softShadows
      }

      if (options.darkness !== undefined) {
        shadowMap.darkness = options.darkness
      }
    }

    this._events.emit('scene.shadows.changed', { enabled, options })
  }

  /**
   * 设置是否对地形进行深度测试
   * @param enabled 是否启用对地形的深度测试
   */
  public setDepthTestAgainstTerrain(enabled: boolean): void {
    if (!this._scene) {
      throw new Error('Scene is not available')
    }

    this._scene.globe.depthTestAgainstTerrain = enabled
    this._events.emit('scene.depthTest.changed', { enabled })
  }

  /**
   * 设置场景模式
   * @param mode 场景模式
   */
  public setSceneMode(mode: Cesium.SceneMode): void {
    if (!this._scene) {
      throw new Error('Scene is not available')
    }

    if (this._scene.mode !== mode) {
      switch (mode) {
        case Cesium.SceneMode.SCENE2D:
          this._scene.morphTo2D(1.0)
          break
        case Cesium.SceneMode.SCENE3D:
          this._scene.morphTo3D(1.0)
          break
        case Cesium.SceneMode.COLUMBUS_VIEW:
          this._scene.morphToColumbusView(1.0)
          break
      }
    }

    this._events.emit('scene.mode.changed', { mode })
  }

  /**
   * 设置性能模式
   * @param mode 性能模式
   */
  public setPerformanceMode(mode: 'high' | 'medium' | 'low'): void {
    if (!this._scene) {
      throw new Error('Scene is not available')
    }

    const scene = this._scene

    switch (mode) {
      case 'high':
        // 高性能模式 - 最佳视觉效果
        scene.fog.enabled = true
        scene.fog.density = 0.0002
        scene.skyAtmosphere.show = true
        scene.globe.enableLighting = true
        scene.globe.depthTestAgainstTerrain = true
        scene.shadowMap.enabled = true
        scene.shadowMap.softShadows = true
        scene.postProcessStages.fxaa.enabled = true
        scene.logarithmicDepthBuffer = true
        break

      case 'medium':
        // 中等性能模式 - 平衡视觉效果和性能
        scene.fog.enabled = true
        scene.fog.density = 0.0001
        scene.skyAtmosphere.show = true
        scene.globe.enableLighting = false
        scene.globe.depthTestAgainstTerrain = true
        scene.shadowMap.enabled = false
        scene.postProcessStages.fxaa.enabled = true
        scene.logarithmicDepthBuffer = true
        break

      case 'low':
        // 低性能模式 - 最佳性能
        scene.fog.enabled = false
        scene.skyAtmosphere.show = false
        scene.globe.enableLighting = false
        scene.globe.depthTestAgainstTerrain = false
        scene.shadowMap.enabled = false
        scene.postProcessStages.fxaa.enabled = false
        scene.logarithmicDepthBuffer = false
        break
    }

    this._events.emit('scene.performance.changed', { mode })
  }

  /**
   * 启用/禁用FXAA抗锯齿
   * @param enabled 是否启用
   */
  public enableFxaa(enabled: boolean): void {
    if (!this._scene) {
      throw new Error('Scene is not available')
    }

    this._scene.postProcessStages.fxaa.enabled = enabled
    this._events.emit('scene.fxaa.changed', { enabled })
  }

  /**
   * 注册预渲染回调
   * @param callback 回调函数
   */
  public onPreRender(callback: (scene: Cesium.Scene) => void): void {
    this._preRenderCallbacks.push(callback)
  }

  /**
   * 注册后渲染回调
   * @param callback 回调函数
   */
  public onPostRender(callback: (scene: Cesium.Scene) => void): void {
    this._postRenderCallbacks.push(callback)
  }

  /**
   * 预渲染处理
   */
  private handlePreRender(scene: Cesium.Scene): void {
    for (const callback of this._preRenderCallbacks) {
      try {
        callback(scene)
      } catch (error) {
        console.error('Error in pre-render callback:', error)
      }
    }
  }

  /**
   * 后渲染处理
   */
  private handlePostRender(scene: Cesium.Scene): void {
    for (const callback of this._postRenderCallbacks) {
      try {
        callback(scene)
      } catch (error) {
        console.error('Error in post-render callback:', error)
      }
    }
  }

  /**
   * 服务初始化
   */
  public init(): void {
    this._events.emit('scene.service.initialized')
  }

  /**
   * 服务销毁
   */
  public dispose(): void {
    if (this._scene) {
      this._scene.preRender.removeEventListener(this.handlePreRender, this)
      this._scene.postRender.removeEventListener(this.handlePostRender, this)
    }

    this._preRenderCallbacks = []
    this._postRenderCallbacks = []

    this._events.emit('scene.service.disposed')
  }
}
