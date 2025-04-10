import type { ILayerService, Layer, LayerOptionsUnion, LayerType } from '../services/layer/types'
import { injectable, inject } from 'tsyringe'

/**
 * 图层API
 */
@injectable()
export class LayerApi {
  private _layerService: ILayerService
  constructor(@inject('LayerService') layerService: ILayerService) {
    this._layerService = layerService
  }

  /**
   * 添加图层
   * @param options 图层选项
   * @returns 创建的图层Promise
   */
  async addLayer(options: LayerOptionsUnion): Promise<Layer> {
    return await this._layerService.addLayer(options)
  }

  /**
   * 移除图层
   * @param layerId 图层ID
   * @returns 是否成功移除
   */
  removeLayer(layerId: string): boolean {
    return this._layerService.removeLayer(layerId)
  }

  /**
   * 获取图层
   * @param layerId 图层ID
   * @returns 图层实例
   */
  getLayer(layerId: string): Layer | undefined {
    return this._layerService.getLayer(layerId)
  }

  /**
   * 获取所有图层
   * @returns 图层列表
   */
  getLayers(): Layer[] {
    return this._layerService.getLayers()
  }

  /**
   * 根据组名获取图层
   * @param groupName 组名
   * @returns 图层列表
   */
  getLayersByGroup(groupName: string): Layer[] {
    return this._layerService.getLayersByGroup(groupName)
  }

  /**
   * 根据类型获取图层
   * @param type 图层类型
   * @returns 图层列表
   */
  getLayersByType(type: LayerType): Layer[] {
    return this._layerService.getLayersByType(type)
  }

  /**
   * 显示图层
   * @param layerId 图层ID
   */
  showLayer(layerId: string): void {
    this._layerService.showLayer(layerId)
  }

  /**
   * 隐藏图层
   * @param layerId 图层ID
   */
  hideLayer(layerId: string): void {
    this._layerService.hideLayer(layerId)
  }

  /**
   * 设置图层不透明度
   * @param layerId 图层ID
   * @param opacity 不透明度(0-1)
   */
  setLayerOpacity(layerId: string, opacity: number): void {
    this._layerService.setLayerOpacity(layerId, opacity)
  }

  /**
   * 设置图层顺序
   * @param layerId 图层ID
   * @param zIndex 图层顺序值
   */
  setLayerZIndex(layerId: string, zIndex: number): void {
    this._layerService.setLayerZIndex(layerId, zIndex)
  }

  /**
   * 显示图层组
   * @param groupName 组名
   */
  showLayerGroup(groupName: string): void {
    this._layerService.showLayerGroup(groupName)
  }

  /**
   * 隐藏图层组
   * @param groupName 组名
   */
  hideLayerGroup(groupName: string): void {
    this._layerService.hideLayerGroup(groupName)
  }

  /**
   * 清除所有图层
   */
  clearLayers(): void {
    this._layerService.clearLayers()
  }
}
