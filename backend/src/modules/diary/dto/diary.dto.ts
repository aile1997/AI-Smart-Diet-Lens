import { IsEnum, IsNumber, IsOptional, IsString, IsArray, Min, IsDateString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**
 * 餐次类型枚举
 */
export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK',
}

/**
 * 食物条目
 */
export interface FoodItem {
  food_name: string
  portion_g: number
  calories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
}

/**
 * 创建日记条目 DTO
 */
export class CreateDiaryEntryDto {
  @ApiProperty({ example: '2025-01-15', description: '日期 (ISO 8601)' })
  @IsDateString()
  date!: string

  @ApiProperty({ enum: MealType, example: MealType.LUNCH, description: '餐次类型' })
  @IsEnum(MealType)
  meal_type!: MealType

  @ApiProperty({ type: [Object], description: '食物条目列表' })
  @IsArray()
  items!: FoodItem[]

  @ApiPropertyOptional({ example: 'food_photo.jpg', description: '图片 S3 key' })
  @IsOptional()
  @IsString()
  image_key?: string

  @ApiPropertyOptional({ example: '午饭吃了沙拉', description: '备注' })
  @IsOptional()
  @IsString()
  note?: string
}

/**
 * 更新日记条目 DTO
 */
export class UpdateDiaryEntryDto {
  @ApiPropertyOptional({ example: 150, description: '份量（克）' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  portion_g?: number

  @ApiPropertyOptional({ example: '增加了份量', description: '备注' })
  @IsOptional()
  @IsString()
  note?: string
}

/**
 * 每日汇总响应 (API 层统一使用 camelCase)
 */
export interface DailySummary {
  date: string
  entries: any[]
  totalCalories: number
  targetCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}
