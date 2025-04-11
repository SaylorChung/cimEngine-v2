import type { IService } from '../../core/types'

/**
 * 数据服务接口
 */
export interface IDataService extends IService {
  /**
   * 加载数据
   * @param url 数据URL
   * @param options 加载选项
   */
  loadData<T>(url: string, options?: DataLoadOptions): Promise<T>

  /**
   * 保存数据
   * @param key 数据键
   * @param data 数据对象
   */
  saveData<T>(key: string, data: T): void

  /**
   * 获取数据
   * @param key 数据键
   */
  getData<T>(key: string): T | undefined

  /**
   * 导出数据
   * @param data 要导出的数据
   * @param options 导出选项
   */
  exportData<T>(data: T, options: ExportOptions): Promise<string>
}

/**
 * 数据加载选项
 */
export interface DataLoadOptions {
  /**
   * 数据类型
   */
  dataType?: 'json' | 'geojson' | 'kml' | 'czml' | 'xml' | 'text'

  /**
   * 请求头
   */
  headers?: Record<string, string>
}

/**
 * 导出选项
 */
export interface ExportOptions {
  /**
   * 导出格式
   */
  format: 'json' | 'geojson' | 'kml' | 'csv'

  /**
   * 文件名
   */
  filename?: string
}
