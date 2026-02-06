import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { randomBytes } from 'crypto'
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

/**
 * 预签名 URL 响应
 */
export interface PresignedUrlResponse {
  upload_url: string      // 预签名的 PUT URL
  file_key: string        // 文件在 S3 中的 key
  public_url: string      // 文件的公开访问 URL
  expires_at: number      // 过期时间戳
}

/**
 * 允许的文件 MIME 类型
 */
const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
]

/**
 * 文件大小限制 (字节)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * S3 上传服务
 */
@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name)
  private readonly s3Client: S3Client
  private readonly bucketName: string

  constructor(private readonly config: ConfigService) {
    this.s3Client = new S3Client({
      region: this.config.get<string>('AWS_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.config.get<string>('AWS_SECRET_ACCESS_KEY') || '',
      },
    })
    this.bucketName = this.config.get<string>('S3_BUCKET') || 'diet-lens-uploads'
  }

  /**
   * 验证文件类型
   */
  private validateContentType(contentType: string): void {
    if (!contentType) {
      throw new BadRequestException('必须提供 Content-Type')
    }

    const normalizedType = contentType.toLowerCase().trim()
    if (!ALLOWED_CONTENT_TYPES.includes(normalizedType)) {
      throw new BadRequestException(
        `不支持的文件类型: ${contentType}. 支持的类型: ${ALLOWED_CONTENT_TYPES.join(', ')}`,
      )
    }
  }

  /**
   * 生成安全的文件名
   */
  private generateSecureFilename(originalExt: string): string {
    const timestamp = Date.now()
    // 使用 crypto.randomBytes 替代 Math.random()，更安全
    const random = randomBytes(4).toString('hex')
    return `${timestamp}_${random}.${originalExt}`
  }

  /**
   * 生成 S3 预签名上传 URL
   * @param filename 原始文件名
   * @param contentType 文件 MIME 类型
   * @param fileSize 文件大小（字节）
   * @returns 预签名 URL 信息
   */
  async generatePresignedUrl(
    filename: string,
    contentType: string,
    fileSize?: number,
  ): Promise<PresignedUrlResponse> {
    // 验证文件类型
    this.validateContentType(contentType)

    // 验证文件大小
    if (fileSize !== undefined && fileSize > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `文件大小超过限制: ${Math.floor(fileSize / 1024 / 1024)}MB (最大 ${MAX_FILE_SIZE / 1024 / 1024}MB)`,
      )
    }

    // 生成安全的文件 key
    const ext = filename.split('.').pop()?.toLowerCase() || 'jpg'
    const fileKey = `uploads/${this.generateSecureFilename(ext)}`

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: contentType,
      ContentLength: fileSize,
      Metadata: {
        originalName: filename,
        uploadedAt: new Date().toISOString(),
      },
    })

    // 生成 15 分钟有效的预签名 URL
    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 15 * 60,
    })

    const publicUrl = `https://${this.bucketName}.s3.amazonaws.com/${fileKey}`

    this.logger.log(`生成预签名 URL: ${fileKey} (${contentType})`)

    return {
      upload_url: uploadUrl,
      file_key: fileKey,
      public_url: publicUrl,
      expires_at: Date.now() + 15 * 60 * 1000,
    }
  }

  /**
   * 获取对象 URL（可选）
   */
  async getObjectUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    })

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 })
  }
}
