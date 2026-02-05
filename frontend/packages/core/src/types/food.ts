/**
 * 食物与营养相关类型定义
 */

/** 营养成分 */
export interface NutritionInfo {
  /** 热量 (kcal) */
  calories: number
  /** 蛋白质 (g) */
  protein: number
  /** 碳水化合物 (g) */
  carbs: number
  /** 脂肪 (g) */
  fat: number
  /** 膳食纤维 (g) */
  fiber?: number
  /** 钠 (mg) */
  sodium?: number
}

/** 食物项 */
export interface FoodItem {
  id: string
  name: string
  /** 每 100g 的营养成分 */
  nutritionPer100g: NutritionInfo
  /** 份量 (g) */
  portion: number
  /** AI 识别置信度 (0-1) */
  confidence?: number
  /** 食物图片 URL */
  imageUrl?: string
  /** 食物类别 */
  category?: string
}

/** AI 食物识别结果 */
export interface FoodRecognitionResult {
  /** 识别到的食物列表 */
  foods: FoodItem[]
  /** 原始图片路径 */
  imagePath: string
  /** 识别时间戳 */
  recognizedAt: number
}

/** 食材百科信息 */
export interface FoodWikiItem {
  id: string
  name: string
  description: string
  /** AI 健康评分 (1-10) */
  healthScore: number
  nutrition: NutritionInfo
  /** 当季推荐 */
  inSeason: boolean
  /** 功效与作用 */
  benefits: string[]
  /** 食用禁忌 */
  cautions: string[]
}
