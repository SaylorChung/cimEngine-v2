/**
 * 引擎配置文件
 */
import { EngineOptions } from '../../core/types'
import Cesium from '../../cesiumLoader'

/**
 * 创建引擎配置
 * @param container 地图容器元素
 * @returns 引擎配置对象
 */
export const createEngineConfig = (container: HTMLElement): Partial<EngineOptions> => {
  return {
    container, // 地图容器
    // 添加Viewer选项
    viewerOptions: {
      // 基本UI选项
      timeline: false,
      animation: false,
      baseLayerPicker: true,
      fullscreenButton: true,
      geocoder: false,
      homeButton: true,
      infoBox: true,
      sceneModePicker: true,
      navigationHelpButton: true,

      // 性能相关选项
      shadows: false,
      terrainShadows: Cesium.ShadowMode.DISABLED,
      requestRenderMode: true,
      maximumRenderTimeChange: 0.0,
    },
    options: {
      performance: 'high', // 性能模式：high, medium, low
      debug: true, // 调试模式
      autoStart: false, // 不自动初始化，由应用控制初始化时机
    },
  }
}
