/**
 * 图片 URL 处理 Composable
 *
 * 统一处理静态图片 URL，支持从本地路径无缝切换到 COS
 */
import { toCosUrl } from '@/config/images'

/**
 * 获取图片 URL
 *
 * 自动将本地路径转换为 COS URL
 *
 * @param path 本地路径或 COS URL
 * @returns 最终的图片 URL
 *
 * @example
 * ```vue
 * <script setup>
 * const { getImageUrl } = useImage()
 * </script>
 *
 * <template>
 *   <image :src="getImageUrl('/static/images/food/food_1.jpg')" />
 * </template>
 * ```
 */
export function useImage() {
  /**
   * 获取图片 URL
   */
  function getImageUrl(path: string): string {
    // 如果已经是完整的 URL，直接返回
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    // 否则尝试转换为 COS URL
    return toCosUrl(path)
  }

  /**
   * 批量获取图片 URL
   */
  function getImageUrls(paths: string[]): string[] {
    return paths.map(getImageUrl)
  }

  return {
    getImageUrl,
    getImageUrls,
  }
}
