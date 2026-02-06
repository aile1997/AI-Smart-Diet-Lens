import { ApiResponse } from './common'
import { NutritionInfo } from './user'

/**
 * AR 上下文
 */
export interface ARContext {
  container: string
  distance_cm?: number
}

/**
 * AI 分析请求
 */
export interface AnalyzeFoodRequest {
  image_key: string
  ar_context?: ARContext
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
}

/**
 * AI 分析响应
 */
export interface AnalyzeResponse {
  foods: RecognizedFood[]
  image_key: string
  recognized_at: number
}

/**
 * POST /api/ai/analyze
 */
export interface AnalyzeApiResponse extends ApiResponse {
  data: AnalyzeResponse
}

/**
 * 食物搜索响应
 */
export interface FoodItem {
  id: string
  name: string
  category?: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sodium?: number
  image_url?: string
}

/**
 * GET /api/food/search
 */
export interface SearchFoodResponse extends ApiResponse {
  data: { results: FoodItem[]; page: number; total_pages: number }
}

/**
 * GET /api/food/barcode/:code
 */
export interface BarcodeFoodResponse extends ApiResponse {
  data: FoodItem
}
