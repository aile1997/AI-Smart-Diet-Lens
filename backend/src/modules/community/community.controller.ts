import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { CommunityService } from './community.service'
import { CreatePostDto, CreateCommentDto, QueryPostsDto } from './dto/community.dto'
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { ApiResponse } from '../../common/api-response'
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'

/**
 * 社区控制器
 */
@ApiTags('community')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  /**
   * GET /api/community/posts
   * 获取社区帖子列表
   */
  @Get('posts')
  @ApiOperation({
    summary: '获取社区帖子列表',
    description: '分页获取社区帖子，支持标签筛选'
  })
  @ApiQuery({ name: 'page', required: false, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量', example: 20 })
  @ApiQuery({ name: 'tag', required: false, description: '标签筛选', example: '减脂' })
  @SwaggerApiResponse({ status: 200, description: '成功返回帖子列表' })
  async getPosts(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('tag') tag?: string,
  ) {
    const result = await this.communityService.getPosts(page, limit, tag)
    return ApiResponse.ok(result)
  }

  /**
   * GET /api/community/posts/:id
   * 获取帖子详情
   */
  @Get('posts/:id')
  @ApiOperation({
    summary: '获取帖子详情',
    description: '获取帖子详情和评论列表'
  })
  @SwaggerApiResponse({ status: 200, description: '成功返回帖子详情' })
  async getPostById(@Param('id') id: string) {
    const post = await this.communityService.getPostById(id)
    return ApiResponse.ok(post)
  }

  /**
   * POST /api/community/posts
   * 发布新帖子
   */
  @Post('posts')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '发布新帖子',
    description: '创建并发布新的社区帖子'
  })
  @SwaggerApiResponse({ status: 201, description: '成功发布帖子' })
  async createPost(
    @CurrentUser() user: UserPayload,
    @Body() dto: CreatePostDto,
  ) {
    const post = await this.communityService.createPost(user.sub, dto)
    return ApiResponse.ok(post)
  }

  /**
   * POST /api/community/posts/:id/like
   * 点赞/取消点赞帖子
   */
  @Post('posts/:id/like')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '点赞/取消点赞',
    description: '切换帖子的点赞状态'
  })
  @SwaggerApiResponse({ status: 200, description: '成功更新点赞状态' })
  async toggleLike(
    @Param('id') id: string,
    @Body() body: { liked: boolean },
  ) {
    const post = await this.communityService.toggleLike(id, body.liked)
    return ApiResponse.ok(post)
  }

  /**
   * DELETE /api/community/posts/:id
   * 删除帖子
   */
  @Delete('posts/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '删除帖子',
    description: '删除自己发布的帖子'
  })
  @SwaggerApiResponse({ status: 200, description: '成功删除帖子' })
  async deletePost(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    const result = await this.communityService.deletePost(id, user.sub)
    return ApiResponse.ok(result)
  }

  /**
   * POST /api/community/posts/:id/comments
   * 添加评论
   */
  @Post('posts/:id/comments')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '添加评论',
    description: '为帖子添加评论'
  })
  @SwaggerApiResponse({ status: 201, description: '成功添加评论' })
  async addComment(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
  ) {
    const comment = await this.communityService.addComment(id, user.sub, dto)
    return ApiResponse.ok(comment)
  }

  /**
   * DELETE /api/community/comments/:id
   * 删除评论
   */
  @Delete('comments/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '删除评论',
    description: '删除自己的评论'
  })
  @SwaggerApiResponse({ status: 200, description: '成功删除评论' })
  async deleteComment(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    const result = await this.communityService.deleteComment(id, user.sub)
    return ApiResponse.ok(result)
  }

  /**
   * GET /api/community/my-posts
   * 获取我发布的帖子
   */
  @Get('my-posts')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '获取我发布的帖子',
    description: '获取当前用户发布的所有帖子'
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @SwaggerApiResponse({ status: 200, description: '成功返回用户帖子' })
  async getMyPosts(
    @CurrentUser() user: UserPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.communityService.getUserPosts(user.sub, page, limit)
    return ApiResponse.ok(result)
  }
}
