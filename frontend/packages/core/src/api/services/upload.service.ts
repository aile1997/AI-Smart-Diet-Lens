/**
 * 文件上传服务
 *
 * GET /api/upload/presigned - 获取预签名 URL
 * POST /api/upload/confirm - 确认上传
 */

import type { ApiClient } from '../client'

/**
 * 预签名 URL 响应
 */
export interface PresignedUrlResponse {
  uploadUrl: string
  fileKey: string
}

/**
 * 确认上传响应
 */
export interface ConfirmUploadResponse {
  url: string
  fileKey: string
}

export class UploadService {
  constructor(private client: ApiClient) {}

  /**
   * 获取预签名上传 URL
   *
   * @param filename 文件名
   * @param contentType 文件类型（如 'image/jpeg'）
   */
  async getPresignedUrl(filename: string, contentType: string): Promise<PresignedUrlResponse> {
    return this.client.get<PresignedUrlResponse>('/upload/presigned', {
      params: { filename, contentType }
    })
  }

  /**
   * 确认上传完成
   *
   * @param fileKey 文件 Key
   */
  async confirmUpload(fileKey: string): Promise<ConfirmUploadResponse> {
    return this.client.post<ConfirmUploadResponse>('/upload/confirm', { fileKey })
  }

  /**
   * 完整上传流程（获取预签名 URL -> 上传到 S3 -> 确认）
   *
   * @param file 文件对象
   * @param onProgress 上传进度回调（可选）
   */
  async uploadFile(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    // 1. 获取预签名 URL
    const { uploadUrl, fileKey } = await this.getPresignedUrl(file.name, file.type)

    // 2. 直接上传到 S3
    const xhr = new XMLHttpRequest()

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100))
        }
      })

      xhr.addEventListener('load', async () => {
        if (xhr.status === 200) {
          try {
            // 3. 确认上传完成
            const { url } = await this.confirmUpload(fileKey)
            resolve(url)
          } catch (error) {
            reject(error)
          }
        } else {
          reject(new Error(`上传失败: HTTP ${xhr.status}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('网络错误，上传失败'))
      })

      xhr.open('PUT', uploadUrl)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.send(file)
    })
  }
}
