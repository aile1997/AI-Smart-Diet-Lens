import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class FoodService {
  constructor(private readonly config: ConfigService) {}

  /**
   * 通过 Gemini API 识别食物
   *
   * TODO: Backend Builder 实现 Gemini API 集成
   */
  async recognizeFood(imagePath: string) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY')

    // 骨架实现 - 返回模拟数据
    // Backend Builder 需要集成真实的 Gemini API
    return {
      foods: [
        {
          id: 'mock-001',
          name: '模拟食物',
          nutritionPer100g: {
            calories: 100,
            protein: 5,
            carbs: 15,
            fat: 3,
          },
          portion: 100,
          confidence: 0.85,
        },
      ],
      imagePath,
      recognizedAt: Date.now(),
    }
  }
}
