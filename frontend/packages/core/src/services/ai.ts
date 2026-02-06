/**
 * AI 识别服务
 *
 * 提供食物拍照识别 API
 */

import type { IHttp } from '../adapters/IHttp'

const API_BASE = 'http://localhost:3000/api'

/**
 * AI 食物识别请求
 */
export interface AnalyzeFoodRequest {
  image_base64: string
  image_url?: string
}

/**
 * AI 食物识别响应
 */
export interface AnalyzeFoodResponse {
  food_name: string
  confidence: number
  serving_size: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
}

/**
 * API 响应包装
 */
interface AnalyzeFoodApiResponse {
  success: boolean
  data?: AnalyzeFoodResponse
  message?: string
  timestamp: number
}

/**
 * AI 食物识别
 *
 * @param http - HTTP 适配器
 * @param data - 识别请求
 * @returns 识别结果
 */
export async function analyzeFood(
  http: IHttp,
  data: AnalyzeFoodRequest
): Promise<AnalyzeFoodResponse> {
  const response = await http.request<AnalyzeFoodApiResponse>({
    url: `${API_BASE}/ai/analyze`,
    method: 'POST',
    data,
  })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'AI 识别失败')
  }

  return response.data.data
}
