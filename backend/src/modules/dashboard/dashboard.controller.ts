import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { ApiResponse } from '../../common/api-response'
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'

/**
 * 仪表盘控制器
 */
@ApiTags('dashboard')
@ApiBearerAuth('JWT-auth')
@Controller('dashboard')
@UseGuards(JwtGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * GET /api/dashboard/summary
   * 获取今日聚合视图
   */
  @Get('summary')
  @ApiOperation({ summary: '获取仪表盘摘要', description: '返回今日营养数据、策略模式和智能提醒' })
  @ApiQuery({ name: 'date', required: false, description: '日期 (YYYY-MM-DD)，默认今日', example: '2026-02-05' })
  @SwaggerApiResponse({ status: 200, description: '成功返回仪表盘摘要' })
  async getSummary(
    @CurrentUser() user: UserPayload,
    @Query('date') date: string,
  ) {
    const summary = await this.dashboardService.getSummary(
      user.sub,
      date || new Date().toISOString().split('T')[0],
    )
    return ApiResponse.ok(summary)
  }
}
