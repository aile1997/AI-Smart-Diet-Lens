import { ApiResponse } from './common'
import { NutritionInfo } from './user'

/**
 * 餐食类型枚举
 */
export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK',
}

/**
 * 食物条目
 */
export interface FoodItemEntry {
  food_name: string
  portion_g: number
  calories: number
  macros: NutritionInfo
}

/**
 * 创建日记条目请求
 */
export interface CreateDiaryEntryRequest {
  date: string
  meal_type: MealType
  items: FoodItemEntry[]
  image_key?: string
  note?: string
}

/**
 * 更新日记条目请求
 */
export interface UpdateDiaryEntryRequest {
  portion_g?: number
  note?: string
}

/**
 * 食物信息（带关系）
 */
export interface FoodWithRelation {
  id: string
  name: string
  category?: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

/**
 * 日记条目
 */
export interface DiaryEntry {
  id: string
  userId: string
  foodId?: string
  mealType: MealType
  portion: number
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
  note?: string
  food?: FoodWithRelation
  createdAt: string
  updatedAt: string
}

/**
 * 营养总和
 */
export interface TotalNutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
}

/**
 * 每日汇总响应
 */
export interface DailySummaryResponse {
  date: string
  entries: DiaryEntry[]
  total_nutrition: TotalNutrition
  target_calories: number
}

/**
 * GET /api/diary
 */
export interface GetDiaryListResponse extends ApiResponse {
  data: DiaryEntry[]
}

/**
 * GET /api/diary/summary
 */
export interface GetDailySummaryResponse extends ApiResponse {
  data: DailySummaryResponse
}
