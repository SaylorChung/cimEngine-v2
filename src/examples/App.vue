<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="logo">地理信息三维可视化平台</div>
      <el-menu
        mode="horizontal"
        background-color="#333"
        text-color="#fff"
        active-text-color="#409EFF"
        :ellipsis="false"
        class="main-menu"
      >
        <el-sub-menu index="1">
          <template #title>地图控制</template>
          <el-menu-item index="1-1">底图切换</el-menu-item>
          <el-menu-item index="1-2">场景设置</el-menu-item>
          <el-menu-item index="1-3">相机控制</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="2">
          <template #title>数据加载</template>
          <el-menu-item index="2-1">影像图层</el-menu-item>
          <el-menu-item index="2-2">三维模型</el-menu-item>
          <el-sub-menu index="2-3">
            <template #title>矢量数据</template>
            <el-menu-item index="2-3-1">GeoJSON</el-menu-item>
            <el-menu-item index="2-3-2">KML</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>

        <el-sub-menu index="3">
          <template #title>工具箱</template>
          <el-menu-item index="3-1">距离测量</el-menu-item>
          <el-menu-item index="3-2">面积测量</el-menu-item>
          <el-menu-item index="3-3">高度测量</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="4">
          <template #title>分析功能</template>
          <el-menu-item index="4-1">视域分析</el-menu-item>
          <el-menu-item index="4-2">洪水模拟</el-menu-item>
          <el-menu-item index="4-3">坡度分析</el-menu-item>
        </el-sub-menu>
      </el-menu>

      <div class="user-info">
        <el-dropdown>
          <span class="user-dropdown-link">
            管理员 <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人设置</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 地图容器 -->
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
// 使用配置好的别名导入
import artis from '../artis'
// 导入引擎配置创建函数
import { createEngineConfig } from './config/engine.config'

// 创建引用
const mapContainer = ref<HTMLDivElement | null>(null)
// 声明引擎变量，但不立即实例化
let engine: any = null
let engineInitialized = ref(false)

// 初始化地图
onMounted(async () => {
  if (mapContainer.value) {
    try {
      // 创建配置
      const engineConfig = createEngineConfig(mapContainer.value)
      // 创建引擎实例
      engine = new artis.Engine(engineConfig)
      // 初始化引擎
      await engine.init()
      // 标记引擎已初始化
      engineInitialized.value = true

      // 监听窗口调整大小事件
      window.addEventListener('resize', handleResize)
    } catch (error) {
      console.error('引擎初始化失败:', error)
    }
  }
})

// 处理窗口调整大小
const handleResize = () => {
  // 只有在引擎初始化后才访问API
  if (engineInitialized.value && engine && engine.viewerService) {
    // 优先使用viewerService而不是通过api访问
    engine.viewerService.resize()
  }
}

// 组件销毁前清理资源
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (engineInitialized.value && engine) {
    engine.dispose()
  }
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
  display: flex;
  flex-direction: column;
}

.header {
  width: 100%;
  height: 60px;
  background-color: #333;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  margin-right: 30px;
  white-space: nowrap;
}

.main-menu {
  flex: 1;
  background-color: transparent !important;
  border-bottom: none !important;
}

.user-info {
  margin-right: 30px;
}

.user-dropdown-link {
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.map-container {
  flex: 1;
  width: 100%;
  position: relative;
}
</style>
