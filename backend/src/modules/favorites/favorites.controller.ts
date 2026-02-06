import { Controller, Get, Post, Delete, Param, Query, UseGuards, Body } from '@nestjs/common'
import { FavoritesService } from './favorites.service'
import { CreateFavoriteDto } from './dto/favorite.dto'
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { ApiResponse } from '../../common/api-response'
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'

/**
 * 收藏控制器
 */
@ApiTags('favorites')
@ApiBearerAuth('JWT-auth')
@Controller('favorites')
@UseGuards(JwtGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  /**
   * GET /api/favorites
   * 获取收藏列表
   */
  @Get()
  @ApiOperation({
    summary: '获取收藏列表',
    description: '获取用户的收藏列表，支持类型筛选'
  })
  @ApiQuery({ name: 'type', required: false, description: '类型: recipe 或 food', example: 'recipe' })
  @SwaggerApiResponse({ status: 200, description: '成功返回收藏列表' })
  async getFavorites(
    @CurrentUser() user: UserPayload,
    @Query('type') type?: 'recipe' | 'food',
  ) {
    const favorites = await this.favoritesService.getFavorites(user.sub, type)
    return ApiResponse.ok(favorites)
  }

  /**
   * POST /api/favorites
   * 添加收藏
   */
  @Post()
  @ApiOperation({
    summary: '添加收藏',
    description: '收藏食谱或食材'
  })
  @SwaggerApiResponse({ status: 201, description: '成功添加收藏' })
  async addFavorite(
    @CurrentUser() user: UserPayload,
    @Body() dto: CreateFavoriteDto,
  ) {
    const favorite = await this.favoritesService.addFavorite(user.sub, dto.itemId, dto.type)
    return ApiResponse.ok(favorite)
  }

  /**
   * DELETE /api/favorites/:id
   * 取消收藏
   */
  @Delete(':id')
  @ApiOperation({
    summary: '取消收藏',
    description: '取消收藏指定的食谱或食材'
  })
  @SwaggerApiResponse({ status: 200, description: '成功取消收藏' })
  async removeFavorite(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    const result = await this.favoritesService.removeFavorite(user.sub, id)
    return ApiResponse.ok(result)
  }

  /**
   * GET /api/favorites/check
   * 检查是否已收藏
   */
  @Get('check')
  @ApiOperation({
    summary: '检查收藏状态',
    description: '检查指定项目是否已收藏'
  })
  @ApiQuery({ name: 'itemId', required: true, description: '项目 ID' })
  @ApiQuery({ name: 'type', required: true, description: '类型: recipe 或 food' })
  @SwaggerApiResponse({ status: 200, description: '返回收藏状态' })
  async checkFavorite(
    @CurrentUser() user: UserPayload,
    @Query('itemId') itemId: string,
    @Query('type') type: 'recipe' | 'food',
  ) {
    const isFavorited = await this.favoritesService.isFavorited(user.sub, itemId, type)
    return ApiResponse.ok({ isFavorited })
  }
}
