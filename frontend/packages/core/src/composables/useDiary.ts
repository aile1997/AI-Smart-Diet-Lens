/**
 * 饮食日记组合式函数
 *
 * 提供日记的增删查改、每日汇总等业务逻辑
 */

import { ref } from 'vue'
import type { IHttp } from '../adapters/IHttp'
import type { DiaryEntry, DailySummary, MealType } from '../types/diary'
import type { FoodItem } from '../types/food'
import { calculateNutrition, sumNutrition } from '../utils/calculate'

export function useDiary(http: IHttp) {
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  /**
   * 添加日记条目
   */
  async function addEntry(
    food: FoodItem,
    mealType: MealType,
    portion: number,
  ): Promise<DiaryEntry | null> {
    loading.value = true
    error.value = null

    try {
      const nutrition = calculateNutrition(food, portion)
      const response = await http.request<DiaryEntry>({
        url: '/api/diary',
        method: 'POST',
        data: {
          foodId: food.id,
          mealType,
          portion,
          nutrition,
        },
      })
      return response.data
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : '记录失败'
      return null
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 获取某日的饮食日记汇总
   */
  async function getDailySummary(date: string): Promise<DailySummary | null> {
    loading.value = true
    error.value = null

    try {
      const response = await http.request<DailySummary>({
        url: `/api/diary/summary?date=${date}`,
        method: 'GET',
      })
      return response.data
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : '获取失败'
      return null
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 删除日记条目
   */
  async function removeEntry(id: string): Promise<boolean> {
    try {
      await http.request({
        url: `/api/diary/${id}`,
        method: 'DELETE',
      })
      return true
    }
    catch {
      return false
    }
  }

  /**
   * 本地计算每日汇总 (离线模式)
   */
  function calculateLocalSummary(
    entries: DiaryEntry[],
    targetCalories: number,
    date: string,
  ): DailySummary {
    return {
      date,
      entries,
      totalNutrition: sumNutrition(entries.map(e => e.nutrition)),
      targetCalories,
    }
  }

  return {
    loading,
    error,
    addEntry,
    getDailySummary,
    removeEntry,
    calculateLocalSummary,
  }
}
