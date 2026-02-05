/**
 * AI 食物识别组合式函数
 *
 * 通过适配器接口调用相机和 HTTP 服务，
 * 实现拍照识别食物的核心业务逻辑
 */

import { ref } from 'vue'
import type { IHttp } from '../adapters/IHttp'
import type { ICamera } from '../adapters/ICamera'
import type { FoodRecognitionResult } from '../types/food'

export function useFoodRecognition(http: IHttp, camera: ICamera) {
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const result = ref<FoodRecognitionResult | null>(null)

  /**
   * 拍照并识别食物
   */
  async function recognizeByCamera(): Promise<FoodRecognitionResult | null> {
    loading.value = true
    error.value = null

    try {
      const photo = await camera.takePicture()
      const response = await http.request<FoodRecognitionResult>({
        url: '/api/food/recognize',
        method: 'POST',
        data: { image: photo.tempFilePath },
      })
      result.value = response.data
      return response.data
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : '识别失败'
      return null
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 从相册选择图片并识别
   */
  async function recognizeByAlbum(): Promise<FoodRecognitionResult | null> {
    loading.value = true
    error.value = null

    try {
      const photo = await camera.chooseFromAlbum()
      const response = await http.request<FoodRecognitionResult>({
        url: '/api/food/recognize',
        method: 'POST',
        data: { image: photo.tempFilePath },
      })
      result.value = response.data
      return response.data
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : '识别失败'
      return null
    }
    finally {
      loading.value = false
    }
  }

  function clearResult() {
    result.value = null
    error.value = null
  }

  return {
    loading,
    error,
    result,
    recognizeByCamera,
    recognizeByAlbum,
    clearResult,
  }
}
