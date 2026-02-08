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

    console.log('[useChat] 发送消息:', content)

    // 添加用户消息到本地（立即显示，用于 UI 反馈）
    const tempUserMessage: UIMessage = {
      id: `temp-${Date.now()}`,
      isUser: true,
      content,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
    messages.value.push(tempUserMessage)

    console.log('[useChat] 本地消息列表长度:', messages.value.length)

    loading.value = true
    error.value = null

    try {
      const api = getApi()
      const chatService = new ChatService(api)

      // 获取当前消息之前的历史作为 context（不包括刚添加的用户消息）
      const previousMessages = messages.value.slice(0, -1)

      console.log('[useChat] 发送 context，包含', previousMessages.length, '条历史消息')

      // 发送到后端
      const response = await chatService.sendMessage(content, previousMessages)

      console.log('[useChat] 收到 AI 回复:', response.reply)

      // 添加 AI 回复（临时 ID）
      const tempAIMessage: UIMessage = {
        id: `temp-${Date.now() + 1}`,
        isUser: false,
        content: response.reply,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        recipeCard: response.recipeCard,
      }
      messages.value.push(tempAIMessage)

      console.log('[useChat] 添加 AI 回复后，消息列表长度:', messages.value.length)

      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : '发送消息失败'
      console.error('[useChat] 发送消息失败:', err)

      // 移除临时用户消息
      const index = messages.value.findIndex(m => m.id === tempUserMessage.id)
      if (index !== -1) {
        messages.value.splice(index, 1)
      }

      // 添加错误消息
      const errorMessage: UIMessage = {
        id: `error-${Date.now()}`,
        isUser: false,
        content: '抱歉，我暂时无法回复。请稍后再试。',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
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

    console.log('[useChat] 开始获取对话历史...')

    try {
      const api = getApi()
      const chatService = new ChatService(api)

      const response = await chatService.getHistory()

      console.log('[useChat] 获取历史响应:', response)
      console.log('[useChat] messages:', response?.messages)

      // 检查 response.messages 是否存在
      if (!response || !response.messages) {
        console.warn('[useChat] response 或 response.messages 为空')
        messages.value = []
        return
      }

      console.log(`[useChat] 解析 ${response.messages.length} 条历史消息`)

      messages.value = response.messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp).toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit'
        }),
      }))

      console.log(`[useChat] 加载完成，共 ${messages.value.length} 条消息`)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取历史失败'
      console.error('[useChat] fetchHistory error:', err)
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
