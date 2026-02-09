import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../common/prisma.service'
import {
  AnalyzeFoodDto,
  AnalyzeResponse,
  RecognizedFood,
} from './dto/analyze.dto'
import { FoodSearchResponse, FoodSearchItem } from './dto/search.dto'
import OpenAI from 'openai'

/**
 * 食物服务
 * 使用阿里云 Qwen-VL 进行食物识别
 */
@Injectable()
export class FoodService {
  private readonly logger = new Logger(FoodService.name)
  private readonly qwen: OpenAI

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    // 初始化阿里云 Qwen-VL 客户端
    this.qwen = new OpenAI({
      apiKey: this.config.get<string>('DASHSCOPE_API_KEY') || '',
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    })
  }

  /**
   * POST /api/ai/analyze
   * 通过 Qwen-VL API 识别食物
   */
  async analyzeFood(dto: AnalyzeFoodDto): Promise<AnalyzeResponse> {
    const apiKey = this.config.get<string>('DASHSCOPE_API_KEY')

    if (!apiKey || apiKey === 'sk-xxxxxxxxxxxxxxxx') {
      this.logger.warn('DASHSCOPE_API_KEY 未配置，返回模拟数据')
      return this.getMockAnalyzeResponse(dto.image_url)
    }

    try {
      const result = await this.callQwenVL(dto.image_url)
      return {
        foods: result,
        image_url: dto.image_url,
        recognized_at: Date.now(),
      }
    } catch (error) {
      this.logger.error('Qwen-VL API 调用失败', error)
      // 失败时返回模拟数据作为降级处理
      return this.getMockAnalyzeResponse(dto.image_url)
    }
  }

  /**
   * 调用阿里云 Qwen-VL 进行食物识别
   * 使用像素级识别提示词，提供更专业的营养分析
   */
  private async callQwenVL(imageUrl: string): Promise<RecognizedFood[]> {
    try {
      const prompt = `你是一个具备"像素级"识别能力的顶级AI营养分析师。请仔细分析图片中的食物，尽可能识别出具体的菜品名称（例如识别出"香煎迷迭香羊排"而不是简单的"羊肉"）。

请严格按照以下 JSON 格式返回，不要包含任何 Markdown 格式或多余文字：

{
  "food_name": "菜品具体名称（尽可能详细，如：低脂牛油果全麦三明治）",
  "calories_per_100g": 估算的每100g卡路里数值（整数）,
  "protein_g": 蛋白质含量（数值）,
  "carbs_g": 碳水含量（数值）,
  "fat_g": 脂肪含量（数值）,
  "portion_estimate_g": 估计盘中食物的总克数（整数）,
  "health_tip": "一句话营养点评（例如：这道菜蛋白质丰富，但建议少喝汤以控制盐分摄入）"
}`

      const completion = await this.qwen.chat.completions.create({
        model: 'qwen-vl-max',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: imageUrl } },
              { type: 'text', text: prompt },
            ],
          },
        ],
      })

      // 数据清洗：移除可能存在的 ```json ... ``` 标记
      let content = completion.choices[0]?.message?.content || '{}'
      content = content.replace(/```json/g, '').replace(/```/g, '').trim()

      this.logger.log(`Qwen-VL 原始响应: ${content}`)

      // 解析 JSON（新的格式）
      const parsed: any = JSON.parse(content)

      // 转换为标准格式（营养值按 100g 基准）
      const portion_g = parsed.portion_estimate_g || 100
      const ratio = portion_g / 100

      return [
        {
          id: `qwen_${Date.now()}`,
          name: parsed.food_name || '未知食物',
          portion_g: portion_g,
          confidence: 0.9,
          nutrition: {
            calories: Math.round(parsed.calories_per_100g || 0),
            protein: Math.round((parsed.protein_g || 0) * ratio),
            carbs: Math.round((parsed.carbs_g || 0) * ratio),
            fat: Math.round((parsed.fat_g || 0) * ratio),
          },
          tips: parsed.health_tip || '营养数据基于 AI 识别估算，仅供参考',
        },
      ]
    } catch (error) {
      this.logger.error('Qwen-VL API 调用异常', error)
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
        tips: '富含优质蛋白质和Omega-3脂肪酸，有益心血管健康',
      },
    ]
  }

  /**
   * 获取模拟分析响应（开发用）
   */
  private getMockAnalyzeResponse(imageUrl: string): AnalyzeResponse {
    return {
      foods: this.getMockRecognizedFoods(),
      image_url: imageUrl,
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
