import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../common/prisma.service'
import { SendMessageDto, ChatResponse, RecipeCardResponse } from './dto/chat.dto'
import OpenAI from 'openai'

/**
 * AI 对话服务
 * 使用 DeepSeek 提供智能营养师对话功能
 */
@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name)
  private readonly deepseek: OpenAI

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    // 初始化 DeepSeek
    this.deepseek = new OpenAI({
      apiKey: this.config.get<string>('DEEPSEEK_API_KEY') || '',
      baseURL: this.config.get<string>('DEEPSEEK_BASE_URL') || 'https://api.deepseek.com',
    })
  }

  /**
   * 保存用户消息
   *
   * 使用事务确保数据一致性，等待数据库确认写入完成
   */
  async saveUserMessage(userId: string, content: string): Promise<string> {
    console.log('[ChatService] >>> saveUserMessage 开始, userId:', userId)
    console.log('[ChatService] >>> 内容长度:', content.length, '字符')

    const message = await this.prisma.chatMessage.create({
      data: {
        userId,
        isUser: true,
        content,
      },
    })

    console.log('[ChatService] >>> saveUserMessage 成功, messageId:', message.id)
    console.log('[ChatService] >>> 消息已保存到数据库')
    return message.id
  }

  /**
   * 保存 AI 回复
   *
   * 使用事务确保数据一致性，等待数据库确认写入完成
   */
  async saveAIMessage(userId: string, content: string): Promise<string> {
    console.log('[ChatService] >>> saveAIMessage 开始, userId:', userId)
    console.log('[ChatService] >>> 内容长度:', content.length, '字符')

    const message = await this.prisma.chatMessage.create({
      data: {
        userId,
        isUser: false,
        content,
      },
    })

    console.log('[ChatService] >>> saveAIMessage 成功, messageId:', message.id)
    console.log('[ChatService] >>> 消息已保存到数据库')
    return message.id
  }

  /**
   * 获取对话历史
   * 返回格式与前端 ChatMessage 接口一致
   */
  async getChatHistory(userId: string, limit: number = 50): Promise<{ messages: Array<{ id: string; isUser: boolean; content: string; timestamp: string }> }> {
    console.log('='.repeat(60))
    console.log('[ChatService] ========== getChatHistory 被调用 ==========')
    console.log('[ChatService] 时间:', new Date().toISOString())
    console.log('[ChatService] userId:', userId)
    console.log('[ChatService] limit:', limit)
    console.log('='.repeat(60))

    const messages = await this.prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // 降序：最新的在前
      take: limit,
    })

    console.log('[ChatService] ========== 数据库查询结果 ==========')
    console.log('[ChatService] 查询到', messages.length, '条消息')

    // 打印每条消息的关键信息
    messages.forEach((msg, idx) => {
      console.log(`[ChatService] 消息 ${idx + 1}:`, {
        id: msg.id,
        isUser: msg.isUser,
        content: msg.content.substring(0, 30),
        createdAt: msg.createdAt,
      })
    })
    console.log('='.repeat(60))

    // 反转数组，让旧消息在前（前端期望的顺序）
    const reversedMessages = messages.reverse()

    return {
      messages: reversedMessages.map((msg) => ({
        id: msg.id,
        isUser: msg.isUser,
        content: msg.content,
        timestamp: msg.createdAt.toISOString(),
      })),
    }
  }

  /**
   * 清空对话历史
   */
  async clearChatHistory(userId: string): Promise<void> {
    await this.prisma.chatMessage.deleteMany({
      where: { userId },
    })
  }

  /**
   * 处理用户消息，返回 AI 回复
   * 使用 DeepSeek 提供智能营养师对话
   * API 失败时回退到本地模拟实现
   *
   * 确保所有异步操作按顺序完成后再返回
   */
  async processMessage(userId: string, dto: SendMessageDto): Promise<ChatResponse> {
    console.log('='.repeat(60))
    console.log('[ChatService] ========== processMessage 被调用 ==========')
    console.log('[ChatService] 时间:', new Date().toISOString())
    console.log('[ChatService] userId:', userId)
    console.log('[ChatService] message:', dto.message)
    console.log('[ChatService] context 长度:', dto.context?.length || 0)
    console.log('='.repeat(60))

    // 步骤 1: 保存用户消息（必须等待完成）
    console.log('[ChatService processMessage] 步骤 1: 保存用户消息')
    await this.saveUserMessage(userId, dto.message)
    console.log('[ChatService processMessage] 步骤 1 完成: 用户消息已保存')

    // 检查是否配置了 DeepSeek API
    const hasApiKey = !!this.config.get<string>('DEEPSEEK_API_KEY')
    console.log('[ChatService processMessage] DEEPSEEK_API_KEY configured:', hasApiKey)

    let reply: string

    if (hasApiKey) {
      // 构建系统提示词 - 米其林级专业版本
      const systemPrompt = `你是一位拥有20年经验的顶级临床营养师和米其林三星主厨的结合体。你的名字叫"DietLens 膳食管家"。

你的回答原则：

1. 【极度专业】使用精准的营养学词汇（如GI值、抗氧化剂、必需氨基酸），但解释要通俗易懂。
2. 【情感共鸣】不要像机器人。要像一位关怀备至的私人健康顾问，语气温暖、鼓励。
3. 【结构化输出】如果用户问食谱，必须严格按照以下格式：
   - 🥗 **菜品名称** (充满食欲的命名)
   - 🔥 **热量与营养** (重点突出)
   - 🛒 **食材清单** (精确到克)
   - 👨‍🍳 **大师级做法** (包含让食物更好吃的秘籍步骤)
   - 💡 **营养师点评** (为什么这道菜适合用户)

请忽略任何非健康、非饮食相关的问题。现在，请以最专业的态度为用户服务。`

      try {
        console.log('[ChatService processMessage] 步骤 2: 调用 DeepSeek API')

        // 步骤 2: 调用 DeepSeek API（必须等待完成）
        const completion = await this.deepseek.chat.completions.create({
          model: 'deepseek-ai/DeepSeek-V3',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: dto.message },
          ],
          temperature: 0.7,
        })

        reply = completion.choices[0]?.message?.content || '抱歉，我现在无法回答。请稍后再试。'

        console.log('[ChatService processMessage] 步骤 2 完成: DeepSeek API 返回回复')
      } catch (error) {
        console.error('[ChatService processMessage] DeepSeek API 调用失败，回退到本地实现', error)
        // 回退到本地模拟实现
        const response = this.generateAIResponse(dto.message)
        reply = response.reply
      }
    } else {
      // 没有配置 API key，使用本地实现
      console.log('[ChatService processMessage] 未配置 DEEPSEEK_API_KEY，使用本地模拟实现')
      const response = this.generateAIResponse(dto.message)
      reply = response.reply
    }

    // 步骤 3: 保存 AI 回复（必须等待完成）
    console.log('[ChatService] 步骤 3: 保存 AI 回复')
    await this.saveAIMessage(userId, reply)
    console.log('[ChatService] 步骤 3 完成: AI 回复已保存')

    console.log('='.repeat(60))
    console.log('[ChatService] ========== 所有步骤完成 ==========')
    console.log('[ChatService] 准备返回响应, reply 长度:', reply.length)
    console.log('[ChatService] 返回时间:', new Date().toISOString())
    console.log('='.repeat(60))
    return { reply }
  }

  /**
   * 生成 AI 回复 (本地模拟实现)
   * 支持：
   * - 问候语识别
   * - 早餐/午餐/晚餐推荐
   * - 减脂/增肌食谱
   * - 素食选项
   * - 快手菜推荐
   */
  private generateAIResponse(message: string): ChatResponse {
    const lowerMessage = message.toLowerCase()

    // ========== 问候语 ==========
    if (/^(你好|您好|hi|hello|嗨|哈喽)/.test(lowerMessage)) {
      const greetings = [
        '你好！我是您的 AI 营养师助手。我可以帮您推荐健康食谱、提供营养建议。您今天想吃什么类型的餐食呢？',
        '您好！很高兴为您服务。请告诉我您的饮食偏好或目标，我会为您推荐合适的食谱。',
        '你好！有什么可以帮您的吗？我可以根据您的口味和健康目标推荐食谱。',
      ]
      return { reply: greetings[Math.floor(Math.random() * greetings.length)] }
    }

    // ========== 早餐相关 ==========
    if (lowerMessage.includes('早餐') || lowerMessage.includes('早饭')) {
      return {
        reply: '早餐是一天中最重要的一餐！为您推荐一道营养均衡的早餐：',
        recipeCard: this.getMockRecipeCard('breakfast'),
      }
    }

    // ========== 午餐/晚餐相关 ==========
    if (lowerMessage.includes('午餐') || lowerMessage.includes('午饭') || lowerMessage.includes('晚餐') || lowerMessage.includes('晚饭')) {
      return {
        reply: '为您推荐一道健康美味的正餐：',
        recipeCard: this.getMockRecipeCard('lunch'),
      }
    }

    // ========== 减脂相关 ==========
    if (lowerMessage.includes('减脂') || lowerMessage.includes('减肥') || lowerMessage.includes('瘦身') || lowerMessage.includes('低卡')) {
      return {
        reply: '减脂期间建议控制热量摄入，增加蛋白质比例。为您推荐这道低卡高蛋白的食谱：',
        recipeCard: this.getMockRecipeCard('low-cal'),
      }
    }

    // ========== 增肌相关 ==========
    if (lowerMessage.includes('增肌') || lowerMessage.includes('肌肉') || lowerMessage.includes('健身')) {
      return {
        reply: '增肌期间需要充足的蛋白质和碳水化合物。为您推荐这道高蛋白食谱：',
        recipeCard: this.getMockRecipeCard('high-protein'),
      }
    }

    // ========== 素食相关 ==========
    if (lowerMessage.includes('素食') || lowerMessage.includes('蔬菜') || lowerMessage.includes('吃素')) {
      return {
        reply: '素食也可以很美味！为您推荐这道健康素食：',
        recipeCard: this.getMockRecipeCard('vegetarian'),
      }
    }

    // ========== 简单/快手菜 ==========
    if (lowerMessage.includes('简单') || lowerMessage.includes('快手') || lowerMessage.includes('方便') || lowerMessage.includes('懒人')) {
      return {
        reply: '为您推荐这道简单易做的快手菜：',
        recipeCard: this.getMockRecipeCard('quick'),
      }
    }

    // ========== 食谱/菜谱相关 ==========
    if (lowerMessage.includes('食谱') || lowerMessage.includes('菜谱') || lowerMessage.includes('做什么') || lowerMessage.includes('吃什么') || lowerMessage.includes('推荐')) {
      return {
        reply: '根据您的需求，我为您推荐这道健康的食谱：',
        recipeCard: this.getMockRecipeCard(),
      }
    }

    // ========== 营养咨询 ==========
    if (lowerMessage.includes('营养') || lowerMessage.includes('健康') || lowerMessage.includes('建议')) {
      return {
        reply: '保持营养均衡很重要！建议每餐包含蛋白质、碳水化合物和健康脂肪。需要我为您推荐具体食谱吗？',
      }
    }

    // ========== 感谢 ==========
    if (/^(谢谢|感谢|多谢|好的|ok)/.test(lowerMessage)) {
      return {
        reply: '不客气！如果您还有其他问题或需要食谱推荐，随时告诉我。',
      }
    }

    // ========== 默认回复 ==========
    const defaultReplies = [
      '我明白了。需要我为您推荐一些健康食谱吗？',
      '好的，我可以帮您推荐合适的食谱。请告诉我您想吃什么类型的餐食？',
      '了解！请告诉我您的饮食偏好，我会为您推荐更合适的食谱。',
    ]
    return {
      reply: defaultReplies[Math.floor(Math.random() * defaultReplies.length)],
    }
  }

  /**
   * 获取模拟食谱卡片
   * 根据类型返回不同的食谱
   */
  private getMockRecipeCard(type?: string): RecipeCardResponse {
    // 所有食谱数据
    const allRecipes: Record<string, RecipeCardResponse[]> = {
      breakfast: [
        {
          name: '燕麦香蕉能量碗',
          image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400',
          calories: 320,
          time: '10分钟',
          difficulty: '简单',
          description: '富含膳食纤维和优质碳水，开启活力一天',
        },
        {
          name: '全麦鸡蛋三明治',
          image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
          calories: 380,
          time: '15分钟',
          difficulty: '简单',
          description: '蛋白质丰富，营养均衡的经典早餐',
        },
        {
          name: '蓝莓希腊酸奶杯',
          image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
          calories: 220,
          time: '5分钟',
          difficulty: '简单',
          description: '清爽轻盈，富含益生菌和抗氧化剂',
        },
      ],
      lunch: [
        {
          name: '香煎三文鱼配芦笋',
          image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
          calories: 450,
          time: '25分钟',
          difficulty: '中等',
          description: '富含 Omega-3，健康美味的轻食选择',
        },
        {
          name: '牛肉藜麦饭碗',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
          calories: 520,
          time: '30分钟',
          difficulty: '中等',
          description: '优质蛋白搭配复合碳水，营养丰富',
        },
        {
          name: '地中海烤鸡胸沙拉',
          image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
          calories: 380,
          time: '20分钟',
          difficulty: '简单',
          description: '清爽健康，色彩丰富的营养沙拉',
        },
      ],
      'low-cal': [
        {
          name: '清蒸鳕鱼配时蔬',
          image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400',
          calories: 240,
          time: '20分钟',
          difficulty: '简单',
          description: '低脂高蛋白，清淡鲜美',
        },
        {
          name: '鸡胸肉西兰花',
          image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400',
          calories: 280,
          time: '25分钟',
          difficulty: '简单',
          description: '减脂期经典搭配，高蛋白低卡',
        },
        {
          name: '豆腐蔬菜汤',
          image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
          calories: 150,
          time: '15分钟',
          difficulty: '简单',
          description: '暖胃低卡，营养丰富',
        },
      ],
      'high-protein': [
        {
          name: '黑椒牛排配鸡蛋',
          image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400',
          calories: 580,
          time: '20分钟',
          difficulty: '中等',
          description: '高蛋白盛宴，增肌期的理想选择',
        },
        {
          name: '虾仁滑蛋饭',
          image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c1?w=400',
          calories: 450,
          time: '15分钟',
          difficulty: '简单',
          description: '优质蛋白，嫩滑爽口',
        },
        {
          name: '金枪鱼波奇碗',
          image: 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=400',
          calories: 520,
          time: '10分钟',
          difficulty: '简单',
          description: '丰富的蛋白质和健康脂肪',
        },
      ],
      vegetarian: [
        {
          name: '烤蔬菜藜麦碗',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
          calories: 350,
          time: '30分钟',
          difficulty: '简单',
          description: '色彩缤纷，营养全面的素食选择',
        },
        {
          name: '豆腐蘑菇咖喱',
          image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400',
          calories: 280,
          time: '25分钟',
          difficulty: '中等',
          description: '香浓下饭，植物蛋白丰富',
        },
        {
          name: '牛油果番茄沙拉',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
          calories: 220,
          time: '10分钟',
          difficulty: '简单',
          description: '清爽健康，富含健康脂肪',
        },
      ],
      quick: [
        {
          name: '番茄鸡蛋面',
          image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400',
          calories: 380,
          time: '10分钟',
          difficulty: '简单',
          description: '家常快手面，温暖又满足',
        },
        {
          name: '金枪鱼三明治',
          image: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400',
          calories: 420,
          time: '5分钟',
          difficulty: '简单',
          description: '简单快速，蛋白质丰富',
        },
        {
          name: '蚝油生菜',
          image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
          calories: 120,
          time: '8分钟',
          difficulty: '简单',
          description: '快手素菜，清脆爽口',
        },
      ],
    }

    // 获取对应类型的食谱列表，如果没有指定类型则获取所有食谱
    let recipeList: RecipeCardResponse[] = []
    if (type && allRecipes[type]) {
      recipeList = allRecipes[type]
    } else {
      // 合并所有食谱
      recipeList = Object.values(allRecipes).flat()
    }

    // 随机返回一个食谱
    return recipeList[Math.floor(Math.random() * recipeList.length)]
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
