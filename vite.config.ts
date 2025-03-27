import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  define: {
    'eval': undefined
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Artis',
      fileName: (format) => `artis.${format}.js`,
      formats: ['es', 'umd']
    },
    sourcemap: true,
    minify: 'terser',
    target: 'esnext',
    rollupOptions: {
      // 确保 Cesium 被打包进来，而不是作为外部依赖
      // external: ['cesium'], // 移除这一行或注释掉
      output: {
         // 解决默认导出和命名导出混合使用的警告
         exports: 'named',
        // 全局变量名称映射（用于 UMD 构建）
        globals: {
          'cesium': 'Cesium' // 将 Cesium 映射到全局变量
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // Cesium 模块的别名路径
      'cesium': resolve(__dirname, 'libs/cesium/Source/Cesium.js'),
      '@cesium/engine': resolve(__dirname, 'libs/cesium/packages/engine/index.js'),
      '@cesium/widgets': resolve(__dirname, 'libs/cesium/packages/widgets/index.js'),
    }
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts']
    })
  ]
});