/**
 * UniApp Storage 适配器实现
 *
 * 基于 uni.setStorage/uni.getStorage 实现 IStorage 接口
 */

import type { IStorage } from '@diet-lens/core'

export class UniStorageAdapter implements IStorage {
  async getItem<T = unknown>(key: string): Promise<T | null> {
    return new Promise((resolve) => {
      uni.getStorage({
        key,
        success: (res) => {
          resolve(res.data as T)
        },
        fail: () => {
          resolve(null)
        },
      })
    })
  }

  async setItem<T = unknown>(key: string, value: T): Promise<void> {
    return new Promise((resolve, reject) => {
      uni.setStorage({
        key,
        data: value,
        success: () => resolve(),
        fail: (err) => reject(err),
      })
    })
  }

  async removeItem(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      uni.removeStorage({
        key,
        success: () => resolve(),
        fail: (err) => reject(err),
      })
    })
  }

  async clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      uni.clearStorage({
        success: () => resolve(),
        fail: (err) => reject(err),
      })
    })
  }
}

/** 单例实例 */
export const storageAdapter = new UniStorageAdapter()
