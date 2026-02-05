/**
 * HTTP 请求适配器接口
 *
 * Core 层通过此接口发起网络请求，
 * UI 层提供基于 uni.request 的具体实现
 */

export interface HttpConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: Record<string, unknown>
  headers?: Record<string, string>
  /** 超时时间 (ms) */
  timeout?: number
}

export interface HttpResponse<T = unknown> {
  data: T
  statusCode: number
  headers: Record<string, string>
}

export interface IHttp {
  request<T = unknown>(config: HttpConfig): Promise<HttpResponse<T>>
}
