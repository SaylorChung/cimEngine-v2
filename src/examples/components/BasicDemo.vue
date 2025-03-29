<template>
  <div class="container">
    <div id="cesiumContainer" ref="cesiumContainer" class="cesium-container"></div>
    <div class="controls">
      <h3>基础示例</h3>
      <p>这个示例展示了 Artis 引擎的基本用法</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
// 从打包后的引擎库导入，而不是直接从源码导入
import { Cesium } from 'dist/artis';


</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.cesium-container {
  width: 100%;
  flex: 1;
}

.controls {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
  width: 250px;
}

h3 {
  margin-top: 0;
  margin-bottom: 10px;
}
</style>