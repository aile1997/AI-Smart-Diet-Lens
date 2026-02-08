# 食材百科数据实施指南

> **目标**: 构建可快速访问的食材数据库，支持中国 + 国际用户
> **预期数据量**: 5000+ 食材，含图片

---

## 一、数据来源分析

### 1.1 推荐数据源对比

| 数据源 | 数据量 | 中文支持 | 许可证 | 推荐度 |
|--------|--------|----------|--------|--------|
| **USDA FoodData Central** | 300,000+ | ❌ 需翻译 | 公共领域 (免费) | ⭐⭐⭐⭐⭐ |
| **Open Food Facts** | 2,000,000+ | ✅ 部分 | ODbL (开源) | ⭐⭐⭐⭐ |
| **中国食物成分表** | 2,000+ | ✅ 原生 | 需授权 | ⭐⭐⭐ |
| **FatSecret API** | 丰富 | ✅ 有 | 商业 API | ⭐⭐⭐ |

### 1.2 推荐组合策略

```
MVP 阶段数据构成:
├── USDA 核心食材 (筛选 3000 条常见食材)
├── 中国特色食材 (手工整理 500 条)
├── Open Food Facts 补充 (1500 条)
└── 总计: ~5000 条
```

---

## 二、USDA 数据获取步骤

### 2.1 下载 USDA 数据

```bash
# 步骤 1: 下载 USDA FoodData Central 数据
# 访问: https://fdc.nal.usda.gov/download-datasets.html
# 选择: "Foundation Foods" 或 "SR Legacy" (更适合 MVP)

# 创建数据目录
mkdir -p backend/prisma/seed-data

# 下载 SR Legacy (约 35MB)
cd backend/prisma/seed-data
curl -L -o FoodData_Central_sr_legacy_food_json_2021-10-28.zip \
  "https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_json_2021-10-28.zip"

# 解压
unzip FoodData_Central_sr_legacy_food_json_2021-10-28.zip
```

### 2.2 数据结构说明

```json
// USDA 原始数据结构
{
  "fdcId": 167512,
  "description": "Apples, raw, with skin",
  "foodNutrients": [
    {
      "nutrientId": 1008,
      "nutrientName": "Energy",
      "unitName": "KCAL",
      "value": 52
    },
    {
      "nutrientId": 1003,
      "nutrientName": "Protein",
      "unitName": "G",
      "value": 0.26
    }
    // ... 更多营养素
  ]
}
```

### 2.3 数据转换脚本

