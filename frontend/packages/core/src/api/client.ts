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
 * 开发环境：
 *   - H5: 使用相对路径（通过 Vite 代理）
 *   - UniApp: 使用局域网 IP（手机调试）
 * 生产环境：必须通过环境变量配置 API 地址
 */
const getBaseURL = () => {
  // 生产环境：必须从环境变量读取（防止使用局域网地址）
  if (import.meta.env.PROD) {
    const prodUrl = import.meta.env.VITE_API_BASE_URL
    if (!prodUrl) {
      console.error('[ApiClient] 生产环境必须设置 VITE_API_BASE_URL 环境变量')
      throw new Error('生产环境缺少 VITE_API_BASE_URL 配置，请联系管理员')
    }
    return prodUrl
  }

  // 开发环境
  // H5 环境使用相对路径，通过 Vite 代理访问后端（避免跨域）
  if (typeof window !== 'undefined') {
    return '/api' // 通过 Vite 代理
  }

  // UniApp 环境：使用局域网 IP（手机和电脑都可以访问）
  const serverIP = '192.168.10.29'
  const serverPort = '3000'
  return `http://${serverIP}:${serverPort}/api`
}

const DEFAULT_CONFIG: ApiClientConfig = {
  baseURL: getBaseURL(),
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
    // 使用箭头函数确保 fetch 在正确的上下文中执行
    this.fetchProvider = finalConfig.fetchProvider || ((url, options) => fetch(url, options))
  }

  /**
   * 设置 401 错误回调
   */
  setOnUnauthorized(callback: OnUnauthorizedCallback) {
    this.onUnauthorized = callback
  }

  /**
   * 构建完整 URL
   *
   * 注意：由于 new URL() 的行为，endpoint 以 / 开头会替换 baseURL 的路径部分
   * 因此需要手动拼接路径，确保 baseURL 和 endpoint 正确连接
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number>): string {
    // 移除 baseURL 末尾的斜杠和 endpoint 开头的斜杠，避免重复
    const cleanBaseURL = this.baseURL.replace(/\/$/, '')
    const cleanEndpoint = endpoint.replace(/^\//, '')
    const fullUrl = `${cleanBaseURL}/${cleanEndpoint}`

    const url = new URL(fullUrl)

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
      console.log('[ApiClient getHeaders] tokenGetter 存在:', !!this.tokenGetter)
      console.log('[ApiClient getHeaders] token 存在:', !!token)
      console.log('[ApiClient getHeaders] token 长度:', token?.length || 0)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
        console.log('[ApiClient getHeaders] Authorization header 已设置')
      }
    } else {
      console.log('[ApiClient getHeaders] tokenGetter 不存在！')
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
      console.log('[ApiClient Request] URL:', url)
      console.log('[ApiClient Request] Config:', { method: config.method, headers: config.headers })
      const response = await this.fetchProvider(url, config)

      console.log('[ApiClient Response] Status:', response.status, 'OK:', response.ok)

      // 处理 401 未授权错误
      if (response.status === 401) {
        if (this.onUnauthorized) {
          this.onUnauthorized()
        }
        const errorData = await this.safeJsonParse(response)
        throw new Error(errorData?.error || errorData?.message || '未授权访问')
      }

      // 处理其他非 2xx 响应
      if (!response.ok) {
        const errorData = await this.safeJsonParse(response)
        throw new Error(errorData?.error || errorData?.message || `HTTP ${response.status}`)
      }

      // 尝试解析响应
      const result = await this.safeJsonParse<ApiResponse<T>>(response)
      console.log('[ApiClient Parsed Result]:', result)
      console.log('[ApiClient Result Keys]:', result ? Object.keys(result) : 'null')

      // 检查是否成功解析
      if (!result) {
        throw new Error('响应解析失败：返回数据不是有效 JSON')
      }

      // 检查业务状态码
      if (!result.success) {
        throw new Error(result.error || result.message || '请求失败')
      }

      // 检查 data 是否存在
      if (result.data === undefined || result.data === null) {
        console.warn('[ApiClient] Warning: result.data is', result.data)
      }

      console.log('[ApiClient Returning data]:', result.data)
      return result.data as T
    } catch (error) {
      console.error('[ApiClient Error]:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error(String(error))
    }
  }

  /**
   * 安全解析 JSON 响应
   */
  private async safeJsonParse<T>(response: Response): Promise<T | null> {
    try {
      // 优先尝试使用 text() 方法（可以更好地处理错误）
      if (typeof response.text === 'function') {
        const text = await response.text()
        if (!text || text.trim() === '') {
          return null
        }
        return JSON.parse(text) as T
      }
      // 如果没有 text() 方法，直接使用 json()（用于兼容 mock）
      const result = await response.json()
      return result as T
    } catch (error) {
      console.error('[ApiClient] JSON parse error:', error)
      return null
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
