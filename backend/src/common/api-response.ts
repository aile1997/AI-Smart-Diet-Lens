/**
 * 统一 API 响应格式
 */
export class ApiResponse<T = unknown> {
  success: boolean
  code?: string
  message?: string
  data?: T
  timestamp: number

  constructor(partial: Partial<ApiResponse<T>>) {
    Object.assign(this, partial)
    this.success = partial.success ?? true
    this.timestamp = Date.now()
  }

  static ok<T>(data?: T, message?: string): ApiResponse<T> {
    return new ApiResponse({
      success: true,
      data,
      message,
    })
  }

  static error(code: string, message: string): ApiResponse {
    return new ApiResponse({
      success: false,
      code,
      message,
    })
  }
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
