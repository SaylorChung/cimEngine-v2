import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // 使用相对路径引入我们打包好的引擎库和 Cesium
      'artis': resolve(__dirname, '../dist/artis.es.js'),
      'cesium': resolve(__dirname, '../dist/assets/cesium/Cesium.js')
    }
  }
})
