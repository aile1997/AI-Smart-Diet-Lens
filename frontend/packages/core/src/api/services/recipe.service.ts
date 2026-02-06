/**
 * 食谱服务
 *
 * GET /api/recipes/recommend - 基于缺口的推荐
 */

import type { ApiClient } from '../client'

/**
 * 食谱推荐响应
 */
export interface RecipeRecommendResponse {
  reasonText: string
  recipes: Recipe[]
}

/**
 * 食谱
 */
export interface Recipe {
  id: string
  name: string
  image: string
  tags: string[]
  calories: number
  time?: string
  difficulty?: string
  description?: string
}

export class RecipeService {
  constructor(private client: ApiClient) {}

  /**
   * 获取基于缺口的食谱推荐
   */
  async getRecommendations(): Promise<RecipeRecommendResponse> {
    return this.client.get<RecipeRecommendResponse>('/recipes/recommend')
  }
}
