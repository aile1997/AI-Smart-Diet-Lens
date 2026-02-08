/**
 * UserService 单元测试
 *
 * 测试用户相关 API 服务
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UserService } from '../../src/api/services/user.service'
import type { ApiClient } from '../../src/api/client'

describe('UserService', () => {
  let userService: UserService
  let mockClient: {
    get: ReturnType<typeof vi.fn>
    post: ReturnType<typeof vi.fn>
    patch: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn()
    }

    userService = new UserService(mockClient as any)
  })

  describe('getProfile', () => {
    it('应成功获取用户信息', async () => {
      const mockProfile = {
        id: 'user-123',
        nickname: '测试用户',
        phone: '13800138000',
        email: 'test@example.com',
        avatar: 'http://example.com/avatar.jpg',
        goalType: 'lose_weight',
        dailyCalories: 1800
      }

      mockClient.get.mockResolvedValue(mockProfile)

      const result = await userService.getProfile()

      expect(result).toEqual(mockProfile)
      expect(mockClient.get).toHaveBeenCalledWith('/user/profile')
    })

    it('应处理获取失败', async () => {
      mockClient.get.mockRejectedValue(new Error('未登录'))

      await expect(userService.getProfile()).rejects.toThrow('未登录')
    })
  })

  describe('updateMetrics', () => {
    it('应成功更新健康指标', async () => {
      const mockMetrics = {
        weight: 70,
        bodyFat: 20,
        height: 175,
        activityLevel: 3
      }

      const mockProfile = {
        id: 'user-123',
        nickname: '测试用户',
        goalType: 'lose_weight',
        dailyCalories: 1800
      }

      mockClient.patch.mockResolvedValue(mockProfile)

      const result = await userService.updateMetrics(mockMetrics)

      expect(result).toEqual(mockProfile)
      expect(mockClient.patch).toHaveBeenCalledWith('/user/metrics', mockMetrics)
    })

    it('应支持部分字段更新', async () => {
      const partialMetrics = {
        weight: 68
      }

      const mockProfile = {
        id: 'user-123',
        nickname: '测试用户',
        goalType: 'lose_weight',
        dailyCalories: 1800
      }

      mockClient.patch.mockResolvedValue(mockProfile)

      const result = await userService.updateMetrics(partialMetrics)

      expect(result).toEqual(mockProfile)
      expect(mockClient.patch).toHaveBeenCalledWith('/user/metrics', partialMetrics)
    })
  })

  describe('switchStrategy', () => {
    it('应成功切换策略', async () => {
      const requestData = {
        newStrategy: 'gain_muscle',
        targetWeight: 75
      }

      const mockResponse = {
        dailyCalories: 2200
      }

      mockClient.post.mockResolvedValue(mockResponse)

      const result = await userService.switchStrategy(requestData)

      expect(result).toEqual(mockResponse)
      expect(mockClient.post).toHaveBeenCalledWith('/user/strategy/switch', requestData)
    })

    it('应支持不带目标体重的策略切换', async () => {
      const requestData = {
        newStrategy: 'maintain'
      }

      const mockResponse = {
        dailyCalories: 2000
      }

      mockClient.post.mockResolvedValue(mockResponse)

      const result = await userService.switchStrategy(requestData)

      expect(result).toEqual(mockResponse)
      expect(mockClient.post).toHaveBeenCalledWith('/user/strategy/switch', requestData)
    })
  })

  describe('syncHealth', () => {
    it('应成功同步健康数据', async () => {
      const requestData = {
        platform: 'Apple Health',
        deviceModel: 'iPhone 15',
        metrics: [
          { type: 'weight', value: 70, recordedAt: '2024-01-15T08:00:00Z' },
          { type: 'steps', value: 10000 }
        ]
      }

      const mockResponse = {
        status: 'success',
        tdeeUpdated: true,
        newDailyBudget: 2100
      }

      mockClient.post.mockResolvedValue(mockResponse)

      const result = await userService.syncHealth(requestData)

      expect(result).toEqual(mockResponse)
      expect(mockClient.post).toHaveBeenCalledWith('/user/health-sync', requestData)
    })

    it('应处理同步失败', async () => {
      const requestData = {
        platform: 'Unknown',
        metrics: []
      }

      mockClient.post.mockRejectedValue(new Error('不支持的平台'))

      await expect(userService.syncHealth(requestData)).rejects.toThrow('不支持的平台')
    })
  })
})
