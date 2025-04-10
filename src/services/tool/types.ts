import { Service } from 'artis'

/**
 * 工具服务接口
 */
export interface IToolService extends Service {
  /**
   * 激活工具
   * @param toolId 工具ID
   * @param options 工具选项
   */
  activate(toolId: string, options?: any): void

  /**
   * 停用工具
   * @param toolId 工具ID
   */
  deactivate(toolId: string): void

  /**
   * 注册工具
   * @param toolId 工具ID
   * @param tool 工具实例
   */
  register(toolId: string, tool: Tool): void

  /**
   * 获取工具实例
   * @param toolId 工具ID
   */
  getTool(toolId: string): Tool | undefined

  /**
   * 获取当前激活的工具ID
   */
  getActiveTool(): string | null
}

/**
 * 工具基础接口
 */
export interface Tool {
  /**
   * 工具名称
   */
  name: string

  /**
   * 初始化工具
   */
  init?(): void

  /**
   * 激活工具
   * @param options 工具选项
   */
  activate(options?: any): void

  /**
   * 停用工具
   */
  deactivate(): void

  /**
   * 销毁工具
   */
  dispose?(): void
}
