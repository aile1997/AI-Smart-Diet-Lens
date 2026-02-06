import { Controller, Get, UseGuards } from '@nestjs/common'
import { GamificationService } from './gamification.service'
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { ApiResponse } from '../../common/api-response'
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBearerAuth } from '@nestjs/swagger'

/**
 * 游戏化控制器
 */
@ApiTags('gamification')
@ApiBearerAuth('JWT-auth')
@Controller('gamification')
@UseGuards(JwtGuard)
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  /**
   * GET /api/gamification/achievements
   * 获取成就墙
   */
  @Get('achievements')
  @ApiOperation({ summary: '获取成就墙', description: '返回用户所有成就徽章和解锁进度' })
  @SwaggerApiResponse({ status: 200, description: '成功返回成就数据' })
  async getAchievements(@CurrentUser() user: UserPayload) {
    const result = await this.gamificationService.getAchievements(user.sub)
    return ApiResponse.ok(result)
  }
}
