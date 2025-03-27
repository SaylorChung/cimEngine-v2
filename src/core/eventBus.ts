/**
 * 事件总线实现
 * 提供类型安全的事件订阅与发布功能
 */
import { EventHandler, IEventBus } from './types'

/**
 * 事件总线
 */
export class EventBus implements IEventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map()
  private onceHandlers: Map<string, Set<EventHandler>> = new Map()

  /**
   * 订阅事件
   * @param eventName 事件名称
   * @param handler 事件处理函数
   */
  on<T = any>(eventName: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set())
    }
    this.handlers.get(eventName)!.add(handler)
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

    // 移除特定处理器
    if (this.handlers.has(eventName)) {
      this.handlers.get(eventName)!.delete(handler)
    }

    if (this.onceHandlers.has(eventName)) {
      this.onceHandlers.get(eventName)!.delete(handler)
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
    this.onceHandlers.get(eventName)!.add(handler)
  }

  /**
   * 发布事件
   * @param eventName 事件名称
   * @param data 事件数据
   */
  emit<T = any>(eventName: string, data?: T): void {
    // 处理常规处理器
    if (this.handlers.has(eventName)) {
      for (const handler of this.handlers.get(eventName)!) {
        try {
          handler(data)
        } catch (error) {
          console.error(`Error in event handler for "${eventName}":`, error)
        }
      }
    }

    // 处理一次性处理器
    if (this.onceHandlers.has(eventName)) {
      const handlers = Array.from(this.onceHandlers.get(eventName)!)
      this.onceHandlers.delete(eventName)

      for (const handler of handlers) {
        try {
          handler(data)
        } catch (error) {
          console.error(`Error in once event handler for "${eventName}":`, error)
        }
      }
    }
  }
}
