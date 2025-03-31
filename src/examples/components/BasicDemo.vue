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
import { ref, onMounted } from 'vue'
import artis from 'artis'

// 使用 typeof 来从值获取类型
type CimEngineType = typeof artis.CimEngine
let engine: InstanceType<CimEngineType> | null = null

// 正确地定义 ref
const cesiumContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!cesiumContainer.value) return

  engine = new artis.CimEngine({
    container: cesiumContainer.value,
    options: {
      performance: 'high',
      debug: true,
      autoStart: true,
    },
  })
})
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
