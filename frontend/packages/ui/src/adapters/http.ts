/**
 * UniApp HTTP 适配器实现
 *
 * 基于 uni.request 实现 IHttp 接口
 */

import type { IHttp, HttpConfig, HttpResponse } from '@diet-lens/core'

// API 基础 URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export class UniHttpAdapter implements IHttp {
  async request<T = unknown>(config: HttpConfig): Promise<HttpResponse<T>> {
    return new Promise((resolve, reject) => {
      const url = config.url.startsWith('http')
        ? config.url
        : `${BASE_URL}${config.url}`

      uni.request({
        url,
        method: config.method || 'GET',
        data: config.data,
        header: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        timeout: config.timeout || 30000,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              data: res.data as T,
              statusCode: res.statusCode,
              headers: res.header as Record<string, string>,
            })
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.data}`))
          }
        },
        fail: (err) => {
          reject(new Error(err.errMsg || 'Network error'))
        },
      })
    })
  }
}

/** 单例实例 */
export const httpAdapter = new UniHttpAdapter()
