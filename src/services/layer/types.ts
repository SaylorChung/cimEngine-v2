import type { IService } from '../../core/types'
import Cesium from '../../cesiumLoader'
/**
 * 图层类型枚举
 */
export enum LayerType {
  IMAGERY = 'imagery', // 影像图层
  TERRAIN = 'terrain', // 地形图层
  TILESET = 'tileset', // 3D Tiles图层
  GEOJSON = 'geojson', // GeoJSON数据图层
  KML = 'kml', // KML数据图层
  CZML = 'czml', // CZML数据图层
  VECTOR = 'vector', // 矢量图层
  MODEL = 'model', // 3D模型图层
  POINT_CLOUD = 'pointcloud', // 点云图层
  CUSTOM = 'custom', // 自定义图层
}
/**
 * 图层基础选项接口
 */
export interface LayerOptions {
  id: string // 图层唯一标识
  name: string // 图层名称
  type: LayerType // 图层类型
  visible?: boolean // 图层可见性
  opacity?: number // 图层不透明度(0-1)
  zIndex?: number // 图层顺序
  group?: string // 图层组名称
  metadata?: Record<string, any> // 元数据
}
/**
 * 影像图层选项
 */
export interface ImageryLayerOptions extends LayerOptions {
  type: LayerType.IMAGERY
  url: string // 图层URL
  maximumLevel?: number // 最大级别
  minimumLevel?: number // 最小级别
  rectangle?: Cesium.Rectangle // 覆盖区域
}

/**
 * 地形图层选项
 */
export interface TerrainLayerOptions extends LayerOptions {
  type: LayerType.TERRAIN
  url: string // 地形URL
  requestVertexNormals?: boolean // 请求顶点法线
  requestWaterMask?: boolean // 请求水面掩码
}

/**
 * 3DTiles图层选项
 */
export interface TilesetLayerOptions extends LayerOptions {
  type: LayerType.TILESET
  url: string // 3DTiles URL
  maximumScreenSpaceError?: number // 最大屏幕空间误差
  maximumMemoryUsage?: number // 最大内存使用量
  skipLevelOfDetail?: boolean // 跳过细节层次
}

/**
 * GeoJSON图层选项
 */
export interface GeoJsonLayerOptions extends LayerOptions {
  type: LayerType.GEOJSON
  data: any // GeoJSON数据或URL
  style?: {
    // 样式
    fill?: Cesium.Color
    stroke?: Cesium.Color
    strokeWidth?: number
    pointSize?: number
    clampToGround?: boolean
  }
}

/**
 * 自定义图层选项
 */
export interface CustomLayerOptions extends LayerOptions {
  type: LayerType.CUSTOM
  instance: any // 自定义图层实例
}

/**
 * 图层配置选项联合类型
 */
export type LayerOptionsUnion =
  | ImageryLayerOptions
  | TerrainLayerOptions
  | TilesetLayerOptions
  | GeoJsonLayerOptions
  | CustomLayerOptions

/**
 * 图层接口
 */
export interface Layer {
  id: string // 图层ID
  name: string // 图层名称
  type: LayerType // 图层类型
  visible: boolean // 可见性
  instance: any // 图层实例(Cesium对象)
  options: LayerOptionsUnion // 图层选项

  // 基本方法
  show(): void // 显示图层
  hide(): void // 隐藏图层
  setOpacity(opacity: number): void // 设置不透明度
  getOpacity(): number // 获取不透明度
  destroy(): void // 销毁图层
}

/**
 * 图层服务接口
 */
export interface ILayerService extends IService {}
