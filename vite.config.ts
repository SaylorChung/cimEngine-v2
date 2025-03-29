import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts'; // 用于生成类型声明文件的插件

export default defineConfig({
  // 定义全局常量替换，这里禁用了eval函数（安全考虑）
  define: {
    'eval': undefined
  },
  
  // 构建配置
  build: {
    // 库模式配置
    lib: {
      // 入口文件路径
      entry: resolve(__dirname, 'src/index.ts'),
      
      // 库的全局变量名（用于UMD/IIFE格式）
      name: 'artis',
      
      // 输出文件名格式
      fileName: (format) => `artis.${format}.js`,
      
      // 构建的格式：ES模块和UMD（通用模块定义）
      formats: ['es', 'umd']
    },
    
    // 生成源映射文件，便于调试
    sourcemap: true,
    
    // 使用terser进行代码压缩
    minify: 'terser',
    
    // 指定目标环境，esnext表示最新的ECMAScript特性
    target: 'esnext',
    
    // Rollup特定选项
    rollupOptions: {
      output: {
         // 解决默认导出和命名导出混合使用的警告
         exports: 'named',
        // 全局变量名称映射（用于UMD构建）
        globals: {
          'cesium': 'Cesium' // 将导入的cesium模块映射到全局Cesium变量
        }
      }
    }
  },
  
  // 路径解析配置
  resolve: {
    // 路径别名，简化导入路径
    alias: {
      // @/xxx 映射到 src/xxx
      '@': resolve(__dirname, 'src'),
      // Cesium模块的别名路径，指向本地库
      'cesium': resolve(__dirname, 'libs/cesium/Source/Cesium.js')
    }
  },
  
  // 插件配置
  plugins: [
    // 类型声明文件生成插件
    dts({
      // 插入类型入口文件
      insertTypesEntry: true,
      
      // 包含的文件模式
      include: ['src/**/*'],
      
      // 排除的文件模式（测试文件）
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts']
    })
  ]
});