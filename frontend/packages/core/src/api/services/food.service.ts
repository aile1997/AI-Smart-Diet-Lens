/**
 * 食物服务
 *
 * 提供 AI 食物识别和食物库搜索功能
 */

import { ApiClient } from '../client'

/**
 * 营养信息
 */
export interface NutritionInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sodium?: number
}

/**
 * 识别的食物
 */
export interface RecognizedFood {
  id: string
  name: string
  portion_g: number
  confidence: number
  nutrition: NutritionInfo
  tips?: string
}

/**
 * AI 分析响应
 */
export interface AnalyzeResponse {
  foods: RecognizedFood[]
  image_url: string
  recognized_at: number
}

/**
 * 食物搜索项
 */
export interface FoodSearchItem {
  id: string
  name: string
  calories: number
  unit: string
}

/**
 * 食物搜索响应
 */
export interface FoodSearchResponse {
  results: FoodSearchItem[]
  page: number
  total_pages: number
}

/**
 * AI 分析请求
 */
export interface AnalyzeFoodRequest {
  image_url: string
  ar_context?: {
    container: string
    distance_cm?: number
  }
}

/**
 * 食物服务类
 */
export class FoodService {
  constructor(private client: ApiClient) {}

  /**
   * AI 食物识别分析
   * POST /api/ai/analyze
   *
   * @param imageUrl 腾讯云 COS 公网 URL
   * @param arContext AR 上下文信息（可选）
   * @returns 识别结果
   */
  async analyzeFood(imageUrl: string, arContext?: AnalyzeFoodRequest['ar_context']): Promise<AnalyzeResponse> {
    // ApiClient.request 已经返回 data 部分，不需要再 .data
    return this.client.post<AnalyzeResponse>('/ai/analyze', {
      image_url: imageUrl,
      ar_context: arContext
    })
  }

  /**
   * 搜索食物库
   * GET /api/food/search
   *
   * @param query 搜索关键词
   * @param page 页码，默认 1
   * @param limit 每页数量，默认 20
   * @returns 搜索结果
   */
  async searchFood(query: string, page = 1, limit = 20): Promise<FoodSearchResponse> {
    const params = new URLSearchParams({
      q: query,
      page: String(page),
      limit: String(limit)
    })
    // ApiClient.request 已经返回 data 部分，不需要再 .data
    return this.client.get<FoodSearchResponse>(`/food/search?${params}`)
  }

  /**
   * 通过条形码查找食物
   * GET /api/food/barcode/:code
   *
   * @param code EAN 条形码
   * @returns 食物信息
   */
  async findByBarcode(code: string): Promise<FoodSearchItem> {
    // ApiClient.request 已经返回 data 部分，不需要再 .data
    return this.client.get<FoodSearchItem>(`/food/barcode/${code}`)
  }
}
