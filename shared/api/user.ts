import { ApiResponse } from './common'

/**
 * 性别枚举
 */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

/**
 * 目标类型枚举
 */
export enum GoalType {
  FAT_LOSS = 'FAT_LOSS',
  MAINTAIN = 'MAINTAIN',
  MUSCLE_GAIN = 'MUSCLE_GAIN',
}

/**
 * 活动等级枚举
 */
export enum ActivityLevel {
  SEDENTARY = 1.2,
  LIGHT = 1.375,
  MODERATE = 1.55,
  ACTIVE = 1.725,
  VERY_ACTIVE = 1.9,
}

/**
 * 营养素信息
 */
export interface NutritionInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sodium?: number
}

/**
 * 策略配置
 */
export interface StrategyConfig {
  mode: GoalType
  daily_calories: number
  macros: NutritionInfo
}

/**
 * 用户入职引导请求
 */
export interface OnboardingRequest {
  profile: {
    gender: Gender
    dob: string
    height_cm: number
  }
  metrics: {
    weight_kg: number
    body_fat?: number
    activity_level: ActivityLevel
  }
  goal: {
    type: GoalType
    target_weight_kg?: number
  }
}

/**
 * 用户入职引导响应
 */
export interface OnboardingResponse {
  user_id: string
  token: string
  strategy_config: StrategyConfig
}

/**
 * POST /api/user/onboarding
 */
export interface OnboardingApiResponse extends ApiResponse {
  data: OnboardingResponse
}

/**
 * 发送验证码请求
 */
export interface SendCodeRequest {
  email: string
}

/**
 * 邮箱登录请求
 */
export interface EmailLoginRequest {
  email: string
  code: string
}

/**
 * 微信登录请求
 */
export interface WechatLoginRequest {
  code: string
  openid?: string
}

/**
 * 登录响应
 */
export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    nickname?: string
    avatar?: string
    emailVerified: boolean
  }
}

/**
 * POST /api/auth/send-code
 */
export interface SendCodeResponse extends ApiResponse {
  data: { success: boolean; message: string }
}

/**
 * POST /api/auth/login/email
 * POST /api/auth/login/wechat
 */
export interface LoginApiResponse extends ApiResponse {
  data: LoginResponse
}
