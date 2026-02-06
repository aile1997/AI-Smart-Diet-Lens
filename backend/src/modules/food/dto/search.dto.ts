import { IsString, IsOptional, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

/**
 * 食物搜索响应
 */
export interface FoodSearchItem {
  id: string
  name: string
  calories: number
  unit: string
}

/**
 * 食物搜索响应
 */
export interface FoodSearchResponse {
  results: FoodSearchItem[]
  page: number
  total_pages: number
}

/**
 * 食物搜索 DTO
 */
export class SearchFoodDto {
  @IsString()
  q!: string

  @IsOptional()
  @IsNumber()
  page?: number

  @IsOptional()
  @IsNumber()
  limit?: number
}
