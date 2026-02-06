/**
 * 收藏服务
 *
 * GET /api/favorites/ - 获取收藏列表
 * POST /api/favorites/ - 添加收藏
 * DELETE /api/favorites/:id - 取消收藏
 * GET /api/favorites/check/:item_id - 检查是否已收藏
 */

import type { ApiClient } from '../client'

/**
 * 收藏类型
 */
export type FavoriteType = 'recipe' | 'food'

/**
 * 收藏项
 */
export interface Favorite {
  id: string
  itemId: string
  type: FavoriteType
  item?: {
    name: string
    image?: string
    calories?: number
  }
  createdAt: string
}

/**
 * 收藏列表响应
 */
export interface FavoritesResponse {
  favorites: Favorite[]
}

/**
 * 检查收藏状态响应
 */
export interface CheckFavoritedResponse {
  isFavorited: boolean
}

export class FavoritesService {
  constructor(private client: ApiClient) {}

  /**
   * 获取收藏列表
   *
   * @param type 类型筛选（可选）
   */
  async getFavorites(type?: FavoriteType): Promise<FavoritesResponse> {
    const params = type ? { type } : undefined
    return this.client.get<FavoritesResponse>('/favorites/', { params })
  }

  /**
   * 添加收藏
   *
   * @param itemId 项目 ID
   * @param type 类型
   */
  async addFavorite(itemId: string, type: FavoriteType): Promise<Favorite> {
    return this.client.post<Favorite>('/favorites/', { itemId, type })
  }

  /**
   * 取消收藏
   *
   * @param id 收藏 ID
   */
  async removeFavorite(id: string): Promise<{ success: boolean }> {
    return this.client.delete<{ success: boolean }>(`/favorites/${id}`)
  }

  /**
   * 检查是否已收藏
   *
   * @param itemId 项目 ID
   * @param type 类型
   */
  async checkFavorited(itemId: string, type?: FavoriteType): Promise<CheckFavoritedResponse> {
    const params = type ? { type } : undefined
    return this.client.get<CheckFavoritedResponse>(`/favorites/check/${itemId}`, { params })
  }
}
