/**
 * 文件上传服务（纯 API 层）
 *
 * GET /api/upload/presigned - 获取预签名 URL
 * POST /api/upload/confirm - 确认上传
 *
 * 注意：完整的上传流程（获取预签名 URL -> 上传到云存储 -> 确认）应该在 UI 层实现，
 * 因为涉及平台特定的文件 API（浏览器使用 File/XMLHttpRequest，UniApp 使用 uni.uploadFile）。
 */

import type { ApiClient } from '../client'

/**
 * 预签名 URL 响应
 */
export interface PresignedUrlResponse {
  uploadUrl: string
  fileKey: string
  publicUrl: string
}

/**
 * 直接上传响应
 */
export interface DirectUploadResponse {
  publicUrl: string
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
   * 后端直接上传（Base64 格式）
   *
   * @param fileKey 文件 Key
   * @param base64 Base64 编码的图片数据（包含 data:image/... 前缀）
   */
  async directUpload(fileKey: string, base64: string): Promise<DirectUploadResponse> {
    return this.client.post<DirectUploadResponse>('/upload/direct', {
      fileKey,
      base64
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
}
