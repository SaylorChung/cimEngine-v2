/**
 * 创建可响应式状态对象
 * @param initialState 初始状态
 * @returns 状态对象
 */
export function createState<T extends object>(initialState: T) {
  // 当前状态
  let state = { ...initialState };
  // 订阅者集合
  const subscribers = new Set<(state: T) => void>();

  return {
    /**
     * 获取当前状态
     * @returns 当前状态的副本
     */
    get: (): T => {
      return { ...state };
    },

    /**
     * 更新状态
     * @param newState 新状态或部分状态
     */
    update: (newState: Partial<T>): void => {
      state = { ...state, ...newState };
      // 通知所有订阅者
      subscribers.forEach(subscriber => subscriber({ ...state }));
    },

    /**
     * 订阅状态变化
     * @param subscriber 订阅函数
     * @returns 取消订阅的函数
     */
    subscribe: (subscriber: (state: T) => void): () => void => {
      subscribers.add(subscriber);
      // 返回取消订阅的函数
      return () => {
        subscribers.delete(subscriber);
      };
    }
  };
}