import { Controller, Get, Post, Query, UseGuards, UseInterceptors, UploadedFile, Body } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadService } from './upload.service'
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { ApiResponse } from '../../common/api-response'
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger'

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
   * 获取腾讯云 COS 预签名上传 URL
   */
  @Get('presigned')
  @Throttle({ short: { limit: 20, ttl: 60000 } })
  @ApiOperation({
    summary: '获取预签名 URL',
    description: '用于前端直接上传图片到腾讯云 COS，获取预签名的 PUT URL'
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

  /**
   * POST /api/upload/direct
   * 后端直接上传到 COS（Base64 格式）
   */
  @Post('direct')
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: '后端直接上传',
    description: '前端将 Base64 编码的图片发送到后端，由后端上传到腾讯云 COS'
  })
  @SwaggerApiResponse({ status: 200, description: '成功返回公开访问 URL' })
  async directUpload(
    @CurrentUser() user: UserPayload,
    @Body() body: { fileKey: string; base64: string },
  ) {
    try {
      console.log('📥 收到上传请求, fileKey:', body.fileKey)

      // 验证请求体
      if (!body.fileKey || !body.base64) {
        console.error('❌ 缺少必需参数')
        return ApiResponse.error('INVALID_REQUEST', 'fileKey 和 base64 是必需的')
      }

      // 将 Base64 转换为 Buffer
      const base64Data = body.base64.replace(/^data:image\/\w+;base64,/, '')
      const fileBuffer = Buffer.from(base64Data, 'base64')

      console.log(`📤 准备上传: ${body.fileKey}, 大小: ${fileBuffer.length} bytes`)

      const publicUrl = await this.uploadService.uploadFileToCOS(fileBuffer, body.fileKey)
      console.log('✅ 上传成功:', publicUrl)
      return ApiResponse.ok({ publicUrl, fileKey: body.fileKey })
    } catch (error: any) {
      console.error('❌ 上传失败:', error)
      return ApiResponse.error('UPLOAD_FAILED', error?.message || '上传失败')
    }
  }
}
