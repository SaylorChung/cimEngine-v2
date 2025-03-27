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
    rollupOptions: {
      // 外部化处理不想打包进库的依赖
      external: ['cesium'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          cesium: 'Cesium'
        }
      }
    },
    sourcemap: true,
    // 确保外部化处理那些你不想打包进库的依赖
    commonjsOptions: {
      include: []
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
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