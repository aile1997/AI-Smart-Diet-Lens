import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'
import {
  RecipeRecommendationResponse,
  RecipeItem,
  NutritionGap,
} from './dto/recipe.dto'

/**
 * 模拟食谱数据库
 */
const MOCK_RECIPES: RecipeItem[] = [
  {
    id: 'r_001',
    title: '黑椒鸡胸肉',
    tags: ['高蛋白', '低脂', '快手'],
    image: 'https://cdn.example.com/chicken.jpg',
    calories: 280,
    protein: 45,
    carbs: 8,
    fat: 6,
  },
  {
    id: 'r_002',
    title: '香煎三文鱼',
    tags: ['高蛋白', 'Omega-3', '健康脂肪'],
    image: 'https://cdn.example.com/salmon.jpg',
    calories: 350,
    protein: 38,
    carbs: 0,
    fat: 20,
  },
  {
    id: 'r_003',
    title: '藜麦沙拉',
    tags: ['素食', '高纤维', '低碳水'],
    image: 'https://cdn.example.com/quinoa.jpg',
    calories: 320,
    protein: 12,
    carbs: 42,
    fat: 12,
  },
  {
    id: 'r_004',
    title: '牛油果鸡蛋吐司',
    tags: ['早餐', '健康脂肪', '快手'],
    image: 'https://cdn.example.com/avocado.jpg',
    calories: 380,
    protein: 18,
    carbs: 35,
    fat: 20,
  },
  {
    id: 'r_005',
    title: '瘦牛肉炒时蔬',
    tags: ['高蛋白', '低碳水', '增肌'],
    image: 'https://cdn.example.com/beef.jpg',
    calories: 320,
    protein: 35,
    carbs: 12,
    fat: 14,
  },
  {
    id: 'r_006',
    title: '燕麦蛋白碗',
    tags: ['早餐', '高纤维', '植物蛋白'],
    image: 'https://cdn.example.com/oats.jpg',
    calories: 420,
    protein: 25,
    carbs: 55,
    fat: 12,
  },
  {
    id: 'r_007',
    title: '虾仁西兰花',
    tags: ['高蛋白', '低脂', '海鲜'],
    image: 'https://cdn.example.com/shrimp.jpg',
    calories: 240,
    protein: 32,
    carbs: 10,
    fat: 8,
  },
  {
    id: 'r_008',
    title: '全麦意式肉酱面',
    tags: ['碳水', '经典', '增肌'],
    image: 'https://cdn.example.com/pasta.jpg',
    calories: 550,
    protein: 30,
    carbs: 75,
    fat: 18,
  },
]

/**
 * 智能内容服务
 */
@Injectable()
export class RecipeService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /recipes/recommend
   * 基于营养缺口推荐食谱
   */
  async recommendRecipes(
    userId: string,
    date: string,
  ): Promise<RecipeRecommendationResponse> {
    // 获取用户今日摄入汇总
    const summary = await this.getDailySummary(userId, date)

    // 获取用户目标
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        dailyCalorieTarget: true,
        proteinTarget: true,
        carbsTarget: true,
        fatTarget: true,
      },
    })

    const targetCalories = user?.dailyCalorieTarget || 2000
    const targetProtein = user?.proteinTarget || 150
    const targetCarbs = user?.carbsTarget || 200
    const targetFat = user?.fatTarget || 65

    // 计算营养缺口
    const gap: NutritionGap = {
      calories: targetCalories - summary.total_nutrition.calories,
      protein: targetProtein - summary.total_nutrition.protein,
      carbs: targetCarbs - summary.total_nutrition.carbs,
      fat: targetFat - summary.total_nutrition.fat,
    }

    // 根据缺口选择最合适的食谱
    const recommendations = this.selectRecipesByGap(gap)

    // 生成推荐理由
    const reasonText = this.generateReasonText(gap)

    return {
      reason_text: reasonText,
      recipes: recommendations,
    }
  }

  /**
   * 获取每日营养汇总
   */
  private async getDailySummary(userId: string, date: string) {
    const entries = await this.prisma.diaryEntry.findMany({
      where: { userId, date },
    })

    const total_nutrition = {
      calories: entries.reduce((sum, e) => sum + e.calories, 0),
      protein: entries.reduce((sum, e) => sum + e.protein, 0),
      carbs: entries.reduce((sum, e) => sum + e.carbs, 0),
      fat: entries.reduce((sum, e) => sum + e.fat, 0),
    }

    return { total_nutrition }
  }

  /**
   * 根据营养缺口选择食谱
   */
  private selectRecipesByGap(gap: NutritionGap): RecipeItem[] {
    // 如果热量缺口很小，返回空
    if (gap.calories < 100) {
      return []
    }

    // 按优先级排序缺口：蛋白质 > 碳水 > 脂肪
    const scores = MOCK_RECIPES.map((recipe) => {
      let score = 0

      // 蛋白质优先
      if (gap.protein > 20) {
        score += recipe.protein * 3
      }

      // 其次碳水
      if (gap.carbs > 30) {
        score += recipe.carbs * 1.5
      }

      // 最后脂肪
      if (gap.fat > 10) {
        score += recipe.fat
      }

      // 热量缺口匹配
      if (recipe.calories <= gap.calories + 100) {
        score += 10
      }

      return { recipe, score }
    })

    // 返回得分最高的 3 个食谱
    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.recipe)
  }

  /**
   * 生成推荐理由
   */
  private generateReasonText(gap: NutritionGap): string {
    const parts: string[] = []

    if (gap.protein > 20) {
      parts.push(`还缺 ${Math.round(gap.protein)}g 蛋白质`)
    }

    if (gap.calories > 300) {
      parts.push(`${Math.round(gap.calories)} 卡路里`)
    }

    if (gap.carbs > 40) {
      parts.push(`${Math.round(gap.carbs)}g 碳水`)
    }

    if (parts.length === 0) {
      return '今天的营养摄入很均衡！这些轻食食谱适合你：'
    }

    return `你今天${parts.join('、')}，推荐以下食谱：`
  }
}
