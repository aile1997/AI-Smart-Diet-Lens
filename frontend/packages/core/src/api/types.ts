/**
 * API 基础类型定义
 *
 * 根据 api-contracts-final.md 定义的响应格式
 */

/**
 * 统一 API 响应格式
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

/**
 * HTTP 请求配置
 */
export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number>
}

/**
 * API 错误类
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public errorCode: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * 401 错误回调函数类型
 */
export type OnUnauthorizedCallback = () => void

/**
 * API 客户端配置
 */
export interface ApiClientConfig {
  baseURL: string
  tokenGetter?: () => string | null
  timeout?: number
  onUnauthorized?: OnUnauthorizedCallback
}
