/**
 * API 客户端核心类
 *
 * 统一封装 HTTP 请求，处理认证、错误、参数等
 * 使用可注入的 fetch 提供器，支持 UniApp 和浏览器环境
 */

import type { ApiResponse, ApiClientConfig, ApiRequestOptions } from './types'

/**
 * Token 获取函数类型
 */
type TokenGetter = () => string | null

/**
 * 401 错误回调函数类型
 */
type OnUnauthorizedCallback = () => void

/**
 * Fetch 提供器类型
 * 支持原生 fetch 或 UniApp 的 uni.request
 */
type FetchProvider = typeof fetch | ((url: string, config: RequestInit) => Promise<Response>)

/**
 * UniApp 请求选项类型
 */
interface UniRequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: unknown
  header?: Record<string, string>
  timeout?: number
}

/**
 * UniApp 请求成功响应类型
 */
interface UniRequestSuccessResponse {
  statusCode: number
  data: unknown
  header: Record<string, string>
}

/**
 * UniApp 请求失败响应类型
 */
interface UniRequestFailResponse {
  errMsg: string
}

/**
 * 默认配置
 */
const DEFAULT_CONFIG: ApiClientConfig = {
  baseURL: 'http://localhost:3000/api',
  timeout: 30000,
}

/**
 * UniApp request 转 fetch 包装
 */
function uniRequestAsFetch(url: string, config: RequestInit): Promise<Response> {
  return new Promise((resolve, reject) => {
    const requestOptions: UniRequestOptions = {
      url,
      method: config.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      data: config.body as unknown,
      header: config.headers as Record<string, string>,
      timeout: 30000,
    }

    uni.request({
      ...requestOptions,
      success: (res: UniRequestSuccessResponse) => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          statusText: 'OK',
          headers: res.header as Headers,
          json: async () => res.data,
          text: async () => JSON.stringify(res.data),
        } as Response)
      },
      fail: (err: UniRequestFailResponse) => {
        reject(new Error(err.errMsg || '网络请求失败'))
      },
    })
  })
}

/**
 * API 客户端类
 *
 * @example
 * ```ts
 * const api = new ApiClient({
 *   baseURL: 'http://localhost:3000/api',
 *   tokenGetter: () => uni.getStorageSync('token'),
 *   fetchProvider: uniRequestAsFetch  // 可选，默认使用原生 fetch
 * })
 *
 * const data = await api.get('/user/profile')
 * ```
 */
export class ApiClient {
  private baseURL: string
  private tokenGetter: TokenGetter | null
  private timeout: number
  private fetchProvider: FetchProvider
  private onUnauthorized: OnUnauthorizedCallback | null

  constructor(config: Partial<ApiClientConfig> & { fetchProvider?: FetchProvider } = {}) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config }
    this.baseURL = finalConfig.baseURL
    this.tokenGetter = finalConfig.tokenGetter || null
    this.timeout = finalConfig.timeout || 30000
    this.onUnauthorized = finalConfig.onUnauthorized || null
    // 使用注入的 fetch 提供器，默认使用原生 fetch
    this.fetchProvider = finalConfig.fetchProvider || (fetch as typeof fetch)
  }

  /**
   * 设置 401 错误回调
   */
  setOnUnauthorized(callback: OnUnauthorizedCallback) {
    this.onUnauthorized = callback
  }

  /**
   * 构建完整 URL
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number>): string {
    const url = new URL(endpoint, this.baseURL)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }

    return url.toString()
  }

  /**
   * 获取请求头
   */
  private getHeaders(customHeaders?: HeadersInit): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...customHeaders,
    }

    // 添加认证 token
    if (this.tokenGetter) {
      const token = this.tokenGetter()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  /**
   * 核心请求方法
   */
  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const {
      params,
      headers,
      body,
      method = 'GET',
      ...restOptions
    } = options

    const url = this.buildUrl(endpoint, params)
    const requestHeaders = this.getHeaders(headers)

    const config: RequestInit = {
      method,
      headers: requestHeaders,
      ...restOptions,
    }

    // 添加请求体（非 GET 请求）
    if (body && method !== 'GET') {
      if (body instanceof FormData) {
        delete (config.headers as Record<string, string>)['Content-Type']
        config.body = body as unknown as BodyInit
      } else {
        config.body = JSON.stringify(body)
      }
    }

    try {
      const response = await this.fetchProvider(url, config)

      // 处理 401 未授权错误
      if (response.status === 401) {
        if (this.onUnauthorized) {
          this.onUnauthorized()
        }
        const errorData = await response.json().catch(() => ({ message: '未授权' }))
        throw new Error(errorData.error || errorData.message || '未授权访问')
      }

      // 处理其他非 2xx 响应
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: '请求失败' }))
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`)
      }

      const result: ApiResponse<T> = await response.json()

      // 检查业务状态码
      if (!result.success) {
        throw new Error(result.error || result.message || '请求失败')
      }

      return result.data as T
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error))
    }
  }

  /**
   * GET 请求
   */
  async get<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'body' | 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  /**
   * POST 请求
   */
  async post<T>(endpoint: string, data?: unknown, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: data as BodyInit })
  }

  /**
   * PATCH 请求
   */
  async patch<T>(endpoint: string, data?: unknown, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body: data as BodyInit })
  }

  /**
   * DELETE 请求
   */
  async delete<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'body' | 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  /**
   * PUT 请求
   */
  async put<T>(endpoint: string, data?: unknown, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: data as BodyInit })
  }
}

/**
 * 导出类型和工具
 */
export type { ApiClientConfig, ApiRequestOptions, ApiResponse }

/**
 * UniApp request 转 fetch 包装（供外部使用）
 */
export { uniRequestAsFetch }
