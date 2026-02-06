import { IsEnum, IsNumber, IsString, IsOptional, IsDateString, Min, Max } from 'class-validator'

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
  SEDENTARY = 1.2, // 久坐
  LIGHT = 1.375, // 轻度活动
  MODERATE = 1.55, // 中度活动
  ACTIVE = 1.725, // 高度活动
  VERY_ACTIVE = 1.9, // 非常活跃
}

/**
 * 档案信息 DTO
 */
export class OnboardingDto {
  // 档案信息
  @IsEnum(Gender)
  gender!: Gender

  @IsDateString()
  dob!: string

  @IsNumber()
  @Min(100)
  @Max(250)
  height_cm!: number

  // 身体指标
  @IsNumber()
  @Min(30)
  @Max(200)
  weight_kg!: number

  @IsOptional()
  @IsNumber()
  @Min(3)
  @Max(50)
  body_fat?: number

  @IsEnum(ActivityLevel)
  activity_level!: ActivityLevel

  // 目标
  @IsEnum(GoalType)
  goal_type!: GoalType

  @IsOptional()
  @IsNumber()
  target_weight_kg?: number
}

/**
 * 策略配置响应
 */
export interface StrategyConfig {
  mode: GoalType
  daily_calories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
}
