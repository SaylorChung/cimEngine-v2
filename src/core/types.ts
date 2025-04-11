/**
 * Artis 核心类型定义
 */
import { ApiManager } from './apiManager'
/**
 * 引擎配置选项
 */
export interface EngineOptions {
  /**
   * 容器元素或ID
   */
  container: string | HTMLElement

  /**
   * 全局选项
   */
  options?: {
    /**
     * 性能模式
     */
    performance?: 'high' | 'medium' | 'low'

    /**
     * 调试模式
     */
    debug?: boolean

    /**
     * 是否自动初始化
     */
    autoStart?: boolean
  }

  /**
   * 插件列表
   */
  plugins?: IPlugin[]
}

/**
 * 插件接口
 */
export interface IPlugin {
  /**
   * 插件名称
   */
  name: string

  /**
   * 安装方法
   */
  install: (engine: IEngine, options?: any) => void

  /**
   * 可选的卸载方法
   */
  uninstall?: (engine: IEngine) => void
}

/**
 * 事件处理函数类型
 */
export type EventHandler<T = any> = (data: T) => void

/**
 * 事件总线接口
 */
export interface IEventBus {
  /**
   * 注册事件监听器
   * @param eventName 事件名称
   * @param handler 处理函数
   * @returns 取消订阅的函数
   */
  on<T = any>(eventName: string, handler: EventHandler<T>): () => void

  /**
   * 注册一次性事件监听器
   * @param eventName 事件名称
   * @param handler 处理函数
   */
  once<T = any>(eventName: string, handler: EventHandler<T>): void

  /**
   * 触发事件
   * @param eventName 事件名称
   * @param data 事件数据
   */
  emit<T = any>(eventName: string, data?: T): void

  /**
   * 移除事件监听器
   * @param eventName 事件名称
   * @param handler 可选的特定处理函数，若不提供则移除所有监听器
   */
  off<T = any>(eventName: string, handler?: EventHandler<T>): void

  /**
   * 清除所有事件监听器
   */
  clear(): void
}

/**
 * 基础服务接口
 * 所有服务的基础接口
 */
export interface IService {
  /**
   * 初始化服务
   */
  init?(): void | Promise<void>

  /**
   * 销毁服务
   */
  dispose?(): void | Promise<void>
}

/**
 * 引擎接口
 * 定义引擎的公共API
 */
export interface IEngine {
  /**
   * 事件总线
   */
  readonly events: IEventBus

  /**
   * API管理器
   */
  readonly api: ApiManager

  /**
   * 初始化引擎
   */
  init(): Promise<void>

  /**
   * 销毁引擎
   */
  dispose(): Promise<void>
}
