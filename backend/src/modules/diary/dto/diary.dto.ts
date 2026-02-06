import { IsEnum, IsNumber, IsOptional, IsString, IsArray, Min, IsDateString } from 'class-validator'

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
  @IsDateString()
  date!: string

  @IsEnum(MealType)
  meal_type!: MealType

  @IsArray()
  items!: FoodItem[]

  @IsOptional()
  @IsString()
  image_key?: string

  @IsOptional()
  @IsString()
  note?: string
}

/**
 * 更新日记条目 DTO
 */
export class UpdateDiaryEntryDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  portion_g?: number

  @IsOptional()
  @IsString()
  note?: string
}

/**
 * 每日汇总响应
 */
export interface DailySummary {
  date: string
  entries: any[]
  total_nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  target_calories: number
}
