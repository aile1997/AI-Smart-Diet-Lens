/**
 * 平台适配器实现
 *
 * 基于 UniApp API 实现 @diet-lens/core 的适配器接口
 */

import type { IStorage } from '@diet-lens/core/adapters/IStorage'
import type { ICamera, CameraResult } from '@diet-lens/core/adapters/ICamera'

// HTTP 适配器已移除 - 请使用 ApiClient (initApi 初始化)

/** 存储适配器 - 基于 uni.setStorage/uni.getStorage */
export const storageAdapter: IStorage = {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const result = uni.getStorageSync(key)
      return result ? (JSON.parse(result as string) as T) : null
    }
    catch {
      return null
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    uni.setStorageSync(key, JSON.stringify(value))
  },

  async removeItem(key: string): Promise<void> {
    uni.removeStorageSync(key)
  },

  async clear(): Promise<void> {
    uni.clearStorageSync()
  },
}

/** 相机适配器 - 基于 uni.chooseImage */
export const cameraAdapter: ICamera = {
  async takePicture(): Promise<CameraResult> {
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (res) => {
          resolve({
            tempFilePath: res.tempFilePaths[0],
            size: res.tempFiles[0].size,
          })
        },
        fail: (err) => {
          reject(new Error(err.errMsg))
        },
      })
    })
  },

  async chooseFromAlbum(): Promise<CameraResult> {
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: (res) => {
          resolve({
            tempFilePath: res.tempFilePaths[0],
            size: res.tempFiles[0].size,
          })
        },
        fail: (err) => {
          reject(new Error(err.errMsg))
        },
      })
    })
  },
}
