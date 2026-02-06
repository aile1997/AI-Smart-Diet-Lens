/**
 * 营养分析组合式函数
 *
 * 提供热量趋势、营养分布、AI 建议等功能
 */

import { ref, computed } from 'vue'
import { getApi } from '../api'
import { DiaryService } from '../api/services/diary.service'
import type { DailySummary } from '../api/services/diary.service'

/**
 * 单日热量数据
 */
export interface DayCalorieData {
  date: string
  dayLabel: string
  calories: number
  target: number
}

/**
 * 营养分布
 */
export interface NutritionDistribution {
  protein: { current: number; percentage: number }
  carbs: { current: number; percentage: number }
  fat: { current: number; percentage: number }
  total: number
}

/**
 * AI 建议类型
 */
export type SuggestionType = 'warning' | 'success' | 'tip'

/**
 * AI 建议
 */
export interface AISuggestion {
  type: SuggestionType
  icon: string
  title: string
  desc: string
  color: 'amber' | 'sage' | 'sky'
}

/**
 * 时间范围类型
 */
export type TimeRange = 'week' | 'month'

/**
 * 获取过去 N 天的日期数组
 */
function getPastDays(days: number): string[] {
  const dates: string[] = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }

  return dates
}

/**
 * 格式化日期为星期显示
 */
function formatDayLabel(dateStr: string, index: number, total: number): string {
  const date = new Date(dateStr)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()

  if (isToday) return '今天'

  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return days[date.getDay()]
}

/**
 * 营养分析组合式函数
 */
export function useAnalysis() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const timeRange = ref<TimeRange>('week')

  // 热量趋势数据
  const calorieTrend = ref<DayCalorieData[]>([])

  // 营养分布
  const nutritionDistribution = computed<NutritionDistribution>(() => {
    if (calorieTrend.value.length === 0) {
      return {
        protein: { current: 0, percentage: 35 },
        carbs: { current: 0, percentage: 45 },
        fat: { current: 0, percentage: 20 },
        total: 0,
      }
    }

    // 聚合最近 7 天的数据
    const recentDays = timeRange.value === 'week' ? 7 : 30
    const daysToAggregate = calorieTrend.value.slice(-recentDays)

    const totalProtein = daysToAggregate.reduce((sum, day) => {
      // 需要从原始数据获取，这里简化处理
      return sum + (day.calories * 0.15) // 假设蛋白质占 15%
    }, 0)

    const totalCarbs = daysToAggregate.reduce((sum, day) => {
      return sum + (day.calories * 0.50) // 假设碳水占 50%
    }, 0)

    const totalFat = daysToAggregate.reduce((sum, day) => {
      return sum + (day.calories * 0.35) // 假设脂肪占 35%
    }, 0)

    const total = totalProtein + totalCarbs + totalFat

    return {
      protein: {
        current: Math.round(totalProtein / 4), // 转换为克
        percentage: Math.round((totalProtein / total) * 100),
      },
      carbs: {
        current: Math.round(totalCarbs / 4),
        percentage: Math.round((totalCarbs / total) * 100),
      },
      fat: {
        current: Math.round(totalFat / 9),
        percentage: Math.round((totalFat / total) * 100),
      },
      total: Math.round(total),
    }
  })

  // AI 建议（静态数据，等待后端 API）
  const aiSuggestions = ref<AISuggestion[]>([
    {
      type: 'warning',
      icon: 'warning',
      title: '周末热量偏高提醒',
      desc: '过去两周六的热量摄入比工作日高出 30%，建议周末也保持规律饮食。',
      color: 'amber',
    },
    {
      type: 'success',
      icon: 'check_circle',
      title: '优质蛋白摄入充足',
      desc: '您的蛋白质来源多样且优质，有助于维持肌肉含量和基础代谢。',
      color: 'sage',
    },
    {
      type: 'tip',
      icon: 'lightbulb',
      title: '增加微量元素摄入',
      desc: '本周深色蔬菜比例略低，建议增加菠菜或西兰花的摄入以补充镁元素。',
      color: 'sky',
    },
  ])

  // 平均热量
  const averageCalories = computed<number>(() => {
    if (calorieTrend.value.length === 0) return 0
    const recentDays = timeRange.value === 'week' ? 7 : 30
    const days = calorieTrend.value.slice(-recentDays)
    const sum = days.reduce((s, d) => s + d.calories, 0)
    return Math.round(sum / days.length)
  })

  // 与上周比较
  const weekOverWeekChange = computed<number>(() => {
    if (calorieTrend.value.length < 14) return 0

    const thisWeek = calorieTrend.value.slice(-7)
    const lastWeek = calorieTrend.value.slice(-14, -7)

    const thisWeekAvg = thisWeek.reduce((s, d) => s + d.calories, 0) / 7
    const lastWeekAvg = lastWeek.reduce((s, d) => s + d.calories, 0) / 7

    return Math.round(((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100)
  })

  /**
   * 获取趋势数据
   */
  async function fetchTrends(range: TimeRange = 'week') {
    loading.value = true
    error.value = null
    timeRange.value = range

    try {
      const api = getApi()
      const diaryService = new DiaryService(api)

      // 获取日期范围
      const days = range === 'week' ? 7 : 30
      const dates = getPastDays(days)

      // 并行获取所有日期的数据
      const summaries = await Promise.allSettled(
        dates.map((date) => diaryService.getSummary(date))
      )

      // 处理结果
      const trendData: DayCalorieData[] = []

      summaries.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const summary: DailySummary = result.value
          trendData.push({
            date: summary.date,
            dayLabel: formatDayLabel(summary.date, index, dates.length),
            calories: summary.totalCalories,
            target: summary.targetCalories,
          })
        } else {
          // API 失败，使用默认值
          trendData.push({
            date: dates[index],
            dayLabel: formatDayLabel(dates[index], index, dates.length),
            calories: 0,
            target: 2000,
          })
        }
      })

      calorieTrend.value = trendData
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取趋势数据失败'
      console.error('fetchTrends error:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新数据
   */
  function refresh() {
    return fetchTrends(timeRange.value)
  }

  return {
    loading,
    error,
    timeRange,
    calorieTrend,
    nutritionDistribution,
    aiSuggestions,
    averageCalories,
    weekOverWeekChange,
    fetchTrends,
    refresh,
  }
}
