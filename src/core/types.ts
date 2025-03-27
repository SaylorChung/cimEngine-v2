/**
 * Artis 核心类型定义
 */

// 引擎配置选项
export interface EngineOptions {
  container: string | HTMLElement // Cesium容器
  options?: {
    performance?: 'high' | 'medium' | 'low' // 性能模式
    debug?: boolean // 调试模式
    autoStart?: boolean // 自动启动
  }
  plugins?: Plugin[] // 插件列表
  services?: Record<string, any> // 服务配置
}

// 插件接口
export interface Plugin {
  name: string // 插件名称
  install: (engine: Engine, options?: any) => void // 安装方法
  uninstall?: (engine: Engine) => void // 卸载方法
}

// Engine类型前向声明
export class Engine {
  // 这里只是为了类型引用，实际实现在engine.ts
  container: IContainer
  events: IEventBus
  plugins: IPluginManager
  
  constructor() {
    // 这些属性将在init方法中被初始化
    this.container = {} as IContainer
    this.events = {} as IEventBus
    this.plugins = {} as IPluginManager
  }
}

// 服务接口
export interface Service {
  init?(): void | Promise<void> // 初始化方法
  dispose?(): void // 销毁方法
}

// 服务构造函数类型
export type ServiceConstructor<T extends Service = Service> = new (...args: any[]) => T

// 服务标识符类型
export type ServiceIdentifier<T extends Service = Service> = string | symbol | ServiceConstructor<T>

// 事件处理函数
export type EventHandler<T = any> = (data: T) => void

// 事件总线接口
export interface IEventBus extends Service {
  on<T = any>(eventName: string, handler: EventHandler<T>): () => void
  once<T = any>(eventName: string, handler: EventHandler<T>): void
  emit<T = any>(eventName: string, data?: T): void
  off<T = any>(eventName: string, handler?: EventHandler<T>): void
  clear(): void
  handlers: Map<string, Set<EventHandler>>
  onceHandlers: Map<string, Set<EventHandler>>
}

// 依赖注入容器接口
export interface IContainer extends Service {
  register<T extends Service>(
    id: ServiceIdentifier<T>,
    implementation: ServiceConstructor<T>,
    singleton?: boolean
  ): void
  registerInstance<T extends Service>(id: ServiceIdentifier<T>, instance: T): void
  resolve<T extends Service>(id: ServiceIdentifier<T>): T
  has<T extends Service>(id: ServiceIdentifier<T>): boolean
}

// 插件管理器接口
export interface IPluginManager extends Service {
  use(plugin: Plugin, options?: any): void
  remove(name: string): void
  has(name: string): boolean
  get(name: string): Plugin | undefined
  plugins: Map<string, Plugin>
}
