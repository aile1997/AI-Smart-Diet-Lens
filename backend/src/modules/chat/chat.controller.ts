import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { ChatService } from './chat.service'
import { SendMessageDto, GenerateRecipeDto, ChatResponse } from './dto/chat.dto'
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { ApiResponse } from '../../common/api-response'
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBearerAuth } from '@nestjs/swagger'

/**
 * AI 对话控制器
 */
@ApiTags('ai-chat')
@ApiBearerAuth('JWT-auth')
@Controller('ai/chat')
@UseGuards(JwtGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * POST /api/ai/chat/message
   * 发送对话消息
   */
  @Post('message')
  @ApiOperation({
    summary: '发送对话消息',
    description: '与 AI 营养师对话，获取个性化建议和食谱推荐'
  })
  @SwaggerApiResponse({ status: 200, description: '成功返回 AI 回复' })
  async sendMessage(
    @CurrentUser() user: UserPayload,
    @Body() dto: SendMessageDto,
  ) {
    const response = await this.chatService.processMessage(user.sub, dto)
    return ApiResponse.ok(response)
  }

  /**
   * POST /api/ai/chat/recipe
   * 根据对话生成食谱
   */
  @Post('recipe')
  @ApiOperation({
    summary: '生成食谱',
    description: '根据用户偏好生成个性化食谱'
  })
  @SwaggerApiResponse({ status: 200, description: '成功返回食谱卡片' })
  async generateRecipe(
    @CurrentUser() user: UserPayload,
    @Body() dto: GenerateRecipeDto,
  ) {
    const recipe = await this.chatService.generateRecipe(user.sub, dto.preferences)
    return ApiResponse.ok(recipe)
  }

  /**
   * GET /api/ai/chat/history
   * 获取对话历史
   */
  @Post('history')
  @ApiOperation({
    summary: '获取对话历史',
    description: '获取最近的对话记录'
  })
  @SwaggerApiResponse({ status: 200, description: '成功返回对话历史' })
  async getHistory(
    @CurrentUser() user: UserPayload,
    @Body() body: { limit?: number },
  ) {
    const history = await this.chatService.getChatHistory(user.sub, body.limit || 10)
    return ApiResponse.ok(history)
  }
}
