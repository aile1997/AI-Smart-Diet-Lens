/**
 * 认证组合式函数
 *
 * 通过适配器接口实现登录、注册、第三方登录、Token 管理等功能
 */

import { ref, computed } from 'vue'
import type { IHttp } from '../adapters/IHttp'
import type { IStorage } from '../adapters/IStorage'
import type { UserProfile } from '../types/user'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'user_profile'

/** 登录方式 */
export type LoginProvider = 'phone' | 'apple' | 'wechat'

/** 注册请求数据 */
export interface RegisterRequest {
  phone: string
  code: string
  password: string
}

/** 第三方登录请求数据 */
export interface ThirdPartyLoginRequest {
  provider: LoginProvider
  /** 第三方平台返回的授权码 */
  authCode: string
}

export function useAuth(http: IHttp, storage: IStorage) {
  const token = ref<string | null>(null)
  const user = ref<UserProfile | null>(null)
  const loading = ref<boolean>(false)

  const isAuthenticated = computed<boolean>(() => {
    return token.value !== null
  })

  /**
   * 初始化认证状态 (从本地存储恢复)
   */
  async function initialize(): Promise<boolean> {
    const savedToken = await storage.getItem<string>(TOKEN_KEY)
    const savedUser = await storage.getItem<UserProfile>(USER_KEY)

    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = savedUser
      return true
    }
    return false
  }

  /**
   * 发送验证码
   */
  async function sendVerificationCode(phone: string): Promise<boolean> {
    loading.value = true
    try {
      await http.request<{ success: boolean }>({
        url: '/api/auth/send-code',
        method: 'POST',
        data: { phone },
      })
      return true
    }
    catch {
      return false
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 注册新用户
   */
  async function register(data: RegisterRequest): Promise<boolean> {
    loading.value = true
    try {
      const response = await http.request<{
        token: string
        user: UserProfile
      }>({
        url: '/api/auth/register',
        method: 'POST',
        data,
      })

      token.value = response.data.token
      user.value = response.data.user

      await storage.setItem(TOKEN_KEY, response.data.token)
      await storage.setItem(USER_KEY, response.data.user)

      return true
    }
    catch {
      return false
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 手机号 + 验证码登录
   */
  async function login(phone: string, code: string): Promise<boolean> {
    loading.value = true
    try {
      const response = await http.request<{
        token: string
        user: UserProfile
      }>({
        url: '/api/auth/login',
        method: 'POST',
        data: { phone, code },
      })

      token.value = response.data.token
      user.value = response.data.user

      await storage.setItem(TOKEN_KEY, response.data.token)
      await storage.setItem(USER_KEY, response.data.user)

      return true
    }
    catch {
      return false
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 第三方登录 (Apple/微信)
   */
  async function thirdPartyLogin(data: ThirdPartyLoginRequest): Promise<boolean> {
    loading.value = true
    try {
      const response = await http.request<{
        token: string
        user: UserProfile
        isNewUser: boolean
      }>({
        url: '/api/auth/third-party',
        method: 'POST',
        data,
      })

      token.value = response.data.token
      user.value = response.data.user

      await storage.setItem(TOKEN_KEY, response.data.token)
      await storage.setItem(USER_KEY, response.data.user)

      return true
    }
    catch {
      return false
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 登出
   */
  async function logout(): Promise<void> {
    token.value = null
    user.value = null
    await storage.removeItem(TOKEN_KEY)
    await storage.removeItem(USER_KEY)
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    initialize,
    sendVerificationCode,
    register,
    login,
    thirdPartyLogin,
    logout,
  }
}