```typescript
// backend/prisma/scripts/transform-usda.ts
import * as fs from 'fs'
import * as path from 'path'

interface USDAFood {
  fdcId: number
  description: string
  foodNutrients: Array<{
    nutrientId: number
    nutrientName: string
    unitName: string
    value: number
  }>
}

interface TransformedFood {
  id: string
  nameEn: string
  nameCn: string
  category: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sodium: number
  sugar: number
}

// 营养素 ID 映射
const NUTRIENT_IDS = {
  ENERGY: 1008,      // 热量 (kcal)
  PROTEIN: 1003,     // 蛋白质 (g)
  FAT: 1004,         // 脂肪 (g)
  CARBS: 1005,       // 碳水化合物 (g)
  FIBER: 1079,       // 膳食纤维 (g)
  SUGAR: 2000,       // 糖 (g)
  SODIUM: 1093,      // 钠 (mg)
}

// 食物分类关键词映射
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  '蔬菜': ['vegetable', 'lettuce', 'spinach', 'carrot', 'broccoli', 'cabbage', 'tomato'],
  '水果': ['fruit', 'apple', 'banana', 'orange', 'grape', 'berry', 'melon'],
  '肉类': ['beef', 'pork', 'chicken', 'lamb', 'meat', 'poultry'],
  '海鲜': ['fish', 'salmon', 'tuna', 'shrimp', 'crab', 'seafood', 'shellfish'],
  '谷物': ['rice', 'wheat', 'bread', 'pasta', 'cereal', 'grain', 'oat'],
  '豆类': ['bean', 'lentil', 'pea', 'soy', 'tofu', 'legume'],
  '乳制品': ['milk', 'cheese', 'yogurt', 'cream', 'butter', 'dairy'],
  '零食': ['snack', 'chip', 'cookie', 'candy', 'chocolate', 'cake'],
  '饮品': ['juice', 'coffee', 'tea', 'soda', 'drink', 'beverage'],
  '调味品': ['sauce', 'oil', 'vinegar', 'spice', 'salt', 'sugar', 'condiment'],
}

// 常见食物中英文映射 (可扩展)
const TRANSLATION_MAP: Record<string, string> = {
  'apple': '苹果',
  'banana': '香蕉',
  'orange': '橙子',
  'chicken': '鸡肉',
  'beef': '牛肉',
  'pork': '猪肉',
  'rice': '米饭',
  'bread': '面包',
  'milk': '牛奶',
  'egg': '鸡蛋',
  'fish': '鱼',
  'tomato': '番茄',
  'potato': '土豆',
  'carrot': '胡萝卜',
  'broccoli': '西兰花',
  'spinach': '菠菜',
  'cheese': '奶酪',
  'yogurt': '酸奶',
  'salmon': '三文鱼',
  'shrimp': '虾',
  // ... 更多映射
}

function getNutrientValue(food: USDAFood, nutrientId: number): number {
  const nutrient = food.foodNutrients.find(n => n.nutrientId === nutrientId)
  return nutrient?.value || 0
}

function categorizeFood(description: string): string {
  const lowerDesc = description.toLowerCase()
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lowerDesc.includes(kw))) {
      return category
    }
  }
  return '其他'
}

function translateToChineseSimple(description: string): string {
  const lowerDesc = description.toLowerCase()
  for (const [en, cn] of Object.entries(TRANSLATION_MAP)) {
    if (lowerDesc.includes(en)) {
      return cn
    }
  }
  // 返回原文，后续可用 AI 批量翻译
  return description
}

async function transformUSDAData() {
  console.log('开始转换 USDA 数据...')

  // 读取原始数据
  const rawData = fs.readFileSync(
    path.join(__dirname, '../seed-data/FoodData_Central_sr_legacy_food_json_2021-10-28.json'),
    'utf-8'
  )
  const usdaFoods: USDAFood[] = JSON.parse(rawData).SRLegacyFoods

  console.log(`原始数据: ${usdaFoods.length} 条`)

  // 筛选和转换
  const transformedFoods: TransformedFood[] = []
  const seenNames = new Set<string>()

  for (const food of usdaFoods) {
    // 跳过重复
    if (seenNames.has(food.description)) continue
    seenNames.add(food.description)

    // 获取营养素
    const calories = getNutrientValue(food, NUTRIENT_IDS.ENERGY)

    // 跳过无热量数据的食物
    if (calories === 0) continue

    const transformed: TransformedFood = {
      id: `usda_${food.fdcId}`,
      nameEn: food.description,
      nameCn: translateToChineseSimple(food.description),
      category: categorizeFood(food.description),
      calories: Math.round(calories),
      protein: Math.round(getNutrientValue(food, NUTRIENT_IDS.PROTEIN) * 10) / 10,
      carbs: Math.round(getNutrientValue(food, NUTRIENT_IDS.CARBS) * 10) / 10,
      fat: Math.round(getNutrientValue(food, NUTRIENT_IDS.FAT) * 10) / 10,
      fiber: Math.round(getNutrientValue(food, NUTRIENT_IDS.FIBER) * 10) / 10,
      sodium: Math.round(getNutrientValue(food, NUTRIENT_IDS.SODIUM)),
      sugar: Math.round(getNutrientValue(food, NUTRIENT_IDS.SUGAR) * 10) / 10,
    }

    transformedFoods.push(transformed)
  }

  // 按分类排序
  transformedFoods.sort((a, b) => a.category.localeCompare(b.category))

  // 保存转换后的数据
  const outputPath = path.join(__dirname, '../seed-data/foods-transformed.json')
  fs.writeFileSync(outputPath, JSON.stringify(transformedFoods, null, 2))

  console.log(`转换完成: ${transformedFoods.length} 条`)
  console.log(`输出文件: ${outputPath}`)

  // 输出分类统计
  const categoryStats: Record<string, number> = {}
  for (const food of transformedFoods) {
    categoryStats[food.category] = (categoryStats[food.category] || 0) + 1
  }
  console.log('分类统计:', categoryStats)
}

transformUSDAData().catch(console.error)
```

