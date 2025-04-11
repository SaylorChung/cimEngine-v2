import { injectable, inject } from 'tsyringe'
import type { ITerrainService, TerrainOptions } from '../services/terrain/types'

/**
 * 地形API
 */
@injectable()
export class TerrainApi {
  private _terrainService: ITerrainService
  constructor(@inject('TerrainService') terrainService: ITerrainService) {
    this._terrainService = terrainService
  }

  /**
   * 加载地形
   */
  loadTerrain(options: TerrainOptions): void {
    this._terrainService.loadTerrain(options)
  }

  /**
   * 启用地形
   */
  enableTerrain(): void {
    this._terrainService.enableTerrain()
  }

  /**
   * 禁用地形
   */
  disableTerrain(): void {
    this._terrainService.disableTerrain()
  }

  /**
   * 设置地形夸张系数
   */
  setExaggeration(exaggeration: number): void {
    this._terrainService.setExaggeration(exaggeration)
  }

  /**
   * 获取点的高程
   */
  async getHeight(longitude: number, latitude: number): Promise<number | null> {
    return this._terrainService.getHeight(longitude, latitude)
  }

  /**
   * 检查地形是否已启用
   * @returns 地形是否启用
   */
  isTerrainEnabled(): boolean {
    return this._terrainService.isEnabled()
  }
}
