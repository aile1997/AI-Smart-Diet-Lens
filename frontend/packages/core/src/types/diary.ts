/**
 * 饮食日记相关类型定义
 */

import type { FoodItem, NutritionInfo } from './food'

/** 餐次类型 */
export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
}

/** 日记条目 */
export interface DiaryEntry {
  id: string
  /** 食物信息 */
  food: FoodItem
  /** 餐次 */
  mealType: MealType
  /** 实际份量 (g) */
  portion: number
  /** 计算后的营养成分 */
  nutrition: NutritionInfo
  /** 记录时间 */
  recordedAt: number
  /** 备注 */
  note?: string
}

/** 每日汇总 */
export interface DailySummary {
  /** 日期 (YYYY-MM-DD) */
  date: string
  /** 日记条目 */
  entries: DiaryEntry[]
  /** 总营养摄入 */
  totalNutrition: NutritionInfo
  /** 目标热量 */
  targetCalories: number
}

/** 心情类型 */
export type MoodType = 'great' | 'good' | 'neutral' | 'bad' | 'terrible'

/** 每日健康记录 */
export interface DailyHealthLog {
  date: string
  /** 步数 */
  steps: number
  /** 饮水杯数 */
  waterCups: number
  /** 睡眠时长 (小时) */
  sleepHours: number
  /** 心情 */
  mood: MoodType
}
