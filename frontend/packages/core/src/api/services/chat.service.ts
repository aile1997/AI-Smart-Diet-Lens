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
    return this.client.post<ChatResponse>('/ai/chat/message', { message, context })
  }

  /**
   * 获取对话历史
   */
  async getHistory(): Promise<ChatHistoryResponse> {
    return this.client.get<ChatHistoryResponse>('/ai/chat/history')
  }

  /**
   * 清空对话历史
   */
  async clearHistory(): Promise<{ success: boolean }> {
    return this.client.delete<{ success: boolean }>('/ai/chat/history')
  }
}
