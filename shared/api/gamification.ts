import { ApiResponse } from './common'

/**
 * 成就徽章
 */
export interface AchievementBadge {
  id: string
  name: string
  description: string
  category: string
  icon: string
  target: number
  unlocked: boolean
  progress?: number
  unlockedAt?: string
}

/**
 * 成就墙响应
 */
export interface AchievementsResponse {
  streak_days: number
  level: number
  badges: AchievementBadge[]
}

/**
 * GET /api/gamification/achievements
 */
export interface GetAchievementsResponse extends ApiResponse {
  data: AchievementsResponse
}
