import Cesium from '../../cesiumLoader'
import type { IEventBus } from '../../core/types'
import type { IViewerService } from '../viewer/types'
import type {
  ILayerService,
  Layer,
  LayerOptionsUnion,
  LayerType,
  ImageryLayerOptions,
  TilesetLayerOptions,
  GeoJsonLayerOptions,
  CustomLayerOptions,
} from './types'

// 导入从models目录移出的图层类
import { ImageryLayer } from '../../models/layer/ImageryLayer'
import { TilesetLayer } from '../../models/layer/TilesetLayer'
import { GeoJsonLayer } from '../../models/layer/GeoJsonLayer'
import { CustomLayer } from '../../models/layer/CustomLayer'
import { injectable, inject } from 'tsyringe'

/**
 * 图层服务实现
 */
@injectable()
export class LayerService implements ILayerService {
  private _viewerService: IViewerService
  private _events: IEventBus
  private _layers: Map<string, Layer>
  private _layerGroups: Map<string, Set<string>>

  constructor(
    @inject('ViewerService') viewerService: IViewerService,
    @inject('EventBus') events: IEventBus
  ) {
    this._viewerService = viewerService
    this._events = events
    this._layers = new Map<string, Layer>()
    this._layerGroups = new Map<string, Set<string>>()
  }

  /**
   * 初始化服务
   */
  public init(): Promise<void> {
    // 初始化代码
    this._events.emit('layer.initialized')
    return Promise.resolve()
  }
  /**
   * 销毁服务
   */
  public dispose(): void {
    this.clearLayers()
    this._events.emit('layer.disposed')
  }
  /**
   * 添加图层
   * @param options 图层选项
   * @returns 图层对象Promise
   */
  public async addLayer(options: LayerOptionsUnion): Promise<Layer> {
    // 验证ID唯一性
    if (this._layers.has(options.id)) {
      throw new Error(`图层ID "${options.id}" 已存在`)
    }

    try {
      let layer: Layer

      // 根据类型创建不同的图层
      switch (options.type) {
        case LayerType.IMAGERY:
          layer = this._createImageryLayer(options as ImageryLayerOptions)
          break
        case LayerType.TERRAIN:
          throw new Error('地形图层应使用 terrainService.loadTerrain() 进行加载')
        case LayerType.TILESET:
          layer = await this._createTilesetLayer(options as TilesetLayerOptions)
          break
        case LayerType.GEOJSON:
          layer = await this._createGeoJsonLayer(options as GeoJsonLayerOptions)
          break
        case LayerType.CUSTOM:
          layer = this._createCustomLayer(options as CustomLayerOptions)
          break
        default:
          throw new Error(`不支持的图层类型: ${(options as any).type}`)
      }

      // 将图层添加到集合
      this._layers.set(options.id, layer)

      // 如果定义了组，将图层添加到组
      if (options.group) {
        this._addLayerToGroup(options.id, options.group)
      }

      // 发送添加事件
      this._events.emit('layer.added', { layer })

      return layer
    } catch (error) {
      this._events.emit('layer.error', {
        id: options.id,
        type: options.type,
        error,
      })
      throw error
    }
  }
  /**
   * 移除图层
   * @param id 图层ID
   * @returns 是否成功移除
   */
  public removeLayer(id: string): boolean {
    const layer = this._layers.get(id)
    if (!layer) {
      return false
    }

    try {
      // 从所有组中移除
      this._removeLayerFromAllGroups(id)

      // 销毁图层
      layer.destroy()

      // 从集合中移除
      this._layers.delete(id)

      // 发送移除事件
      this._events.emit('layer.removed', { id })

      return true
    } catch (error) {
      this._events.emit('layer.error', { id, error })
      return false
    }
  }

  /**
   * 获取图层
   * @param id 图层ID
   * @returns 图层对象
   */
  public getLayer(id: string): Layer | undefined {
    return this._layers.get(id)
  }
  /**
   * 获取所有图层
   * @returns 图层列表
   */
  public getLayers(): Layer[] {
    return Array.from(this._layers.values())
  }

