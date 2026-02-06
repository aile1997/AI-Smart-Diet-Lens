/**
 * 用户服务
 *
 * GET /api/user/profile - 获取用户信息
 * PATCH /api/user/metrics - 更新健康指标
 * POST /api/user/health-sync - 健康数据同步
 */

import type { ApiClient } from '../client'

/**
 * 用户信息
 */
export interface UserProfile {
  id: string
  nickname: string
  phone?: string
  email?: string
  avatar?: string
  goalType: string
  dailyCalories: number
}

/**
 * 健康指标
 */
export interface HealthMetrics {
  weight?: number
  bodyFat?: number
  height?: number
  activityLevel?: number
}

/**
 * 策略切换请求
 */
export interface SwitchStrategyRequest {
  newStrategy: string
  targetWeight?: number
}

/**
 * 健康数据同步请求
 */
export interface HealthSyncRequest {
  platform: string
  deviceModel?: string
  metrics: Array<{
    type: string
    value: number
    recordedAt?: string
  }>
}

/**
 * 健康数据同步响应
 */
export interface HealthSyncResponse {
  status: string
  tdeeUpdated?: boolean
  newDailyBudget?: number
}

export class UserService {
  constructor(private client: ApiClient) {}

  /**
   * 获取用户信息
   */
  async getProfile(): Promise<UserProfile> {
    return this.client.get<UserProfile>('/user/profile')
  }

  /**
   * 更新健康指标
   */
  async updateMetrics(metrics: HealthMetrics): Promise<UserProfile> {
    return this.client.patch<UserProfile>('/user/metrics', metrics)
  }

  /**
   * 切换策略
   */
  async switchStrategy(data: SwitchStrategyRequest): Promise<{ dailyCalories: number }> {
    return this.client.post('/user/strategy/switch', data)
  }

  /**
   * 健康数据同步
   */
  async syncHealth(data: HealthSyncRequest): Promise<HealthSyncResponse> {
    return this.client.post<HealthSyncResponse>('/user/health-sync', data)
  }
}
