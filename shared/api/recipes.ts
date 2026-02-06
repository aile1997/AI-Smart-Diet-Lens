import { ApiResponse } from './common'

/**
 * 营养缺口
 */
export interface NutritionGap {
  calories: number
  protein: number
  carbs: number
  fat: number
}

/**
 * 食谱条目
 */
export interface RecipeItem {
  id: string
  title: string
  tags: string[]
  image?: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

/**
 * 食谱推荐响应
 */
export interface RecipeRecommendationResponse {
  reason_text: string
  recipes: RecipeItem[]
}

/**
 * GET /api/recipes/recommend
 */
export interface GetRecommendRecipesResponse extends ApiResponse {
  data: RecipeRecommendationResponse
}
