/**
 * 成就系统相关类型定义
 */

/** 成就类别 */
export enum AchievementCategory {
  /** 减脂相关 */
  WEIGHT_LOSS = 'weight_loss',
  /** 营养相关 */
  NUTRITION = 'nutrition',
  /** AI 使用相关 */
  AI_EXPLORER = 'ai_explorer',
  /** 坚持相关 */
  CONSISTENCY = 'consistency',
}

/** 成就定义 */
export interface Achievement {
  id: string
  name: string
  description: string
  category: AchievementCategory
  /** 图标名 */
  icon: string
  /** 是否已解锁 */
  unlocked: boolean
  /** 解锁时间 */
  unlockedAt?: number
  /** 进度 (0-100) */
  progress: number
  /** 目标值 */
  target: number
  /** 当前值 */
  current: number
}

/** 用户等级 */
export interface UserLevel {
  level: number
  /** 当前经验值 */
  currentExp: number
  /** 升级所需经验值 */
  nextLevelExp: number
  /** 等级名称 */
  title: string
}
