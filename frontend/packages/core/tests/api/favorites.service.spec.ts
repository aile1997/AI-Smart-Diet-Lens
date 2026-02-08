/**
 * FavoritesService 单元测试
 *
 * 测试收藏 API 服务
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FavoritesService } from '../../src/api/services/favorites.service'
import type { ApiClient } from '../../src/api/client'

describe('FavoritesService', () => {
  let favoritesService: FavoritesService
  let mockClient: {
    get: ReturnType<typeof vi.fn>
    post: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn()
    }

    favoritesService = new FavoritesService(mockClient as any)
  })

  describe('getFavorites', () => {
    it('应成功获取收藏列表', async () => {
      const mockResponse = {
        favorites: [
          {
            id: 'fav-1',
            itemId: 'recipe-123',
            type: 'recipe' as const,
            item: {
              name: '香煎鸡胸肉',
              image: 'https://example.com/recipes/chicken.jpg',
              calories: 280
            },
            createdAt: '2024-01-15T10:00:00Z'
          },
          {
            id: 'fav-2',
            itemId: 'food-456',
            type: 'food' as const,
            item: {
              name: '燕麦',
              calories: 380
            },
            createdAt: '2024-01-14T08:00:00Z'
          }
        ]
      }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await favoritesService.getFavorites()

      expect(result).toEqual(mockResponse)
      expect(mockClient.get).toHaveBeenCalledWith('/favorites/', { params: undefined })
    })

    it('应支持按类型筛选', async () => {
      const mockResponse = {
        favorites: [
          {
            id: 'fav-1',
            itemId: 'recipe-123',
            type: 'recipe' as const,
            item: {
              name: '香煎鸡胸肉',
              image: 'https://example.com/recipes/chicken.jpg',
              calories: 280
            },
            createdAt: '2024-01-15T10:00:00Z'
          }
        ]
      }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await favoritesService.getFavorites('recipe')

      expect(result).toEqual(mockResponse)
      expect(mockClient.get).toHaveBeenCalledWith('/favorites/', { params: { type: 'recipe' } })
    })
  })

  describe('addFavorite', () => {
    it('应成功添加收藏', async () => {
      const mockFavorite = {
        id: 'fav-3',
        itemId: 'recipe-789',
        type: 'recipe' as const,
        item: {
          name: '三文鱼配芦笋',
          image: 'https://example.com/recipes/salmon.jpg',
          calories: 350
        },
        createdAt: '2024-01-15T12:00:00Z'
      }

      mockClient.post.mockResolvedValue(mockFavorite)

      const result = await favoritesService.addFavorite('recipe-789', 'recipe')

      expect(result).toEqual(mockFavorite)
      expect(mockClient.post).toHaveBeenCalledWith('/favorites/', {
        itemId: 'recipe-789',
        type: 'recipe'
      })
    })

    it('应支持收藏食物', async () => {
      const mockFavorite = {
        id: 'fav-4',
        itemId: 'food-999',
        type: 'food' as const,
        item: {
          name: '苹果',
          calories: 52
        },
        createdAt: '2024-01-15T13:00:00Z'
      }

      mockClient.post.mockResolvedValue(mockFavorite)

      const result = await favoritesService.addFavorite('food-999', 'food')

      expect(result).toEqual(mockFavorite)
      expect(mockClient.post).toHaveBeenCalledWith('/favorites/', {
        itemId: 'food-999',
        type: 'food'
      })
    })
  })

  describe('removeFavorite', () => {
    it('应成功取消收藏', async () => {
      const mockResponse = { success: true }

      mockClient.delete.mockResolvedValue(mockResponse)

      const result = await favoritesService.removeFavorite('fav-1')

      expect(result).toEqual(mockResponse)
      expect(mockClient.delete).toHaveBeenCalledWith('/favorites/fav-1')
    })

    it('应处理删除失败', async () => {
      mockClient.delete.mockRejectedValue(new Error('收藏不存在'))

      await expect(favoritesService.removeFavorite('invalid-id')).rejects.toThrow('收藏不存在')
    })
  })

  describe('checkFavorited', () => {
    it('应成功检查收藏状态（已收藏）', async () => {
      const mockResponse = { isFavorited: true }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await favoritesService.checkFavorited('recipe-123', 'recipe')

      expect(result).toEqual(mockResponse)
      expect(mockClient.get).toHaveBeenCalledWith('/favorites/check/recipe-123', {
        params: { type: 'recipe' }
      })
    })

    it('应成功检查收藏状态（未收藏）', async () => {
      const mockResponse = { isFavorited: false }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await favoritesService.checkFavorited('recipe-456', 'recipe')

      expect(result.isFavorited).toBe(false)
    })

    it('应支持不带类型参数的检查', async () => {
      const mockResponse = { isFavorited: true }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await favoritesService.checkFavorited('recipe-123')

      expect(result).toEqual(mockResponse)
      expect(mockClient.get).toHaveBeenCalledWith('/favorites/check/recipe-123', {
        params: undefined
      })
    })
  })
})
