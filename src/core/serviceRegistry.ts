import { Container } from './container'
import { EventBus } from './eventBus'

/**
 * 服务注册表，管理所有服务的生命周期
 */
export class ServiceRegistry {
  private _container: Container
  private _events: EventBus
  private _serviceInitializers: Map<string, () => Promise<void>> = new Map()
  private _serviceDisposers: Map<string, () => Promise<void>> = new Map()

  /**
   * 构造函数
   * @param container 依赖注入容器
   * @param events 事件总线
   */
  constructor(container: Container, events: EventBus) {
    this._container = container
    this._events = events
  }

  /**
   * 注册服务
   * @param serviceId 服务ID
   * @param serviceFactory 服务工厂函数
   * @param initFn 可选的初始化函数
   * @param disposeFn 可选的销毁函数
   */
  registerService(
    serviceId: string,
    serviceFactory: () => any,
    initFn?: () => Promise<void>,
    disposeFn?: () => Promise<void>
  ): void {
    this._container.register(serviceId, serviceFactory())

    if (initFn) {
      this._serviceInitializers.set(serviceId, initFn)
    }

    if (disposeFn) {
      this._serviceDisposers.set(serviceId, disposeFn)
    }
  }

  /**
   * 初始化所有已注册的服务
   */
  async initServices(): Promise<void> {
    const initPromises: Promise<void>[] = []

    this._serviceInitializers.forEach(initFn => {
      initPromises.push(initFn())
    })

    await Promise.all(initPromises)
    this._events.emit('services.initialized')
  }

  /**
   * 销毁所有已注册的服务
   */
  async disposeServices(): Promise<void> {
    const disposePromises: Promise<void>[] = []

    this._serviceDisposers.forEach(disposeFn => {
      disposePromises.push(disposeFn())
    })

    await Promise.all(disposePromises)
    this._events.emit('services.disposed')
  }
}
