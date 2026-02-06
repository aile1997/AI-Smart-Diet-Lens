/**
 * 饮食日记服务（新版本 - 基于 ApiClient）
 *
 * GET /api/diary - 获取日记列表
 * POST /api/diary/entry - 添加记录
 * PATCH /api/diary/entry/:id - 更新记录
 * DELETE /api/diary/entry/:id - 删除记录
 */

import type { ApiClient } from '../client'

/**
 * 餐别类型
 */
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'

/**
 * 食物项
 */
export interface FoodItem {
  name: string
  portion: number  // 克
  calories: number
  protein?: number
  carbs?: number
  fat?: number
}

/**
 * 日记条目
 */
export interface DiaryEntry {
  id: string
  date: string
  mealType: MealType
  items: FoodItem[]
  imageKey?: string
  totalCalories: number
}

/**
 * 创建日记请求
 */
export interface CreateDiaryEntryRequest {
  mealType: MealType
  items: FoodItem[]
  imageKey?: string
}

/**
 * 每日汇总
 */
export interface DailySummary {
  date: string
  totalCalories: number
  targetCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

export class DiaryService {
  constructor(private client: ApiClient) {}

  /**
   * 获取日记列表
   *
   * @param date 日期 (YYYY-MM-DD)
   */
  async getList(date?: string): Promise<DiaryEntry[]> {
    const params = date ? { date } : undefined
    return this.client.get<DiaryEntry[]>('/diary', { params })
  }

  /**
   * 获取每日营养汇总
   *
   * @param date 日期 (YYYY-MM-DD)
   */
  async getSummary(date?: string): Promise<DailySummary> {
    const params = date ? { date } : undefined
    return this.client.get<DailySummary>('/diary/summary', { params })
  }

  /**
   * 添加记录
   */
  async createEntry(data: CreateDiaryEntryRequest): Promise<DiaryEntry> {
    return this.client.post<DiaryEntry>('/diary/entry', data)
  }

  /**
   * 更新记录
   *
   * @param id 记录 ID
   * @param data 更新数据
   */
  async updateEntry(id: string, data: Partial<CreateDiaryEntryRequest>): Promise<DiaryEntry> {
    return this.client.patch<DiaryEntry>(`/diary/entry/${id}`, data)
  }

  /**
   * 删除记录
   */
  async deleteEntry(id: string): Promise<{ success: boolean }> {
    return this.client.delete<{ success: boolean }>(`/diary/entry/${id}`)
  }
}
