import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SendCodeDto, EmailLoginDto, WechatLoginDto } from './dto/login.dto'
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse } from '@nestjs/swagger'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/send-code
   * 发送邮箱验证码
   */
  @Post('send-code')
  @ApiOperation({ summary: '发送验证码', description: '向用户邮箱发送 6 位数字验证码' })
  @SwaggerApiResponse({ status: 200, description: '验证码已发送' })
  async sendCode(@Body() dto: SendCodeDto) {
    await this.authService.sendVerificationCode(dto.email)
    return { success: true, message: '验证码已发送' }
  }

  /**
   * POST /api/auth/login/email
   * 邮箱验证码登录
   */
  @Post('login/email')
  @ApiOperation({ summary: '邮箱登录', description: '使用邮箱和验证码登录' })
  @SwaggerApiResponse({ status: 200, description: '登录成功，返回 JWT Token' })
  async loginWithEmail(@Body() dto: EmailLoginDto) {
    return this.authService.loginWithEmail(dto.email, dto.code)
  }

  /**
   * POST /api/auth/login/wechat
   * 微信授权登录
   */
  @Post('login/wechat')
  @ApiOperation({ summary: '微信登录', description: '使用微信授权码登录' })
  @SwaggerApiResponse({ status: 200, description: '登录成功，返回 JWT Token' })
  async loginWithWechat(@Body() dto: WechatLoginDto) {
    return this.authService.loginWithWechat(dto.code, dto.openid)
  }
}
