import { IsString, IsOptional, IsNumber, IsUrl } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**
 * AI 分析请求 DTO
 * 使用腾讯云 COS 公网 URL
 */
export class AnalyzeFoodDto {
  @ApiProperty({ example: 'https://smart-diet-lens.cos.ap-beijing.myqcloud.com/uploads/xxx.jpg', description: '腾讯云 COS 公网 URL' })
  @IsUrl()
  image_url!: string

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
  tips?: string
}

/**
 * AI 分析响应
 */
export interface AnalyzeResponse {
  foods: RecognizedFood[]
  image_url: string
  recognized_at: number
}

/**
 * Qwen-VL API 原始响应
 */
export interface QwenVLResponse {
  food_name: string
  calories: number
  weight_g: number
  macros: {
    protein: number
    fat: number
    carbs: number
  }
  tips?: string
}
