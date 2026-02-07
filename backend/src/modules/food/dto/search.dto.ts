import { IsString, IsOptional, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

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
  @ApiProperty({ example: '苹果', description: '搜索关键词' })
  @IsString()
  q!: string

  @ApiPropertyOptional({ example: 1, description: '页码' })
  @IsOptional()
  @IsNumber()
  page?: number

  @ApiPropertyOptional({ example: 20, description: '每页数量' })
  @IsOptional()
  @IsNumber()
  limit?: number
}
