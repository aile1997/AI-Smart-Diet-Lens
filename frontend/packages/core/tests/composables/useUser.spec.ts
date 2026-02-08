/**
 * useUser Composable 单元测试
 *
 * 测试用户状态管理
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// 使用 vi.hoisted 创建 mock 函数
const mockGetProfile = vi.hoisted(() => vi.fn())
const mockUpdateMetrics = vi.hoisted(() => vi.fn())

// Mock API 模块
vi.mock('../../src/api', () => ({
  getApi: vi.fn(() => ({
    get: vi.fn(),
    patch: vi.fn(),
  })),
  initApi: vi.fn(),
  // 导出 UserService（需要从 services 重新导出）
  UserService: class {
    constructor() {}
    getProfile = mockGetProfile
    updateMetrics = mockUpdateMetrics
  },
}))

// 不需要单独 mock services/user.service

// Mock auth store
vi.mock('../../src/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    logout: vi.fn(),
  })),
}))

import { useUserStore } from '../../src/stores/user'

describe('useUser', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)

    vi.clearAllMocks()

    // 设置默认返回值
    mockGetProfile.mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      nickname: 'Test User',
      avatar: 'http://example.com/avatar.jpg',
      dailyCalorieTarget: 2000,
    })
  })

  describe('初始状态', () => {
    it('应有正确的初始状态', () => {
      const userStore = useUserStore()

      expect(userStore.profile).toBeNull()
      expect(userStore.basicInfo).toBeNull()
      expect(userStore.displayName).toBe('未登录')
    })
  })

  describe('displayName 计算属性', () => {
    it('应返回 nickname', () => {
      const userStore = useUserStore()
      userStore.setProfile({
        id: 'user-123',
        email: 'test@example.com',
        nickname: 'Test User',
        avatar: '',
        dailyCalorieTarget: 2000,
      } as any)

      expect(userStore.displayName).toBe('Test User')
    })

    it('profile 和 basicInfo 都为空时应返回"未登录"', () => {
      const userStore = useUserStore()
      expect(userStore.displayName).toBe('未登录')
    })
  })

  describe('fetchProfile', () => {
    it('应成功获取用户信息', async () => {
      const userStore = useUserStore()

      await userStore.fetchProfile()

      expect(userStore.profile).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        nickname: 'Test User',
        avatar: 'http://example.com/avatar.jpg',
        dailyCalorieTarget: 2000,
      })
      expect(mockGetProfile).toHaveBeenCalled()
    })

    it('应处理获取失败', async () => {
      mockGetProfile.mockRejectedValue(new Error('未登录'))

      const userStore = useUserStore()
      await expect(userStore.fetchProfile()).rejects.toThrow('未登录')
    })
  })

  describe('setProfile', () => {
    it('应设置用户信息', () => {
      const userStore = useUserStore()
      const profile = {
        id: 'user-123',
        email: 'test@example.com',
        nickname: 'Test User',
        avatar: '',
        dailyCalorieTarget: 2000,
      }

      userStore.setProfile(profile as any)

      expect(userStore.profile).toEqual(profile)
    })
  })

  describe('setBasicInfo', () => {
    it('应设置基础信息', () => {
      const userStore = useUserStore()
      const basicInfo = {
        id: 'user-123',
        email: 'test@example.com',
        nickname: 'Test User',
        onboardingCompleted: true,
      }

      userStore.setBasicInfo(basicInfo as any)

      expect(userStore.basicInfo).toEqual(basicInfo)
    })
  })

  describe('updateMetrics', () => {
    it('应成功更新健康指标', async () => {
      const userStore = useUserStore()
      userStore.setProfile({
        id: 'user-123',
        email: 'test@example.com',
        nickname: 'Test User',
        avatar: '',
        dailyCalorieTarget: 2000,
      } as any)

      mockUpdateMetrics.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        nickname: 'Test User',
        avatar: '',
        dailyCalorieTarget: 2200,
        weight: 70,
        bodyFat: 15,
      })

      const result = await userStore.updateMetrics({ weight: 70, bodyFat: 15 })

      expect(userStore.profile?.weight).toBe(70)
      expect(userStore.profile?.bodyFat).toBe(15)
      expect(mockUpdateMetrics).toHaveBeenCalledWith({ weight: 70, bodyFat: 15 })
    })
  })

  describe('logout', () => {
    it('应清除所有状态', () => {
      const userStore = useUserStore()
      userStore.setProfile({
        id: 'user-123',
        email: 'test@example.com',
        nickname: 'Test User',
        avatar: '',
        dailyCalorieTarget: 2000,
      } as any)
      userStore.setBasicInfo({
        id: 'user-123',
        email: 'test@example.com',
        nickname: 'Test User',
        onboardingCompleted: true,
      } as any)

      userStore.logout()

      expect(userStore.profile).toBeNull()
      expect(userStore.basicInfo).toBeNull()
    })
  })
})
