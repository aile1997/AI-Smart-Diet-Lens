import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { randomBytes } from 'crypto'
// 使用 require 兼容 CommonJS 模块
const COS = require('cos-nodejs-sdk-v5')

/**
 * 腾讯云 COS 预签名 URL 授权参数
 */
interface PresignedUrlOptions {
  Bucket: string
  Region: string
  Key: string
  Method: string
  Expires: number
  Headers?: Record<string, string>
  Query?: Record<string, string>
}

/**
 * 预签名 URL 响应
 */
export interface PresignedUrlResponse {
  uploadUrl: string      // 预签名的 PUT URL
  fileKey: string        // 文件在 COS 中的 key
  publicUrl: string      // 文件的公开访问 URL
  expiresAt: number      // 过期时间戳
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
 * 腾讯云 COS 上传服务
 */
@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name)
  private readonly cos: any
  private readonly bucketName: string
  private readonly region: string

  constructor(private readonly config: ConfigService) {
    // 初始化腾讯云 COS
    this.cos = new COS({
      SecretId: this.config.get<string>('TENCENT_SECRET_ID') || '',
      SecretKey: this.config.get<string>('TENCENT_SECRET_KEY') || '',
    })
    this.bucketName = this.config.get<string>('TENCENT_BUCKET') || 'smart-diet-lens'
    this.region = this.config.get<string>('TENCENT_REGION') || 'ap-beijing'
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
   * 生成腾讯云 COS 预签名上传 URL
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

    // 使用腾讯云 COS SDK 生成预签名 PUT URL
    return new Promise((resolve, reject) => {
      this.cos.getObjectUrl(
        {
          Bucket: this.bucketName,
          Region: this.region,
          Key: fileKey,
          Method: 'PUT',
          Sign: true,
          Expires: 600, // 10分钟有效期
          Headers: {
            'Content-Type': contentType, // 必须包含 Content-Type
          },
        },
        (err: any, data: any) => {
          if (err) {
            this.logger.error('生成预签名 URL 失败', err)
            return reject(err)
          }

          const publicUrl = `https://${this.bucketName}.cos.${this.region}.myqcloud.com/${fileKey}`
          this.logger.log(`生成 COS 预签名 URL: ${fileKey}`)

          resolve({
            uploadUrl: data.Url, // 预签名的 PUT URL
            fileKey: fileKey,
            publicUrl: publicUrl,
            expiresAt: Date.now() + 10 * 60 * 1000,
          })
        },
      )
    })
  }

  /**
   * 后端直接上传文件到 COS
   * @param fileBuffer 文件缓冲区
   * @param fileKey COS 中的文件 key
   * @returns 公开访问 URL
   */
  async uploadFileToCOS(fileBuffer: Buffer, fileKey: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.cos.putObject(
        {
          Bucket: this.bucketName,
          Region: this.region,
          Key: fileKey,
          Body: fileBuffer,
        },
        (err: any, data: any) => {
          if (err) {
            this.logger.error('COS 上传失败', err)
            return reject(err)
          }
          const publicUrl = `https://${this.bucketName}.cos.${this.region}.myqcloud.com/${fileKey}`
          this.logger.log(`COS 上传成功: ${fileKey}`)
          resolve(publicUrl)
        },
      )
    })
  }

  /**
   * 获取对象 URL（可选）
   */
  async getObjectUrl(fileKey: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.cos.getObjectUrl(
        {
          Bucket: this.bucketName,
          Region: this.region,
          Key: fileKey,
          Sign: true,
          Expires: 3600,
        },
        (err: any, data: any) => {
          if (err) {
            this.logger.error('获取 COS 对象 URL 失败', err)
            return reject(err)
          }
          resolve(data.Url || '')
        },
      )
    })
  }
}