  /**
   * 获取指定组的图层
   * @param groupName 组名
   * @returns 图层列表
   */
  public getLayersByGroup(groupName: string): Layer[] {
    const group = this._layerGroups.get(groupName)
    if (!group) {
      return []
    }

    return Array.from(group)
      .map(id => this._layers.get(id))
      .filter(Boolean) as Layer[]
  }

  /**
   * 将图层添加到组
   * @param layerId 图层ID
   * @param groupName 组名
   * @private
   */
  private _addLayerToGroup(layerId: string, groupName: string): void {
    if (!this._layerGroups.has(groupName)) {
      this._layerGroups.set(groupName, new Set())
    }

    this._layerGroups.get(groupName)!.add(layerId)
  }

  /**
   * 从所有组中移除图层
   * @param layerId 图层ID
   * @private
   */
  private _removeLayerFromAllGroups(layerId: string): void {
    for (const [_, group] of this._layerGroups) {
      group.delete(layerId)
    }
  }

  /**
   * 根据类型获取图层
   * @param type 图层类型
   * @returns 图层列表
   */
  public getLayersByType(type: LayerType): Layer[] {
    return this.getLayers().filter(layer => layer.type === type)
  }

  /**
   * 显示图层
   * @param layerId 图层ID
   */
  public showLayer(layerId: string): void {
    const layer = this.getLayer(layerId)
    if (layer) {
      layer.show()
    }
  }

  /**
   * 隐藏图层
   * @param layerId 图层ID
   */
  public hideLayer(layerId: string): void {
    const layer = this.getLayer(layerId)
    if (layer) {
      layer.hide()
    }
  }

  /**
   * 设置图层不透明度
   * @param layerId 图层ID
   * @param opacity 不透明度(0-1)
   */
  public setLayerOpacity(layerId: string, opacity: number): void {
    const layer = this.getLayer(layerId)
    if (layer) {
      layer.setOpacity(opacity)
    }
  }

  /**
   * 设置图层顺序
   * @param layerId 图层ID
   * @param zIndex 图层顺序值
   */
  public setLayerZIndex(layerId: string, zIndex: number): void {
    const layer = this.getLayer(layerId)
    if (layer && 'options' in layer) {
      layer.options.zIndex = zIndex

      // 对于影像图层，需要重新排序
      if (layer.type === LayerType.IMAGERY && this._viewerService.viewer) {
        // 重新排序所有影像图层
        const imageryLayers = this.getLayersByType(LayerType.IMAGERY).sort(
          (a, b) => (a.options.zIndex || 0) - (b.options.zIndex || 0)
        )

        // 重新应用顺序
        this._applyImageryLayersOrder(imageryLayers)
      }
    }
  }

  /**
   * 应用影像图层顺序
   * @private
   */
  private _applyImageryLayersOrder(orderedLayers: Layer[]): void {
    const viewer = this._viewerService.viewer
    const imageryLayerCollection = viewer.imageryLayers

    // 这是简化实现，实际上可能需要更复杂的逻辑
    // 例如，移除所有图层并按顺序重新添加它们
    for (let i = 0; i < orderedLayers.length; i++) {
      const layer = orderedLayers[i]
      if (layer.instance && layer.instance.zIndex !== undefined) {
        try {
          const index = imageryLayerCollection.indexOf(layer.instance)
          if (index !== -1) {
            // 移动图层到正确的位置
            for (let j = 0; j < Math.abs(index - i); j++) {
              if (index > i) {
                imageryLayerCollection.raise(layer.instance)
              } else {
                imageryLayerCollection.lower(layer.instance)
              }
            }
          }
        } catch (error) {
          console.warn(
            `无法调整图层顺序: ${error instanceof Error ? error.message : String(error)}`
          )
        }
      }
    }
  }

