import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { UploadService } from './upload.service'
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { ApiResponse } from '../../common/api-response'
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'

/**
 * 上传控制器
 */
@ApiTags('upload')
@ApiBearerAuth('JWT-auth')
@Controller('upload')
@UseGuards(JwtGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * GET /api/upload/presigned
   * 获取 S3 预签名上传 URL
   */
  @Get('presigned')
  @Throttle({ short: { limit: 20, ttl: 60000 } })
  @ApiOperation({
    summary: '获取预签名 URL',
    description: '用于前端直接上传图片到 S3，获取预签名的 PUT URL'
  })
  @ApiQuery({ name: 'filename', required: true, description: '文件名', example: 'food_photo.jpg' })
  @ApiQuery({ name: 'contentType', required: true, description: '文件类型', example: 'image/jpeg' })
  @ApiQuery({ name: 'fileSize', required: false, description: '文件大小（字节），用于验证', example: 1024000 })
  @SwaggerApiResponse({ status: 200, description: '成功返回预签名 URL' })
  async getPresignedUrl(
    @CurrentUser() user: UserPayload,
    @Query('filename') filename: string,
    @Query('contentType') contentType: string,
    @Query('fileSize') fileSize?: string,
  ) {
    const size = fileSize ? parseInt(fileSize, 10) : undefined
    const result = await this.uploadService.generatePresignedUrl(filename, contentType, size)
    return ApiResponse.ok(result)
  }
}
