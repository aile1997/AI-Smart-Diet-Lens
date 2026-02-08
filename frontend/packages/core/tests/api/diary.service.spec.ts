/**
 * DiaryService 单元测试
 *
 * 测试饮食日记 API 服务
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DiaryService } from '../../src/api/services/diary.service'
import type { ApiClient } from '../../src/api/client'

describe('DiaryService', () => {
  let diaryService: DiaryService
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

    diaryService = new DiaryService(mockClient as any)
  })

  describe('getList', () => {
    it('应成功获取日记列表', async () => {
      const mockEntries = [
        {
          id: 'entry-1',
          date: '2024-01-15',
          mealType: 'BREAKFAST',
          items: [
            { name: '燕麦', portion: 50, calories: 180, protein: 6, carbs: 30, fat: 3 }
          ],
          totalCalories: 180
        }
      ]

      mockClient.get.mockResolvedValue(mockEntries)

      const result = await diaryService.getList('2024-01-15')

      expect(result).toEqual(mockEntries)
      expect(mockClient.get).toHaveBeenCalledWith('/diary', { params: { date: '2024-01-15' } })
    })

    it('应支持不带日期参数的获取', async () => {
      const mockEntries: Array<ReturnType<typeof DiaryService>> = []

      mockClient.get.mockResolvedValue(mockEntries)

      const result = await diaryService.getList()

      expect(result).toEqual(mockEntries)
      expect(mockClient.get).toHaveBeenCalledWith('/diary', { params: undefined })
    })
  })

  describe('getSummary', () => {
    it('应成功获取每日汇总', async () => {
      const mockSummary = {
        date: '2024-01-15',
        totalCalories: 1850,
        targetCalories: 2000,
        totalProtein: 85,
        totalCarbs: 220,
        totalFat: 65
      }

      mockClient.get.mockResolvedValue(mockSummary)

      const result = await diaryService.getSummary('2024-01-15')

      expect(result).toEqual(mockSummary)
      expect(mockClient.get).toHaveBeenCalledWith('/diary/summary', { params: { date: '2024-01-15' } })
    })

    it('应支持不带日期参数的获取', async () => {
      const mockSummary = {
        date: '2024-01-15',
        totalCalories: 0,
        targetCalories: 2000,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0
      }

      mockClient.get.mockResolvedValue(mockSummary)

      const result = await diaryService.getSummary()

      expect(result).toEqual(mockSummary)
      expect(mockClient.get).toHaveBeenCalledWith('/diary/summary', { params: undefined })
    })
  })

  describe('createEntry', () => {
    it('应成功创建日记条目', async () => {
      const createData = {
        mealType: 'LUNCH' as const,
        items: [
          { name: '鸡胸肉', portion: 150, calories: 248, protein: 46, carbs: 0, fat: 5 }
        ],
        imageKey: 'diary-123.jpg'
      }

      const mockEntry = {
        id: 'entry-2',
        date: '2024-01-15',
        mealType: 'LUNCH',
        items: createData.items,
        imageKey: 'diary-123.jpg',
        totalCalories: 248
      }

      mockClient.post.mockResolvedValue(mockEntry)

      const result = await diaryService.createEntry(createData)

      expect(result).toEqual(mockEntry)
      expect(mockClient.post).toHaveBeenCalledWith('/diary/entry', createData)
    })

    it('应支持不带图片的创建', async () => {
      const createData = {
        mealType: 'SNACK' as const,
        items: [
          { name: '苹果', portion: 200, calories: 104, protein: 0, carbs: 28, fat: 0 }
        ]
      }

      const mockEntry = {
        id: 'entry-3',
        date: '2024-01-15',
        mealType: 'SNACK',
        items: createData.items,
        totalCalories: 104
      }

      mockClient.post.mockResolvedValue(mockEntry)

      const result = await diaryService.createEntry(createData)

      expect(result).toEqual(mockEntry)
      expect(mockClient.post).toHaveBeenCalledWith('/diary/entry', createData)
    })
  })

  describe('updateEntry', () => {
    it('应成功更新日记条目', async () => {
      const updateData = {
        items: [
          { name: '鸡胸肉（更新）', portion: 200, calories: 330, protein: 62, carbs: 0, fat: 7 }
        ]
      }

      const mockEntry = {
        id: 'entry-2',
        date: '2024-01-15',
        mealType: 'LUNCH',
        items: updateData.items,
        totalCalories: 330
      }

      mockClient.patch.mockResolvedValue(mockEntry)

      const result = await diaryService.updateEntry('entry-2', updateData)

      expect(result).toEqual(mockEntry)
      expect(mockClient.patch).toHaveBeenCalledWith('/diary/entry/entry-2', updateData)
    })

    it('应支持更新多个字段', async () => {
      const updateData = {
        mealType: 'DINNER' as const,
        items: []
      }

      const mockEntry = {
        id: 'entry-2',
        date: '2024-01-15',
        mealType: 'DINNER',
        items: [],
        totalCalories: 0
      }

      mockClient.patch.mockResolvedValue(mockEntry)

      const result = await diaryService.updateEntry('entry-2', updateData)

      expect(result).toEqual(mockEntry)
      expect(mockClient.patch).toHaveBeenCalledWith('/diary/entry/entry-2', updateData)
    })
  })

  describe('deleteEntry', () => {
    it('应成功删除日记条目', async () => {
      const mockResponse = { success: true }

      mockClient.delete.mockResolvedValue(mockResponse)

      const result = await diaryService.deleteEntry('entry-1')

      expect(result).toEqual(mockResponse)
      expect(mockClient.delete).toHaveBeenCalledWith('/diary/entry/entry-1')
    })

    it('应处理删除失败', async () => {
      mockClient.delete.mockRejectedValue(new Error('记录不存在'))

      await expect(diaryService.deleteEntry('invalid-id')).rejects.toThrow('记录不存在')
    })
  })
})
