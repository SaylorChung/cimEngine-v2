/**
 * 依赖注入容器实现
 */
import { IContainer, Service, ServiceConstructor, ServiceIdentifier } from './types'

/**
 * 依赖注入容器
 * 负责管理服务的注册和解析
 */
export class Container implements IContainer {
  private _services: Map<ServiceIdentifier<any>, ServiceConstructor<any>> = new Map()
  private _instances: Map<ServiceIdentifier<any>, any> = new Map()
  private _singletons: Set<ServiceIdentifier<any>> = new Set()

  /**
   * 注册服务
   */
  register<T extends Service>(
    id: ServiceIdentifier<T>,
    implementation: ServiceConstructor<T>,
    singleton = true
  ): void {
    this._services.set(id, implementation)
    if (singleton) {
      this._singletons.add(id)
    }
  }

  /**
   * 注册实例
   */
  registerInstance<T extends Service>(id: ServiceIdentifier<T>, instance: T): void {
    this._instances.set(id, instance)
  }

  /**
   * 解析服务
   */
  resolve<T extends Service>(id: ServiceIdentifier<T>): T {
    // 先检查实例
    const instance = this._instances.get(id)
    if (instance) {
      return instance
    }

    // 查找服务注册
    const implementation = this._services.get(id)
    if (!implementation) {
      throw new Error(`Service "${id.toString()}" not found`)
    }

    // 如果是单例模式，检查是否已有实例
    if (this._singletons.has(id)) {
      const existingInstance = this._instances.get(id)
      if (existingInstance) {
        return existingInstance
      }
    }

    // 创建新实例
    const newInstance = new implementation()
    
    // 如果是单例，保存实例
    if (this._singletons.has(id)) {
      this._instances.set(id, newInstance)
    }

    return newInstance
  }

  /**
   * 检查服务是否已注册
   */
  has<T extends Service>(id: ServiceIdentifier<T>): boolean {
    return this._services.has(id) || this._instances.has(id)
  }
}
