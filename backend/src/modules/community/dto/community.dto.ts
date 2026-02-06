import { IsString, IsOptional, IsNotEmpty, IsArray, IsNumber, Min, Max } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * 创建帖子 DTO
 */
export class CreatePostDto {
  @ApiProperty({ description: '帖子内容', example: '今天做了一道减脂餐，分享给大家！' })
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiProperty({ description: '图片 URL 数组', required: false, example: ['https://example.com/image.jpg'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[]

  @ApiProperty({ description: '标签数组', required: false, example: ['减脂', '健康饮食'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]
}

/**
 * 点赞 DTO
 */
export class LikePostDto {
  @ApiProperty({ description: '是否点赞', example: true })
  @IsNotEmpty()
  liked: boolean
}

/**
 * 评论 DTO
 */
export class CreateCommentDto {
  @ApiProperty({ description: '评论内容', example: '看起来很棒，我也想试试！' })
  @IsString()
  @IsNotEmpty()
  content: string
}

/**
 * 评价 DTO
 */
export class CreateReviewDto {
  @ApiProperty({ description: '评分 1-5', example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number

  @ApiProperty({ description: '评价内容', required: false, example: '非常棒的食谱！' })
  @IsString()
  @IsOptional()
  comment?: string
}

/**
 * 查询帖子 DTO
 */
export class QueryPostsDto {
  @ApiProperty({ description: '页码', required: false, example: 1 })
  @IsOptional()
  page?: number

  @ApiProperty({ description: '每页数量', required: false, example: 20 })
  @IsOptional()
  limit?: number

  @ApiProperty({ description: '标签筛选', required: false, example: '减脂' })
  @IsString()
  @IsOptional()
  tag?: string
}
