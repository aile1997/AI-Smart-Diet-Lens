/**
 * GamificationService 单元测试
 *
 * 测试游戏化 API 服务
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GamificationService } from '../../src/api/services/gamification.service'
import type { ApiClient } from '../../src/api/client'

describe('GamificationService', () => {
  let gamificationService: GamificationService
  let mockClient: {
    get: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockClient = {
      get: vi.fn()
    }

    gamificationService = new GamificationService(mockClient as any)
  })

  describe('getAchievements', () => {
    it('应成功获取成就列表', async () => {
      const mockResponse = {
        streakDays: 7,
        level: 5,
        badges: [
          {
            id: 'first-entry',
            name: '初次记录',
            description: '完成第一次饮食记录',
            icon: 'https://example.com/icons/first-entry.png',
            unlocked: true
          },
          {
            id: 'week-streak',
            name: '坚持一周',
            description: '连续记录 7 天',
            icon: 'https://example.com/icons/week-streak.png',
            unlocked: true,
            progress: '7/7'
          },
          {
            id: 'month-streak',
            name: '月度冠军',
            description: '连续记录 30 天',
            icon: 'https://example.com/icons/month-streak.png',
            unlocked: false,
            progress: '7/30'
          }
        ]
      }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await gamificationService.getAchievements()

      expect(result).toEqual(mockResponse)
      expect(mockClient.get).toHaveBeenCalledWith('/gamification/achievements')
    })

    it('应处理空成就列表', async () => {
      const mockResponse = {
        streakDays: 0,
        level: 1,
        badges: []
      }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await gamificationService.getAchievements()

      expect(result).toEqual(mockResponse)
      expect(result.badges).toEqual([])
    })

    it('应处理获取失败', async () => {
      mockClient.get.mockRejectedValue(new Error('未登录'))

      await expect(gamificationService.getAchievements()).rejects.toThrow('未登录')
    })
  })
})
