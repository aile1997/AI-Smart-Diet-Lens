/**
 * 营养计算组合式函数
 *
 * 提供 BMR 计算、每日目标热量计算等营养相关功能
 */

import { computed } from 'vue'
import type { Gender, ActivityLevel, GoalType } from '../types/user'
import { calculateBMR, calculateDailyCalorieTarget } from '../utils/calculate'

interface UseNutritionParams {
  weight: () => number
  height: () => number
  age: () => number
  gender: () => Gender
  activityLevel: () => ActivityLevel
  goal: () => GoalType
}

export function useNutrition(params: UseNutritionParams) {
  const bmr = computed<number>(() => {
    return calculateBMR(
      params.weight(),
      params.height(),
      params.age(),
      params.gender(),
    )
  })

  const dailyCalorieTarget = computed<number>(() => {
    return calculateDailyCalorieTarget(
      bmr.value,
      params.activityLevel(),
      params.goal(),
    )
  })

  return {
    bmr,
    dailyCalorieTarget,
  }
}
