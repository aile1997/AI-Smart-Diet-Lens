/**
 * useDashboard Composable 单元测试
 *
 * 测试仪表盘数据管理
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

// 使用 vi.hoisted 创建 mock 函数（在模块导入前执行）
const mockGetSummary = vi.hoisted(() => vi.fn())

// Mock API 模块
vi.mock('../../src/api', () => ({
  getApi: vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  })),
  DashboardService: class {
    constructor() {}
    getSummary = mockGetSummary
  },
  initApi: vi.fn(),
}))

import { useDashboard } from '../../src/composables/useDashboard'

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('初始状态', () => {
    it('应有正确的初始状态', () => {
      const dashboard = useDashboard()

      expect(dashboard.loading.value).toBe(false)
      expect(dashboard.error.value).toBeNull()
      expect(dashboard.data.value).toBeNull()
    })

    it('应返回默认的计算属性值', () => {
      const dashboard = useDashboard()

      expect(dashboard.calories.value).toEqual({ current: 0, target: 2000, remaining: 2000 })
      expect(dashboard.protein.value).toEqual({ current: 0, target: 180 })
      expect(dashboard.steps.value).toEqual({ current: 0, target: 10000 })
      expect(dashboard.water.value).toEqual({ current: 0, target: 8 })
      expect(dashboard.sleep.value).toEqual({ hours: 0, quality: 'FAIR' })
      expect(dashboard.strategy.value).toBe('MAINTAIN')
    })
  })

  describe('fetchDashboard', () => {
    it('应成功获取仪表盘数据', async () => {
      const dashboard = useDashboard()

      const mockData = {
        ui_strategy: 'LOSE_WEIGHT' as const,
        date: '2024-01-15',
        hero_component: {
          type: 'CALORIE_RING' as const,
          data: {
            primary: {
              label: '热量',
              current: 1500,
              target: 2000,
              unit: 'kcal'
            },
            secondary: {
              label: '蛋白质',
              current: 120,
              target: 180,
              unit: 'g'
            }
          }
        },
        widgets: {
          steps: { current: 5000, target: 10000 },
          water: { current: 6, target: 8 },
          sleep: { hours: 7, quality: 'GOOD' as const }
        }
      }

      mockGetSummary.mockResolvedValue(mockData)

      const result = await dashboard.fetchDashboard()

      expect(result).toEqual(mockData)
      expect(dashboard.loading.value).toBe(false)
      expect(dashboard.error.value).toBeNull()
    })

    it('应正确计算热量进度', async () => {
      const dashboard = useDashboard()

      mockGetSummary.mockResolvedValue({
        ui_strategy: 'MAINTAIN' as const,
        date: '2024-01-15',
        hero_component: {
          type: 'CALORIE_RING' as const,
          data: {
            primary: { label: '热量', current: 1500, target: 2000, unit: 'kcal' },
            secondary: { label: '蛋白质', current: 120, target: 180, unit: 'g' }
          }
        },
        widgets: {
          steps: { current: 0, target: 10000 },
          water: { current: 0, target: 8 },
          sleep: { hours: 0, quality: 'FAIR' as const }
        }
      })

      await dashboard.fetchDashboard()

      expect(dashboard.calories.value).toEqual({
        current: 1500,
        target: 2000,
        remaining: 500
      })
    })

    it('应正确计算蛋白质进度', async () => {
      const dashboard = useDashboard()

      mockGetSummary.mockResolvedValue({
        ui_strategy: 'MAINTAIN' as const,
        date: '2024-01-15',
        hero_component: {
          type: 'CALORIE_RING' as const,
          data: {
            primary: { label: '热量', current: 1500, target: 2000, unit: 'kcal' },
            secondary: { label: '蛋白质', current: 90, target: 180, unit: 'g' }
          }
        },
        widgets: {
          steps: { current: 0, target: 10000 },
          water: { current: 0, target: 8 },
          sleep: { hours: 0, quality: 'FAIR' as const }
        }
      })

      await dashboard.fetchDashboard()

      expect(dashboard.protein.value).toEqual({
        current: 90,
        target: 180
      })
    })

    it('应处理获取失败', async () => {
      const dashboard = useDashboard()

      mockGetSummary.mockRejectedValue(new Error('网络错误'))

      await expect(dashboard.fetchDashboard()).rejects.toThrow('网络错误')

      expect(dashboard.loading.value).toBe(false)
      expect(dashboard.error.value).toBe('网络错误')
    })

    it('应支持按日期获取数据', async () => {
      const dashboard = useDashboard()

      mockGetSummary.mockResolvedValue({
        ui_strategy: 'MAINTAIN' as const,
        date: '2024-01-15',
        hero_component: {
          type: 'CALORIE_RING' as const,
          data: {
            primary: { label: '热量', current: 0, target: 2000, unit: 'kcal' },
            secondary: { label: '蛋白质', current: 0, target: 180, unit: 'g' }
          }
        },
        widgets: {
          steps: { current: 0, target: 10000 },
          water: { current: 0, target: 8 },
          sleep: { hours: 0, quality: 'FAIR' as const }
        }
      })

      await dashboard.fetchDashboard('2024-01-15')

      expect(mockGetSummary).toHaveBeenCalledWith('2024-01-15')
    })
  })

  describe('refresh', () => {
    it('应重新获取仪表盘数据', async () => {
      const dashboard = useDashboard()

      mockGetSummary.mockResolvedValue({
        ui_strategy: 'MAINTAIN' as const,
        date: '2024-01-15',
        hero_component: {
          type: 'CALORIE_RING' as const,
          data: {
            primary: { label: '热量', current: 0, target: 2000, unit: 'kcal' },
            secondary: { label: '蛋白质', current: 0, target: 180, unit: 'g' }
          }
        },
        widgets: {
          steps: { current: 0, target: 10000 },
          water: { current: 0, target: 8 },
          sleep: { hours: 0, quality: 'FAIR' as const }
        }
      })

      await dashboard.refresh()

      expect(mockGetSummary).toHaveBeenCalled()
    })
  })

  describe('strategy 计算属性', () => {
    it('应返回正确的策略模式', async () => {
      const dashboard = useDashboard()

      mockGetSummary.mockResolvedValue({
        ui_strategy: 'LOSE_WEIGHT' as const,
        date: '2024-01-15',
        hero_component: {
          type: 'CALORIE_RING' as const,
          data: {
            primary: { label: '热量', current: 0, target: 2000, unit: 'kcal' },
            secondary: { label: '蛋白质', current: 0, target: 180, unit: 'g' }
          }
        },
        widgets: {
          steps: { current: 0, target: 10000 },
          water: { current: 0, target: 8 },
          sleep: { hours: 0, quality: 'FAIR' as const }
        }
      })

      await dashboard.fetchDashboard()

      expect(dashboard.strategy.value).toBe('LOSE_WEIGHT')
    })

    it('默认应为 MAINTAIN 策略', async () => {
      const dashboard = useDashboard()

      mockGetSummary.mockResolvedValue({
        ui_strategy: 'MAINTAIN' as const,
        date: '2024-01-15',
        hero_component: {
          type: 'CALORIE_RING' as const,
          data: {
            primary: { label: '热量', current: 0, target: 2000, unit: 'kcal' },
            secondary: { label: '蛋白质', current: 0, target: 180, unit: 'g' }
          }
        },
        widgets: {
          steps: { current: 0, target: 10000 },
          water: { current: 0, target: 8 },
          sleep: { hours: 0, quality: 'FAIR' as const }
        }
      })

      await dashboard.fetchDashboard()

      expect(dashboard.strategy.value).toBe('MAINTAIN')
    })
  })
})
