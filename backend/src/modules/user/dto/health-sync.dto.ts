import { IsEnum, IsNumber, IsString, IsOptional, IsDateString, ArrayMinSize, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

/**
 * 健康指标类型枚举
 */
export enum HealthMetricType {
  STEPS = 'STEPS',
  BODY_FAT = 'BODY_FAT',
  WEIGHT = 'WEIGHT',
  SLEEP = 'SLEEP',
  ACTIVE_CALORIES = 'ACTIVE_CALORIES',
}

/**
 * 数据来源枚举
 */
export enum MetricSource {
  YOLANDA_SCALE = 'YOLANDA_SCALE',
  APPLE_HEALTH = 'APPLE_HEALTH',
  GOOGLE_FIT = 'GOOGLE_FIT',
  MANUAL = 'MANUAL',
}

/**
 * 单个健康指标 DTO
 */
export class HealthMetricItem {
  @IsEnum(HealthMetricType)
  type!: HealthMetricType

  @IsNumber()
  value!: number

  @IsDateString()
  recorded_at!: string

  @IsOptional()
  @IsString()
  source?: string
}

/**
 * 健康数据同步请求 DTO
 */
export class HealthSyncDto {
  @IsString()
  platform!: 'ios' | 'android'

  @IsOptional()
  @IsString()
  device_model?: string

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => HealthMetricItem)
  metrics!: HealthMetricItem[]
}

/**
 * 健康同步响应
 */
export interface HealthSyncResponse {
  status: string
  tdee_updated: boolean
  new_daily_budget?: number
}

/**
 * 策略切换请求 DTO
 */
export class SwitchStrategyDto {
  @IsEnum(['FAT_LOSS', 'MAINTAIN', 'MUSCLE_GAIN'])
  new_strategy!: 'FAT_LOSS' | 'MAINTAIN' | 'MUSCLE_GAIN'

  @IsOptional()
  @IsNumber()
  target_weight?: number
}

/**
 * 更新身体指标 DTO
 */
export class UpdateMetricsDto {
  @IsOptional()
  @IsNumber()
  weight?: number

  @IsOptional()
  @IsNumber()
  body_fat?: number

  @IsOptional()
  @IsNumber()
  height?: number
}
