import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'

/**
 * 消息类型
 */
export enum MessageType {
  ACHIEVEMENT = 'achievement',
  REMINDER = 'reminder',
  SYSTEM = 'system',
}

/**
 * 消息服务 (仅系统通知)
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name)

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 获取用户消息列表
   */
  async getMessages(userId: string, type?: MessageType) {
    const where: { userId: string; type?: MessageType } = { userId }
    if (type) {
      where.type = type
    }

    const messages = await this.prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return messages
  }

  /**
   * 获取未读消息数量
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.message.count({
      where: {
        userId,
        isRead: false,
      },
    })
  }

  /**
   * 标记消息已读
   */
  async markAsRead(messageId: string, userId: string) {
    // 验证消息属于当前用户
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      throw new Error('消息不存在')
    }

    if (message.userId !== userId) {
      throw new Error('无权操作')
    }

    await this.prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    })

    return { success: true }
  }

  /**
   * 标记所有消息已读
   */
  async markAllAsRead(userId: string) {
    await this.prisma.message.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    })

    return { success: true }
  }

  /**
   * 创建系统消息
   */
  async createMessage(userId: string, type: MessageType, title: string, content: string) {
    return this.prisma.message.create({
      data: {
        userId,
        type,
        title,
        content,
      },
    })
  }

  /**
   * 创建成就解锁消息
   */
  async createAchievementMessage(userId: string, achievementName: string) {
    return this.createMessage(
      userId,
      MessageType.ACHIEVEMENT,
      '🎉 成就解锁',
      `恭喜您解锁了「${achievementName}」成就！`,
    )
  }

  /**
   * 创建提醒消息
   */
  async createReminderMessage(userId: string, content: string) {
    return this.createMessage(
      userId,
      MessageType.REMINDER,
      '📋 温馨提醒',
      content,
    )
  }

  /**
   * 创建系统消息
   */
  async createSystemMessage(userId: string, title: string, content: string) {
    return this.createMessage(
      userId,
      MessageType.SYSTEM,
      title,
      content,
    )
  }

  /**
   * 删除消息
   */
  async deleteMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      throw new Error('消息不存在')
    }

    if (message.userId !== userId) {
      throw new Error('无权操作')
    }

    await this.prisma.message.delete({
      where: { id: messageId },
    })

    return { success: true }
  }
}
