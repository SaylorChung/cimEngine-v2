import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Artis',
      fileName: (format) => `artis.${format}.js`,
      formats: ['es', 'umd']
    },
    sourcemap: true,
    minify: 'terser', // 添加代码压缩
    target: 'esnext' // 使用最新的 JS 特性
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // Cesium 模块的别名路径
      cesium: resolve(__dirname, 'libs/cesium/Source/Cesium.js'),
      "@cesium/engine": resolve(__dirname, 'libs/cesium/packages/engine/index.js'),
      "@cesium/widgets": resolve(__dirname, 'libs/cesium/packages/widgets/index.js'),
    }
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts']
    })
  ],
  // 测试配置
  test: {
    globals: true,
    environment: 'jsdom'
  }
});