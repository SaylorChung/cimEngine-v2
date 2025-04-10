import { Engine } from '../core/engine'
import { TerrainOptions } from '../services/terrain/types'

/**
 * 地形API
 */
export class TerrainApi {
  private _engine: Engine

  constructor(engine: Engine) {
    this._engine = engine
  }

  /**
   * 加载地形
   */
  loadTerrain(options: TerrainOptions): void {
    this._engine.terrainService.loadTerrain(options)
  }

  /**
   * 启用地形
   */
  enableTerrain(): void {
    this._engine.terrainService.enableTerrain()
  }

  /**
   * 禁用地形
   */
  disableTerrain(): void {
    this._engine.terrainService.disableTerrain()
  }

  /**
   * 设置地形夸张系数
   */
  setExaggeration(exaggeration: number): void {
    this._engine.terrainService.setExaggeration(exaggeration)
  }

  /**
   * 获取点的高程
   */
  async getHeight(longitude: number, latitude: number): Promise<number | null> {
    return this._engine.terrainService.getHeight(longitude, latitude)
  }

  /**
   * 检查地形是否已启用
   * @returns 地形是否启用
   */
  isTerrainEnabled(): boolean {
    return this._engine.terrainService.isEnabled()
  }
}
