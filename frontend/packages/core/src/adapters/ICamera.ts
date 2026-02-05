/**
 * 相机适配器接口
 *
 * Core 层通过此接口调用相机/相册功能，
 * UI 层提供基于 uni.chooseImage 的具体实现
 */

export interface CameraResult {
  /** 图片临时路径 */
  tempFilePath: string
  /** 图片大小 (bytes) */
  size: number
}

export interface ICamera {
  /** 拍照 */
  takePicture(): Promise<CameraResult>
  /** 从相册选择 */
  chooseFromAlbum(): Promise<CameraResult>
}
