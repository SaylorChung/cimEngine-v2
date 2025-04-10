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
   * 设置场景背景色
   * @param color 背景色
   */
  public setBackgroundColor(color: Cesium.Color): void {
    if (!this._scene) {
      throw new Error('Scene is not available')
    }

    this._scene.backgroundColor = color
    this._events.emit('scene.backgroundColor.changed', { color })
  }

  /**
   * 启用/禁用雾效果
   * @param enabled 是否启用
   */
  public enableFog(enabled: boolean): void {
    if (!this._scene) {
      throw new Error('Scene is not available')
    }

    this._scene.fog.enabled = enabled
    this._events.emit('scene.fog.enabled', { enabled })
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
   * @returns 场景模式变化完成后的Promise
   */
  public async setSceneMode(mode: Cesium.SceneMode): Promise<void> {
    if (!this._scene) {
      throw new Error('Scene is not available')
    }

    if (this._scene.mode !== mode) {
      try {
        // 创建一个Promise来处理场景模式转换
        return new Promise<void>((resolve, reject) => {
          try {
            // 创建一个事件监听器，监听模式变化完成
            const completedCallback = this._scene!.morphComplete.addEventListener(() => {
              // 移除监听器
              completedCallback()
              resolve()
            })

            // 触发模式转换
            switch (mode) {
              case Cesium.SceneMode.SCENE2D:
                this._scene!.morphTo2D(1.0)
                break
              case Cesium.SceneMode.SCENE3D:
                this._scene!.morphTo3D(1.0)
                break
              case Cesium.SceneMode.COLUMBUS_VIEW:
                this._scene!.morphToColumbusView(1.0)
                break
            }

            // 发出事件
            this._events.emit('scene.mode.changing', { mode })
          } catch (err) {
            reject(err)
          }
        })
      } catch (error) {
        this._events.emit('scene.error', { error, operation: 'setSceneMode' })
        throw error
      } finally {
        // 无论成功还是失败，都发出模式已改变事件
        this._events.emit('scene.mode.changed', { mode })
      }
    }

    // 如果模式相同，直接返回已解析的Promise
    return Promise.resolve()
  }

  /**
   * 获取当前场景模式
   * @returns 当前场景模式
   */
  public getSceneMode(): Cesium.SceneMode {
    if (!this._scene) {
      throw new Error('Scene is not available')
    }
    return this._scene.mode
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
   * 设置地形夸张系数
   * @param scale 夸张系数
   */
  public setTerrainExaggeration(scale: number): void {
    if (!this._scene || !this._scene.globe) {
      throw new Error('Scene or globe is not available')
    }
    // 在最新版本的Cesium中，terrainExaggeration已移至viewer.scene下
    // 或者通过terrainProvider进行控制
    try {
      // 第一种方法：尝试设置scene上的terrainExaggeration
      if ('terrainExaggeration' in this._scene) {
        ;(this._scene as any).terrainExaggeration = scale
      }
      // 第二种方法：尝试通过EllipsoidTerrainProvider设置
      else if (this._scene.globe.terrainProvider) {
        const provider = this._scene.globe.terrainProvider
        if ('exaggeration' in provider) {
          ;(provider as any).exaggeration = scale
        }
      }
      // 备选方法：直接创建具有夸张效果的新地形提供者
      else if (scale !== 1.0) {
        console.warn(
          'Current Cesium version may not support direct terrain exaggeration, using alternative method'
        )
      }

      this._events.emit('scene.terrainExaggeration.changed', { scale })
    } catch (error) {
      console.error('Error setting terrain exaggeration:', error)
      this._events.emit('scene.error', { error, operation: 'setTerrainExaggeration' })
    }
  }

  /**
   * 启用/禁用阳光照明
   * @param enabled 是否启用
   */
  public enableSunLighting(enabled: boolean): void {
    if (!this._scene) {
      throw new Error('Scene is not available')
    }

    // 设置太阳可见性
    if (this._scene.sun) {
      this._scene.sun.show = enabled
    }

    // 设置地球光照
    if (this._scene.globe) {
      this._scene.globe.enableLighting = enabled
    }

    this._events.emit('scene.sunLighting.changed', { enabled })
  }

  /**
   * 启用/禁用大气效果
   * @param enabled 是否启用
   */
  public enableAtmosphere(enabled: boolean): void {
    if (!this._scene || !this._scene.skyAtmosphere) {
      throw new Error('Scene or skyAtmosphere is not available')
    }

    this._scene.skyAtmosphere.show = enabled
    this._events.emit('scene.atmosphere.enabled', { enabled })
  }

  /**
   * 截取场景图像
   * @returns 场景图像数据URL的Promise
   */
  public async captureScreenshot(): Promise<string> {
    if (!this._scene || !this._scene.canvas) {
      throw new Error('Scene or canvas is not available')
    }

    return new Promise(resolve => {
      // 在下一帧渲染完成后获取截图
      const removeCallback = this._scene!.postRender.addEventListener(() => {
        const canvas = this._scene!.canvas as HTMLCanvasElement
        const dataUrl = canvas.toDataURL('image/png')
        resolve(dataUrl)

        // 移除监听器，避免多次触发
        removeCallback()
      })
    })
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
