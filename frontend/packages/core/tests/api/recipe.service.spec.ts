/**
 * RecipeService 单元测试
 *
 * 测试食谱 API 服务
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RecipeService } from '../../src/api/services/recipe.service'
import type { ApiClient } from '../../src/api/client'

describe('RecipeService', () => {
  let recipeService: RecipeService
  let mockClient: {
    get: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockClient = {
      get: vi.fn()
    }

    recipeService = new RecipeService(mockClient as any)
  })

  describe('getRecommendations', () => {
    it('应成功获取食谱推荐', async () => {
      const mockResponse = {
        reasonText: '根据您的今日营养缺口，我们为您推荐以下高蛋白食谱',
        recipes: [
          {
            id: 'recipe-1',
            name: '香煎鸡胸肉',
            image: 'https://example.com/recipes/chicken.jpg',
            tags: ['高蛋白', '低脂'],
            calories: 280,
            time: '20分钟',
            difficulty: '简单',
            description: '鲜嫩多汁的鸡胸肉，富含蛋白质'
          },
          {
            id: 'recipe-2',
            name: '三文鱼配芦笋',
            image: 'https://example.com/recipes/salmon.jpg',
            tags: ['Omega-3', '低卡'],
            calories: 350,
            time: '25分钟',
            difficulty: '中等'
          }
        ]
      }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await recipeService.getRecommendations()

      expect(result).toEqual(mockResponse)
      expect(mockClient.get).toHaveBeenCalledWith('/recipes/recommend')
    })

    it('应处理空推荐列表', async () => {
      const mockResponse = {
        reasonText: '您今天的营养摄入很均衡',
        recipes: []
      }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await recipeService.getRecommendations()

      expect(result.recipes).toEqual([])
    })

    it('应处理获取失败', async () => {
      mockClient.get.mockRejectedValue(new Error('网络错误'))

      await expect(recipeService.getRecommendations()).rejects.toThrow('网络错误')
    })
  })
})