### 2.4 运行转换脚本

```bash
# 安装依赖
cd backend
pnpm add -D ts-node

# 运行转换脚本
npx ts-node prisma/scripts/transform-usda.ts
```

---

## 三、中文翻译优化

### 3.1 使用 AI 批量翻译

```typescript
// backend/prisma/scripts/translate-foods.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import * as fs from 'fs'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

interface Food {
  id: string
  nameEn: string
  nameCn: string
}

async function translateBatch(foods: Food[]): Promise<Food[]> {
  // 每批 50 个，避免 token 限制
  const batch = foods.slice(0, 50)
  const names = batch.map(f => f.nameEn).join('\n')

  const prompt = `将以下食物名称翻译成简体中文，每行一个，保持顺序：
${names}

只返回翻译结果，每行一个中文名称。`

  const result = await model.generateContent(prompt)
  const translations = result.response.text().split('\n').filter(Boolean)

  return batch.map((food, i) => ({
    ...food,
    nameCn: translations[i] || food.nameCn,
  }))
}

async function translateAllFoods() {
  const foods: Food[] = JSON.parse(
    fs.readFileSync('prisma/seed-data/foods-transformed.json', 'utf-8')
  )

  // 筛选未翻译的 (nameCn === nameEn)
  const needTranslation = foods.filter(f => f.nameCn === f.nameEn)
  console.log(`需要翻译: ${needTranslation.length} 条`)

  const translated: Food[] = []
  const BATCH_SIZE = 50

  for (let i = 0; i < needTranslation.length; i += BATCH_SIZE) {
    const batch = needTranslation.slice(i, i + BATCH_SIZE)
    console.log(`翻译进度: ${i}/${needTranslation.length}`)

    const result = await translateBatch(batch)
    translated.push(...result)

    // 限速：每分钟 60 次请求
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // 合并翻译结果
  const translatedMap = new Map(translated.map(f => [f.id, f.nameCn]))
  const finalFoods = foods.map(f => ({
    ...f,
    nameCn: translatedMap.get(f.id) || f.nameCn,
  }))

  fs.writeFileSync(
    'prisma/seed-data/foods-final.json',
    JSON.stringify(finalFoods, null, 2)
  )

  console.log('翻译完成!')
}

translateAllFoods().catch(console.error)
```

### 3.2 翻译成本估算

```
USDA 3000 条食材名称翻译:
- 平均名称长度: 30 字符
- 总 token: ~50,000 (输入) + ~30,000 (输出)
- Gemini Flash 价格: $0.075/1M 输入 + $0.30/1M 输出
- 成本: < $0.05 (几乎免费)
```

---

## 四、中国特色食材补充

### 4.1 手工整理清单

