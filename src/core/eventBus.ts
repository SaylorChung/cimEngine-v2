/**
 * 事件总线实现
 * 提供类型安全的事件订阅与发布功能
 */
import { EventHandler, IEventBus } from './types'

/**
 * 事件总线
 */
export class EventBus implements IEventBus {
  public handlers: Map<string, Set<EventHandler>> = new Map()
  public onceHandlers: Map<string, Set<EventHandler>> = new Map()

  /**
   * 订阅事件
   * @param eventName 事件名称
   * @param handler 事件处理函数
   */
  on<T = any>(eventName: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set())
    }
    const handlers = this.handlers.get(eventName)!
    handlers.add(handler)

    return () => this.off(eventName, handler)
  }

  /**
   * 取消订阅事件
   * @param eventName 事件名称
   * @param handler 事件处理函数，不提供则移除所有该事件的处理器
   */
  off<T = any>(eventName: string, handler?: EventHandler<T>): void {
    if (!handler) {
      // 移除所有处理器
      this.handlers.delete(eventName)
      this.onceHandlers.delete(eventName)
      return
    }

    const handlers = this.handlers.get(eventName)
    if (handlers) {
      handlers.delete(handler)
    }

    const onceHandlers = this.onceHandlers.get(eventName)
    if (onceHandlers) {
      onceHandlers.delete(handler)
    }
  }

  /**
   * 订阅一次性事件
   * @param eventName 事件名称
   * @param handler 事件处理函数
   */
  once<T = any>(eventName: string, handler: EventHandler<T>): void {
    if (!this.onceHandlers.has(eventName)) {
      this.onceHandlers.set(eventName, new Set())
    }
    const handlers = this.onceHandlers.get(eventName)!
    handlers.add(handler)
  }

  /**
   * 发布事件
   * @param eventName 事件名称
   * @param data 事件数据
   */
  emit<T = any>(eventName: string, data?: T): void {
    const handlers = this.handlers.get(eventName)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data)
        } catch (error) {
          console.error(`Error in event handler for ${eventName}:`, error)
        }
      })
    }

    const onceHandlers = this.onceHandlers.get(eventName)
    if (onceHandlers) {
      onceHandlers.forEach(handler => {
        try {
          handler(data)
        } catch (error) {
          console.error(`Error in once event handler for ${eventName}:`, error)
        }
      })
      this.onceHandlers.delete(eventName)
    }
  }

  /**
   * 清除所有事件处理器
   */
  clear(): void {
    this.handlers.clear()
    this.onceHandlers.clear()
  }
}
