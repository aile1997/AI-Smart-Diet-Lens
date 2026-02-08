/**
 * 路由守卫 Composable
 *
 * 当前配置：所有页面均为公开路由，无需登录即可访问
 * 开发模式下，暂不强制登录认证
 */

import { useAuthStore } from '../stores'
import { logger } from '../utils/logger'

// 公开路由白名单（只需要登录页）
const PUBLIC_ROUTES = [
  '/pages/onboarding/login',      // 登录页
  '/pages/splash',                // 启动页
]

// 需要登录的路由（所有功能页面）
const PROTECTED_ROUTES = [
  '/pages/index',                 // 首页
  '/pages/discover',              // 发现页
  '/pages/wiki',                  // 食材百科
  '/pages/food-detail',           // 食物详情
  '/pages/recipe-detail',         // 食谱详情
  '/pages/profile',               // 个人资料
  '/pages/analysis',              // AI 分析
  '/pages/messages',              // 消息中心
  '/pages/scan',                  // 扫描页
  '/pages/scan-fail',             // 扫描失败页
  '/pages/food-result',           // 食物结果页
  '/pages/diary',                 // 日记页
  '/pages/ai-chat',               // AI 聊天页
  '/pages/achievements',          // 成就页
  '/pages/cooking-assistant',     // 烹饪助手
  '/pages/favorites',             // 收藏页
  '/pages/shopping-list',         // 购物清单
  '/pages/settings',              // 设置页
  '/pages/my-posts',              // 我的帖子
  '/pages/my-reviews',            // 我的评论
  '/pages/onboarding',            // 其他引导页（body-metrics, goals 等）
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
 *
 * 当前逻辑：所有 /pages/ 开头的路由均为公开路由
 */
export function isProtectedRoute(url: string): boolean {
  // 解析 URL 获取路径
  try {
    const urlObj = new URL(url, 'http://dummy')
    const path = urlObj.pathname

    // 检查是否在公开路由中
    if (PUBLIC_ROUTES.some(route => path.startsWith(route))) {
      return false  // 公开路由，不需要登录
    }

    // 检查是否在保护路由中（当前为空列表）
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