```typescript
// backend/prisma/seed-data/chinese-foods.ts
export const chineseFoods = [
  // 蔬菜
  { nameCn: '白菜', nameEn: 'Chinese Cabbage', category: '蔬菜', calories: 13, protein: 1.5, carbs: 2.2, fat: 0.2 },
  { nameCn: '青菜', nameEn: 'Bok Choy', category: '蔬菜', calories: 13, protein: 1.5, carbs: 2.2, fat: 0.2 },
  { nameCn: '空心菜', nameEn: 'Water Spinach', category: '蔬菜', calories: 19, protein: 2.6, carbs: 3.1, fat: 0.2 },
  { nameCn: '韭菜', nameEn: 'Chinese Chives', category: '蔬菜', calories: 26, protein: 2.4, carbs: 4.4, fat: 0.3 },
  { nameCn: '芥蓝', nameEn: 'Chinese Broccoli', category: '蔬菜', calories: 26, protein: 1.2, carbs: 5.6, fat: 0.3 },
  { nameCn: '茼蒿', nameEn: 'Garland Chrysanthemum', category: '蔬菜', calories: 24, protein: 1.9, carbs: 4.3, fat: 0.3 },
  { nameCn: '莴笋', nameEn: 'Celtuce', category: '蔬菜', calories: 15, protein: 0.9, carbs: 2.8, fat: 0.1 },
  { nameCn: '藕', nameEn: 'Lotus Root', category: '蔬菜', calories: 74, protein: 2.6, carbs: 17.2, fat: 0.1 },
  { nameCn: '冬瓜', nameEn: 'Winter Melon', category: '蔬菜', calories: 12, protein: 0.4, carbs: 2.6, fat: 0.2 },
  { nameCn: '丝瓜', nameEn: 'Loofah', category: '蔬菜', calories: 20, protein: 1.0, carbs: 4.4, fat: 0.2 },

  // 豆制品
  { nameCn: '豆腐', nameEn: 'Tofu', category: '豆类', calories: 76, protein: 8.1, carbs: 1.9, fat: 4.2 },
  { nameCn: '豆腐干', nameEn: 'Dried Tofu', category: '豆类', calories: 140, protein: 16.2, carbs: 4.9, fat: 6.0 },
  { nameCn: '豆腐皮', nameEn: 'Tofu Skin', category: '豆类', calories: 409, protein: 44.6, carbs: 18.8, fat: 17.4 },
  { nameCn: '腐竹', nameEn: 'Dried Bean Curd Sticks', category: '豆类', calories: 459, protein: 44.6, carbs: 22.3, fat: 21.7 },
  { nameCn: '豆浆', nameEn: 'Soy Milk', category: '豆类', calories: 54, protein: 3.3, carbs: 6.3, fat: 1.8 },

  // 主食
  { nameCn: '米饭', nameEn: 'Steamed Rice', category: '谷物', calories: 116, protein: 2.6, carbs: 25.6, fat: 0.3 },
  { nameCn: '馒头', nameEn: 'Steamed Bun', category: '谷物', calories: 223, protein: 7.0, carbs: 45.7, fat: 1.1 },
  { nameCn: '面条', nameEn: 'Noodles', category: '谷物', calories: 284, protein: 8.3, carbs: 59.5, fat: 0.9 },
  { nameCn: '饺子', nameEn: 'Dumplings', category: '谷物', calories: 239, protein: 7.6, carbs: 34.4, fat: 7.6 },
  { nameCn: '包子', nameEn: 'Steamed Stuffed Bun', category: '谷物', calories: 227, protein: 7.0, carbs: 39.1, fat: 4.8 },
  { nameCn: '油条', nameEn: 'Fried Dough Stick', category: '谷物', calories: 386, protein: 6.9, carbs: 51.0, fat: 17.6 },
  { nameCn: '粥', nameEn: 'Rice Porridge', category: '谷物', calories: 46, protein: 1.1, carbs: 10.0, fat: 0.1 },

  // 肉类
  { nameCn: '五花肉', nameEn: 'Pork Belly', category: '肉类', calories: 395, protein: 13.2, carbs: 0, fat: 37.0 },
  { nameCn: '排骨', nameEn: 'Spare Ribs', category: '肉类', calories: 278, protein: 18.3, carbs: 0, fat: 22.0 },
  { nameCn: '猪蹄', nameEn: 'Pig Trotters', category: '肉类', calories: 260, protein: 22.6, carbs: 0, fat: 18.8 },
  { nameCn: '鸡胸肉', nameEn: 'Chicken Breast', category: '肉类', calories: 133, protein: 23.3, carbs: 0.4, fat: 3.6 },
  { nameCn: '鸭肉', nameEn: 'Duck Meat', category: '肉类', calories: 240, protein: 15.5, carbs: 0, fat: 19.7 },

  // 海鲜
  { nameCn: '带鱼', nameEn: 'Hairtail', category: '海鲜', calories: 127, protein: 17.7, carbs: 0, fat: 6.1 },
  { nameCn: '鲫鱼', nameEn: 'Crucian Carp', category: '海鲜', calories: 108, protein: 17.1, carbs: 0, fat: 4.2 },
  { nameCn: '草鱼', nameEn: 'Grass Carp', category: '海鲜', calories: 112, protein: 16.6, carbs: 0, fat: 5.2 },
  { nameCn: '虾仁', nameEn: 'Shrimp Meat', category: '海鲜', calories: 87, protein: 18.3, carbs: 0.9, fat: 0.7 },
  { nameCn: '蛤蜊', nameEn: 'Clam', category: '海鲜', calories: 62, protein: 10.1, carbs: 2.2, fat: 1.1 },

  // 调味品
  { nameCn: '酱油', nameEn: 'Soy Sauce', category: '调味品', calories: 53, protein: 5.6, carbs: 5.4, fat: 0.1 },
  { nameCn: '醋', nameEn: 'Vinegar', category: '调味品', calories: 21, protein: 0.4, carbs: 0.8, fat: 0 },
  { nameCn: '蚝油', nameEn: 'Oyster Sauce', category: '调味品', calories: 85, protein: 1.0, carbs: 19.1, fat: 0.1 },
  { nameCn: '豆瓣酱', nameEn: 'Doubanjiang', category: '调味品', calories: 131, protein: 8.2, carbs: 14.6, fat: 4.5 },
  { nameCn: '老干妈', nameEn: 'Lao Gan Ma Chili Sauce', category: '调味品', calories: 718, protein: 3.5, carbs: 10.0, fat: 74.0 },

  // 水果
  { nameCn: '荔枝', nameEn: 'Lychee', category: '水果', calories: 66, protein: 0.8, carbs: 16.5, fat: 0.4 },
  { nameCn: '龙眼', nameEn: 'Longan', category: '水果', calories: 60, protein: 1.3, carbs: 15.2, fat: 0.1 },
  { nameCn: '杨梅', nameEn: 'Bayberry', category: '水果', calories: 28, protein: 0.8, carbs: 5.7, fat: 0.2 },
  { nameCn: '枇杷', nameEn: 'Loquat', category: '水果', calories: 39, protein: 0.8, carbs: 9.3, fat: 0.1 },
  { nameCn: '山竹', nameEn: 'Mangosteen', category: '水果', calories: 73, protein: 0.4, carbs: 18.0, fat: 0.6 },
]
```

