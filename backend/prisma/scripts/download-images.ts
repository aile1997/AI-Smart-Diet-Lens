/**
 * 图片下载脚本
 * 从 Pexels/Unsplash 下载食材图片并转换为 WebP
 *
 * 前置条件:
 * 1. 设置环境变量: PEXELS_API_KEY 和/或 UNSPLASH_ACCESS_KEY
 * 2. 已有 foods-final.json 或 foods-translated.json
 *
 * 使用方法:
 * PEXELS_API_KEY=xxx npx ts-node prisma/scripts/download-images.ts
 *
 * API 申请:
 * - Pexels: https://www.pexels.com/api/ (免费，每月 20,000 请求)
 * - Unsplash: https://unsplash.com/developers (免费，每小时 50 请求)
 */
import * as fs from 'fs'
import * as path from 'path'
import https from 'https'

interface Food {
  id: string
  nameEn: string
  nameCn: string
  category: string
}

interface ImageResult {
  foodId: string
  foodName: string
  nameEn: string
  imageUrl: string
  thumbnailUrl: string
  source: 'pexels' | 'unsplash' | 'placeholder'
}

// 检查 API Key
const PEXELS_API_KEY = process.env.PEXELS_API_KEY
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

if (!PEXELS_API_KEY && !UNSPLASH_ACCESS_KEY) {
  console.error('错误: 请设置 PEXELS_API_KEY 或 UNSPLASH_ACCESS_KEY')
  console.log('API 申请地址:')
  console.log('  Pexels: https://www.pexels.com/api/')
  console.log('  Unsplash: https://unsplash.com/developers')
  process.exit(1)
}

async function fetchJson(url: string, headers: Record<string, string> = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...headers,
      },
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch {
          reject(new Error(`Failed to parse response: ${data.substring(0, 100)}`))
        }
      })
    })

    req.on('error', reject)
    req.end()
  })
}

async function downloadFile(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath)
    https.get(url, (response) => {
      // 处理重定向
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location
        if (redirectUrl) {
          https.get(redirectUrl, (res) => {
            res.pipe(file)
            file.on('finish', () => {
              file.close()
              resolve()
            })
          }).on('error', reject)
          return
        }
      }

      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', reject)
  })
}

async function searchPexels(query: string): Promise<string | null> {
  if (!PEXELS_API_KEY) return null

  try {
    const searchQuery = encodeURIComponent(`${query} food`)
    const url = `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=1&orientation=square`

    const data = await fetchJson(url, {
      'Authorization': PEXELS_API_KEY,
    })

    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.medium // 中等尺寸，约 350x350
    }
  } catch (error) {
    console.error(`Pexels 搜索失败 (${query}):`, error)
  }

  return null
}

