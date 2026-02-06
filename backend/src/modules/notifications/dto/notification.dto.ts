import { IsString, IsEnum, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * 查询消息 DTO
 */
export class QueryMessagesDto {
  @ApiProperty({ description: '消息类型', required: false, enum: ['achievement', 'reminder', 'system'], example: 'achievement' })
  @IsString()
  @IsEnum(['achievement', 'reminder', 'system'])
  @IsOptional()
  type?: 'achievement' | 'reminder' | 'system'
}
