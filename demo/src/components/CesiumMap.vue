<template>
  <div ref="cesiumContainer" class="cesium-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import artis from 'artis';

const cesiumContainer = ref<HTMLElement | null>(null);
let viewer: any = null;
let engine: any = null;

onMounted(() => {
  if (!cesiumContainer.value) return;
  
  try {
    console.log('引擎库加载状态:', artis);
    
    // 从我们的引擎中获取 Cesium
    const { Cesium } = artis;
    console.log('Cesium 从引擎中导入成功:', !!Cesium);
    
    // 创建 Cesium Viewer
    viewer = new Cesium.Viewer(cesiumContainer.value, {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false
    });
    
    console.log('Cesium Viewer 创建成功!');
    
    // 飞到特定位置
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(116.3912, 39.9073, 1500), // 北京
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0.0
      }
    });
    
    // 可选: 也测试我们引擎的功能
    initEngine();
    
  } catch (error) {
    console.error('初始化 Cesium 时出错:', error);
  }
});

const initEngine = () => {
  try {
    // 创建引擎实例
    engine = new artis.CimEngine({
      container: cesiumContainer.value,
      options: {
        performance: 'high',
        debug: true,
        autoStart: false
      }
    });
    
    console.log('引擎实例创建成功:', engine);
    
    // 初始化并启动引擎
    engine.init().then(() => {
      console.log('引擎初始化成功!');
      engine.start();
      
      // 监听事件
      engine.events().on('engineStarted', () => {
        console.log('引擎已启动事件触发!');
      });
      
      // 测试获取服务
      const container = engine.container();
      if (container) {
        console.log('容器获取成功');
      }
    }).catch((error: any) => {
      console.error('引擎初始化失败:', error);
    });
  } catch (error) {
    console.error('创建引擎实例时出错:', error);
  }
};

onBeforeUnmount(() => {
  // 清理资源
  if (viewer) {
    viewer.destroy();
    viewer = null;
  }
  
  if (engine) {
    engine.stop();
    engine = null;
  }
});
</script>

<style scoped>
.cesium-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
