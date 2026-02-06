/**
 * 社区服务
 *
 * GET /api/community/posts - 获取帖子列表
 * POST /api/community/posts - 发布帖子
 * POST /api/community/posts/:id/like - 点赞/取消点赞
 * POST /api/community/posts/:id/comments - 添加评论
 * DELETE /api/community/posts/:id - 删除帖子
 * GET /api/community/posts/my - 获取我的帖子
 */

import type { ApiClient } from '../client'

/**
 * 用户信息
 */
export interface UserInfo {
  id: string
  nickname: string
  avatar?: string
}

/**
 * 社区帖子
 */
export interface Post {
  id: string
  content: string
  images: string[]
  tags: string[]
  likes: number
  isLiked: boolean
  createdAt: string
  updatedAt: string
  user: UserInfo
}

/**
 * 评论
 */
export interface Comment {
  id: string
  postId: string
  content: string
  createdAt: string
  user: UserInfo
}

/**
 * 帖子列表响应
 */
export interface PostsResponse {
  posts: Post[]
  total: number
  page: number
  limit: number
}

/**
 * 点赞响应
 */
export interface LikeResponse {
  liked: boolean
  likesCount: number
}

export class CommunityService {
  constructor(private client: ApiClient) {}

  /**
   * 获取帖子列表
   *
   * @param page 页码
   * @param limit 每页数量
   * @param tag 标签筛选（可选）
   */
  async getPosts(page = 1, limit = 20, tag?: string): Promise<PostsResponse> {
    const params: Record<string, string | number> = { page, limit }
    if (tag) params.tag = tag
    return this.client.get<PostsResponse>('/community/posts', { params })
  }

  /**
   * 发布帖子
   *
   * @param content 内容
   * @param images 图片列表
   * @param tags 标签列表
   */
  async createPost(content: string, images?: string[], tags?: string[]): Promise<Post> {
    return this.client.post<Post>('/community/posts', { content, images, tags })
  }

  /**
   * 点赞/取消点赞
   *
   * @param postId 帖子 ID
   */
  async toggleLike(postId: string): Promise<LikeResponse> {
    return this.client.post<LikeResponse>(`/community/posts/${postId}/like`)
  }

  /**
   * 添加评论
   *
   * @param postId 帖子 ID
   * @param content 评论内容
   */
  async addComment(postId: string, content: string): Promise<Comment> {
    return this.client.post<Comment>(`/community/posts/${postId}/comments`, { content })
  }

  /**
   * 删除帖子
   *
   * @param postId 帖子 ID
   */
  async deletePost(postId: string): Promise<{ success: boolean }> {
    return this.client.delete<{ success: boolean }>(`/community/posts/${postId}`)
  }

  /**
   * 获取我的帖子
   */
  async getMyPosts(): Promise<Post[]> {
    return this.client.get<Post[]>('/community/posts/my')
  }
}
