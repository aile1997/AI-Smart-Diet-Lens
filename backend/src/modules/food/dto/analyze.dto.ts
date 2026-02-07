import { IsString, IsOptional, IsNumber } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**
 * AI 分析请求 DTO
 */
export class AnalyzeFoodDto {
  @ApiProperty({ example: 'food_photo.jpg', description: 'S3 图片 key' })
  @IsString()
  image_key!: string

  @ApiPropertyOptional({
    description: 'AR 上下文信息',
    example: {
      container: 'bowl',
      distance_cm: 30
    }
  })
  @IsOptional()
  ar_context?: {
    container: string
    distance_cm?: number
  }
}

/**
 * 营养信息
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
 * 识别结果
 */
export interface RecognizedFood {
  id: string
  name: string
  portion_g: number
  confidence: number
  nutrition: NutritionInfo
}

/**
 * AI 分析响应
 */
export interface AnalyzeResponse {
  foods: RecognizedFood[]
  image_key: string
  recognized_at: number
}
