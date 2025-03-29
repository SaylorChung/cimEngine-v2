import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

// 导出 Vite 配置
export default defineConfig({
  // 移除 eval 的限制，因为 Cesium/Knockout.js 需要使用它
  // define: {
  //   'eval': undefined
  // },
  root: resolve(__dirname, 'src/examples'),
  publicDir: resolve(__dirname, 'public'),
  server: {
    port: 5007,
    open: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      }
    })
  ],
  optimizeDeps: {
    include: ['vue'],
    // 确保 Cesium 和 Knockout 被正确优化
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    // 防止与主库构建冲突
    outDir: resolve(__dirname, 'dist/examples'),
    target: 'es2020'
  }
});