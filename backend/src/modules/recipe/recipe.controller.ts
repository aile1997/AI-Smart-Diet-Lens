import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { RecipeService } from './recipe.service'
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { ApiResponse } from '../../common/api-response'
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'

/**
 * 智能内容控制器
 */
@ApiTags('recipes')
@ApiBearerAuth('JWT-auth')
@Controller('recipes')
@UseGuards(JwtGuard)
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  /**
   * GET /api/recipes/recommend
   * 基于营养缺口推荐食谱
   */
  @Get('recommend')
  @ApiOperation({ summary: '推荐食谱', description: '基于当日营养缺口智能推荐健康食谱' })
  @ApiQuery({ name: 'date', required: false, description: '日期 (YYYY-MM-DD)，默认今日', example: '2026-02-05' })
  @SwaggerApiResponse({ status: 200, description: '成功返回食谱推荐' })
  async recommendRecipes(
    @CurrentUser() user: UserPayload,
    @Query('date') date: string,
  ) {
    const result = await this.recipeService.recommendRecipes(
      user.sub,
      date || new Date().toISOString().split('T')[0],
    )
    return ApiResponse.ok(result)
  }
}
