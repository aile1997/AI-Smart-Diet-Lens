import { IsEnum, IsNumber, IsString, IsOptional, IsDateString, ArrayMinSize, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

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
  @ApiProperty({ enum: HealthMetricType, example: HealthMetricType.STEPS, description: '指标类型' })
  @IsEnum(HealthMetricType)
  type!: HealthMetricType

  @ApiProperty({ example: 8000, description: '指标值' })
  @IsNumber()
  value!: number

  @ApiProperty({ example: '2025-01-15T10:00:00Z', description: '记录时间 (ISO 8601)' })
  @IsDateString()
  recorded_at!: string

  @ApiPropertyOptional({ example: 'APPLE_HEALTH', description: '数据来源' })
  @IsOptional()
  @IsString()
  source?: string
}

/**
 * 健康数据同步请求 DTO
 */
export class HealthSyncDto {
  @ApiProperty({ enum: ['ios', 'android'], example: 'ios', description: '平台类型' })
  @IsString()
  platform!: 'ios' | 'android'

  @ApiPropertyOptional({ example: 'iPhone 15 Pro', description: '设备型号' })
  @IsOptional()
  @IsString()
  device_model?: string

  @ApiProperty({ type: [HealthMetricItem], description: '健康指标列表' })
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
  @ApiProperty({ enum: ['FAT_LOSS', 'MAINTAIN', 'MUSCLE_GAIN'], example: 'FAT_LOSS', description: '新策略' })
  @IsEnum(['FAT_LOSS', 'MAINTAIN', 'MUSCLE_GAIN'])
  new_strategy!: 'FAT_LOSS' | 'MAINTAIN' | 'MUSCLE_GAIN'

  @ApiPropertyOptional({ example: 70, description: '目标体重（公斤）' })
  @IsOptional()
  @IsNumber()
  target_weight?: number
}

/**
 * 更新身体指标 DTO
 */
export class UpdateMetricsDto {
  @ApiPropertyOptional({ example: 70.5, description: '体重（公斤）' })
  @IsOptional()
  @IsNumber()
  weight?: number

  @ApiPropertyOptional({ example: 15, description: '体脂率（%）' })
  @IsOptional()
  @IsNumber()
  body_fat?: number

  @ApiPropertyOptional({ example: 175, description: '身高（厘米）' })
  @IsOptional()
  @IsNumber()
  height?: number
}
