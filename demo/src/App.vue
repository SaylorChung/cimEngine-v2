<script setup lang="ts">
import CesiumMap from './components/CesiumMap.vue';
import { ref } from 'vue';

const showInfo = ref(true);

const toggleInfo = () => {
  showInfo.value = !showInfo.value;
};
</script>

<template>
  <div class="app-container">
    <header>
      <h1>CimEngine 演示</h1>
      <div class="controls">
        <button @click="toggleInfo">{{ showInfo ? '隐藏信息' : '显示信息' }}</button>
      </div>
    </header>
    <main>
      <CesiumMap />
      
      <div v-if="showInfo" class="info-panel">
        <h3>引擎演示说明</h3>
        <p>这个演示页面展示了通过我们的引擎直接使用 Cesium 的功能。</p>
        <p>请查看浏览器控制台以获取更多调试信息。</p>
        <p class="note">注意：我们的引擎已经成功将 Cesium 打包进来，无需额外引入 Cesium 库。</p>
      </div>
    </main>
  </div>
</template>

<style>
/* 重置全局样式 */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: Arial, sans-serif;
}

#app {
  width: 100%;
  height: 100%;
}

/* 应用容器样式 */
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

header {
  background-color: #2c3e50;
  color: white;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.controls {
  display: flex;
  gap: 0.5rem;
}

button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3aa876;
}

main {
  flex: 1;
  position: relative;
  min-height: 0; /* 重要: 防止 flex 子项溢出 */
}

.info-panel {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 300px;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 4px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.note {
  font-weight: bold;
  color: #e74c3c;
}
</style>
