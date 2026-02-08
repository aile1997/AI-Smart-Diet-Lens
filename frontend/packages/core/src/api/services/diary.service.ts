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
 * 餐别类型（后端使用小写）
 */
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'

/**
 * 食物项（前端使用）
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
 * 后端返回的食物数据
 */
interface BackendFood {
  id: string
  name: string
  category: string
  calories: number
  protein: number
  carbs: number
  fat: number
  imageUrl?: string  // 食物图片 URL
}

/**
 * 后端返回的日记条目（Prisma 格式）
 */
interface BackendDiaryEntry {
  id: string
  userId: string
  foodId: string | null
  mealType: string  // 后端返回小写：breakfast, lunch, dinner, snack
  portion: number
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
  note: string | null
  food: BackendFood | null
  createdAt: string
  updatedAt: string
}

/**
 * 前端使用的日记条目
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
 * 创建日记请求（前端使用 camelCase）
 */
export interface CreateDiaryEntryRequest {
  mealType: MealType
  items: FoodItem[]
  imageKey?: string
}

/**
 * 后端 DTO 格式（snake_case）
 * 内部使用，不对外暴露
 */
interface BackendCreateDiaryEntryDto {
  date: string
  meal_type: MealType
  items: BackendFoodItem[]
  image_key?: string
  note?: string
}

interface BackendFoodItem {
  food_name: string
  portion_g: number
  calories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
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
   * 将后端格式转换为前端格式
   */
  private convertToDiaryEntry(backendEntry: BackendDiaryEntry): DiaryEntry {
    // 后端的 mealType 是小写，需要转换为大写
    const mealTypeMap: Record<string, MealType> = {
      breakfast: 'BREAKFAST',
      lunch: 'LUNCH',
      dinner: 'DINNER',
      snack: 'SNACK',
    }

    return {
      id: backendEntry.id,
      date: backendEntry.date,
      mealType: mealTypeMap[backendEntry.mealType] || backendEntry.mealType as MealType,
      items: [
        {
          name: backendEntry.food?.name || '未知食物',
          portion: Math.round(backendEntry.portion),
          calories: Math.round(backendEntry.calories),
          protein: Math.round(backendEntry.protein),
          carbs: Math.round(backendEntry.carbs),
          fat: Math.round(backendEntry.fat),
        }
      ],
      totalCalories: Math.round(backendEntry.calories),
      // 使用关联食物的图片，如果没有则使用默认占位图
      imageKey: backendEntry.food?.imageUrl || undefined,
    }
  }

  /**
   * 获取日记列表
   *
   * @param date 日期 (YYYY-MM-DD)
   */
  async getList(date?: string): Promise<DiaryEntry[]> {
    const params = date ? { date } : undefined
    const backendEntries = await this.client.get<BackendDiaryEntry[]>('/diary', { params })
    return backendEntries.map(entry => this.convertToDiaryEntry(entry))
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
   *
   * 将前端 camelCase 格式转换为后端 snake_case 格式
   */
  async createEntry(data: CreateDiaryEntryRequest): Promise<DiaryEntry> {
    // 转换为后端 DTO 格式
    const backendDto: BackendCreateDiaryEntryDto = {
      date: new Date().toISOString().split('T')[0], // 今日日期
      meal_type: data.mealType,
      items: data.items.map(item => ({
        food_name: item.name,
        portion_g: item.portion,
        calories: item.calories,
        macros: {
          protein: item.protein || 0,
          carbs: item.carbs || 0,
          fat: item.fat || 0,
        }
      })),
      image_key: data.imageKey,
    }

    const backendEntry = await this.client.post<BackendDiaryEntry>('/diary/entry', backendDto)
    return this.convertToDiaryEntry(backendEntry)
  }

  /**
   * 更新记录
   *
   * @param id 记录 ID
   * @param data 更新数据
   */
  async updateEntry(id: string, data: Partial<CreateDiaryEntryRequest>): Promise<DiaryEntry> {
    // 后端更新只接受 portion_g 和 note
    const backendDto: { portion_g?: number; note?: string } = {}
    if (data.items?.[0]?.portion) {
      backendDto.portion_g = data.items[0].portion
    }

    const backendEntry = await this.client.patch<BackendDiaryEntry>(`/diary/entry/${id}`, backendDto)
    return this.convertToDiaryEntry(backendEntry)
  }

  /**
   * 删除记录
   */
  async deleteEntry(id: string): Promise<{ success: boolean }> {
    return this.client.delete<{ success: boolean }>(`/diary/entry/${id}`)
  }
}
