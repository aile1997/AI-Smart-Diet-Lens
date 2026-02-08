/**
 * useDiary Composable 单元测试
 *
 * 测试饮食日记管理
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

// 使用 vi.hoisted 创建 mock 函数（在模块导入前执行）
const mockGetList = vi.hoisted(() => vi.fn())
const mockGetSummary = vi.hoisted(() => vi.fn())
const mockCreateEntry = vi.hoisted(() => vi.fn())
const mockUpdateEntry = vi.hoisted(() => vi.fn())
const mockDeleteEntry = vi.hoisted(() => vi.fn())

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
    getList = mockGetList
    getSummary = mockGetSummary
    createEntry = mockCreateEntry
    updateEntry = mockUpdateEntry
    deleteEntry = mockDeleteEntry
  },
}))

import { useDiary } from '../../src/composables/useDiary'

describe('useDiary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  describe('初始状态', () => {
    it('应有正确的初始状态', () => {
      const diary = useDiary()

      expect(diary.loading.value).toBe(false)
      expect(diary.error.value).toBeNull()
      expect(diary.entries.value).toEqual([])
      expect(diary.dailySummary.value).toBeNull()
    })

    it('应初始化选中日期为今天', () => {
      const diary = useDiary()

      const today = new Date().toISOString().split('T')[0]
      expect(diary.selectedDate.value).toBe(today)
    })

    it('应返回默认的宏量营养素数据', () => {
      const diary = useDiary()

      expect(diary.macros.value).toEqual([
        { label: '碳水', val: '0g', color: 'bg-blue-400', pct: '0%' },
        { label: '蛋白质', val: '0g', color: 'bg-primary', pct: '0%' },
        { label: '脂肪', val: '0g', color: 'bg-amber-400', pct: '0%' },
      ])
    })

    it('应返回空的餐别列表', () => {
      const diary = useDiary()

      expect(diary.meals.value).toEqual([])
    })
  })

  describe('fetchEntries', () => {
    it('应成功获取日记条目', async () => {
      const diary = useDiary()

      const mockEntries = [
        {
          id: '1',
          mealType: 'BREAKFAST' as const,
          totalCalories: 500,
          items: [{ name: '燕麦粥', portion: 100 }]
        }
      ]

      mockGetList.mockResolvedValue(mockEntries)

      await diary.fetchEntries('2024-01-15')

      expect(diary.entries.value).toEqual(mockEntries)
      expect(diary.loading.value).toBe(false)
      expect(diary.error.value).toBeNull()
    })

    it('应处理获取失败', async () => {
      const diary = useDiary()

      mockGetList.mockRejectedValue(new Error('网络错误'))

      await diary.fetchEntries('2024-01-15')

      expect(diary.loading.value).toBe(false)
      expect(diary.error.value).toBe('网络错误')
    })

    it('应使用当前选中日期当未指定日期时', async () => {
      const diary = useDiary()

      mockGetList.mockResolvedValue([])

      await diary.fetchEntries()

      expect(mockGetList).toHaveBeenCalledWith(diary.selectedDate.value)
    })
  })

  describe('fetchSummary', () => {
    it('应成功获取每日汇总', async () => {
      const diary = useDiary()

      const mockSummary = {
        date: '2024-01-15',
        totalCalories: 1800,
        targetCalories: 2000,
        totalProtein: 120,
        totalCarbs: 200,
        totalFat: 60
      }

      mockGetSummary.mockResolvedValue(mockSummary)

      await diary.fetchSummary('2024-01-15')

      expect(diary.dailySummary.value).toEqual(mockSummary)
      expect(diary.loading.value).toBe(false)
    })

    it('应正确计算宏量营养素百分比', async () => {
      const diary = useDiary()

      const mockSummary = {
        date: '2024-01-15',
        totalCalories: 2000,
        targetCalories: 2000,
        totalProtein: 100, // 100g * 4cal/g = 400cal
        totalCarbs: 250,   // 250g * 4cal/g = 1000cal
        totalFat: 67       // 67g * 9cal/g = 600cal
      }

      mockGetSummary.mockResolvedValue(mockSummary)

      await diary.fetchSummary('2024-01-15')

      const macros = diary.macros.value
      expect(macros[0].label).toBe('碳水')
      expect(macros[0].val).toBe('250g')
      expect(macros[1].label).toBe('蛋白质')
      expect(macros[1].val).toBe('100g')
      expect(macros[2].label).toBe('脂肪')
      expect(macros[2].val).toBe('67g')
    })
  })

  describe('fetchAll', () => {
    it('应同时获取条目和汇总', async () => {
      const diary = useDiary()

      mockGetList.mockResolvedValue([])
      mockGetSummary.mockResolvedValue({
        date: '2024-01-15',
        totalCalories: 1800
      })

      await diary.fetchAll('2024-01-15')

      expect(mockGetList).toHaveBeenCalledWith('2024-01-15')
      expect(mockGetSummary).toHaveBeenCalledWith('2024-01-15')
    })
  })

  describe('addEntry', () => {
    it('应成功添加日记条目', async () => {
      const diary = useDiary()

      const newEntry = {
        id: '1',
        mealType: 'LUNCH' as const,
        totalCalories: 600,
        items: [{ name: '鸡胸肉沙拉', portion: 200 }]
      }

      mockCreateEntry.mockResolvedValue(newEntry)
      mockGetSummary.mockResolvedValue({ date: '2024-01-15' } as any)

      const result = await diary.addEntry({
        mealType: 'LUNCH',
        items: [{ name: '鸡胸肉沙拉', portion: 200 }]
      })

      expect(result).toEqual(newEntry)
      expect(diary.entries.value).toContainEqual(newEntry)
      expect(diary.loading.value).toBe(false)
    })

    it('添加后应刷新汇总数据', async () => {
      const diary = useDiary()

      const newEntry = { id: '1', mealType: 'LUNCH' as const, totalCalories: 600, items: [] }
      mockCreateEntry.mockResolvedValue(newEntry)
      mockGetSummary.mockResolvedValue({ date: '2024-01-15', totalCalories: 600 } as any)

      await diary.addEntry({ mealType: 'LUNCH', items: [] })

      expect(mockGetSummary).toHaveBeenCalled()
    })

    it('应处理添加失败', async () => {
      const diary = useDiary()

      mockCreateEntry.mockRejectedValue(new Error('添加失败'))

      await expect(diary.addEntry({
        mealType: 'LUNCH',
        items: []
      })).rejects.toThrow('添加失败')

      expect(diary.error.value).toBe('添加失败')
      expect(diary.loading.value).toBe(false)
    })
  })

  describe('updateEntry', () => {
    it('应成功更新日记条目', async () => {
      const diary = useDiary()

      const existingEntry = {
        id: '1',
        mealType: 'BREAKFAST' as const,
        totalCalories: 400,
        items: [{ name: '鸡蛋', portion: 100 }]
      }
      diary.entries.value = [existingEntry]

      const updatedEntry = {
        ...existingEntry,
        totalCalories: 500
      }

      mockUpdateEntry.mockResolvedValue(updatedEntry)
      mockGetSummary.mockResolvedValue({ date: '2024-01-15' } as any)

      const result = await diary.updateEntry('1', { items: [{ name: '鸡蛋', portion: 150 }] })

      expect(result).toEqual(updatedEntry)
      expect(diary.entries.value[0]).toEqual(updatedEntry)
    })

    it('应处理更新失败', async () => {
      const diary = useDiary()

      mockUpdateEntry.mockRejectedValue(new Error('更新失败'))

      await expect(diary.updateEntry('1', {})).rejects.toThrow('更新失败')

      expect(diary.error.value).toBe('更新失败')
    })
  })

  describe('deleteEntry', () => {
    it('应成功删除日记条目', async () => {
      const diary = useDiary()

      const entry1 = { id: '1', mealType: 'BREAKFAST' as const, totalCalories: 400, items: [] }
      const entry2 = { id: '2', mealType: 'LUNCH' as const, totalCalories: 600, items: [] }
      diary.entries.value = [entry1, entry2]

      mockDeleteEntry.mockResolvedValue(undefined)
      mockGetSummary.mockResolvedValue({ date: '2024-01-15' } as any)

      const result = await diary.deleteEntry('1')

      expect(result).toBe(true)
      expect(diary.entries.value).toHaveLength(1)
      expect(diary.entries.value[0].id).toBe('2')
    })

    it('应处理删除失败', async () => {
      const diary = useDiary()

      mockDeleteEntry.mockRejectedValue(new Error('删除失败'))

      const result = await diary.deleteEntry('1')

      expect(result).toBe(false)
      expect(diary.error.value).toBe('删除失败')
    })
  })

  describe('meals 计算属性', () => {
    it('应按餐别正确分组食物', () => {
      const diary = useDiary()

      diary.entries.value = [
        {
          id: '1',
          mealType: 'BREAKFAST',
          totalCalories: 400,
          imageKey: 'breakfast.jpg',
          items: [
            { name: '燕麦粥', portion: 100 },
            { name: '鸡蛋', portion: 50 }
          ]
        },
        {
          id: '2',
          mealType: 'LUNCH',
          totalCalories: 600,
          imageKey: 'lunch.jpg',
          items: [
            { name: '米饭', portion: 150 }
          ]
        }
      ] as any

      const meals = diary.meals.value

      expect(meals).toHaveLength(2)
      expect(meals[0].name).toBe('早餐')
      expect(meals[0].color).toBe('bg-amber-400')
      expect(meals[0].cal).toBe('400')
      expect(meals[0].items).toHaveLength(1)
      expect(meals[1].name).toBe('午餐')
      expect(meals[1].color).toBe('bg-primary')
    })

    it('应保持餐别顺序', () => {
      const diary = useDiary()

      diary.entries.value = [
        { id: '1', mealType: 'DINNER', totalCalories: 500, items: [] },
        { id: '2', mealType: 'BREAKFAST', totalCalories: 400, items: [] },
        { id: '3', mealType: 'LUNCH', totalCalories: 600, items: [] }
      ] as any

      const meals = diary.meals.value

      expect(meals[0].name).toBe('早餐')
      expect(meals[1].name).toBe('午餐')
      expect(meals[2].name).toBe('晚餐')
    })

    it('应汇总餐别总热量', () => {
      const diary = useDiary()

      diary.entries.value = [
        { id: '1', mealType: 'BREAKFAST', totalCalories: 300, items: [] },
        { id: '2', mealType: 'BREAKFAST', totalCalories: 200, items: [] }
      ] as any

      const meals = diary.meals.value

      expect(meals[0].cal).toBe('500')
    })
  })

  describe('refresh', () => {
    it('应刷新当前选中日期的数据', async () => {
      const diary = useDiary()
      diary.selectedDate.value = '2024-01-15'

      mockGetList.mockResolvedValue([])
      mockGetSummary.mockResolvedValue({ date: '2024-01-15' } as any)

      await diary.refresh()

      expect(mockGetList).toHaveBeenCalledWith('2024-01-15')
      expect(mockGetSummary).toHaveBeenCalledWith('2024-01-15')
    })
  })
})
