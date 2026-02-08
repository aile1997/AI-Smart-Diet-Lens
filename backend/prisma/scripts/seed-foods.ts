/**
 * 食材数据导入脚本
 * 将转换后的 USDA 数据和中国特色食材导入数据库
 *
 * 前置条件:
 * 1. 已运行 transform-usda.ts (可选)
 * 2. 已运行 translate-foods.ts (可选)
 * 3. chinese-foods.json 已存在
 *
 * 使用方法:
 * npx ts-node prisma/scripts/seed-foods.ts
 *
 * 可选参数:
 * --skip-usda    跳过 USDA 数据，只导入中国食材
 * --clear        清空现有食物数据后导入
 */
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface FoodData {
  id: string
  nameEn: string
  nameCn: string
  category: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sodium?: number
  sugar?: number
}

interface ImageMapping {
  foodId: string
  imageUrl: string
  thumbnailUrl: string
}

async function main() {
  const args = process.argv.slice(2)
  const skipUsda = args.includes('--skip-usda')
  const clearFirst = args.includes('--clear')

  const seedDataDir = path.join(__dirname, '../seed-data')

  console.log('🍎 开始导入食材数据...')
  console.log(`数据目录: ${seedDataDir}`)
  console.log('')

  // 清空现有数据 (可选)
  if (clearFirst) {
    console.log('⚠️ 清空现有食物数据...')
    await prisma.food.deleteMany({})
    console.log('✅ 已清空')
  }

  let allFoods: FoodData[] = []

  // 1. 加载 USDA 数据
  if (!skipUsda) {
    const usdaFiles = [
      'foods-final.json',
      'foods-translated.json',
      'foods-transformed.json',
    ]

    for (const file of usdaFiles) {
      const filePath = path.join(seedDataDir, file)
      if (fs.existsSync(filePath)) {
        const usdaFoods = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        allFoods = [...allFoods, ...usdaFoods]
        console.log(`📦 加载 USDA 数据: ${file} (${usdaFoods.length} 条)`)
        break
      }
    }

    if (allFoods.length === 0) {
      console.log('⚠️ 未找到 USDA 数据文件，跳过')
    }
  } else {
    console.log('⏭️ 跳过 USDA 数据')
  }

  // 2. 加载中国特色食材
  const chineseFoodsPath = path.join(seedDataDir, 'chinese-foods.json')
  if (fs.existsSync(chineseFoodsPath)) {
    const chineseFoods = JSON.parse(fs.readFileSync(chineseFoodsPath, 'utf-8'))
    allFoods = [...allFoods, ...chineseFoods]
    console.log(`🥢 加载中国食材: chinese-foods.json (${chineseFoods.length} 条)`)
  } else {
    console.log('⚠️ 未找到 chinese-foods.json')
  }

  if (allFoods.length === 0) {
    console.error('❌ 没有可导入的数据')
    process.exit(1)
  }

  // 3. 加载图片映射 (可选)
  let imageMapping = new Map<string, { imageUrl: string; thumbUrl: string }>()
  const imageMappingPath = path.join(seedDataDir, 'image-mapping.json')
  if (fs.existsSync(imageMappingPath)) {
    const images: ImageMapping[] = JSON.parse(fs.readFileSync(imageMappingPath, 'utf-8'))
    imageMapping = new Map(
      images.map(img => [img.foodId, { imageUrl: img.imageUrl, thumbUrl: img.thumbnailUrl }])
    )
    console.log(`🖼️ 加载图片映射: ${imageMapping.size} 张`)
  }

  // 4. 去重
  const uniqueFoods = new Map<string, FoodData>()
  for (const food of allFoods) {
    if (!uniqueFoods.has(food.id)) {
      uniqueFoods.set(food.id, food)
    }
  }

  console.log(`\n📊 统计:`)
  console.log(`  总数据: ${allFoods.length}`)
  console.log(`  去重后: ${uniqueFoods.size}`)
  console.log('')

  // 5. 批量导入
  const BATCH_SIZE = 100
  const foods = Array.from(uniqueFoods.values())
  let imported = 0
  let skipped = 0

  console.log('💾 开始写入数据库...')

  for (let i = 0; i < foods.length; i += BATCH_SIZE) {
    const batch = foods.slice(i, i + BATCH_SIZE)

    const data = batch.map(food => {
      const images = imageMapping.get(food.id)
      return {
        id: food.id,
        name: food.nameCn || food.nameEn, // 优先使用中文名
        nameEn: food.nameEn,
        category: food.category,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        fiber: food.fiber || 0,
        sodium: food.sodium || 0,
        sugar: food.sugar || 0,
        imageUrl: images?.imageUrl || null,
        thumbUrl: images?.thumbUrl || null,
      }
    })

    try {
      await prisma.food.createMany({
        data,
        skipDuplicates: true,
      })
      imported += batch.length
    } catch (error) {
      // 如果批量插入失败，尝试逐个插入
      for (const item of data) {
        try {
          await prisma.food.upsert({
            where: { id: item.id },
            update: {},
            create: item,
          })
          imported++
        } catch {
          skipped++
        }
      }
    }

    const progress = Math.round(((i + batch.length) / foods.length) * 100)
    process.stdout.write(`\r进度: ${progress}% (${imported}/${foods.length})`)
  }

  console.log('\n')
  console.log('✅ 导入完成!')
  console.log(`  成功: ${imported}`)
  console.log(`  跳过: ${skipped}`)

  // 6. 统计分类
  const categories = await prisma.food.groupBy({
    by: ['category'],
    _count: true,
  })

  console.log('\n📈 分类统计:')
  for (const cat of categories.sort((a, b) => b._count - a._count)) {
    console.log(`  ${cat.category}: ${cat._count}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
