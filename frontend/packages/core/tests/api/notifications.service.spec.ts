/**
 * NotificationsService 单元测试
 *
 * 测试消息通知 API 服务
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NotificationsService } from '../../src/api/services/notifications.service'
import type { ApiClient } from '../../src/api/client'

describe('NotificationsService', () => {
  let notificationsService: NotificationsService
  let mockClient: {
    get: ReturnType<typeof vi.fn>
    patch: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn()
    }

    notificationsService = new NotificationsService(mockClient as any)
  })

  describe('getMessages', () => {
    it('应成功获取消息列表', async () => {
      const mockResponse = {
        messages: [
          {
            id: 'msg-1',
            type: 'achievement' as const,
            title: '恭喜解锁新成就！',
            content: '您已连续记录 7 天，解锁「坚持一周」成就',
            isRead: false,
            createdAt: '2024-01-15T10:00:00Z'
          },
          {
            id: 'msg-2',
            type: 'reminder' as const,
            title: '记录提醒',
            content: '您还没有记录今天的早餐',
            isRead: true,
            createdAt: '2024-01-15T08:00:00Z'
          },
          {
            id: 'msg-3',
            type: 'system' as const,
            title: '系统通知',
            content: '新功能上线：智能食谱推荐',
            isRead: false,
            createdAt: '2024-01-14T15:00:00Z'
          }
        ]
      }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await notificationsService.getMessages()

      expect(result).toEqual(mockResponse)
      expect(mockClient.get).toHaveBeenCalledWith('/notifications/', { params: undefined })
    })

    it('应支持按类型筛选', async () => {
      const mockResponse = {
        messages: [
          {
            id: 'msg-1',
            type: 'achievement' as const,
            title: '恭喜解锁新成就！',
            content: '您已连续记录 7 天',
            isRead: false,
            createdAt: '2024-01-15T10:00:00Z'
          }
        ]
      }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await notificationsService.getMessages('achievement')

      expect(result).toEqual(mockResponse)
      expect(mockClient.get).toHaveBeenCalledWith('/notifications/', { params: { type: 'achievement' } })
    })
  })

  describe('getUnreadCount', () => {
    it('应成功获取未读数量', async () => {
      const mockResponse = { count: 5 }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await notificationsService.getUnreadCount()

      expect(result).toEqual(mockResponse)
      expect(mockClient.get).toHaveBeenCalledWith('/notifications/unread-count')
    })

    it('应返回零未读', async () => {
      const mockResponse = { count: 0 }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await notificationsService.getUnreadCount()

      expect(result.count).toBe(0)
    })
  })

  describe('markAsRead', () => {
    it('应成功标记消息已读', async () => {
      const mockResponse = { success: true }

      mockClient.patch.mockResolvedValue(mockResponse)

      const result = await notificationsService.markAsRead('msg-1')

      expect(result).toEqual(mockResponse)
      expect(mockClient.patch).toHaveBeenCalledWith('/notifications/msg-1/read')
    })
  })

  describe('markAllAsRead', () => {
    it('应成功标记全部已读', async () => {
      const mockResponse = { success: true }

      mockClient.patch.mockResolvedValue(mockResponse)

      const result = await notificationsService.markAllAsRead()

      expect(result).toEqual(mockResponse)
      expect(mockClient.patch).toHaveBeenCalledWith('/notifications/read-all')
    })
  })

  describe('deleteMessage', () => {
    it('应成功删除消息', async () => {
      const mockResponse = { success: true }

      mockClient.delete.mockResolvedValue(mockResponse)

      const result = await notificationsService.deleteMessage('msg-1')

      expect(result).toEqual(mockResponse)
      expect(mockClient.delete).toHaveBeenCalledWith('/notifications/msg-1')
    })

    it('应处理删除失败', async () => {
      mockClient.delete.mockRejectedValue(new Error('消息不存在'))

      await expect(notificationsService.deleteMessage('invalid-id')).rejects.toThrow('消息不存在')
    })
  })
})
