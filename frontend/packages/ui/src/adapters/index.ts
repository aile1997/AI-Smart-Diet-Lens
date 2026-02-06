/**
 * 适配器统一导出
 *
 * 导出 UI 层实现的适配器实例
 */

export { httpAdapter } from './http'
export { storageAdapter } from './storage'

// 重新导出类型
export type { IHttp } from '@diet-lens/core'
export type { IStorage } from '@diet-lens/core'