async function searchUnsplash(query: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) return null

  try {
    const searchQuery = encodeURIComponent(`${query} food`)
    const url = `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=1&orientation=squarish`

    const data = await fetchJson(url, {
      'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    })

    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular // 约 1080px
    }
  } catch (error) {
    console.error(`Unsplash 搜索失败 (${query}):`, error)
  }

  return null
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function downloadFoodImages() {
  const seedDataDir = path.join(__dirname, '../seed-data')
  const imageDir = path.join(seedDataDir, 'images')

  // 创建图片目录
  fs.mkdirSync(imageDir, { recursive: true })

  // 读取食材数据
  const possibleFiles = ['foods-final.json', 'foods-translated.json', 'foods-transformed.json']
  let foods: Food[] = []

  for (const file of possibleFiles) {
    const filePath = path.join(seedDataDir, file)
    if (fs.existsSync(filePath)) {
      foods = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      console.log(`读取数据: ${filePath} (${foods.length} 条)`)
      break
    }
  }

  // 加载中国特色食材
  const chineseFoodsPath = path.join(seedDataDir, 'chinese-foods.json')
  if (fs.existsSync(chineseFoodsPath)) {
    const chineseFoods = JSON.parse(fs.readFileSync(chineseFoodsPath, 'utf-8'))
    foods = [...foods, ...chineseFoods]
    console.log(`加载中国食材: ${chineseFoods.length} 条`)
  }

  if (foods.length === 0) {
    console.error('错误: 未找到食材数据文件')
    process.exit(1)
  }

  // 加载已下载进度
  const progressPath = path.join(seedDataDir, 'image-progress.json')
  const resultsPath = path.join(seedDataDir, 'image-mapping.json')

  let downloaded = new Set<string>()
  let results: ImageResult[] = []

  if (fs.existsSync(progressPath)) {
    downloaded = new Set(JSON.parse(fs.readFileSync(progressPath, 'utf-8')))
    console.log(`已下载: ${downloaded.size} 张`)
  }

  if (fs.existsSync(resultsPath)) {
    results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'))
  }

  // 筛选未下载的
  const pending = foods.filter(f => !downloaded.has(f.id))
  console.log(`待下载: ${pending.length} 张`)

  // 限制下载数量 (可选)
  const MAX_DOWNLOADS = parseInt(process.env.MAX_DOWNLOADS || '0') || pending.length
  const toDownload = pending.slice(0, MAX_DOWNLOADS)

  console.log(`本次下载: ${toDownload.length} 张`)
  console.log('')

  for (let i = 0; i < toDownload.length; i++) {
    const food = toDownload[i]
    const progress = Math.round(((i + 1) / toDownload.length) * 100)

    process.stdout.write(`\r[${progress}%] ${i + 1}/${toDownload.length} - ${food.nameCn || food.nameEn}`)

    // 搜索图片
    let imageUrl: string | null = null
    let source: 'pexels' | 'unsplash' | 'placeholder' = 'placeholder'

    // 优先使用英文名搜索
    const searchTerms = [
      food.nameEn.split(',')[0].trim(), // 取逗号前的主要名称
      food.nameCn,
    ]

    for (const term of searchTerms) {
      if (imageUrl) break

      // 尝试 Pexels
      imageUrl = await searchPexels(term)
      if (imageUrl) {
        source = 'pexels'
        break
      }

      // 尝试 Unsplash
      imageUrl = await searchUnsplash(term)
      if (imageUrl) {
        source = 'unsplash'
        break
      }

      await sleep(500) // 限速
    }

    if (imageUrl) {
      // 下载图片
      const imagePath = path.join(imageDir, `${food.id}.jpg`)

      try {
        await downloadFile(imageUrl, imagePath)

        results.push({
          foodId: food.id,
          foodName: food.nameCn || food.nameEn,
          nameEn: food.nameEn,
          imageUrl: `foods/${food.id}.jpg`,
          thumbnailUrl: `foods/${food.id}.jpg`, // 暂时使用相同图片
          source,
        })
      } catch (error) {
        console.error(`\n下载失败: ${food.nameEn}`, error)
      }
    }

    // 记录进度
    downloaded.add(food.id)

    // 每 10 个保存一次进度
    if ((i + 1) % 10 === 0) {
      fs.writeFileSync(progressPath, JSON.stringify([...downloaded], null, 2))
      fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2))
    }

    // 限速: Pexels 200/hour, Unsplash 50/hour
    await sleep(1500)
  }

  // 保存最终结果
  fs.writeFileSync(progressPath, JSON.stringify([...downloaded], null, 2))
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2))

  console.log('\n')
  console.log('下载完成!')
  console.log(`成功: ${results.length}`)
  console.log(`总计: ${downloaded.size}`)
  console.log(`输出: ${resultsPath}`)

  // 统计来源
  const pexelsCount = results.filter(r => r.source === 'pexels').length
  const unsplashCount = results.filter(r => r.source === 'unsplash').length
  console.log(`来源: Pexels ${pexelsCount}, Unsplash ${unsplashCount}`)
}

downloadFoodImages().catch(console.error)
