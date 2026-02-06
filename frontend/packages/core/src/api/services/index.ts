/**
 * API 服务层统一导出
 *
 * 使用示例：
 * ```ts
 * import { api, authService, dashboardService } from '@diet-lens/core'
 *
 * // 登录
 * const result = await authService.loginWithEmail('email@example.com', '123456')
 *
 * // 获取仪表盘
 * const data = await dashboardService.getSummary()
 * ```
 */

import { ApiClient, uniRequestAsFetch } from '../client'
import type { OnUnauthorizedCallback } from '../types'

// 创建全局 API 实例
let apiInstance: ApiClient | null = null

/**
 * 初始化 API 客户端
 *
 * @param tokenGetter Token 获取函数
 * @param options 可选配置
 */
export function initApi(
  tokenGetter: () => string | null,
  options?: {
    fetchProvider?: typeof fetch | ((url: string, config: RequestInit) => Promise<Response>)
    onUnauthorized?: OnUnauthorizedCallback
  }
): ApiClient {
  apiInstance = new ApiClient({
    baseURL: import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000/api',
    tokenGetter,
    fetchProvider: options?.fetchProvider,
    onUnauthorized: options?.onUnauthorized,
  })
  return apiInstance
}

/**
 * 设置 401 未授权回调
 * 用于在 API 返回 401 时自动登出
 */
export function setOnUnauthorizedCallback(callback: OnUnauthorizedCallback) {
  if (apiInstance) {
    apiInstance.setOnUnauthorized(callback)
  }
}

/**
 * 获取 API 客户端实例
 */
export function getApi(): ApiClient {
  if (!apiInstance) {
    throw new Error('API 未初始化，请先调用 initApi()')
  }
  return apiInstance
}

// 导出所有服务类（需要 API 实例）
export { AuthService } from './auth.service'
export { ChatService } from './chat.service'
export { CommunityService } from './community.service'
export { DashboardService } from './dashboard.service'
export { FavoritesService } from './favorites.service'
export { NotificationsService } from './notifications.service'
export { RecipeService } from './recipe.service'
export { UploadService } from './upload.service'
export { DiaryService } from './diary.service'
export { UserService } from './user.service'
export { GamificationService } from './gamification.service'

// 导出类型
export type { LoginResponse, WechatLoginResponse } from './auth.service'
export type { ChatMessage, ChatResponse } from './chat.service'
export type { Post, Comment, LikeResponse, PostsResponse } from './community.service'
export type { DashboardSummary } from './dashboard.service'
export type { Favorite, FavoriteType, FavoritesResponse, CheckFavoritedResponse } from './favorites.service'
export type { Notification, MessageType, NotificationsResponse, UnreadCountResponse } from './notifications.service'
export type { Recipe, RecipeRecommendResponse } from './recipe.service'
export type { PresignedUrlResponse, ConfirmUploadResponse } from './upload.service'
export type { DiaryEntry, CreateDiaryEntryRequest, DailySummary, MealType, FoodItem } from './diary.service'
export type { UserProfile, HealthMetrics, HealthSyncResponse } from './user.service'
export type { Achievement, AchievementsResponse } from './gamification.service'

// 导出 ApiClient 和工具
export { ApiClient, uniRequestAsFetch } from '../client'
export type { ApiClientConfig, ApiRequestOptions, ApiResponse } from '../types'
