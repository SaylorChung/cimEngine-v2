/**
 * API 层类型定义
 * 将服务层的相关类型重新导出，供API用户使用
 */

// 导出Camera相关类型
export type {
  CameraViewOptions,
  CameraFlyToOptions,
  CameraLimits,
  CameraPosition,
} from '../services/camera/types'

// 导出Scene相关类型
export type {
  SceneOptions,
  SkyBoxOptions,
  AtmosphereOptions,
  SceneMode, // 新增
} from '../services/scene/types'

// 导出Viewer相关类型
export type { ViewerOptions } from '../services/viewer/types'

// 导出Layer相关类型 - 新增
export type { Layer, LayerOptionsUnion, LayerType } from '../services/layer/types'

// 导出Terrain相关类型 - 新增
export type { TerrainOptions } from '../services/terrain/types'

// 导出API自己定义的类型
export type { CameraApiOptions } from './cameraApi'

// 其他可能需要的性能模式类型
export type PerformanceMode = 'high' | 'medium' | 'low'
