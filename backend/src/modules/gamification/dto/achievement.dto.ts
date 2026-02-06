import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator'

/**
 * 成就响应 DTO
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
  unlockedAt?: Date
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
 * 更新成就进度 DTO
 */
export class UpdateAchievementDto {
  @IsString()
  achievement_id!: string

  @IsNumber()
  progress!: number
}
