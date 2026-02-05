/**
 * 营养计算工具函数
 */

import type { Gender, ActivityLevel, GoalType } from '../types/user'
import type { NutritionInfo, FoodItem } from '../types/food'

/**
 * 计算基础代谢率 (BMR)
 * 使用 Mifflin-St Jeor 公式
 *
 * @param weight - 体重 (kg)
 * @param height - 身高 (cm)
 * @param age - 年龄 (岁)
 * @param gender - 性别
 * @returns 基础代谢率 (kcal/day)
 */
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
): number {
  if (gender === 'male') {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5)
  }
  return Math.round(10 * weight + 6.25 * height - 5 * age - 161)
}

/** 活动系数映射 */
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  heavy: 1.725,
  extreme: 1.9,
}

/** 目标热量调整系数 */
const GOAL_ADJUSTMENTS: Record<GoalType, number> = {
  lose_weight: -500,
  maintain: 0,
  gain_muscle: 300,
}

/**
 * 计算每日目标热量 (TDEE + 目标调整)
 *
 * @param bmr - 基础代谢率
 * @param activityLevel - 活动等级
 * @param goal - 健身目标
 * @returns 每日目标热量 (kcal)
 */
export function calculateDailyCalorieTarget(
  bmr: number,
  activityLevel: ActivityLevel,
  goal: GoalType,
): number {
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel]
  return Math.round(tdee + GOAL_ADJUSTMENTS[goal])
}

/**
 * 根据份量计算食物营养成分
 *
 * @param food - 食物项 (含每 100g 营养成分)
 * @param portion - 实际份量 (g)
 * @returns 计算后的营养成分
 */
export function calculateNutrition(
  food: FoodItem,
  portion: number,
): NutritionInfo {
  const ratio = portion / 100
  const base = food.nutritionPer100g
  return {
    calories: Math.round(base.calories * ratio),
    protein: Math.round(base.protein * ratio * 10) / 10,
    carbs: Math.round(base.carbs * ratio * 10) / 10,
    fat: Math.round(base.fat * ratio * 10) / 10,
    fiber: base.fiber ? Math.round(base.fiber * ratio * 10) / 10 : undefined,
    sodium: base.sodium ? Math.round(base.sodium * ratio) : undefined,
  }
}

/**
 * 汇总多个营养成分
 *
 * @param items - 营养成分数组
 * @returns 汇总后的营养成分
 */
export function sumNutrition(items: NutritionInfo[]): NutritionInfo {
  return items.reduce<NutritionInfo>(
    (sum, item) => ({
      calories: sum.calories + item.calories,
      protein: Math.round((sum.protein + item.protein) * 10) / 10,
      carbs: Math.round((sum.carbs + item.carbs) * 10) / 10,
      fat: Math.round((sum.fat + item.fat) * 10) / 10,
      fiber: item.fiber !== undefined
        ? Math.round(((sum.fiber ?? 0) + item.fiber) * 10) / 10
        : sum.fiber,
      sodium: item.sodium !== undefined
        ? (sum.sodium ?? 0) + item.sodium
        : sum.sodium,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )
}
