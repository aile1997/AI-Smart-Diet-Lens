/**
 * useAnalysis Composable 单元测试
 *
 * 测试营养分析功能
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

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
  initApi: vi.fn(),
}))

// Mock DiaryService
vi.mock('../../src/api/services/diary.service', () => ({
  DiaryService: class {
    constructor() {}
    getSummary = mockGetSummary
  },
}))

import { useAnalysis } from '../../src/composables/useAnalysis'

describe('useAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // 重置 mock 行为，避免测试间互相影响
    mockGetSummary.mockReset()
    // 不设置默认返回值，让每个测试自己设置
    setActivePinia(createPinia())
  })

  describe('初始状态', () => {
    it('应有正确的初始状态', () => {
      const analysis = useAnalysis()

      expect(analysis.loading.value).toBe(false)
      expect(analysis.error.value).toBeNull()
      expect(analysis.timeRange.value).toBe('week')
      expect(analysis.calorieTrend.value).toEqual([])
    })

    it('应返回默认营养分布', () => {
      const analysis = useAnalysis()

      expect(analysis.nutritionDistribution.value).toEqual({
        protein: { current: 0, percentage: 35 },
        carbs: { current: 0, percentage: 45 },
        fat: { current: 0, percentage: 20 },
        total: 0,
      })
    })

    it('应返回 AI 建议列表', () => {
      const analysis = useAnalysis()

      expect(analysis.aiSuggestions.value).toHaveLength(3)
      expect(analysis.aiSuggestions.value[0].type).toBe('warning')
      expect(analysis.aiSuggestions.value[0].title).toBe('周末热量偏高提醒')
    })

    it('应计算平均热量为 0', () => {
      const analysis = useAnalysis()

      expect(analysis.averageCalories.value).toBe(0)
    })

    it('应计算周同比变化为 0', () => {
      const analysis = useAnalysis()

      expect(analysis.weekOverWeekChange.value).toBe(0)
    })
  })

  describe('fetchTrends', () => {
    it('应成功获取一周趋势数据', async () => {
      const analysis = useAnalysis()

      // Mock 7天的数据
      const mockSummaries = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalCalories: 1800 + i * 50,
        targetCalories: 2000,
        totalProtein: 100,
        totalCarbs: 200,
        totalFat: 60
      }))

      // 使用 mockResolvedValueOnce 按顺序返回
      mockSummaries.forEach((s) => mockGetSummary.mockResolvedValueOnce(s))
      // 设置默认返回值
      mockGetSummary.mockResolvedValue(mockSummaries[0])

      await analysis.fetchTrends('week')

      expect(analysis.calorieTrend.value).toHaveLength(7)
      expect(analysis.timeRange.value).toBe('week')
      expect(mockGetSummary).toHaveBeenCalledTimes(7)
      expect(analysis.loading.value).toBe(false)
    })

    it('应正确格式化日期标签', async () => {
      const analysis = useAnalysis()

      // 使用固定的测试日期（周一）来避免时区问题
      const testDate = '2024-01-15' // 2024年1月15日是周一
      mockGetSummary.mockResolvedValue({
        date: testDate,
        totalCalories: 1800,
        targetCalories: 2000,
        totalProtein: 100,
        totalCarbs: 200,
        totalFat: 60
      })

      await analysis.fetchTrends('week')

      const testEntry = analysis.calorieTrend.value.find(d => d.date === testDate)
      // 2024-01-15 是周一
      expect(testEntry?.dayLabel).toBe('周一')
    })

    it('应处理获取失败（使用默认值）', async () => {
      const analysis = useAnalysis()

      mockGetSummary.mockRejectedValue(new Error('API 错误'))

      await analysis.fetchTrends('week')

      // Promise.allSettled 会处理拒绝，使用默认值
      expect(analysis.calorieTrend.value).toHaveLength(7)
      expect(analysis.loading.value).toBe(false)
    })

    it('应支持获取月度趋势数据', async () => {
      const analysis = useAnalysis()

      mockGetSummary.mockResolvedValue({
        date: '2024-01-15',
        totalCalories: 1800,
        targetCalories: 2000,
        totalProtein: 100,
        totalCarbs: 200,
        totalFat: 60
      })

      await analysis.fetchTrends('month')

      expect(mockGetSummary).toHaveBeenCalledTimes(30)
      expect(analysis.timeRange.value).toBe('month')
    })
  })

  describe('averageCalories 计算属性', () => {
    it('应正确计算周平均热量', async () => {
      const analysis = useAnalysis()

      mockGetSummary.mockResolvedValue({
        date: '2024-01-15',
        totalCalories: 1800,
        targetCalories: 2000,
        totalProtein: 100,
        totalCarbs: 200,
        totalFat: 60
      })

      await analysis.fetchTrends('week')

      // 7天，每天1800 = 平均1800
      expect(analysis.averageCalories.value).toBe(1800)
    })

    it('应计算最近 7 天的平均值（即使有更多数据）', async () => {
      const analysis = useAnalysis()

      // 创建 10 天数据：前5天1500，后5天2000
      // 但 fetchTrends('week') 只会获取最后 7 天
      const tenDaySummaries = Array.from({ length: 10 }, (_, i) => ({
        date: new Date(Date.now() - (9 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalCalories: i < 5 ? 1500 : 2000, // 前5天1500，后5天2000
        targetCalories: 2000,
        totalProtein: 100,
        totalCarbs: 200,
        totalFat: 60
      }))

      // Mock 按顺序返回 10 天数据中的后 7 天（索引 3-9）
      let callCount = 0
      mockGetSummary.mockImplementation(() => {
        // fetchTrends('week') 会调用 7 次
        // 返回 tenDaySummaries 的后 7 个元素（索引 3-9）
        // 前 2 个是 1500，后 5 个是 2000
        const index = 3 + callCount
        callCount++
        return Promise.resolve(tenDaySummaries[index])
      })

      await analysis.fetchTrends('week')

      // 最后 7 天：前 2 天 1500，后 5 天 2000
      // 平均值 = (1500 * 2 + 2000 * 5) / 7 = 3000 + 10000 / 7 = 1857
      expect(analysis.averageCalories.value).toBe(1857)
    })

    it('应在月度范围计算最近 30 天平均值', async () => {
      const analysis = useAnalysis()

      mockGetSummary.mockResolvedValue({
        date: '2024-01-15',
        totalCalories: 1800,
        targetCalories: 2000,
        totalProtein: 100,
        totalCarbs: 200,
        totalFat: 60
      })

      await analysis.fetchTrends('month')

      expect(analysis.averageCalories.value).toBe(1800)
    })
  })

  describe('weekOverWeekChange 计算属性', () => {
    it('应正确计算周同比变化', async () => {
      const analysis = useAnalysis()

      // 创建 30 天数据：前7天1500，后7天1800，其余任意
      const monthSummaries = [
        // 前16天（任意值）
        ...Array.from({ length: 16 }, () => ({
          date: '2024-01-01',
          totalCalories: 1500,
          targetCalories: 2000,
          totalProtein: 100,
          totalCarbs: 200,
          totalFat: 60
        })),
        // 上周 (第17-23天) - 平均1500
        ...Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          totalCalories: 1500,
          targetCalories: 2000,
          totalProtein: 100,
          totalCarbs: 200,
          totalFat: 60
        })),
        // 这周 (第24-30天) - 平均1800
        ...Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          totalCalories: 1800,
          targetCalories: 2000,
          totalProtein: 100,
          totalCarbs: 200,
          totalFat: 60
        }))
      ]

      // 使用 mockImplementation 精确控制返回值
      let callCount = 0
      mockGetSummary.mockImplementation(() => {
        return Promise.resolve(monthSummaries[callCount++ % monthSummaries.length])
      })

      await analysis.fetchTrends('month')

      // (1800 - 1500) / 1500 * 100 = 20%
      expect(analysis.weekOverWeekChange.value).toBe(20)
    })

    it('应处理负增长', async () => {
      const analysis = useAnalysis()

      // 创建 30 天数据：前7天2000，后7天1600，其余任意
      const monthSummaries = [
        // 前16天（任意值）
        ...Array.from({ length: 16 }, () => ({
          date: '2024-01-01',
          totalCalories: 2000,
          targetCalories: 2000,
          totalProtein: 100,
          totalCarbs: 200,
          totalFat: 60
        })),
        // 上周 (第17-23天) - 平均2000
        ...Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          totalCalories: 2000,
          targetCalories: 2000,
          totalProtein: 100,
          totalCarbs: 200,
          totalFat: 60
        })),
        // 这周 (第24-30天) - 平均1600
        ...Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          totalCalories: 1600,
          targetCalories: 2000,
          totalProtein: 100,
          totalCarbs: 200,
          totalFat: 60
        }))
      ]

      // 使用 mockImplementation 精确控制返回值
      let callCount = 0
      mockGetSummary.mockImplementation(() => {
        return Promise.resolve(monthSummaries[callCount++ % monthSummaries.length])
      })

      await analysis.fetchTrends('month')

      // (1600 - 2000) / 2000 * 100 = -20%
      expect(analysis.weekOverWeekChange.value).toBe(-20)
    })

    it('数据不足时应返回 0', () => {
      const analysis = useAnalysis()

      // 只有 10 天数据
      analysis.calorieTrend.value = Array.from({ length: 10 }, (_, i) => ({
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
        dayLabel: '周一',
        calories: 1800,
        target: 2000
      }))

      expect(analysis.weekOverWeekChange.value).toBe(0)
    })
  })

  describe('nutritionDistribution 计算属性', () => {
    it('应根据趋势数据计算营养分布', () => {
      const analysis = useAnalysis()

      // 7天，每天2000卡
      analysis.calorieTrend.value = Array.from({ length: 7 }, () => ({
        date: '2024-01-15',
        dayLabel: '周一',
        calories: 2000,
        target: 2000
      }))

      const dist = analysis.nutritionDistribution.value

      // 总热量: 2000 * 7 = 14000
      // 蛋白质: 14000 * 0.15 = 2100 / 4 = 525g
      // 碳水: 14000 * 0.50 = 7000 / 4 = 1750g
      // 脂肪: 14000 * 0.35 = 4900 / 9 ≈ 544g

      expect(dist.protein.current).toBe(525)
      expect(dist.carbs.current).toBe(1750)
      expect(dist.fat.current).toBe(544)
      expect(dist.total).toBe(14000)
    })

    it('应正确计算营养素百分比', () => {
      const analysis = useAnalysis()

      analysis.calorieTrend.value = Array.from({ length: 7 }, () => ({
        date: '2024-01-15',
        dayLabel: '周一',
        calories: 2000,
        target: 2000
      }))

      const dist = analysis.nutritionDistribution.value

      // 蛋白质15%, 碳水50%, 脂肪35%
      expect(dist.protein.percentage).toBe(15)
      expect(dist.carbs.percentage).toBe(50)
      expect(dist.fat.percentage).toBe(35)
    })

    it('月度范围应聚合 30 天数据', () => {
      const analysis = useAnalysis()

      analysis.timeRange.value = 'month'
      analysis.calorieTrend.value = Array.from({ length: 30 }, () => ({
        date: '2024-01-15',
        dayLabel: '周一',
        calories: 2000,
        target: 2000
      }))

      const dist = analysis.nutritionDistribution.value

      // 总热量: 2000 * 30 = 60000
      expect(dist.total).toBe(60000)
    })
  })

  describe('refresh', () => {
    it('应使用当前时间范围刷新数据', async () => {
      const analysis = useAnalysis()
      analysis.timeRange.value = 'month'

      mockGetSummary.mockResolvedValue({
        date: '2024-01-15',
        totalCalories: 1800,
        targetCalories: 2000,
        totalProtein: 100,
        totalCarbs: 200,
        totalFat: 60
      })

      await analysis.refresh()

      expect(mockGetSummary).toHaveBeenCalledTimes(30)
    })
  })
})
