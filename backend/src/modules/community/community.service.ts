import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'
import { CreatePostDto, CreateCommentDto } from './dto/community.dto'

/**
 * 社区服务
 */
@Injectable()
export class CommunityService {
  private readonly logger = new Logger(CommunityService.name)

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 获取帖子列表
   */
  async getPosts(page: number = 1, limit: number = 20, tag?: string) {
    const skip = (page - 1) * limit

    const where = tag ? { tags: { has: tag } } : {}

    const [posts, total] = await Promise.all([
      this.prisma.communityPost.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              avatar: true,
            },
          },
          _count: {
            select: { comments: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.communityPost.count({ where }),
    ])

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * 获取帖子详情
   */
  async getPostById(id: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            bio: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!post) {
      throw new Error('帖子不存在')
    }

    return post
  }

  /**
   * 创建帖子
   */
  async createPost(userId: string, dto: CreatePostDto) {
    return this.prisma.communityPost.create({
      data: {
        userId,
        content: dto.content,
        images: dto.images || [],
        tags: dto.tags || [],
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    })
  }

  /**
   * 点赞/取消点赞帖子
   */
  async toggleLike(postId: string, liked: boolean) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new Error('帖子不存在')
    }

    return this.prisma.communityPost.update({
      where: { id: postId },
      data: {
        likes: liked ? post.likes + 1 : Math.max(0, post.likes - 1),
      },
    })
  }

  /**
   * 添加评论
   */
  async addComment(postId: string, userId: string, dto: CreateCommentDto) {
    // 验证帖子存在
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new Error('帖子不存在')
    }

    // 创建评论
    const comment = await this.prisma.comment.create({
      data: {
        postId,
        userId,
        content: dto.content,
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    })

    // 更新帖子评论数（可选，如果需要的话）

    return comment
  }

  /**
   * 删除评论
   */
  async deleteComment(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      throw new Error('评论不存在')
    }

    if (comment.userId !== userId) {
      throw new Error('无权删除此评论')
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    })

    return { success: true }
  }

  /**
   * 删除帖子
   */
  async deletePost(postId: string, userId: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new Error('帖子不存在')
    }

    if (post.userId !== userId) {
      throw new Error('无权删除此帖子')
    }

    await this.prisma.communityPost.delete({
      where: { id: postId },
    })

    return { success: true }
  }

  /**
   * 获取用户发布的帖子
   */
  async getUserPosts(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit

    const [posts, total] = await Promise.all([
      this.prisma.communityPost.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.communityPost.count({ where: { userId } }),
    ])

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
}
