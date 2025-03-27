/**
 * Artis 主入口文件
 */

// 导入引擎类
import { Engine } from './core/engine';

// 创建导出对象
const artis = {
  // 使 engine 成为主要导出
  engine: Engine,
  
  // 其他核心类
  Container: undefined,
  EventBus: undefined,
  PluginManager: undefined,
  // 版本信息
  VERSION: '2.0.0'
};

// 设置其他核心模块
import { Container } from './core/container';
import { EventBus } from './core/eventBus';
import { PluginManager } from './core/pluginManager';

artis.Container = Container;
artis.EventBus = EventBus;
artis.PluginManager = PluginManager;

// 导出默认对象
export default artis;

// 为了保持兼容性，也单独导出这些模块
export { Engine } from './core/engine';
export { Container } from './core/container';
export { EventBus } from './core/eventBus';
export { PluginManager } from './core/pluginManager';

// 导出类型定义
export * from './core/types';
