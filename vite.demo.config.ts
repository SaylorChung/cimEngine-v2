import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

// 导出 Vite 配置
export default defineConfig({
  root: resolve(__dirname, 'src/examples'),
  publicDir: resolve(__dirname, 'public'),
  server: {
    port: 5007,
    open: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      cesium: resolve(__dirname, 'libs/cesium/Source/Cesium.js'),
      // 同时指向 JS 文件和类型声明文件
      artis: resolve(__dirname, 'dist/artis.es.js'),
    },
  },
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    }),
  ],
  optimizeDeps: {
    include: ['vue'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  build: {
    // 防止与主库构建冲突
    outDir: resolve(__dirname, 'dist/examples'),
    target: 'es2020',
  },
})
