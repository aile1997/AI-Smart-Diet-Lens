import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
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
   * 生成 S3 预签名上传 URL
   * @param filename 原始文件名
   * @param contentType 文件 MIME 类型
   * @returns 预签名 URL 信息
   */
  async generatePresignedUrl(
    filename: string,
    contentType: string,
  ): Promise<PresignedUrlResponse> {
    // 生成唯一文件 key
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const ext = filename.split('.').pop()
    const fileKey = `uploads/${timestamp}_${random}.${ext}`

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: contentType,
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

    this.logger.log(`生成预签名 URL: ${fileKey}`)

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
