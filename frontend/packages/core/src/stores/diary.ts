/**
 * 饮食日记状态管理
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { DailySummary, DailyHealthLog, MoodType } from '../types/diary'
import { formatDate } from '../utils/format'

export const useDiaryStore = defineStore('diary', () => {
  // 状态
  const dailySummaries = ref<Map<string, DailySummary>>(new Map())
  const healthLogs = ref<Map<string, DailyHealthLog>>(new Map())
  const selectedDate = ref<string>(formatDate(new Date()))

  // 计算属性
  const currentSummary = computed<DailySummary | undefined>(() => {
    return dailySummaries.value.get(selectedDate.value)
  })

  const currentHealthLog = computed<DailyHealthLog | undefined>(() => {
    return healthLogs.value.get(selectedDate.value)
  })

  // 方法
  function setSelectedDate(date: string) {
    selectedDate.value = date
  }

  function setSummary(date: string, summary: DailySummary) {
    dailySummaries.value.set(date, summary)
  }

  function updateHealthLog(
    date: string,
    updates: Partial<DailyHealthLog>,
  ) {
    const existing = healthLogs.value.get(date)
    const log: DailyHealthLog = {
      date,
      steps: existing?.steps ?? 0,
      waterCups: existing?.waterCups ?? 0,
      sleepHours: existing?.sleepHours ?? 0,
      mood: existing?.mood ?? 'neutral' as MoodType,
      ...updates,
    }
    healthLogs.value.set(date, log)
  }

  return {
    // 状态
    dailySummaries,
    healthLogs,
    selectedDate,
    // 计算属性
    currentSummary,
    currentHealthLog,
    // 方法
    setSelectedDate,
    setSummary,
    updateHealthLog,
  }
})
