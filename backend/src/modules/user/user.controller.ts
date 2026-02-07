import { Controller, Post, Put, Get, Patch, Body, Param, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { OnboardingDto } from './dto/onboarding.dto'
import {
  HealthSyncDto,
  SwitchStrategyDto,
  UpdateMetricsDto,
} from './dto/health-sync.dto'
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { ApiResponse } from '../../common/api-response'
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBearerAuth } from '@nestjs/swagger'

@ApiTags('user')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * POST /api/user/onboarding
   * 用户入职引导
   */
  @Post('onboarding')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '用户入职引导', description: '首次登录时提交用户基本信息、目标和健康数据' })
  @SwaggerApiResponse({ status: 201, description: '成功完成入职引导，返回营养目标' })
  async onboarding(@CurrentUser() user: UserPayload, @Body() dto: OnboardingDto) {
    const result = await this.userService.onboarding(user.sub, dto)
    return ApiResponse.ok(result)
  }

  /**
   * GET /api/user/profile
   * 获取当前登录用户的资料
   * 注意：必须在 @Get(':id') 之前定义，否则 'profile' 会被当作 :id 参数
   */
  @Get('profile')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '获取当前用户资料', description: '获取当前登录用户的资料信息' })
  @SwaggerApiResponse({ status: 200, description: '成功返回用户信息' })
  async getCurrentProfile(@CurrentUser() user: UserPayload) {
    const result = await this.userService.findById(user.sub)
    return ApiResponse.ok(result)
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '获取用户资料', description: '根据用户 ID 查询用户基本信息（仅限本人）' })
  @SwaggerApiResponse({ status: 200, description: '成功返回用户信息' })
  async getProfile(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    // 只允许用户查看自己的资料
    const result = await this.userService.findById(id, user.sub)
    return ApiResponse.ok(result)
  }

  @Put(':id/profile')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '更新用户资料', description: '更新用户基本信息（仅限本人）' })
  @SwaggerApiResponse({ status: 200, description: '成功更新用户信息' })
  async updateProfile(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    // 只允许用户修改自己的资料
    const result = await this.userService.updateProfile(id, body, user.sub)
    return ApiResponse.ok(result)
  }

  /**
   * POST /api/user/health-sync
   * 批量同步健康数据
   */
  @Post('health-sync')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '同步健康数据', description: '批量同步来自 Health Connect / HealthKit 的健康数据' })
  @SwaggerApiResponse({ status: 201, description: '成功同步健康数据' })
  async healthSync(@CurrentUser() user: UserPayload, @Body() dto: HealthSyncDto) {
    const result = await this.userService.healthSync(user.sub, dto)
    return ApiResponse.ok(result)
  }

  /**
   * POST /api/user/strategy/switch
   * 切换核心策略
   */
  @Post('strategy/switch')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '切换核心策略', description: '在 FAT_LOSS / MAINTAIN / MUSCLE_GAIN 之间切换' })
  @SwaggerApiResponse({ status: 201, description: '成功切换策略，返回新的营养目标' })
  async switchStrategy(
    @CurrentUser() user: UserPayload,
    @Body() dto: SwitchStrategyDto,
  ) {
    const result = await this.userService.switchStrategy(user.sub, dto)
    return ApiResponse.ok(result)
  }

  /**
   * PATCH /api/user/profile/metrics
   * 更新身体指标
   */
  @Patch('profile/metrics')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '更新身体指标', description: '更新当前体重、体脂率等指标' })
  @SwaggerApiResponse({ status: 200, description: '成功更新身体指标' })
  async updateMetrics(
    @CurrentUser() user: UserPayload,
    @Body() dto: UpdateMetricsDto,
  ) {
    const result = await this.userService.updateMetrics(user.sub, dto)
    return ApiResponse.ok(result)
  }
}
