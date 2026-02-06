/**
 * 通用 API 响应格式
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  code?: string
  message?: string
  data?: T
  timestamp: number
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
