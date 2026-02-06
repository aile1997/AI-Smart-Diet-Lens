import { IsString, IsOptional, IsNumber } from 'class-validator'

/**
 * AI 分析请求 DTO
 */
export class AnalyzeFoodDto {
  @IsString()
  image_key!: string

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
