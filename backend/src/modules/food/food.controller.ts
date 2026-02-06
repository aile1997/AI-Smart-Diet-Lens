import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common'
import { FoodService } from './food.service'
import { AnalyzeFoodDto } from './dto/analyze.dto'
import { SearchFoodDto } from './dto/search.dto'
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { ApiResponse } from '../../common/api-response'
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'

/**
 * AI 分析控制器
 */
@ApiTags('ai')
@ApiBearerAuth('JWT-auth')
@Controller('ai')
@UseGuards(JwtGuard)
export class AIController {
  constructor(private readonly foodService: FoodService) {}

  /**
   * POST /api/ai/analyze
   * 提交食物识别分析
   */
  @Post('analyze')
  @ApiOperation({ summary: 'AI 食物识别', description: '基于 Gemini API 进行食物拍照识别' })
  @SwaggerApiResponse({ status: 200, description: '成功返回识别结果' })
  async analyze(@Body() dto: AnalyzeFoodDto) {
    const result = await this.foodService.analyzeFood(dto)
    return ApiResponse.ok(result)
  }
}

/**
 * 食物控制器
 */
@ApiTags('food')
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  /**
   * GET /api/food/search
   * 文本模糊搜索
   */
  @Get('search')
  @ApiOperation({ summary: '搜索食物', description: '通过食物名称模糊搜索' })
  @ApiQuery({ name: 'q', required: true, description: '搜索关键词' })
  @ApiQuery({ name: 'page', required: false, description: '页码，默认 1' })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量，默认 20' })
  @SwaggerApiResponse({ status: 200, description: '成功返回搜索结果' })
  async search(@Query() query: SearchFoodDto) {
    const result = await this.foodService.searchFood(
      query.q,
      query.page,
      query.limit,
    )
    return ApiResponse.ok(result)
  }

  /**
   * GET /api/food/barcode/:code
   * 条形码查询
   */
  @Get('barcode/:code')
  @ApiOperation({ summary: '条形码查询', description: '通过 EAN 条形码查找食物' })
  @SwaggerApiResponse({ status: 200, description: '成功返回食物信息' })
  async findByBarcode(@Param('code') code: string) {
    const result = await this.foodService.findByBarcode(code)
    return ApiResponse.ok(result)
  }
}
