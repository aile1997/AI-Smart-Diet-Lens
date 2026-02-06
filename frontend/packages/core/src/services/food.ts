/**
 * 食物库服务
 *
 * 提供食物搜索和条形码查询 API
 */

import type { IHttp } from '../adapters/IHttp'

const API_BASE = 'http://localhost:3000/api'

/**
 * 食物搜索项
 */
export interface FoodSearchItem {
  id: string
  name: string
  brand?: string
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
}

/**
 * 分页响应
 */
export interface PaginatedFoodResponse {
  items: FoodSearchItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * API 响应包装
 */
interface FoodSearchApiResponse {
  success: boolean
  data?: PaginatedFoodResponse
  message?: string
  timestamp: number
}

/**
 * 搜索食物
 *
 * @param http - HTTP 适配器
 * @param query - 搜索关键词
 * @param page - 页码，默认 1
 * @param limit - 每页数量，默认 20
 * @returns 搜索结果
 */
export async function searchFood(
  http: IHttp,
  query: string,
  page = 1,
  limit = 20
): Promise<PaginatedFoodResponse> {
  const response = await http.request<FoodSearchApiResponse>({
    url: `${API_BASE}/food/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
    method: 'GET',
  })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '搜索食物失败')
  }

  return response.data.data
}

/**
 * 条形码查询食物
 *
 * @param http - HTTP 适配器
 * @param code - EAN 条形码
 * @returns 食物信息
 */
export async function getFoodByBarcode(
  http: IHttp,
  code: string
): Promise<FoodSearchItem> {
  const response = await http.request<{ success: boolean; data?: FoodSearchItem; message?: string }>({
    url: `${API_BASE}/food/barcode/${code}`,
    method: 'GET',
  })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '未找到该条形码对应的食物')
  }

  return response.data.data
}
