import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../common/prisma.service'
import {
  AnalyzeFoodDto,
  AnalyzeResponse,
  RecognizedFood,
} from './dto/analyze.dto'
import { FoodSearchResponse, FoodSearchItem } from './dto/search.dto'
import {
  S3Client,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

/**
 * Gemini API 响应格式
 */
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
}

/**
 * 食物服务
 */
@Injectable()
export class FoodService {
  private readonly logger = new Logger(FoodService.name)
  private readonly s3Client: S3Client
  private readonly bucketName: string

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    // 初始化 S3 客户端用于获取图片
    this.s3Client = new S3Client({
      region: this.config.get<string>('AWS_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.config.get<string>('AWS_SECRET_ACCESS_KEY') || '',
      },
    })
    this.bucketName = this.config.get<string>('S3_BUCKET') || 'diet-lens-uploads'
  }

  /**
   * POST /api/ai/analyze
   * 通过 Gemini API 识别食物
   */
  async analyzeFood(dto: AnalyzeFoodDto): Promise<AnalyzeResponse> {
    const apiKey = this.config.get<string>('GEMINI_API_KEY')

    if (!apiKey || apiKey === 'your-gemini-api-key') {
      this.logger.warn('GEMINI_API_KEY 未配置，返回模拟数据')
      return this.getMockAnalyzeResponse(dto.image_key)
    }

    try {
      const result = await this.callGeminiAPI(dto.image_key, apiKey)
      return {
        foods: result,
        image_key: dto.image_key,
        recognized_at: Date.now(),
      }
    } catch (error) {
      this.logger.error('Gemini API 调用失败', error)
      // 失败时返回模拟数据作为降级处理
      return this.getMockAnalyzeResponse(dto.image_key)
    }
  }

  /**
   * 调用 Gemini API 进行食物识别
   */
  private async callGeminiAPI(
    imageKey: string,
    apiKey: string,
  ): Promise<RecognizedFood[]> {
    try {
      // 从 S3 获取图片数据
      const imageBase64 = await this.getImageFromS3(imageKey)

      const prompt = `
请分析这张图片中的食物，并返回以下格式的 JSON：

{
  "foods": [
    {
      "name": "食物名称",
      "portion_g": 估算重量（克），
      "confidence": 识别置信度（0-1之间的小数），
      "nutrition": {
        "calories": 卡路里，
        "protein": 蛋白质（克），
        "carbs": 碳水化合物（克），
        "fat": 脂肪（克）
      }
    }
  ]
}

请只返回 JSON，不要有其他文字。如果图片中没有食物，返回 {"foods": []}
`

      // 调用 Gemini Pro Vision API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                  {
                    inline_data: {
                      mime_type: 'image/jpeg',
                      data: imageBase64,
                    },
                  },
                ],
              },
            ],
          }),
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        this.logger.error(`Gemini API 错误: ${response.status} - ${errorText}`)
        throw new Error(`Gemini API 调用失败: ${response.status}`)
      }

      const data: GeminiResponse = await response.json()

      // 解析响应
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const jsonMatch = text.match(/\{[\s\S]*\}/)

      if (!jsonMatch) {
        this.logger.warn('Gemini 返回的不是有效 JSON，返回模拟数据')
        return this.getMockRecognizedFoods()
      }

      const parsed = JSON.parse(jsonMatch[0])

      // 转换为标准格式
      return (parsed.foods || []).map((food: any, index: number) => ({
        id: `gemini_${Date.now()}_${index}`,
        name: food.name,
        portion_g: food.portion_g,
        confidence: food.confidence,
        nutrition: {
          calories: food.nutrition?.calories || 0,
          protein: food.nutrition?.protein || 0,
          carbs: food.nutrition?.carbs || 0,
          fat: food.nutrition?.fat || 0,
        },
      }))
    } catch (error) {
      this.logger.error('Gemini API 调用异常', error)
      throw error
    }
  }

  /**
   * 从 S3 获取图片并转换为 base64
   */
  private async getImageFromS3(imageKey: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: imageKey,
      })

      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 })

      // 下载图片
      const imageResponse = await fetch(url)
      if (!imageResponse.ok) {
        throw new Error(`无法获取图片: ${imageResponse.status}`)
      }

      const buffer = await imageResponse.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')

      return base64
    } catch (error) {
      this.logger.error(`从 S3 获取图片失败: ${imageKey}`, error)
      throw error
    }
  }

  /**
   * 获取模拟识别结果（开发用）
   */
  private getMockRecognizedFoods(): RecognizedFood[] {
    return [
      {
        id: `food_${Date.now()}_1`,
        name: '煎三文鱼',
        portion_g: 150,
        confidence: 0.92,
        nutrition: {
          calories: 310,
          protein: 28,
          carbs: 0,
          fat: 22,
        },
      },
    ]
  }

  /**
   * 获取模拟分析响应（开发用）
   */
  private getMockAnalyzeResponse(imageKey: string): AnalyzeResponse {
    return {
      foods: this.getMockRecognizedFoods(),
      image_key: imageKey,
      recognized_at: Date.now(),
    }
  }

  /**
   * GET /api/food/search
   * 文本模糊搜索食物
   */
  async searchFood(
    query: string,
    page = 1,
    limit = 20,
  ): Promise<FoodSearchResponse> {
    const skip = (page - 1) * limit

    const [foods, total] = await Promise.all([
      this.prisma.food.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        skip,
        take: limit,
      }),
      this.prisma.food.count({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
      }),
    ])

    const results: FoodSearchItem[] = foods.map((food) => ({
      id: food.id,
      name: food.name,
      calories: Math.round(food.calories),
      unit: '100g',
    }))

    return {
      results,
      page,
      total_pages: Math.ceil(total / limit),
    }
  }

  /**
   * GET /api/food/barcode/:code
   * 条形码查询
   */
  async findByBarcode(code: string) {
    // TODO: 集成条形码数据库 API
    return {
      id: `barcode_${code}`,
      name: '条形码食品（待集成数据库）',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    }
  }
}
