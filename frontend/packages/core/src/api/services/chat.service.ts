/**
 * AI 对话服务
 *
 * POST /api/ai/chat/message - 发送对话消息
 * GET /api/ai/chat/history - 获取对话历史
 * DELETE /api/ai/chat/history - 清空对话历史
 */

import type { ApiClient } from '../client'

/**
 * AI 对话消息
 */
export interface ChatMessage {
  id: string
  isUser: boolean
  content: string
  timestamp: string
}

/**
 * AI 对话响应
 */
export interface ChatResponse {
  reply: string
  recipeCard?: {
    name: string
    image: string
    calories: number
    time: string
    difficulty: string
    description: string
  }
}

/**
 * 对话历史响应
 */
export interface ChatHistoryResponse {
  messages: ChatMessage[]
}

export class ChatService {
  constructor(private client: ApiClient) {}

  /**
   * 发送对话消息
   *
   * @param message 用户消息
   * @param context 上下文历史（可选）
   */
  async sendMessage(message: string, context?: ChatMessage[]): Promise<ChatResponse> {
    // 将 ChatMessage[] 转换为后端期望的 { role, content }[] 格式
    const contextForBackend = context?.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.content
    }))

    return this.client.post<ChatResponse>('/ai/chat/message', { message, context: contextForBackend })
  }

  /**
   * 获取对话历史
   */
  async getHistory(): Promise<ChatHistoryResponse> {
    console.log('[ChatService] 开始获取对话历史...')
    const result = await this.client.get<ChatHistoryResponse>('/ai/chat/history')
    console.log('[ChatService] 获取历史结果:', result)
    console.log('[ChatService] result.messages:', result?.messages)
    return result
  }

  /**
   * 清空对话历史
   */
  async clearHistory(): Promise<{ success: boolean }> {
    return this.client.delete<{ success: boolean }>('/ai/chat/history')
  }
}