  /**
   * 创建影像图层
   * @private
   */
  private _createImageryLayer(options: ImageryLayerOptions): Layer {
    const viewer = this._viewerService.viewer

    // 创建影像提供者
    const provider = new Cesium.UrlTemplateImageryProvider({
      url: options.url,
      minimumLevel: options.minimumLevel,
      maximumLevel: options.maximumLevel,
      rectangle: options.rectangle
        ? Cesium.Rectangle.fromDegrees(
            options.rectangle.west,
            options.rectangle.south,
            options.rectangle.east,
            options.rectangle.north
          )
        : undefined,
    })

    // 创建影像图层
    const imageryLayer = viewer.imageryLayers.addImageryProvider(provider)

    // 设置不透明度
    if (options.opacity !== undefined) {
      imageryLayer.alpha = options.opacity
    }

    // 创建并返回图层对象
    return new ImageryLayer(options, imageryLayer, this._events)
  }

  /**
   * 创建3DTiles图层
   * @private
   */
  private async _createTilesetLayer(options: TilesetLayerOptions): Promise<Layer> {
    const viewer = this._viewerService.viewer

    // 使用异步方法创建3DTiles
    let tileset: Cesium.Cesium3DTileset

    try {
      tileset = await Cesium.Cesium3DTileset.fromUrl(options.url, {
        maximumScreenSpaceError: options.maximumScreenSpaceError || 16,
        // 移除已经不支持的maximumMemoryUsage参数
        skipLevelOfDetail: options.skipLevelOfDetail,
      })
      // 添加到场景
      viewer.scene.primitives.add(tileset)
      // 创建并返回图层对象
      return new TilesetLayer(options, tileset, this._events)
    } catch (error) {
      console.error('创建3DTiles失败:', error)
      throw new Error(`无法加载3DTiles: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * 创建GeoJSON图层
   * @private
   */
  private async _createGeoJsonLayer(options: GeoJsonLayerOptions): Promise<Layer> {
    const viewer = this._viewerService.viewer

    // 创建数据源
    const dataSource = new Cesium.GeoJsonDataSource(options.id)

    try {
      // 加载数据
      await dataSource.load(options.data, {
        stroke: options.style?.stroke
          ? new Cesium.Color(
              options.style.stroke.red,
              options.style.stroke.green,
              options.style.stroke.blue,
              options.style.stroke.alpha
            )
          : Cesium.Color.ROYALBLUE,
        strokeWidth: options.style?.strokeWidth || 2,
        fill: options.style?.fill
          ? new Cesium.Color(
              options.style.fill.red,
              options.style.fill.green,
              options.style.fill.blue,
              options.style.fill.alpha
            )
          : Cesium.Color.ROYALBLUE.withAlpha(0.5),
        clampToGround: options.style?.clampToGround,
      })
    } catch (error) {
      console.error('加载GeoJSON数据失败:', error)
      throw new Error(
        `无法加载GeoJSON数据: ${error instanceof Error ? error.message : String(error)}`
      )
    }

    // 添加到数据源集合
    await viewer.dataSources.add(dataSource)

    // 创建并返回图层对象
    return new GeoJsonLayer(options, dataSource, this._events)
  }

  /**
   * 创建自定义图层
   * @private
   */
  private _createCustomLayer(options: CustomLayerOptions): Layer {
    // 验证实例
    if (!options.instance) {
      throw new Error('自定义图层必须提供实例')
    }

    // 直接使用传入的实例
    return new CustomLayer(options, options.instance, this._events)
  }

  /**
   * 清除所有图层
   */
  public clearLayers(): void {
    // 逐个移除所有图层
    const layerIds = Array.from(this._layers.keys())
    layerIds.forEach(id => this.removeLayer(id))

    // 清空集合
    this._layers.clear()
    this._layerGroups.clear()

    // 发送清除事件
    this._events.emit('layer.cleared')
  }

  /**
   * 显示图层组
   * @param groupName 组名
   */
  public showLayerGroup(groupName: string): void {
    const layers = this.getLayersByGroup(groupName)
    layers.forEach(layer => layer.show())
  }

  /**
   * 隐藏图层组
   * @param groupName 组名
   */
  public hideLayerGroup(groupName: string): void {
    const layers = this.getLayersByGroup(groupName)
    layers.forEach(layer => layer.hide())
  }
}
