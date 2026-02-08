/**
 * 静态资源配置
 *
 * 使用腾讯云 COS + 数据万象托管静态图片
 * 支持自动 WebP 转换，压缩率达 50%-80%
 */

/**
 * COS 基础配置
 */
export const COS_CONFIG = {
  bucket: 'smart-diet-1622598684-1309736368',
  region: 'ap-beijing',
  baseUrl: 'https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com',
}

/**
 * 静态资源文件夹路径
 */
export const STATIC_PATHS = {
  food: 'public_assets/food',      // 食物图片
  avatars: 'public_assets/avatars', // 用户头像
  recipes: 'public_assets/recipes', // 食谱图片
}

/**
 * 生成 COS 图片 URL（带 WebP 压缩）
 *
 * @param folder 文件夹路径
 * @param filename 文件名
 * @param options 可选参数
 * @returns 完整的 COS URL
 *
 * @example
 * ```ts
 * // 基础用法
 * const url = getCosImageUrl('food', 'food_1.jpg')
 * // => https://.../public_assets/food/food_1.jpg
 *
 * // 带压缩参数
 * const url = getCosImageUrl('food', 'food_1.jpg', { webp: true, quality: 80 })
 * // => https://.../food_1.jpg?imageMogr2/format/webp/quality/80
 * ```
 */
export function getCosImageUrl(
  folder: keyof typeof STATIC_PATHS,
  filename: string,
  options: {
    webp?: boolean      // 转换为 WebP 格式（推荐）
    quality?: number    // 图片质量 1-100（默认 85）
    width?: number      // 限制宽度
    height?: number     // 限制高度
  } = {}
): string {
  const { webp = true, quality = 85, width, height } = options

  // 构建 COS URL
  let url = `${COS_CONFIG.baseUrl}/${STATIC_PATHS[folder]}/${filename}`

  // 添加数据万象处理参数
  const params: string[] = []

  if (webp) {
    params.push('format/webp')
  }

  if (quality !== 85) {
    params.push(`quality/${quality}`)
  }

  if (width || height) {
    const resize = width && height
      ? `thumbnail/${width}x${height}`
      : width
        ? `thumbnail/${width}x`
        : `thumbnail/x${height}`
    params.push(resize)
  }

  if (params.length > 0) {
    url += `?imageMogr2/${params.join('/')}`
  }

  return url
}

/**
 * 获取食物图片 URL
 *
 * @param filename 文件名（如 'food_1.jpg'）
 * @returns COS URL
 */
export function getFoodImageUrl(filename: string): string {
  return getCosImageUrl('food', filename)
}

/**
 * 常用食物图片映射表
 *
 * 将本地路径映射到 COS URL
 */
export const FOOD_IMAGES = {
  // 本地路径 -> COS 文件名映射
  '/static/images/food/food_1.jpg': 'food_1.jpg',
  '/static/images/food/food_2.jpg': 'food_2.jpg',
  '/static/images/food/food_3.jpg': 'food_3.jpg',
  '/static/images/food/food_4.jpg': 'food_4.jpg',
  '/static/images/food/food_5.jpg': 'food_5.jpg',
  '/static/images/food/food_6.jpg': 'food_6.jpg',
  '/static/images/food/food_7.jpg': 'food_7.jpg',
  '/static/images/food/food_8.jpg': 'food_8.jpg',
  '/static/images/food/food_9.jpg': 'food_9.jpg',
  '/static/images/food/food_10.jpg': 'food_10.jpg',
  '/static/images/food/food_11.jpg': 'food_11.jpg',
  '/static/images/food/food_12.jpg': 'food_12.jpg',
  '/static/images/food/food_13.jpg': 'food_13.jpg',
  '/static/images/food/food_14.jpg': 'food_14.jpg',
  '/static/images/food/food_15.jpg': 'food_15.jpg',
  '/static/images/food/food_16.jpg': 'food_16.jpg',
  '/static/images/food/food_17.jpg': 'food_17.jpg',
  '/static/images/food/food_18.jpg': 'food_18.jpg',
  '/static/images/food/food_19.jpg': 'food_19.jpg',
  '/static/images/food/food_20.jpg': 'food_20.jpg',
  '/static/images/food/food_21.jpg': 'food_21.jpg',
  '/static/images/food/food_22.jpg': 'food_22.jpg',
  '/static/images/food/food_23.jpg': 'food_23.jpg',
  '/static/images/food/food_24.jpg': 'food_24.jpg',
  '/static/images/food/food_25.jpg': 'food_25.jpg',
  '/static/images/food/food_27.jpg': 'food_27.jpg',
  '/static/images/food/food_28.jpg': 'food_28.jpg',
  '/static/images/food/food_29.jpg': 'food_29.jpg',
  '/static/images/food/food_30.jpg': 'food_30.jpg',
} as const

/**
 * 将本地图片路径转换为 COS URL
 *
 * @param localPath 本地路径（如 '/static/images/food/food_1.jpg'）
 * @returns COS URL
 */
export function toCosUrl(localPath: string): string {
  const filename = FOOD_IMAGES[localPath as keyof typeof FOOD_IMAGES]
  if (filename) {
    return getFoodImageUrl(filename)
  }
  // 如果没有映射，返回原路径（降级处理）
  return localPath
}
