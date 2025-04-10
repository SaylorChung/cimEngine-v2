/**
 * 依赖注入容器实现
 */
export class Container {
  // 存储服务构造函数
  private _constructors: Map<string, new (...args: any[]) => any> = new Map()
  // 存储服务实例
  private _instances: Map<string, any> = new Map()
  /**
   * 注册服务构造函数
   * @param name 服务名称
   * @param constructor 服务构造函数
   */
  register<T>(name: string, constructor: new (...args: any[]) => T): void {
    this._constructors.set(name, constructor)
  }
  /**
   * 注册服务实例
   * @param name 服务名称
   * @param instance 服务实例
   */
  registerInstance<T>(name: string, instance: T): void {
    this._instances.set(name, instance)
  }
  /**
   * 解析服务
   * @param name 服务名称
   * @returns 服务实例
   */
  resolve<T>(name: string): T {
    // 如果已经有实例，直接返回
    if (this._instances.has(name)) {
      return this._instances.get(name) as T
    }

    // 获取构造函数
    const constructor = this._constructors.get(name)
    if (!constructor) {
      throw new Error(`服务未注册: ${name}`)
    }
    // 创建实例
    const instance = new constructor()
    // 存储实例以便重用
    this._instances.set(name, instance)
    return instance as T
  }
}
