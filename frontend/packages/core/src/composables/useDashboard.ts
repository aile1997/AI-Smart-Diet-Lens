/**
 * 仪表盘 Composable
 *
 * 获取仪表盘数据、热量进度、健康指标等
 */

import { ref, computed } from 'vue'
import { getApi, DashboardService } from '../api'
import type { DashboardSummary } from '../api/services/dashboard.service'

export function useDashboard() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<DashboardSummary | null>(null)

  // 热量相关计算属性
  const calories = computed(() => {
    if (!data.value?.hero_component?.data) {
      return { current: 0, target: 2000, remaining: 2000 }
    }
    const { primary } = data.value.hero_component.data
    return {
      current: primary.current,
      target: primary.target,
      remaining: primary.target - primary.current,
    }
  })

  // 蛋白质相关计算属性
  const protein = computed(() => {
    if (!data.value?.hero_component?.data) {
      return { current: 0, target: 180 }
    }
    const { secondary } = data.value.hero_component.data
    return {
      current: secondary.current,
      target: secondary.target,
    }
  })

  // 步数
  const steps = computed(() => {
    if (!data.value?.widgets?.steps) {
      return { current: 0, target: 10000 }
    }
    return data.value.widgets.steps
  })

  // 水分
  const water = computed(() => {
    if (!data.value?.widgets?.water) {
      return { current: 0, target: 8 }
    }
    return data.value.widgets.water
  })

  // 睡眠
  const sleep = computed(() => {
    if (!data.value?.widgets?.sleep) {
      return { hours: 0, quality: 'FAIR' as const }
    }
    return data.value.widgets.sleep
  })

  // 策略模式
  const strategy = computed(() => {
    return data.value?.ui_strategy || 'MAINTAIN'
  })

  /**
   * 获取仪表盘数据
   */
  async function fetchDashboard(date?: string) {
    loading.value = true
    error.value = null

    try {
      console.log('[Dashboard] 开始获取数据, date:', date)
      const api = getApi()
      console.log('[Dashboard] api 实例:', !!api)
      const dashboardService = new DashboardService(api)
      console.log('[Dashboard] 开始调用 getSummary')
      const result = await dashboardService.getSummary(date)
      console.log('[Dashboard] getSummary 返回:', result)
      data.value = result
      console.log('[Dashboard] data.value 已设置')
      return data.value
    } catch (err) {
      console.error('[Dashboard] 获取数据失败:', err)
      const message = err instanceof Error ? err.message : '获取数据失败'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新数据
   */
  async function refresh() {
    return fetchDashboard()
  }

  return {
    // 状态
    loading,
    error,
    data,

    // 计算属性
    calories,
    protein,
    steps,
    water,
    sleep,
    strategy,

    // 方法
    fetchDashboard,
    refresh,
  }
}
