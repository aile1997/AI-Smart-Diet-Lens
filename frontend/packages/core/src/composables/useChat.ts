/**
 * AI 营养师对话组合式函数
 *
 * 提供与 AI 营养师的对话功能
 */

import { ref, computed } from 'vue'
import { getApi } from '../api'
import { ChatService } from '../api/services/chat.service'
import type { ChatMessage, ChatResponse } from '../api/services/chat.service'

/**
 * UI 消息类型（扩展自后端 ChatMessage）
 */
export interface UIMessage extends ChatMessage {
  richContent?: string
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
 * AI 营养师对话组合式函数
 */
export function useChat() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const messages = ref<UIMessage[]>([])

  // 是否正在输入
  const isTyping = computed(() => loading.value && messages.value.length > 0)

  /**
   * 发送消息
   */
  async function sendMessage(content: string) {
    if (!content.trim()) return

    // 添加用户消息
    const userMessage: UIMessage = {
      id: Date.now().toString(),
      isUser: true,
      content,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
    messages.value.push(userMessage)

    loading.value = true
    error.value = null

    try {
      const api = getApi()
      const chatService = new ChatService(api)

      // 发送到后端
      const response = await chatService.sendMessage(content, messages.value)

      // 添加 AI 回复
      const aiMessage: UIMessage = {
        id: (Date.now() + 1).toString(),
        isUser: false,
        content: response.reply,
        timestamp: '',
        recipeCard: response.recipeCard,
      }
      messages.value.push(aiMessage)

      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : '发送消息失败'

      // 添加错误消息
      const errorMessage: UIMessage = {
        id: (Date.now() + 1).toString(),
        isUser: false,
        content: '抱歉，我暂时无法回复。请稍后再试。',
        timestamp: '',
      }
      messages.value.push(errorMessage)

      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取对话历史
   */
  async function fetchHistory() {
    loading.value = true
    error.value = null

    try {
      const api = getApi()
      const chatService = new ChatService(api)

      const response = await chatService.getHistory()
      messages.value = response.messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp).toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit'
        }),
      }))
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取历史失败'
      console.error('fetchHistory error:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 清空对话历史
   */
  async function clearHistory() {
    loading.value = true
    error.value = null

    try {
      const api = getApi()
      const chatService = new ChatService(api)

      await chatService.clearHistory()
      messages.value = []
    } catch (err) {
      error.value = err instanceof Error ? err.message : '清空历史失败'
      console.error('clearHistory error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 重新发送消息（重试）
   */
  async function retrySend(content: string) {
    // 移除最后一条错误消息（如果有）
    const lastMessage = messages.value[messages.value.length - 1]
    if (lastMessage && !lastMessage.isUser && lastMessage.content.includes('暂时无法回复')) {
      messages.value.pop()
    }

    return sendMessage(content)
  }

  return {
    loading,
    error,
    messages,
    isTyping,
    sendMessage,
    fetchHistory,
    clearHistory,
    retrySend,
  }
}
