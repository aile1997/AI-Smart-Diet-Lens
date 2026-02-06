import { IsString, IsNotEmpty, IsIn } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * 添加收藏 DTO
 */
export class CreateFavoriteDto {
  @ApiProperty({ description: '收藏项 ID', example: 'recipe_123' })
  @IsString()
  @IsNotEmpty()
  itemId: string

  @ApiProperty({ description: '类型', example: 'recipe', enum: ['recipe', 'food'] })
  @IsString()
  @IsIn(['recipe', 'food'])
  type: 'recipe' | 'food'
}

/**
 * 查询收藏 DTO
 */
export class QueryFavoritesDto {
  @ApiProperty({ description: '类型筛选', required: false, example: 'recipe' })
  @IsString()
  type?: 'recipe' | 'food'
}
