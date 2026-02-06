/**
 * 用户状态管理
 *
 * 管理用户信息、认证状态和个人资料
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getApi, UserService } from '../api'
import { useAuthStore } from './auth'
import type { UserProfile, UserBasic } from '../types/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const profile = ref<UserProfile | null>(null)
  const basicInfo = ref<UserBasic | null>(null)

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
  /**
   * 获取用户信息
   */
  async function fetchProfile() {
    try {
      const api = getApi()
      const userService = new UserService(api)
      const data = await userService.getProfile()
      profile.value = data as UserProfile
      return data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  /**
   * 设置用户信息
   */
  function setProfile(data: UserProfile) {
    profile.value = data
  }

  /**
   * 设置基础信息
   */
  function setBasicInfo(data: UserBasic) {
    basicInfo.value = data
  }

  /**
   * 更新健康指标
   */
  async function updateMetrics(metrics: { weight?: number; bodyFat?: number }) {
    try {
      const api = getApi()
      const userService = new UserService(api)
      const data = await userService.updateMetrics(metrics)
      profile.value = data as UserProfile
      return data
    } catch (error) {
      console.error('更新健康指标失败:', error)
      throw error
    }
  }

  /**
   * 登出
   */
  function logout() {
    const authStore = useAuthStore()
    profile.value = null
    basicInfo.value = null
    authStore.logout()
  }

  return {
    // 状态
    profile,
    basicInfo,
    // 计算属性
    displayName,
    hasCompletedOnboarding,
    dailyCalorieTarget,
    // 方法
    fetchProfile,
    setProfile,
    setBasicInfo,
    updateMetrics,
    logout,
  }
})
