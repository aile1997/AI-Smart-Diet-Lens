/**
 * AI 翻译脚本
 * 使用 Gemini API 将英文食物名称翻译成中文
 *
 * 前置条件:
 * 1. 设置环境变量: GEMINI_API_KEY
 * 2. 已运行 transform-usda.ts 生成 foods-transformed.json
 *
 * 使用方法:
 * GEMINI_API_KEY=xxx npx ts-node prisma/scripts/translate-foods.ts
 */
import { GoogleGenerativeAI } from '@google/generative-ai'
import * as fs from 'fs'
import * as path from 'path'

interface Food {
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

// 检查环境变量
if (!process.env.GEMINI_API_KEY) {
  console.error('错误: 请设置 GEMINI_API_KEY 环境变量')
  console.log('使用方法: GEMINI_API_KEY=xxx npx ts-node prisma/scripts/translate-foods.ts')
  process.exit(1)
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.1, // 低温度，更准确
    maxOutputTokens: 2048,
  },
})

async function translateBatch(foods: Food[]): Promise<Map<string, string>> {
  const names = foods.map(f => f.nameEn).join('\n')

  const prompt = `你是一个食物翻译专家。请将以下英文食物名称翻译成简体中文。

规则:
1. 每行一个翻译结果
2. 保持与输入相同的顺序
3. 只返回中文名称，不要编号或其他内容
4. 使用中国大陆常用的食物名称
5. 如果是加工食品，保留主要成分名称

输入:
${names}

输出 (每行一个中文名称):`

  try {
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    const translations = responseText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.match(/^\d+[\.\)]/))

    const translationMap = new Map<string, string>()
    foods.forEach((food, i) => {
      if (translations[i]) {
        translationMap.set(food.id, translations[i])
      }
    })

    return translationMap
  } catch (error) {
    console.error('翻译请求失败:', error)
    return new Map()
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function translateAllFoods() {
  const seedDataDir = path.join(__dirname, '../seed-data')
  const inputPath = path.join(seedDataDir, 'foods-transformed.json')
  const outputPath = path.join(seedDataDir, 'foods-translated.json')
  const progressPath = path.join(seedDataDir, 'translation-progress.json')

  // 检查输入文件
  if (!fs.existsSync(inputPath)) {
    console.error('错误: 未找到 foods-transformed.json')
    console.log('请先运行: npx ts-node prisma/scripts/transform-usda.ts')
    process.exit(1)
  }

  const foods: Food[] = JSON.parse(fs.readFileSync(inputPath, 'utf-8'))

  // 加载进度 (支持断点续传)
  let translatedMap = new Map<string, string>()
  if (fs.existsSync(progressPath)) {
    const progress = JSON.parse(fs.readFileSync(progressPath, 'utf-8'))
    translatedMap = new Map(Object.entries(progress))
    console.log(`加载已翻译进度: ${translatedMap.size} 条`)
  }

  // 筛选需要翻译的 (nameCn === nameEn 且未翻译)
  const needTranslation = foods.filter(f =>
    f.nameCn === f.nameEn && !translatedMap.has(f.id)
  )

  console.log(`总食材数: ${foods.length}`)
  console.log(`已翻译: ${translatedMap.size}`)
  console.log(`需要翻译: ${needTranslation.length}`)

  if (needTranslation.length === 0) {
    console.log('无需翻译，直接输出最终文件')
  } else {
    const BATCH_SIZE = 30 // 每批 30 个
    const DELAY_MS = 2000 // 每批间隔 2 秒 (避免限流)

    for (let i = 0; i < needTranslation.length; i += BATCH_SIZE) {
      const batch = needTranslation.slice(i, i + BATCH_SIZE)
      const progress = Math.round((i / needTranslation.length) * 100)

      console.log(`翻译进度: ${i}/${needTranslation.length} (${progress}%)`)

      const batchTranslations = await translateBatch(batch)

      // 合并结果
      batchTranslations.forEach((cn, id) => {
        translatedMap.set(id, cn)
      })

      // 保存进度
      const progressObj = Object.fromEntries(translatedMap)
      fs.writeFileSync(progressPath, JSON.stringify(progressObj, null, 2))

      // 限速
      if (i + BATCH_SIZE < needTranslation.length) {
        await sleep(DELAY_MS)
      }
    }

    console.log(`翻译完成: ${translatedMap.size} 条`)
  }

  // 合并翻译结果到原数据
  const finalFoods = foods.map(f => ({
    ...f,
    nameCn: translatedMap.get(f.id) || f.nameCn,
  }))

  // 保存最终文件
  fs.writeFileSync(outputPath, JSON.stringify(finalFoods, null, 2))
  console.log(`输出文件: ${outputPath}`)

  // 统计翻译覆盖率
  const translated = finalFoods.filter(f => f.nameCn !== f.nameEn).length
  const coverage = Math.round((translated / finalFoods.length) * 100)
  console.log(`翻译覆盖率: ${translated}/${finalFoods.length} (${coverage}%)`)

  // 删除进度文件
  if (fs.existsSync(progressPath)) {
    fs.unlinkSync(progressPath)
    console.log('已清理进度文件')
  }
}

translateAllFoods().catch(console.error)
