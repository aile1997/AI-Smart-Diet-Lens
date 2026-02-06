/**
 * 游戏化功能组合式函数
 *
 * 提供成就、等级、连续天数等功能
 */

import { ref, computed } from 'vue'
import { getApi } from '../api'
import { GamificationService } from '../api/services/gamification.service'
import type { Achievement } from '../api/services/gamification.service'

/**
 * 游戏化功能组合式函数
 */
export function useGamification() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 用户等级
  const level = ref(1)

  // 连续打卡天数
  const streakDays = ref(0)

  // 成就列表
  const achievements = ref<Achievement[]>([])

  // 已解锁成就
  const unlockedAchievements = computed(() => {
    return achievements.value.filter(a => a.unlocked)
  })

  // 未解锁成就
  const lockedAchievements = computed(() => {
    return achievements.value.filter(a => !a.unlocked)
  })

  // 成就进度统计
  const progress = computed(() => {
    const unlocked = unlockedAchievements.value.length
    const total = achievements.value.length
    return {
      unlocked,
      total,
      percentage: total > 0 ? Math.round((unlocked / total) * 100) : 0
    }
  })

  /**
   * 获取成就列表
   */
  async function fetchAchievements() {
    loading.value = true
    error.value = null

    try {
      const api = getApi()
      const gamificationService = new GamificationService(api)

      const response = await gamificationService.getAchievements()

      level.value = response.level
      streakDays.value = response.streakDays
      achievements.value = response.badges
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取成就失败'
      console.error('fetchAchievements error:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新数据
   */
  function refresh() {
    return fetchAchievements()
  }

  return {
    loading,
    error,
    level,
    streakDays,
    achievements,
    unlockedAchievements,
    lockedAchievements,
    progress,
    fetchAchievements,
    refresh,
  }
}
