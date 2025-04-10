import { Service } from 'artis'

/**
 * 地形服务接口
 */
export interface ITerrainService extends Service {
  /**
   * 加载地形
   * @param options 地形选项
   */
  loadTerrain(options: TerrainOptions): Promise<void>

  /**
   * 启用地形
   */
  enableTerrain(): void

  /**
   * 禁用地形
   */
  disableTerrain(): void

  /**
   * 设置地形夸张系数
   * @param exaggeration 夸张系数
   */
  setExaggeration(exaggeration: number): void

  /**
   * 获取点的高程
   * @param longitude 经度
   * @param latitude 纬度
   */
  getHeight(longitude: number, latitude: number): Promise<number | null>

  /**
   * 检查地形是否已启用
   */
  isEnabled(): boolean
}

/**
 * 地形选项
 */
export interface TerrainOptions {
  /**
   * 地形提供者类型
   */
  provider: 'cesium' | 'arcgis' | 'url' | 'custom'

  /**
   * 地形URL
   * 当provider为url时使用
   */
  url?: string

  /**
   * 请求水体效果
   */
  requestWaterMask?: boolean

  /**
   * 请求顶点法线
   */
  requestVertexNormals?: boolean

  /**
   * 自定义地形提供者
   * 当provider为custom时使用
   */
  customProvider?: any
}
