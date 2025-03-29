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
      name: 'artis',
      fileName: (format) => `artis.${format}.js`,
      formats: ['es', 'umd']
    },
    sourcemap: true,
    minify: 'terser',
    target: 'esnext',
    rollupOptions: {
      output: {
        // 解决默认导出和命名导出混合使用的警告
        exports: 'named',
        // 全局变量名称映射（用于 UMD 构建）
        globals: {
          // 不再将 cesium 标记为全局变量，我们会将它打包进来
          // 'cesium': 'Cesium'
        }
      },
      // 不再将 cesium 标记为外部依赖
      external: []
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // Cesium 模块的别名路径，指向Build/CesiumUnminified
      'cesium': resolve(__dirname, 'libs/cesium/Build/CesiumUnminified/Cesium.js')
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