/**
 * 游戏化服务
 *
 * GET /api/gamification/achievements - 获取成就列表
 */

import type { ApiClient } from '../client'

/**
 * 成就
 */
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  progress?: string
}

/**
 * 成就列表响应
 */
export interface AchievementsResponse {
  streakDays: number
  level: number
  badges: Achievement[]
}

export class GamificationService {
  constructor(private client: ApiClient) {}

  /**
   * 获取成就墙
   */
  async getAchievements(): Promise<AchievementsResponse> {
    return this.client.get<AchievementsResponse>('/gamification/achievements')
  }
}