---

## 五、图片获取策略

### 5.1 免费图片 API

```typescript
// backend/prisma/scripts/download-images.ts
import { createClient } from 'pexels'
import { createApi } from 'unsplash-js'
import fetch from 'node-fetch'
import * as fs from 'fs'
import sharp from 'sharp'

// Pexels API (免费，每月 20,000 请求)
const pexels = createClient(process.env.PEXELS_API_KEY!)

// Unsplash API (免费，每小时 50 请求)
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
  fetch: fetch as any,
})

interface FoodImage {
  foodId: string
  foodName: string
  imageUrl: string
  thumbnailUrl: string
}

async function searchPexelsImage(query: string): Promise<string | null> {
  try {
    const result = await pexels.photos.search({
      query: `${query} food`,
      per_page: 1,
      orientation: 'square',
    })

    if ('photos' in result && result.photos.length > 0) {
      return result.photos[0].src.medium
    }
  } catch (e) {
    console.error(`Pexels 搜索失败: ${query}`, e)
  }
  return null
}

async function searchUnsplashImage(query: string): Promise<string | null> {
  try {
    const result = await unsplash.search.getPhotos({
      query: `${query} food`,
      perPage: 1,
      orientation: 'squarish',
    })

    if (result.response?.results.length) {
      return result.response.results[0].urls.regular
    }
  } catch (e) {
    console.error(`Unsplash 搜索失败: ${query}`, e)
  }
  return null
}

async function downloadAndProcess(
  imageUrl: string,
  foodId: string,
  outputDir: string
): Promise<{ main: string; thumb: string }> {
  // 下载图片
  const response = await fetch(imageUrl)
  const buffer = await response.buffer()

  // 处理为 WebP 格式
  const mainPath = `${outputDir}/${foodId}.webp`
  const thumbPath = `${outputDir}/${foodId}_thumb.webp`

  // 主图 (800x800)
  await sharp(buffer)
    .resize(800, 800, { fit: 'cover' })
    .webp({ quality: 85 })
    .toFile(mainPath)

  // 缩略图 (200x200)
  await sharp(buffer)
    .resize(200, 200, { fit: 'cover' })
    .webp({ quality: 75 })
    .toFile(thumbPath)

  return { main: mainPath, thumb: thumbPath }
}

async function downloadFoodImages() {
  const foods = JSON.parse(
    fs.readFileSync('prisma/seed-data/foods-final.json', 'utf-8')
  )

  const outputDir = 'prisma/seed-data/images'
  fs.mkdirSync(outputDir, { recursive: true })

  const results: FoodImage[] = []

  for (let i = 0; i < foods.length; i++) {
    const food = foods[i]
    console.log(`下载进度: ${i + 1}/${foods.length} - ${food.nameCn}`)

    // 优先使用英文名搜索
    let imageUrl = await searchPexelsImage(food.nameEn)

    if (!imageUrl) {
      imageUrl = await searchUnsplashImage(food.nameEn)
    }

    if (imageUrl) {
      try {
        const paths = await downloadAndProcess(imageUrl, food.id, outputDir)
        results.push({
          foodId: food.id,
          foodName: food.nameCn,
          imageUrl: paths.main,
          thumbnailUrl: paths.thumb,
        })
      } catch (e) {
        console.error(`处理图片失败: ${food.nameCn}`, e)
      }
    }

    // 限速: 每秒 1 个请求
    await new Promise(r => setTimeout(r, 1000))
  }

  // 保存图片映射
  fs.writeFileSync(
    'prisma/seed-data/image-mapping.json',
    JSON.stringify(results, null, 2)
  )

  console.log(`图片下载完成: ${results.length}/${foods.length}`)
}

downloadFoodImages().catch(console.error)
```

