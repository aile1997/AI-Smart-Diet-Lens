/**
 * nutritionStore 单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNutritionStore } from '../../src/stores/nutrition'
import { MealType } from '../../src/types/diary'
import type { FoodItem } from '../../src/types/food'

// 测试用食物数据
const mockApple: FoodItem = {
  id: 'apple-001',
  name: '苹果',
  nutritionPer100g: {
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
  },
  portion: 100,
}

const mockRice: FoodItem = {
  id: 'rice-001',
  name: '米饭',
  nutritionPer100g: {
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
  },
  portion: 100,
}

describe('useNutritionStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('初始状态应为空', () => {
    const store = useNutritionStore()
    expect(store.currentFood).toBeNull()
    expect(store.todayEntries).toHaveLength(0)
    expect(store.todayNutrition.calories).toBe(0)
  })

  it('添加条目后应正确计算营养汇总', () => {
    const store = useNutritionStore()

    // 添加 200g 苹果
    store.addEntry(mockApple, MealType.BREAKFAST, 200)
    expect(store.todayEntries).toHaveLength(1)
    expect(store.todayNutrition.calories).toBe(104) // 52 * 2

    // 再添加 150g 米饭
    store.addEntry(mockRice, MealType.LUNCH, 150)
    expect(store.todayEntries).toHaveLength(2)
    expect(store.todayNutrition.calories).toBe(299) // 104 + 195
  })

  it('删除条目后应重新计算', () => {
    const store = useNutritionStore()

    const entry = store.addEntry(mockApple, MealType.SNACK, 100)
    expect(store.todayNutrition.calories).toBe(52)

    store.removeEntry(entry.id)
    expect(store.todayEntries).toHaveLength(0)
    expect(store.todayNutrition.calories).toBe(0)
  })

  it('应正确计算剩余热量', () => {
    const store = useNutritionStore()
    store.setDailyTarget(2000)

    store.addEntry(mockRice, MealType.LUNCH, 200)
    // 130 * 2 = 260
    expect(store.remainingCalories).toBe(1740)
  })

  it('应正确计算热量进度百分比', () => {
    const store = useNutritionStore()
    store.setDailyTarget(1000)

    store.addEntry(mockRice, MealType.LUNCH, 200) // 260 kcal
    expect(store.calorieProgress).toBe(26)
  })
})
