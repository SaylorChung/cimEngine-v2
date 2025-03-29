<template>
  <div class="app-container">
    <header>
      <h1>Artis Engine Examples</h1>
      <nav>
        <button 
          v-for="demo in demos" 
          :key="demo.name"
          :class="{ active: currentDemo === demo.component }"
          @click="currentDemo = demo.component"
        >
          {{ demo.name }}
        </button>
      </nav>
    </header>
    
    <main>
      <component :is="currentDemo" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue';
import BasicDemo from './components/BasicDemo.vue';

// 示例组件列表，使用 markRaw 标记组件避免不必要的响应式转换
const demos = [
  { name: '基础示例', component: markRaw(BasicDemo) },
  // 可以在这里添加更多示例组件
];

// 当前显示的示例组件
const currentDemo = ref(demos[0].component);
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: Arial, sans-serif;
}

header {
  background-color: #333;
  color: white;
  padding: 10px 20px;
}

h1 {
  margin: 0;
  font-size: 24px;
  margin-bottom: 10px;
}

nav {
  display: flex;
  gap: 10px;
}

button {
  background-color: #555;
  color: white;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 4px;
}

button.active {
  background-color: #4CAF50;
}

main {
  flex: 1;
  position: relative;
  overflow: hidden;
}
</style>