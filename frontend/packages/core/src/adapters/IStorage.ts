/**
 * 本地存储适配器接口
 *
 * Core 层通过此接口进行本地存储操作，
 * UI 层提供基于 uni.setStorage/uni.getStorage 的具体实现
 */

export interface IStorage {
  getItem<T = unknown>(key: string): Promise<T | null>
  setItem<T = unknown>(key: string, value: T): Promise<void>
  removeItem(key: string): Promise<void>
  clear(): Promise<void>
}
