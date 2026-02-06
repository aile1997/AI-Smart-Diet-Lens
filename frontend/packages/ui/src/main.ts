/**
 * 应用入口
 *
 * 初始化 API 客户端、Pinia 状态管理
 */

import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'uno.css'

// 导入 API 初始化函数
import { initApi, setOnUnauthorizedCallback, uniRequestAsFetch } from '@diet-lens/core'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()

  app.use(pinia)

  // 初始化 API 客户端
  // Token 从 uni.getStorageSync 获取
  // 使用 uniRequestAsFetch 包装器以兼容 UniApp 环境
  initApi(
    () => {
      try {
        return uni.getStorageSync('token') || null
      } catch {
        return null
      }
    },
    {
      fetchProvider: uniRequestAsFetch,
      // 401 错误回调：清除登录状态并跳转登录页
      onUnauthorized: () => {
        try {
          // 清除 token
          uni.removeStorageSync('token')
          // 清除用户信息
          uni.removeStorageSync('user')
          // 跳转登录页
          uni.reLaunch({
            url: '/pages/onboarding/login'
          })
          // 提示用户
          uni.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none',
            duration: 2000,
          })
        } catch (error) {
          console.error('401 处理失败:', error)
        }
      }
    }
  )

  return {
    app,
  }
}
