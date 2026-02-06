/**
 * 路由守卫 Composable
 *
 * 拦截页面跳转，保护需要登录的页面
 */

import { useAuthStore } from '../stores'
import { logger } from '../utils/logger'

// 公开路由白名单（不需要登录）
const PUBLIC_ROUTES = [
  '/pages/index/index',           // 首页（可以未登录查看部分内容）
  '/pages/onboarding/login',      // 登录页
  '/pages/onboarding/register',   // 注册页
  '/pages/onboarding/welcome',     // 欢迎页
]

// 需要登录的路由
const PROTECTED_ROUTES = [
  '/pages/profile/index',         // 个人资料
  '/pages/analysis/index',        // AI 分析
  '/pages/messages/index',        // 消息中心
]

/**
 * UniApp 导航选项类型
 */
interface UniNavigateOptions {
  url: string
  success?: () => void
  fail?: () => void
  complete?: () => void
}

/**
 * UniApp SwitchTab 选项类型
 */
interface UniSwitchTabOptions {
  url: string
  success?: () => void
  fail?: () => void
  complete?: () => void
}

/**
 * 检查路由是否需要登录
 */
export function isProtectedRoute(url: string): boolean {
  // 解析 URL 获取路径
  try {
    const urlObj = new URL(url, 'http://dummy')
    const path = urlObj.pathname

    // 检查是否在公开路由中
    if (PUBLIC_ROUTES.some(route => path.startsWith(route))) {
      return false
    }

    // 检查是否在保护路由中
    return PROTECTED_ROUTES.some(route => path.startsWith(route))
  } catch {
    // URL 解析失败，保守对待，认为需要登录
    return true
  }
}

/**
 * 设置路由拦截器
 *
 * 在应用启动时调用，拦截所有页面跳转
 */
export function setupRouteGuard() {
  const authStore = useAuthStore()

  // 拦截 navigateTo
  const originalNavigateTo = uni.navigateTo
  uni.navigateTo = function(options: UniNavigateOptions) {
    const url = options.url || (options as string)

    if (isProtectedRoute(url)) {
      if (!authStore.isLoggedIn) {
        // 未登录，跳转到登录页
        originalNavigateTo({
          url: '/pages/onboarding/login',
          success: () => {
            logger.debug('重定向到登录页')
          }
        })
        return
      }
    }

    return originalNavigateTo(options as UniNavigateOptions)
  }

  // 拦截 redirectTo
  const originalRedirectTo = uni.redirectTo
  uni.redirectTo = function(options: UniNavigateOptions) {
    const url = options.url || (options as string)

    if (isProtectedRoute(url)) {
      if (!authStore.isLoggedIn) {
        originalRedirectTo({
          url: '/pages/onboarding/login'
        })
        return
      }
    }

    return originalRedirectTo(options as UniNavigateOptions)
  }

  // 拦截 switchTab
  const originalSwitchTab = uni.switchTab
  uni.switchTab = function(options: UniSwitchTabOptions) {
    const url = options.url || (options as string)

    if (isProtectedRoute(url)) {
      if (!authStore.isLoggedIn) {
        // switchTab 不能直接跳转到非 tabBar 页面
        // 先跳转到首页，然后导航到登录页
        originalSwitchTab({
          url: '/pages/index/index',
          success: () => {
            setTimeout(() => {
              uni.navigateTo({ url: '/pages/onboarding/login' })
            }, 100)
          }
        })
        return
      }
    }

    return originalSwitchTab(options as UniSwitchTabOptions)
  }
}

/**
 * 检查当前页面是否需要登录
 */
export function requiresLogin(): boolean {
  // 获取当前页面路径
  const pages = getCurrentPages()
  if (pages.length === 0) return false

  const currentPage = pages[pages.length - 1]
  const route = currentPage.route

  return isProtectedRoute(route)
}

// 获取当前页面栈（UniApp API）
function getCurrentPages() {
  // 在 UniApp 中，可以通过 getCurrentPages() 获取当前页面栈
  // 这里返回一个模拟的结果，实际使用时需要在页面中调用
  return []
}
