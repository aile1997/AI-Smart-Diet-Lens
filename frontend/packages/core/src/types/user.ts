/**
 * 用户相关类型定义
 */

/** 性别 */
export type Gender = 'male' | 'female'

/** 健身目标 */
export enum GoalType {
  /** 减脂 */
  LOSE_WEIGHT = 'lose_weight',
  /** 维持体重 */
  MAINTAIN = 'maintain',
  /** 增肌 */
  GAIN_MUSCLE = 'gain_muscle',
}

/** 活动等级 */
export enum ActivityLevel {
  /** 久坐 */
  SEDENTARY = 'sedentary',
  /** 轻度运动 */
  LIGHT = 'light',
  /** 中度运动 */
  MODERATE = 'moderate',
  /** 重度运动 */
  HEAVY = 'heavy',
  /** 极重度运动 */
  EXTREME = 'extreme',
}

/** 用户个人资料 */
export interface UserProfile {
  id: string
  nickname: string
  avatar: string
  gender: Gender
  age: number
  /** 身高 (cm) */
  height: number
  /** 体重 (kg) */
  weight: number
  goal: GoalType
  activityLevel: ActivityLevel
  /** 每日目标热量 (kcal) */
  dailyCalorieTarget: number
}

/** 用户基础信息 (未完成 Onboarding) */
export interface UserBasic {
  id: string
  nickname: string
  avatar: string
  onboardingCompleted: boolean
}
