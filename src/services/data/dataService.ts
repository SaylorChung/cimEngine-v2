import { IDataService, DataLoadOptions, ExportOptions } from './types'
import { EventBus } from '../../core/eventBus'

/**
 * 数据服务实现
 */
export class DataService implements IDataService {
  private _events: EventBus
  private _dataStore: Map<string, any> = new Map()

  /**
   * 构造函数
   * @param events 事件总线
   */
  constructor(events: EventBus) {
    this._events = events
  }

  /**
   * 加载数据
   * @param url 数据URL
   * @param options 加载选项
   */
  async loadData<T>(url: string, options: DataLoadOptions = {}): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: options.headers || {},
      })

      let data: T

      switch (options.dataType) {
        case 'json':
        case 'geojson':
          data = await response.json()
          break
        case 'xml':
          const text = await response.text()
          const parser = new DOMParser()
          data = parser.parseFromString(text, 'text/xml') as any
          break
        case 'text':
        default:
          data = (await response.text()) as any
      }

      this._events.emit('data.loaded', { url, data })
      return data
    } catch (error) {
      this._events.emit('data.error', { url, error })
      throw error
    }
  }

  /**
   * 保存数据
   * @param key 数据键
   * @param data 数据对象
   */
  saveData<T>(key: string, data: T): void {
    this._dataStore.set(key, data)
    this._events.emit('data.saved', { key, data })
  }

  /**
   * 获取数据
   * @param key 数据键
   */
  getData<T>(key: string): T | undefined {
    return this._dataStore.get(key)
  }

  /**
   * 导出数据
   * @param data 要导出的数据
   * @param options 导出选项
   */
  async exportData<T>(data: T, options: ExportOptions): Promise<string> {
    let content: string
    const filename = options.filename || 'export'

    switch (options.format) {
      case 'json':
      case 'geojson':
        content = JSON.stringify(data)
        break
      case 'csv':
        // 简单CSV转换，实际应用中可能需要更复杂的处理
        if (Array.isArray(data)) {
          content = this._convertToCSV(data)
        } else {
          throw new Error('CSV导出需要数组数据')
        }
        break
      case 'kml':
        // KML导出需要特定格式处理
        throw new Error('KML格式导出尚未实现')
      default:
        throw new Error(`不支持的导出格式: ${options.format}`)
    }

    // 创建下载链接
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    this._events.emit('data.exported', { format: options.format, filename })

    return url
  }

  /**
   * 将对象数组转换为CSV字符串
   * @private
   */
  private _convertToCSV(data: any[]): string {
    if (data.length === 0) return ''

    // 获取所有列名
    const headers = Object.keys(data[0])

    // 创建CSV标题行
    const csvRows = [headers.join(',')]

    // 添加数据行
    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header]
        return `"${val !== undefined && val !== null ? val : ''}"`
      })
      csvRows.push(values.join(','))
    }

    return csvRows.join('\n')
  }
}