### 5.2 图片存储估算

```
5000 张食材图片存储估算:

主图 (800x800 WebP):
  - 平均大小: ~80KB
  - 总计: 5000 × 80KB = 400MB

缩略图 (200x200 WebP):
  - 平均大小: ~15KB
  - 总计: 5000 × 15KB = 75MB

总存储: ~500MB (远低于 R2 免费额度 10GB)
```

---

## 六、数据库导入

### 6.1 更新 Prisma Schema

```prisma
// backend/prisma/schema.prisma

model Food {
  id          String   @id @default(cuid())
  nameEn      String   @map("name_en")
  nameCn      String   @map("name_cn")
  category    String
  description String?

  // 营养成分 (每 100g)
  calories    Int      // 热量 (kcal)
  protein     Float    // 蛋白质 (g)
  carbs       Float    // 碳水化合物 (g)
  fat         Float    // 脂肪 (g)
  fiber       Float    @default(0) // 膳食纤维 (g)
  sodium      Float    @default(0) // 钠 (mg)
  sugar       Float    @default(0) // 糖 (g)

  // 图片
  imageUrl    String?  @map("image_url")
  thumbUrl    String?  @map("thumb_url")

  // 元数据
  source      String   @default("usda") // usda, custom, user
  verified    Boolean  @default(true)

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // 关联
  diaryEntries DiaryEntry[]
  favorites    Favorite[]

  @@index([category])
  @@index([nameCn])
  @@index([nameEn])
  @@map("foods")
}
```

### 6.2 Seed 脚本

