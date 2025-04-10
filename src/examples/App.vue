<template>
  <div class="app-container">
    <div ref="mapContainer" class="map-container"></div>
    <div class="toolbar">
      <button @click="switchTo3D" :class="{ active: currentMode === '3D' }">3D模式</button>
      <button @click="switchTo2D" :class="{ active: currentMode === '2D' }">2D模式</button>
      <button @click="switchToColumbus" :class="{ active: currentMode === 'Columbus' }">
        哥伦布视图
      </button>
      <select v-model="performanceMode" @change="changePerformanceMode">
        <option value="high">高质量</option>
        <option value="medium">平衡模式</option>
        <option value="low">高性能</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 使用配置好的别名导入
import artis from 'artis'

// 创建引用
const mapContainer = ref<HTMLDivElement | null>(null)
const currentMode = ref('3D')
const performanceMode = ref<'high' | 'medium' | 'low'>('medium')

// 创建引擎
const engine = new artis.CimEngine()

// 初始化地图
onMounted(async () => {
  if (mapContainer.value) {
    // 初始化引擎
    await engine.init()

    // 创建查看器
    const viewer = engine.api.viewer.createViewer(mapContainer.value, {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      timeline: false,
      navigationHelpButton: false,
      // 移除不确定是否支持的参数
      // navigationInstructionsInitiallyVisible: false,
    })

    // 设置默认性能模式
    engine.api.viewer.setPerformanceMode(performanceMode.value)

    // 添加默认的OSM影像图层
    const imageryLayer = await engine.api.layer.addLayer({
      id: 'osm_base', // 添加必需的id字段
      name: '默认OSM影像',
      type: artis.LayerType.IMAGERY, // 使用枚举值而非字符串
      url: 'https://tile.openstreetmap.org/', // 添加必需的url字段
      visible: true, // 使用visible而非show
    })

    // 调整相机位置到更好的位置
    // 使用flyTo方法，这是CameraApi中存在的方法
    engine.api.camera.flyTo({
      destination: artis.Cesium.Cartesian3.fromDegrees(116.391, 39.891, 1000),
      orientation: {
        heading: 0,
        pitch: -Math.PI / 4,
        roll: 0,
      },
    })

    // 监听窗口调整大小事件
    window.addEventListener('resize', handleResize)
  }
})

// 切换到3D模式
const switchTo3D = () => {
  engine.api.viewer.switchTo3D()
  currentMode.value = '3D'
}

// 切换到2D模式
const switchTo2D = () => {
  engine.api.viewer.switchTo2D()
  currentMode.value = '2D'
}

// 切换到哥伦布视图
const switchToColumbus = () => {
  engine.api.viewer.switchToColumbus()
  currentMode.value = 'Columbus'
}

// 更改性能模式
const changePerformanceMode = () => {
  engine.api.viewer.setPerformanceMode(performanceMode.value)
}

// 处理窗口调整大小
const handleResize = () => {
  engine.api.viewer.resize()
}

// 组件销毁前清理资源
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  engine.dispose()
})
</script>
<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
  font-family: Arial, sans-serif;
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.toolbar {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  display: flex;
  gap: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  padding: 5px;
}

button,
select {
  background-color: #555;
  color: white;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

button.active {
  background-color: #4caf50;
}

select {
  background-color: #555;
  color: white;
  border: none;
}
</style>
