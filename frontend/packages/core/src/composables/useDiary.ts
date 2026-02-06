/**
 * 饮食日记组合式函数
 *
 * 提供日记的增删查改、每日汇总等业务逻辑
 */

import { ref, computed } from 'vue'
import { getApi } from '../api'
import { DiaryService } from '../api/services/diary.service'
import type { DailySummary, DiaryEntry, MealType, CreateDiaryEntryRequest } from '../api/services/diary.service'

/**
 * 餐别类型映射
 */
const MEAL_TYPE_MAP: Record<MealType, string> = {
  BREAKFAST: '早餐',
  LUNCH: '午餐',
  DINNER: '晚餐',
  SNACK: '加餐',
}

/**
 * 饮食日记组合式函数
 */
export function useDiary() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 当前选中的日期
  const selectedDate = ref(new Date().toISOString().split('T')[0])

  // 日记条目列表
  const entries = ref<DiaryEntry[]>([])

  // 每日汇总
  const dailySummary = ref<DailySummary | null>(null)

  // 计算属性 - 营养素数据
  const macros = computed(() => {
    if (!dailySummary.value) {
      return [
        { label: '碳水', val: '0g', color: 'bg-blue-400', pct: '0%' },
        { label: '蛋白质', val: '0g', color: 'bg-primary', pct: '0%' },
        { label: '脂肪', val: '0g', color: 'bg-amber-400', pct: '0%' },
      ]
    }

    const summary = dailySummary.value
    const targetCalories = summary.targetCalories || 2000

    return [
      {
        label: '碳水',
        val: `${Math.round(summary.totalCarbs)}g`,
        color: 'bg-blue-400',
        pct: `${Math.min(Math.round((summary.totalCarbs / (targetCalories * 0.5)) * 100), 100)}%`,
      },
      {
        label: '蛋白质',
        val: `${Math.round(summary.totalProtein)}g`,
        color: 'bg-primary',
        pct: `${Math.min(Math.round((summary.totalProtein / (targetCalories * 0.2)) * 100), 100)}%`,
      },
      {
        label: '脂肪',
        val: `${Math.round(summary.totalFat)}g`,
        color: 'bg-amber-400',
        pct: `${Math.min(Math.round((summary.totalFat / (targetCalories * 0.3)) * 100), 100)}%`,
      },
    ]
  })

  // 按餐别分组的食物列表
  const meals = computed(() => {
    if (!entries.value || entries.value.length === 0) {
      return []
    }

    // 按餐别分组
    const grouped: Record<string, DiaryEntry[]> = {}
    entries.value.forEach((entry) => {
      const mealType = entry.mealType
      if (!grouped[mealType]) {
        grouped[mealType] = []
      }
      grouped[mealType].push(entry)
    })

    // 转换为 UI 格式
    const mealOrder: MealType[] = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']
    const colorMap: Record<MealType, string> = {
      BREAKFAST: 'bg-amber-400',
      LUNCH: 'bg-primary',
      DINNER: 'bg-indigo-500',
      SNACK: 'bg-purple-400',
    }

    return mealOrder
      .filter((type) => grouped[type])
      .map((type) => ({
        name: MEAL_TYPE_MAP[type],
        color: colorMap[type],
        cal: Math.round(grouped[type].reduce((sum, e) => sum + e.totalCalories, 0)).toString(),
        items: grouped[type].map((entry) => ({
          title: entry.items[0]?.name || '未知食物',
          desc: `${entry.items.reduce((sum, item) => sum + item.portion, 0)}g`,
          c: entry.totalCalories,
          img: entry.imageKey || 'https://via.placeholder.com/100',
        })),
      }))
  })

  /**
   * 获取日记列表
   */
  async function fetchEntries(date?: string) {
    loading.value = true
    error.value = null

    try {
      const api = getApi()
      const diaryService = new DiaryService(api)

      const dateToFetch = date || selectedDate.value
      const data = await diaryService.getList(dateToFetch)

      entries.value = data
      selectedDate.value = dateToFetch
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取日记失败'
      console.error('fetchEntries error:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取每日汇总
   */
  async function fetchSummary(date?: string) {
    loading.value = true
    error.value = null

    try {
      const api = getApi()
      const diaryService = new DiaryService(api)

      const dateToFetch = date || selectedDate.value
      const summary = await diaryService.getSummary(dateToFetch)

      dailySummary.value = summary
      selectedDate.value = dateToFetch
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取汇总失败'
      console.error('fetchSummary error:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 同时获取条目和汇总
   */
  async function fetchAll(date?: string) {
    await Promise.all([fetchEntries(date), fetchSummary(date)])
  }

  /**
   * 添加日记条目
   */
  async function addEntry(data: CreateDiaryEntryRequest) {
    loading.value = true
    error.value = null

    try {
      const api = getApi()
      const diaryService = new DiaryService(api)

      const entry = await diaryService.createEntry(data)
      entries.value.push(entry)

      // 刷新汇总
      await fetchSummary(selectedDate.value)

      return entry
    } catch (err) {
      error.value = err instanceof Error ? err.message : '添加记录失败'
      console.error('addEntry error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新日记条目
   */
  async function updateEntry(id: string, data: Partial<CreateDiaryEntryRequest>) {
    loading.value = true
    error.value = null

    try {
      const api = getApi()
      const diaryService = new DiaryService(api)

      const updated = await diaryService.updateEntry(id, data)

      // 更新本地列表
      const index = entries.value.findIndex((e) => e.id === id)
      if (index !== -1) {
        entries.value[index] = updated
      }

      // 刷新汇总
      await fetchSummary(selectedDate.value)

      return updated
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新记录失败'
      console.error('updateEntry error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除日记条目
   */
  async function deleteEntry(id: string) {
    loading.value = true
    error.value = null

    try {
      const api = getApi()
      const diaryService = new DiaryService(api)

      await diaryService.deleteEntry(id)

      // 从本地列表移除
      entries.value = entries.value.filter((e) => e.id !== id)

      // 刷新汇总
      await fetchSummary(selectedDate.value)

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除记录失败'
      console.error('deleteEntry error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新当前日期的数据
   */
  function refresh() {
    return fetchAll(selectedDate.value)
  }

  return {
    // 状态
    loading,
    error,
    selectedDate,
    entries,
    dailySummary,
    // 计算属性
    macros,
    meals,
    // 方法
    fetchEntries,
    fetchSummary,
    fetchAll,
    addEntry,
    updateEntry,
    deleteEntry,
    refresh,
  }
}