```typescript
// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始导入食材数据...')

  // 读取转换后的数据
  const foods = JSON.parse(
    fs.readFileSync('prisma/seed-data/foods-final.json', 'utf-8')
  )

  // 读取图片映射
  let imageMapping: Record<string, { imageUrl: string; thumbUrl: string }> = {}
  try {
    const images = JSON.parse(
      fs.readFileSync('prisma/seed-data/image-mapping.json', 'utf-8')
    )
    imageMapping = Object.fromEntries(
      images.map((img: any) => [img.foodId, { imageUrl: img.imageUrl, thumbUrl: img.thumbnailUrl }])
    )
  } catch (e) {
    console.log('未找到图片映射文件，跳过图片')
  }

  // 批量导入
  const BATCH_SIZE = 100
  let imported = 0

  for (let i = 0; i < foods.length; i += BATCH_SIZE) {
    const batch = foods.slice(i, i + BATCH_SIZE)

    await prisma.food.createMany({
      data: batch.map((food: any) => ({
        id: food.id,
        nameEn: food.nameEn,
        nameCn: food.nameCn,
        category: food.category,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        fiber: food.fiber || 0,
        sodium: food.sodium || 0,
        sugar: food.sugar || 0,
        imageUrl: imageMapping[food.id]?.imageUrl || null,
        thumbUrl: imageMapping[food.id]?.thumbUrl || null,
        source: 'usda',
        verified: true,
      })),
      skipDuplicates: true,
    })

    imported += batch.length
    console.log(`导入进度: ${imported}/${foods.length}`)
  }

  console.log('食材数据导入完成!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

### 6.3 运行导入

```bash
# 生成 Prisma Client
npx prisma generate

# 执行数据库迁移
npx prisma migrate dev --name add-food-model

# 运行 Seed 脚本
npx prisma db seed
```

---

## 七、中国访问优化 (确保快速访问)

### 7.1 方案对比

| 方案 | 中国延迟 | 成本 | 复杂度 | 推荐 |
|------|----------|------|--------|------|
| **Cloudflare R2 + CDN** | 100-300ms | 免费 | 低 | ✅ MVP 首选 |
| 阿里云 OSS + CDN | 30-80ms | ¥100/月 | 中 | 正式版 |
| 腾讯云 COS + CDN | 30-80ms | ¥100/月 | 中 | 正式版 |
| 混合部署 | 最优 | ¥150/月 | 高 | 规模化 |

### 7.2 Cloudflare R2 配置 (MVP 推荐)

```bash
# 步骤 1: 创建 R2 存储桶
# 登录 Cloudflare Dashboard → R2 → Create Bucket
# 名称: diet-lens-foods

# 步骤 2: 获取 API 凭证
# R2 → Manage R2 API Tokens → Create API Token

# 步骤 3: 配置环境变量
cat >> backend/.env << 'EOF'
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=diet-lens-foods
R2_PUBLIC_URL=https://pub-xxx.r2.dev
EOF
```

### 7.3 图片上传到 R2

```typescript
// backend/src/modules/upload/r2.service.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class R2Service {
  private readonly s3: S3Client

  constructor() {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })
  }

  async uploadFoodImages(imageDir: string): Promise<void> {
    const files = fs.readdirSync(imageDir).filter(f => f.endsWith('.webp'))

    for (const file of files) {
      const filePath = path.join(imageDir, file)
      const fileContent = fs.readFileSync(filePath)

      await this.s3.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `foods/${file}`,
        Body: fileContent,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000', // 1 年缓存
      }))

      console.log(`上传: ${file}`)
    }

    console.log(`上传完成: ${files.length} 个文件`)
  }

  getPublicUrl(key: string): string {
    return `${process.env.R2_PUBLIC_URL}/${key}`
  }
}
```

### 7.4 配置 Cloudflare CDN 缓存

```yaml
# Cloudflare 页面规则配置

