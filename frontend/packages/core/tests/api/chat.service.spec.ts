/**
 * ChatService 单元测试
 *
 * 测试 AI 对话 API 服务
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ChatService } from '../../src/api/services/chat.service'
import type { ApiClient } from '../../src/api/client'

describe('ChatService', () => {
  let chatService: ChatService
  let mockClient: {
    get: ReturnType<typeof vi.fn>
    post: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn()
    }

    chatService = new ChatService(mockClient as any)
  })

  describe('sendMessage', () => {
    it('应成功发送对话消息（无上下文）', async () => {
      const mockResponse = {
        reply: '根据您的目标，建议您每天摄入 1800 卡路里'
      }

      mockClient.post.mockResolvedValue(mockResponse)

      const result = await chatService.sendMessage('我每天应该吃多少卡路里？')

      expect(result).toEqual(mockResponse)
      expect(mockClient.post).toHaveBeenCalledWith('/ai/chat/message', {
        message: '我每天应该吃多少卡路里？',
        context: undefined
      })
    })

    it('应支持带上下文的对话', async () => {
      const context = [
        {
          id: 'msg-1',
          isUser: true,
          content: '我每天应该吃多少卡路里？',
          timestamp: '2024-01-15T10:00:00Z'
        },
        {
          id: 'msg-2',
          isUser: false,
          content: '建议您每天摄入 1800 卡路里',
          timestamp: '2024-01-15T10:00:01Z'
        }
      ]

      const mockResponse = {
        reply: '1800 卡路里可以这样分配：早餐 500，午餐 700，晚餐 600'
      }

      mockClient.post.mockResolvedValue(mockResponse)

      const result = await chatService.sendMessage('那怎么分配呢？', context)

      expect(result).toEqual(mockResponse)
      // 验证 context 被转换为 { role, content }[] 格式
      expect(mockClient.post).toHaveBeenCalledWith('/ai/chat/message', {
        message: '那怎么分配呢？',
        context: [
          { role: 'user', content: '我每天应该吃多少卡路里？' },
          { role: 'assistant', content: '建议您每天摄入 1800 卡路里' }
        ]
      })
    })

    it('应支持返回食谱卡片', async () => {
      const mockResponse = {
        reply: '根据您的需求，我为您推荐这道菜',
        recipeCard: {
          name: '香煎鸡胸肉',
          image: 'https://example.com/recipes/chicken.jpg',
          calories: 280,
          time: '20分钟',
          difficulty: '简单',
          description: '鲜嫩多汁的鸡胸肉，富含蛋白质'
        }
      }

      mockClient.post.mockResolvedValue(mockResponse)

      const result = await chatService.sendMessage('推荐一道高蛋白的菜')

      expect(result.recipeCard).toBeDefined()
      expect(result.recipeCard?.name).toBe('香煎鸡胸肉')
    })
  })

  describe('getHistory', () => {
    it('应成功获取对话历史', async () => {
      const mockResponse = {
        messages: [
          {
            id: 'msg-1',
            isUser: true,
            content: '我每天应该吃多少卡路里？',
            timestamp: '2024-01-15T10:00:00Z'
          },
          {
            id: 'msg-2',
            isUser: false,
            content: '建议您每天摄入 1800 卡路里',
            timestamp: '2024-01-15T10:00:01Z'
          },
          {
            id: 'msg-3',
            isUser: true,
            content: '那怎么分配呢？',
            timestamp: '2024-01-15T10:00:05Z'
          },
          {
            id: 'msg-4',
            isUser: false,
            content: '早餐 500，午餐 700，晚餐 600',
            timestamp: '2024-01-15T10:00:06Z'
          }
        ]
      }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await chatService.getHistory()

      expect(result).toEqual(mockResponse)
      expect(mockClient.get).toHaveBeenCalledWith('/ai/chat/history')
    })

    it('应处理空对话历史', async () => {
      const mockResponse = { messages: [] }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await chatService.getHistory()

      expect(result.messages).toEqual([])
    })
  })

  describe('clearHistory', () => {
    it('应成功清空对话历史', async () => {
      const mockResponse = { success: true }

      mockClient.delete.mockResolvedValue(mockResponse)

      const result = await chatService.clearHistory()

      expect(result).toEqual(mockResponse)
      expect(mockClient.delete).toHaveBeenCalledWith('/ai/chat/history')
    })
  })
})
