/**
 * 认证状态管理
 *
 * 管理登录状态、Token 和用户认证流程
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getApi, initApi, AuthService } from '../api'
import { tokenStorage } from '../utils/secure-storage'
import { createRateLimiter } from '../utils/throttle'
import { logger } from '../utils/logger'

// 验证码发送限流器：每分钟最多 5 次
const codeRateLimiter = createRateLimiter(5, 60000)

// 记录每次发送验证码的时间（用于计算冷却时间）
const codeSendTimes: number[] = []

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string | null>(null)
  const loading = ref(false)
  const errorCode = ref<string | null>(null)
  const canSendCode = ref(true)
  const codeCooldown = ref(0)

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)

  // 方法
  /**
   * 初始化认证状态（从 Storage 恢复）
   */
  async function initAuth() {
    try {
      const savedToken = tokenStorage.getToken()
      if (savedToken) {
        token.value = savedToken
        // 重新初始化 API 客户端（带 token）
        initApi(() => savedToken)
      }
    } catch (error) {
      logger.error('初始化认证状态失败:', error)
    }
  }

  /**
   * 检查是否可以发送验证码
   */
  function checkCodeRateLimit(): { canSend: boolean; cooldown: number } {
    // 检查限流器
    if (!codeRateLimiter()) {
      // 计算冷却时间
      const cooldown = 60000 - (Date.now() - codeSendTimes[codeSendTimes.length - 5])
      return { canSend: false, cooldown: Math.max(0, cooldown) }
    }

    return { canSend: true, cooldown: 0 }
  }

  /**
   * 发送邮箱验证码
   */
  async function sendCode(email: string) {
    // 检查限流
    const { canSend, cooldown } = checkCodeRateLimit()
    if (!canSend) {
      codeCooldown.value = cooldown
      canSendCode.value = false

      // 更新冷却状态
      setTimeout(() => {
        canSendCode.value = true
        codeCooldown.value = 0
      }, cooldown)

      return {
        success: false,
        error: `发送过于频繁，请在 ${Math.ceil(cooldown / 1000)} 秒后重试`
      }
    }

    loading.value = true
    errorCode.value = null

    try {
      const api = getApi()
      const authService = new AuthService(api)
      await authService.sendCode(email)

      // 记录发送时间
      codeSendTimes.push(Date.now())

      // 开始60秒倒计时
      canSendCode.value = false
      setTimeout(() => {
        canSendCode.value = true
      }, 60000)

      return { success: true }
    } catch (error) {
      errorCode.value = (error as Error).message
      logger.error('发送验证码失败:', error)
      return { success: false, error: (error as Error).message }
    } finally {
      loading.value = false
    }
  }

  /**
   * 邮箱验证码登录
   */
  async function loginWithEmail(email: string, code: string) {
    loading.value = true
    errorCode.value = null

    try {
      const api = getApi()
      const authService = new AuthService(api)
      const result = await authService.loginWithEmail(email, code)

      // 保存 Token（使用加密存储）
      token.value = result.token
      tokenStorage.setToken(result.token)

      // 重新初始化 API 客户端（带新 token）
      initApi(() => result.token)

      return { success: true, user: result.user }
    } catch (error) {
      errorCode.value = (error as Error).message
      return { success: false, error: (error as Error).message }
    } finally {
      loading.value = false
    }
  }

  /**
   * 微信授权登录
   */
  async function loginWithWechat(code: string, openid?: string) {
    loading.value = true
    errorCode.value = null

    try {
      const api = getApi()
      const authService = new AuthService(api)
      const result = await authService.loginWithWechat(code, openid)

      // 保存 Token（使用加密存储）
      token.value = result.token
      tokenStorage.setToken(result.token)

      // 重新初始化 API 客户端（带新 token）
      initApi(() => result.token)

      return { success: true, user: result.user }
    } catch (error) {
      errorCode.value = (error as Error).message
      return { success: false, error: (error as Error).message }
    } finally {
      loading.value = false
    }
  }

  /**
   * 登出
   */
  function logout() {
    token.value = null
    errorCode.value = null
    tokenStorage.removeToken()
  }

  return {
    // 状态
    token,
    loading,
    errorCode,
    canSendCode,
    codeCooldown,
    // 计算属性
    isLoggedIn,
    // 方法
    initAuth,
    sendCode,
    loginWithEmail,
    loginWithWechat,
    logout,
  }
})