规则 1: 食材图片长期缓存
  URL: pub-xxx.r2.dev/foods/*
  设置:
    - Cache Level: Cache Everything
    - Edge Cache TTL: 1 month
    - Browser Cache TTL: 1 year

规则 2: 中国访问优化
  URL: *diet-lens.app/*
  设置:
    - Auto Minify: JavaScript, CSS, HTML
    - Polish: Lossy (图片压缩)
    - Mirage: On (智能图片加载)
    - Rocket Loader: On
```

### 7.5 中国访问测试

```bash
# 测试中国不同地区的访问延迟
# 使用 https://www.17ce.com 或 https://www.boce.com

# 测试 URL:
# 1. https://pub-xxx.r2.dev/foods/apple.webp (R2 直连)
# 2. https://cdn.diet-lens.app/foods/apple.webp (自定义域名 + CDN)

# 预期结果:
# - 北上广深: 100-200ms
# - 二三线城市: 150-300ms
# - 偏远地区: 200-400ms
```

---

## 八、备用方案：阿里云 OSS (中国最快)

如果 Cloudflare 在中国访问不稳定，可使用阿里云：

### 8.1 阿里云 OSS 配置

```bash
# 步骤 1: 创建 OSS Bucket
# 登录阿里云 → 对象存储 OSS → 创建 Bucket
# - 名称: diet-lens-foods
# - 地域: 华东1 (杭州) 或 华北2 (北京)
# - 读写权限: 公共读

# 步骤 2: 配置 CDN
# 登录阿里云 → CDN → 添加域名
# - 加速域名: cdn.diet-lens.app
# - 源站: diet-lens-foods.oss-cn-hangzhou.aliyuncs.com
# - 缓存配置: 图片 30 天

# 步骤 3: 配置环境变量
cat >> backend/.env << 'EOF'
ALIYUN_OSS_REGION=oss-cn-hangzhou
ALIYUN_OSS_ACCESS_KEY=your_access_key
ALIYUN_OSS_SECRET_KEY=your_secret_key
ALIYUN_OSS_BUCKET=diet-lens-foods
ALIYUN_CDN_URL=https://cdn.diet-lens.app
EOF
```

### 8.2 成本估算 (阿里云)

```
月度成本 (5000 张图片, 1 万用户):

存储费用:
  - 500MB × ¥0.12/GB = ¥0.06

CDN 流量 (假设每用户每天加载 50 张缩略图):
  - 50 × 15KB × 30天 × 10000用户 = 225GB
  - 225GB × ¥0.24/GB = ¥54

总计: ~¥55/月 (约 $8)
```

---

## 九、实施检查清单

### 9.1 数据准备阶段

```
[ ] 下载 USDA FoodData Central 数据
[ ] 运行数据转换脚本
[ ] 运行 AI 翻译脚本
[ ] 添加中国特色食材
[ ] 合并并验证最终数据
```

### 9.2 图片处理阶段

```
[ ] 申请 Pexels API Key
[ ] 申请 Unsplash API Key
[ ] 运行图片下载脚本
[ ] 验证图片质量
[ ] 处理缺失图片 (使用占位图)
```

### 9.3 存储部署阶段

```
[ ] 创建 Cloudflare R2 Bucket
[ ] 上传图片到 R2
[ ] 配置公共访问
[ ] 配置 CDN 缓存规则
[ ] 中国访问速度测试
```

### 9.4 数据库导入阶段

```
[ ] 更新 Prisma Schema
[ ] 执行数据库迁移
[ ] 运行 Seed 脚本
[ ] 验证数据完整性
[ ] API 接口测试
```

---

## 十、常见问题

### Q1: USDA 数据是英文的，用户搜索中文怎么办？

**解决方案**:
1. 数据库同时存储 `nameEn` 和 `nameCn`
2. 搜索时同时匹配中英文字段
3. 使用 PostgreSQL 全文搜索或 Elasticsearch

```sql
-- 搜索示例
SELECT * FROM foods
WHERE name_cn ILIKE '%苹果%'
   OR name_en ILIKE '%apple%'
ORDER BY
  CASE WHEN name_cn = '苹果' THEN 0 ELSE 1 END,
  name_cn
LIMIT 20;
```

### Q2: 图片加载慢怎么办？

**解决方案**:
1. 列表页使用缩略图 (200x200)
2. 详情页使用主图 (800x800)
3. 使用懒加载 (`lazy-load` 属性)
4. 配置 CDN 边缘缓存

### Q3: Cloudflare 在中国部分地区访问慢？

**解决方案**:
1. 短期: 接受 200-400ms 延迟 (MVP 可接受)
2. 中期: 添加阿里云 OSS 作为中国源站
3. 长期: 混合部署，DNS 智能解析

---

**文档状态**: 可执行
**预计耗时**: 2-3 天完成全部步骤
**下一步**: 按照检查清单依次执行
