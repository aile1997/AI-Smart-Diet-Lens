/**
 * 营养数据状态管理
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { FoodItem, NutritionInfo } from '../types/food'
import type { DiaryEntry, MealType } from '../types/diary'
import { sumNutrition, calculateNutrition } from '../utils/calculate'

export const useNutritionStore = defineStore('nutrition', () => {
  // 状态
  const currentFood = ref<FoodItem | null>(null)
  const todayEntries = ref<DiaryEntry[]>([])
  const dailyTarget = ref<number>(2000)

  // 计算属性
  const todayNutrition = computed<NutritionInfo>(() => {
    return sumNutrition(todayEntries.value.map(e => e.nutrition))
  })

  const remainingCalories = computed<number>(() => {
    return dailyTarget.value - todayNutrition.value.calories
  })

  const calorieProgress = computed<number>(() => {
    if (dailyTarget.value <= 0) return 0
    return Math.min(100, Math.round(
      (todayNutrition.value.calories / dailyTarget.value) * 100,
    ))
  })

  // 方法
  function setCurrentFood(food: FoodItem) {
    currentFood.value = food
  }

  function clearCurrentFood() {
    currentFood.value = null
  }

  function addEntry(food: FoodItem, mealType: MealType, portion: number) {
    const nutrition = calculateNutrition(food, portion)
    const entry: DiaryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      food,
      mealType,
      portion,
      nutrition,
      recordedAt: Date.now(),
    }
    todayEntries.value.push(entry)
    return entry
  }

  function removeEntry(id: string) {
    todayEntries.value = todayEntries.value.filter(e => e.id !== id)
  }

  function setDailyTarget(target: number) {
    dailyTarget.value = target
  }

  function setTodayEntries(entries: DiaryEntry[]) {
    todayEntries.value = entries
  }

  return {
    // 状态
    currentFood,
    todayEntries,
    dailyTarget,
    // 计算属性
    todayNutrition,
    remainingCalories,
    calorieProgress,
    // 方法
    setCurrentFood,
    clearCurrentFood,
    addEntry,
    removeEntry,
    setDailyTarget,
    setTodayEntries,
  }
})
