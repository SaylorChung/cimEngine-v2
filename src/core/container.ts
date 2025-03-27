/**
 * 依赖注入容器实现
 */
import { IContainer, Service, ServiceConstructor, ServiceIdentifier } from './types'

/**
 * 依赖注入容器
 * 负责管理服务的注册和解析
 */
export class Container implements IContainer {
  private services = new Map<ServiceIdentifier, any>()
  private singletons = new Map<ServiceIdentifier, Service>()
  private implementations = new Map<ServiceIdentifier, ServiceConstructor>()

  /**
   * 注册服务
   */
  register<T extends Service>(
    id: ServiceIdentifier<T>,
    implementation: ServiceConstructor<T>,
    singleton = true
  ): void {
    this.implementations.set(id, implementation)
    this.services.set(id, { implementation, singleton })

    // 如果已经有实例，则删除它以便下次重新创建
    if (this.singletons.has(id)) {
      this.singletons.delete(id)
    }
  }

  /**
   * 注册实例
   */
  registerInstance<T extends Service>(id: ServiceIdentifier<T>, instance: T): void {
    this.singletons.set(id, instance)
    this.services.set(id, { singleton: true })
  }

  /**
   * 解析服务
   */
  resolve<T extends Service>(id: ServiceIdentifier<T>): T {
    // 已经有实例，直接返回
    if (this.singletons.has(id)) {
      return this.singletons.get(id) as T
    }

    const registration = this.services.get(id)
    if (!registration) {
      throw new Error(`Service "${id.toString()}" not registered`)
    }

    const { implementation, singleton } = registration

    // 创建新实例
    if (!implementation) {
      throw new Error(`Implementation for "${id.toString()}" not found`)
    }

    const instance = new implementation()

    // 如果是单例，存储实例
    if (singleton) {
      this.singletons.set(id, instance)
    }

    return instance as T
  }

  /**
   * 检查服务是否已注册
   */
  has<T extends Service>(id: ServiceIdentifier<T>): boolean {
    return this.services.has(id)
  }
}
