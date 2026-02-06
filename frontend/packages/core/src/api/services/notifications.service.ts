/**
 * 消息通知服务
 *
 * GET /api/notifications/ - 获取消息列表
 * GET /api/notifications/unread-count - 获取未读数量
 * PATCH /api/notifications/:id/read - 标记消息已读
 * PATCH /api/notifications/read-all - 全部标记已读
 * DELETE /api/notifications/:id - 删除消息
 */

import type { ApiClient } from '../client'

/**
 * 消息类型
 */
export type MessageType = 'achievement' | 'reminder' | 'system'

/**
 * 消息通知
 */
export interface Notification {
  id: string
  type: MessageType
  title: string
  content: string
  isRead: boolean
  createdAt: string
}

/**
 * 消息列表响应
 */
export interface NotificationsResponse {
  messages: Notification[]
}

/**
 * 未读数量响应
 */
export interface UnreadCountResponse {
  count: number
}

export class NotificationsService {
  constructor(private client: ApiClient) {}

  /**
   * 获取消息列表
   *
   * @param type 类型筛选（可选）
   */
  async getMessages(type?: MessageType): Promise<NotificationsResponse> {
    const params = type ? { type } : undefined
    return this.client.get<NotificationsResponse>('/notifications/', { params })
  }

  /**
   * 获取未读数量
   */
  async getUnreadCount(): Promise<UnreadCountResponse> {
    return this.client.get<UnreadCountResponse>('/notifications/unread-count')
  }

  /**
   * 标记消息已读
   *
   * @param messageId 消息 ID
   */
  async markAsRead(messageId: string): Promise<{ success: boolean }> {
    return this.client.patch<{ success: boolean }>(`/notifications/${messageId}/read`)
  }

  /**
   * 全部标记已读
   */
  async markAllAsRead(): Promise<{ success: boolean }> {
    return this.client.patch<{ success: boolean }>('/notifications/read-all')
  }

  /**
   * 删除消息
   *
   * @param messageId 消息 ID
   */
  async deleteMessage(messageId: string): Promise<{ success: boolean }> {
    return this.client.delete<{ success: boolean }>(`/notifications/${messageId}`)
  }
}
