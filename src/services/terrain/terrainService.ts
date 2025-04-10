import Cesium from '../../cesiumLoader'
import { ITerrainService, TerrainOptions } from './types'
import { EventBus } from '../../core/eventBus'

/**
 * 地形服务实现
 */
export class TerrainService implements ITerrainService {
  private _viewer: Cesium.Viewer
  private _events: EventBus
  private _enabled: boolean = false
  private _currentTerrainProvider: Cesium.TerrainProvider | null = null
  private _defaultTerrainProvider: Cesium.TerrainProvider

  /**
   * 构造函数
   * @param viewer Cesium Viewer实例
   * @param events 事件总线
   */
  constructor(viewer: Cesium.Viewer, events: EventBus) {
    this._viewer = viewer
    this._events = events
    // 保存默认地形提供者(椭球体)
    this._defaultTerrainProvider = new Cesium.EllipsoidTerrainProvider()
  }

  /**
   * 加载地形
   * @param options 地形选项
   * @returns 加载完成的Promise
   */
  async loadTerrain(options: TerrainOptions): Promise<void> {
    let terrainProvider: Cesium.TerrainProvider

    try {
      switch (options.provider) {
        case 'cesium':
          // 使用 Cesium 官方地形 - 新版本异步 API
          terrainProvider = await Cesium.createWorldTerrainAsync({
            requestVertexNormals: options.requestVertexNormals,
            requestWaterMask: options.requestWaterMask,
          })
          break
        case 'url':
          if (!options.url) {
            throw new Error('必须为URL地形提供者指定URL')
          }
          terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(options.url)
          break
        case 'custom':
          if (!options.customProvider) {
            throw new Error('必须为自定义地形提供者指定实例')
          }
          terrainProvider = options.customProvider
          break
        default:
          throw new Error(`不支持的地形提供者类型: ${options.provider}`)
      }

      this._currentTerrainProvider = terrainProvider
      this._viewer.terrainProvider = terrainProvider
      this._enabled = true
      this._events.emit('terrain.loaded', { provider: options.provider })
    } catch (error) {
      this._events.emit('terrain.error', { error, provider: options.provider })
      throw error
    }
  }
  /**
   * 启用地形
   */
  enableTerrain(): void {
    if (this._currentTerrainProvider) {
      this._viewer.terrainProvider = this._currentTerrainProvider
      this._enabled = true
      this._events.emit('terrain.enabled')
    }
  }

  /**
   * 禁用地形
   */
  disableTerrain(): void {
    if (this._enabled) {
      this._viewer.terrainProvider = this._defaultTerrainProvider
      this._enabled = false
      this._events.emit('terrain.disabled')
    }
  }

  /**
   * 设置地形夸张系数
   * @param exaggeration 夸张系数
   */
  setExaggeration(exaggeration: number): void {
    this._viewer.scene.verticalExaggeration = exaggeration
    this._events.emit('terrain.exaggerationChanged', { exaggeration })
  }

  /**
   * 获取点的高程
   * @param longitude 经度
   * @param latitude 纬度
   * @returns 高程值，若无法获取则返回null
   */
  async getHeight(longitude: number, latitude: number): Promise<number | null> {
    try {
      const cartographic = Cesium.Cartographic.fromDegrees(longitude, latitude)
      const heights = await Cesium.sampleTerrainMostDetailed(this._viewer.terrainProvider, [
        cartographic,
      ])
      return heights[0].height
    } catch (error) {
      console.error('获取高程失败:', error)
      return null
    }
  }

  /**
   * 检查地形是否已启用
   * @returns 地形是否启用
   */
  isEnabled(): boolean {
    return this._enabled
  }
}
