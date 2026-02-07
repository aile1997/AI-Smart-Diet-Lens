import { Controller, Post, Body, Get, Query } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { AuthService } from './auth.service'
import { SendCodeDto, EmailLoginDto, WechatLoginDto } from './dto/login.dto'
import { ApiResponse } from '../../common/api-response'
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBody } from '@nestjs/swagger'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/send-code
   * 发送邮箱验证码 (限流: 每 IP 每分钟 5 次)
   */
  @Post('send-code')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: '发送验证码', description: '向用户邮箱发送 6 位数字验证码' })
  @ApiBody({ type: SendCodeDto })
  @SwaggerApiResponse({ status: 200, description: '验证码已发送' })
  async sendCode(@Body() dto: SendCodeDto) {
    await this.authService.sendVerificationCode(dto.email)
    return { success: true, message: '验证码已发送' }
  }

  /**
   * POST /api/auth/login/email
   * 邮箱验证码登录 (限流: 每 IP 每分钟 10 次)
   */
  @Post('login/email')
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: '邮箱登录', description: '使用邮箱和验证码登录' })
  @ApiBody({ type: EmailLoginDto })
  @SwaggerApiResponse({ status: 200, description: '登录成功，返回 JWT Token' })
  async loginWithEmail(@Body() dto: EmailLoginDto) {
    const result = await this.authService.loginWithEmail(dto.email, dto.code)
    return ApiResponse.ok(result)
  }

  /**
   * POST /api/auth/login/wechat
   * 微信授权登录
   */
  @Post('login/wechat')
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: '微信登录', description: '使用微信授权码登录' })
  @ApiBody({ type: WechatLoginDto })
  @SwaggerApiResponse({ status: 200, description: '登录成功，返回 JWT Token' })
  async loginWithWechat(@Body() dto: WechatLoginDto) {
    const result = await this.authService.loginWithWechat(dto.code, dto.openid)
    return ApiResponse.ok(result)
  }

  /**
   * GET /api/auth/dev/code
   * 开发模式：获取验证码（仅用于测试）
   */
  @Get('dev/code')
  @ApiOperation({ summary: '获取验证码（开发模式）', description: '开发模式下获取邮箱对应的验证码，生产环境返回 null' })
  @SwaggerApiResponse({ status: 200, description: '返回验证码信息' })
  getDevCode(@Query('email') email: string) {
    const codeData = this.authService.getDevVerificationCode(email)
    if (!codeData) {
      return { success: false, message: '开发模式未启用或验证码不存在' }
    }
    return {
      success: true,
      data: {
        email,
        code: codeData.code,
        expiresAt: new Date(codeData.expiresAt).toISOString(),
      },
    }
  }
}
