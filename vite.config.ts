import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/artis.ts'),
      name: 'artis',
      fileName: (format) => `artis.${format}.js`,
      formats: ['es', 'umd']
    },
    sourcemap: true,
    minify: 'terser',
    target: 'esnext',
    rollupOptions: {
      output: {
        exports: 'named',
        globals: {}
      },
      // 使用函数形式的 external 选项来排除 examples 目录中的文件
      external: (id) => {
        // 检查模块路径是否包含 examples 目录
        return id.includes('src/examples/');
      }
    }
  },
  resolve: {
    alias: [
      {
        find: 'cesium',
        replacement: resolve(__dirname, 'libs/cesium/Source/Cesium.js')
      },
      {
        find: '@',
        replacement: resolve(__dirname, 'src')
      }
    ]
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: [
        'src/**/*.test.ts', 
        'src/**/*.spec.ts',
        'src/demo/**/*.ts',
        'src/examples/**/*' // 排除示例目录中的所有文件
      ],
      copyDtsFiles: false,
    })
  ]
});