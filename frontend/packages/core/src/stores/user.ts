/**
 * 用户状态管理
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { UserProfile, UserBasic } from '../types/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const profile = ref<UserProfile | null>(null)
  const basicInfo = ref<UserBasic | null>(null)
  const isLoggedIn = ref<boolean>(false)

  // 计算属性
  const displayName = computed<string>(() => {
    return profile.value?.nickname ?? basicInfo.value?.nickname ?? '未登录'
  })

  const hasCompletedOnboarding = computed<boolean>(() => {
    return basicInfo.value?.onboardingCompleted ?? false
  })

  const dailyCalorieTarget = computed<number>(() => {
    return profile.value?.dailyCalorieTarget ?? 2000
  })

  // 方法
  function setProfile(data: UserProfile) {
    profile.value = data
    isLoggedIn.value = true
  }

  function setBasicInfo(data: UserBasic) {
    basicInfo.value = data
  }

  function logout() {
    profile.value = null
    basicInfo.value = null
    isLoggedIn.value = false
  }

  return {
    // 状态
    profile,
    basicInfo,
    isLoggedIn,
    // 计算属性
    displayName,
    hasCompletedOnboarding,
    dailyCalorieTarget,
    // 方法
    setProfile,
    setBasicInfo,
    logout,
  }
})
