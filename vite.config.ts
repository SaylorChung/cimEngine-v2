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
        exports: 'named',
        globals: {}
      },
      external: []
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
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts','src/demo/**/*.ts'],
      copyDtsFiles: false,
    })
  ]
});