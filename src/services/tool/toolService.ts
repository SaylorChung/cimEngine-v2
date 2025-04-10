import { IToolService, Tool } from './types'
import { EventBus } from '../../core/eventBus'

/**
 * 工具服务实现
 */
export class ToolService implements IToolService {
  private _events: EventBus
  private _tools: Map<string, Tool> = new Map()
  private _activeTool: string | null = null

  /**
   * 构造函数
   * @param events 事件总线
   */
  constructor(events: EventBus) {
    this._events = events
  }

  /**
   * 激活工具
   * @param toolId 工具ID
   * @param options 工具选项
   */
  activate(toolId: string, options?: any): void {
    const tool = this._tools.get(toolId)
    if (!tool) {
      console.warn(`工具 ${toolId} 未注册`)
      return
    }

    // 如果有活跃工具，先停用它
    if (this._activeTool && this._activeTool !== toolId) {
      this.deactivate(this._activeTool)
    }

    // 激活新工具
    tool.activate(options)
    this._activeTool = toolId
    this._events.emit('tool.activated', { toolId, tool })
  }

  /**
   * 停用工具
   * @param toolId 工具ID
   */
  deactivate(toolId: string): void {
    const tool = this._tools.get(toolId)
    if (!tool) return

    tool.deactivate()
    if (this._activeTool === toolId) {
      this._activeTool = null
    }
    this._events.emit('tool.deactivated', { toolId })
  }

  /**
   * 注册工具
   * @param toolId 工具ID
   * @param tool 工具实例
   */
  register(toolId: string, tool: Tool): void {
    if (this._tools.has(toolId)) {
      console.warn(`工具 ${toolId} 已存在`)
      return
    }

    this._tools.set(toolId, tool)

    // 初始化工具(如果有初始化方法)
    if (typeof tool.init === 'function') {
      tool.init()
    }

    this._events.emit('tool.registered', { toolId, tool })
  }

  /**
   * 获取工具实例
   * @param toolId 工具ID
   */
  getTool(toolId: string): Tool | undefined {
    return this._tools.get(toolId)
  }

  /**
   * 获取当前激活的工具ID
   */
  getActiveTool(): string | null {
    return this._activeTool
  }
}
