import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'

/**
 * 收藏服务
 */
@Injectable()
export class FavoritesService {
  private readonly logger = new Logger(FavoritesService.name)

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 获取收藏列表
   */
  async getFavorites(userId: string, type?: 'recipe' | 'food') {
    const where: { userId: string; type?: 'recipe' | 'food' } = { userId }
    if (type) {
      where.type = type
    }

    const favorites = await this.prisma.favorite.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return favorites
  }

  /**
   * 添加收藏
   */
  async addFavorite(userId: string, itemId: string, type: 'recipe' | 'food') {
    // 检查是否已收藏
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_itemId_type: {
          userId,
          itemId,
          type,
        },
      },
    })

    if (existing) {
      throw new Error('已收藏')
    }

    return this.prisma.favorite.create({
      data: {
        userId,
        itemId,
        type,
      },
    })
  }

  /**
   * 取消收藏
   */
  async removeFavorite(userId: string, favoriteId: string) {
    // 验证收藏属于当前用户
    const favorite = await this.prisma.favorite.findUnique({
      where: { id: favoriteId },
    })

    if (!favorite) {
      throw new Error('收藏不存在')
    }

    if (favorite.userId !== userId) {
      throw new Error('无权操作')
    }

    await this.prisma.favorite.delete({
      where: { id: favoriteId },
    })

    return { success: true }
  }

  /**
   * 检查是否已收藏
   */
  async isFavorited(userId: string, itemId: string, type: 'recipe' | 'food'): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_itemId_type: {
          userId,
          itemId,
          type,
        },
      },
    })

    return !!favorite
  }
}
