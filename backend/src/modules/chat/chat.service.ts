import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'
import { SendMessageDto, ChatResponse, RecipeCardResponse } from './dto/chat.dto'

/**
 * AI 对话服务
 * 模拟 AI 营养师对话功能
 */
@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name)

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 保存用户消息
   */
  async saveUserMessage(userId: string, content: string): Promise<void> {
    await this.prisma.chatMessage.create({
      data: {
        userId,
        isUser: true,
        content,
      },
    })
  }

  /**
   * 保存 AI 回复
   */
  async saveAIMessage(userId: string, content: string): Promise<void> {
    await this.prisma.chatMessage.create({
      data: {
        userId,
        isUser: false,
        content,
      },
    })
  }

  /**
   * 获取对话历史
   */
  async getChatHistory(userId: string, limit: number = 10): Promise<Array<{ role: string; content: string }>> {
    const messages = await this.prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return messages
      .reverse()
      .map((msg) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content,
      }))
  }

  /**
   * 处理用户消息，返回 AI 回复
   * 注意：这是一个模拟实现，生产环境应接入真实的 AI 服务 (如 Gemini API)
   */
  async processMessage(userId: string, dto: SendMessageDto): Promise<ChatResponse> {
    // 保存用户消息
    await this.saveUserMessage(userId, dto.message)

    // 模拟 AI 回复
    const response = await this.generateAIResponse(dto.message)

    // 保存 AI 回复
    await this.saveAIMessage(userId, response.reply)

    return response
  }

  /**
   * 生成 AI 回复 (模拟实现)
   */
  private async generateAIResponse(message: string): Promise<ChatResponse> {
    // 简单的关键词匹配来生成回复
    const lowerMessage = message.toLowerCase()

    // 检测用户想要食谱
    if (lowerMessage.includes('食谱') || lowerMessage.includes('菜谱') || lowerMessage.includes('做什么') || lowerMessage.includes('吃')) {
      return {
        reply: '根据您的需求，我为您推荐这道健康的食谱：',
        recipeCard: this.getMockRecipeCard(),
      }
    }

    // 检测减脂相关
    if (lowerMessage.includes('减脂') || lowerMessage.includes('减肥') || lowerMessage.includes('瘦身')) {
      return {
        reply: '减脂期间建议控制热量摄入，增加蛋白质比例。推荐您尝试低卡高蛋白的食谱，比如鸡胸肉沙拉、蒸蛋羹等。需要我为您推荐具体食谱吗？',
      }
    }

    // 检测增肌相关
    if (lowerMessage.includes('增肌') || lowerMessage.includes('肌肉')) {
      return {
        reply: '增肌期间需要充足的蛋白质和碳水化合物支持训练恢复。建议每餐摄入 30-40g 蛋白质，训练后及时补充碳水。需要我为您推荐增肌食谱吗？',
      }
    }

    // 默认回复
    return {
      reply: '您好！我是您的 AI 营养师助手。我可以帮您推荐健康的食谱、提供营养建议、制定饮食计划。请告诉我您的需求！',
    }
  }

  /**
   * 获取模拟食谱卡片
   */
  private getMockRecipeCard(): RecipeCardResponse {
    const recipes = [
      {
        name: '香煎鸡胸肉配时蔬',
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400',
        calories: 350,
        time: '25分钟',
        difficulty: '简单',
        description: '高蛋白低卡路里，适合减脂期的经典选择',
      },
      {
        name: '三文鱼牛油果沙拉',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        calories: 420,
        time: '15分钟',
        difficulty: '简单',
        description: '富含优质脂肪和 Omega-3，营养均衡',
      },
      {
        name: '蒸蛋羹配虾仁',
        image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c1?w=400',
        calories: 180,
        time: '20分钟',
        difficulty: '简单',
        description: '嫩滑爽口，高蛋白低脂肪',
      },
    ]

    return recipes[Math.floor(Math.random() * recipes.length)]
  }

  /**
   * 生成食谱 (基于用户偏好)
   */
  async generateRecipe(userId: string, preferences: Record<string, unknown>): Promise<RecipeCardResponse> {
    this.logger.log(`为用户 ${userId} 生成食谱，偏好: ${JSON.stringify(preferences)}`)

    // 根据偏好返回不同的食谱
    // 实际实现中应调用 AI API 生成

    return this.getMockRecipeCard()
  }
}
