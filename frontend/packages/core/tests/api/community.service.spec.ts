/**
 * CommunityService 单元测试
 *
 * 测试社区 API 服务
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CommunityService } from '../../src/api/services/community.service'
import type { ApiClient } from '../../src/api/client'

describe('CommunityService', () => {
  let communityService: CommunityService
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

    communityService = new CommunityService(mockClient as any)
  })

  describe('getPosts', () => {
    it('应成功获取帖子列表（默认参数）', async () => {
      const mockResponse = {
        posts: [
          {
            id: 'post-1',
            content: '今天吃得很健康！',
            images: ['https://example.com/images/food.jpg'],
            tags: ['健康饮食', '减脂'],
            likes: 10,
            isLiked: false,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
            user: {
              id: 'user-1',
              nickname: '健身达人',
              avatar: 'https://example.com/avatars/user1.jpg'
            }
          }
        ],
        total: 50,
        page: 1,
        limit: 20
      }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await communityService.getPosts()

      expect(result).toEqual(mockResponse)
      expect(mockClient.get).toHaveBeenCalledWith('/community/posts', {
        params: { page: 1, limit: 20 }
      })
    })

    it('应支持自定义分页参数', async () => {
      const mockResponse = {
        posts: [],
        total: 50,
        page: 2,
        limit: 10
      }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await communityService.getPosts(2, 10)

      expect(result).toEqual(mockResponse)
      expect(mockClient.get).toHaveBeenCalledWith('/community/posts', {
        params: { page: 2, limit: 10 }
      })
    })

    it('应支持标签筛选', async () => {
      const mockResponse = {
        posts: [],
        total: 20,
        page: 1,
        limit: 20
      }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await communityService.getPosts(1, 20, '减脂')

      expect(result).toEqual(mockResponse)
      expect(mockClient.get).toHaveBeenCalledWith('/community/posts', {
        params: { page: 1, limit: 20, tag: '减脂' }
      })
    })
  })

  describe('createPost', () => {
    it('应成功发布帖子（纯文字）', async () => {
      const mockPost = {
        id: 'post-2',
        content: '今天的午餐很好吃！',
        images: [],
        tags: ['午餐分享'],
        likes: 0,
        isLiked: false,
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z',
        user: {
          id: 'user-2',
          nickname: '美食爱好者'
        }
      }

      mockClient.post.mockResolvedValue(mockPost)

      const result = await communityService.createPost('今天的午餐很好吃！')

      expect(result).toEqual(mockPost)
      expect(mockClient.post).toHaveBeenCalledWith('/community/posts', {
        content: '今天的午餐很好吃！',
        images: undefined,
        tags: undefined
      })
    })

    it('应支持带图片和标签的帖子', async () => {
      const mockPost = {
        id: 'post-3',
        content: '分享一下我的减脂餐',
        images: ['https://example.com/images/meal1.jpg', 'https://example.com/images/meal2.jpg'],
        tags: ['减脂餐', '食谱分享'],
        likes: 5,
        isLiked: false,
        createdAt: '2024-01-15T13:00:00Z',
        updatedAt: '2024-01-15T13:00:00Z',
        user: {
          id: 'user-3',
          nickname: '减脂达人'
        }
      }

      mockClient.post.mockResolvedValue(mockPost)

      const result = await communityService.createPost(
        '分享一下我的减脂餐',
        ['https://example.com/images/meal1.jpg', 'https://example.com/images/meal2.jpg'],
        ['减脂餐', '食谱分享']
      )

      expect(result).toEqual(mockPost)
      expect(mockClient.post).toHaveBeenCalledWith('/community/posts', {
        content: '分享一下我的减脂餐',
        images: ['https://example.com/images/meal1.jpg', 'https://example.com/images/meal2.jpg'],
        tags: ['减脂餐', '食谱分享']
      })
    })
  })

  describe('toggleLike', () => {
    it('应成功点赞帖子', async () => {
      const mockResponse = {
        liked: true,
        likesCount: 11
      }

      mockClient.post.mockResolvedValue(mockResponse)

      const result = await communityService.toggleLike('post-1')

      expect(result).toEqual(mockResponse)
      expect(mockClient.post).toHaveBeenCalledWith('/community/posts/post-1/like')
    })

    it('应支持取消点赞', async () => {
      const mockResponse = {
        liked: false,
        likesCount: 9
      }

      mockClient.post.mockResolvedValue(mockResponse)

      const result = await communityService.toggleLike('post-1')

      expect(result.liked).toBe(false)
    })
  })

  describe('addComment', () => {
    it('应成功添加评论', async () => {
      const mockComment = {
        id: 'comment-1',
        postId: 'post-1',
        content: '看着真不错！',
        createdAt: '2024-01-15T14:00:00Z',
        user: {
          id: 'user-4',
          nickname: '路人甲'
        }
      }

      mockClient.post.mockResolvedValue(mockComment)

      const result = await communityService.addComment('post-1', '看着真不错！')

      expect(result).toEqual(mockComment)
      expect(mockClient.post).toHaveBeenCalledWith('/community/posts/post-1/comments', {
        content: '看着真不错！'
      })
    })
  })

  describe('deletePost', () => {
    it('应成功删除帖子', async () => {
      const mockResponse = { success: true }

      mockClient.delete.mockResolvedValue(mockResponse)

      const result = await communityService.deletePost('post-1')

      expect(result).toEqual(mockResponse)
      expect(mockClient.delete).toHaveBeenCalledWith('/community/posts/post-1')
    })

    it('应处理删除失败', async () => {
      mockClient.delete.mockRejectedValue(new Error('无权删除'))

      await expect(communityService.deletePost('post-1')).rejects.toThrow('无权删除')
    })
  })

  describe('getMyPosts', () => {
    it('应成功获取我的帖子', async () => {
      const mockPosts = [
        {
          id: 'my-post-1',
          content: '我的第一条帖子',
          images: [],
          tags: ['日记'],
          likes: 3,
          isLiked: false,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          user: {
            id: 'my-user-id',
            nickname: '我'
          }
        }
      ]

      mockClient.get.mockResolvedValue(mockPosts)

      const result = await communityService.getMyPosts()

      expect(result).toEqual(mockPosts)
      expect(mockClient.get).toHaveBeenCalledWith('/community/posts/my')
    })
  })
})
