import { IsString, IsOptional, IsNotEmpty, IsArray } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * 发送消息 DTO
 */
export class SendMessageDto {
  @ApiProperty({ description: '消息内容', example: '我想做一道减脂餐' })
  @IsString()
  @IsNotEmpty()
  message: string

  @ApiProperty({ description: '对话上下文', required: false, example: [{ role: 'user', content: '你好' }] })
  @IsArray()
  @IsOptional()
  context?: Array<{ role: string; content: string }>
}

/**
 * 生成食谱 DTO
 */
export class GenerateRecipeDto {
  @ApiProperty({ description: '饮食偏好', example: { calories: 500, mealType: 'lunch', preferences: ['低卡', '高蛋白'] } })
  preferences: Record<string, unknown>
}

/**
 * 食谱卡片响应
 */
export class RecipeCardResponse {
  @ApiProperty({ description: '食谱名称' })
  name: string

  @ApiProperty({ description: '食谱图片' })
  image: string

  @ApiProperty({ description: '卡路里' })
  calories: number

  @ApiProperty({ description: '烹饪时间' })
  time: string

  @ApiProperty({ description: '难度' })
  difficulty: string

  @ApiProperty({ description: '描述' })
  description: string
}

/**
 * AI 回复响应
 */
export class ChatResponse {
  @ApiProperty({ description: 'AI 回复内容' })
  reply: string

  @ApiProperty({ description: '推荐的食谱卡片', required: false, type: RecipeCardResponse })
  recipeCard?: RecipeCardResponse
}
