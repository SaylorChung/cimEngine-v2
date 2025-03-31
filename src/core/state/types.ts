/**
 * 状态管理相关的类型定义
 */

/**
 * 状态订阅者函数类型
 * @template T 状态对象类型
 */
export type StateSubscriber<T> = (state: T) => void

/**
 * 状态对象接口
 * @template T 状态对象类型
 */
export interface State<T extends object> {
  /**
   * 获取当前状态
   * @returns 当前状态的副本
   */
  get(): T

  /**
   * 更新状态
   * @param newState 新状态或部分状态
   */
  update(newState: Partial<T>): void

  /**
   * 重置状态到初始值
   */
  reset(): void

  /**
   * 订阅状态变化
   * @param subscriber 订阅函数
   * @returns 取消订阅的函数
   */
  subscribe(subscriber: StateSubscriber<T>): () => void
}
