import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../../common/prisma.service'
import { MailService } from '../mail/mail.service'
import { ConfigService } from '@nestjs/config'

/**
 * 验证码存储 (开发环境使用内存)
 * 生产环境应使用 Redis
 */
const verificationCodes = new Map<string, { code: string; expiresAt: number }>()

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}

  /**
   * 发送验证码
   */
  async sendVerificationCode(email: string): Promise<void> {
    // 生成 6 位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 分钟后过期

    // 存储验证码
    verificationCodes.set(email, { code, expiresAt })

    // 发送邮件
    await this.mailService.sendVerificationCode(email, code)
  }

  /**
   * 开发模式：获取验证码（仅用于测试）
   */
  getDevVerificationCode(email: string): { code: string; expiresAt: number } | null {
    const isDev = this.config.get<string>('NODE_ENV') !== 'production'
    if (!isDev) {
      return null
    }
    return verificationCodes.get(email) || null
  }

  /**
   * 邮箱验证码注册
   * 创建新账号，需要后续完成 onboarding
   */
  async registerWithEmail(email: string, code: string): Promise<{ token: string; user: any }> {
    // 验证验证码
    const stored = verificationCodes.get(email)
    if (!stored) {
      throw new UnauthorizedException('验证码不存在或已过期')
    }

    if (stored.code !== code) {
      throw new UnauthorizedException('验证码错误')
    }

    if (Date.now() > stored.expiresAt) {
      verificationCodes.delete(email)
      throw new UnauthorizedException('验证码已过期')
    }

    // 检查邮箱是否已注册
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new ConflictException('该邮箱已注册，请直接登录')
    }

    // 清除已使用的验证码
    verificationCodes.delete(email)

    // 创建新用户（未完成 onboarding）
    const user = await this.prisma.user.create({
      data: {
        email,
        emailVerified: true,
        onboardingCompleted: false,
      },
    })

    // 生成 JWT
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    })

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        needOnboarding: true,
      },
    }
  }

  /**
   * 邮箱 + 验证码登录
   * 仅限已注册用户
   */
  async loginWithEmail(email: string, code: string): Promise<{ token: string; user: any }> {
    // 验证验证码
    const stored = verificationCodes.get(email)
    if (!stored) {
      throw new UnauthorizedException('验证码不存在或已过期')
    }

    if (stored.code !== code) {
      throw new UnauthorizedException('验证码错误')
    }

    if (Date.now() > stored.expiresAt) {
      verificationCodes.delete(email)
      throw new UnauthorizedException('验证码已过期')
    }

    // 清除已使用的验证码
    verificationCodes.delete(email)

    // 查找用户（不再自动创建）
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('账号不存在，请先注册')
    }

    // 生成 JWT
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    })

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        needOnboarding: !user.onboardingCompleted,
      },
    }
  }

  /**
   * 微信授权登录
   * @param code 微信授权码
   * @param openid 微信 OpenID (可选，已登录时返回)
   */
  async loginWithWechat(code: string, openid?: string): Promise<{ token: string; user: any }> {
    // TODO: 调用微信 API 获取用户信息
    // 生产环境需要:
    // 1. 使用 code 换取 access_token 和 openid
    // 2. 获取用户信息
    // 3. 根据 openid 查找或创建用户

    // 当前为骨架实现
    if (openid) {
      let user = await this.prisma.user.findUnique({
        where: { wechatOpenid: openid },
      })

      if (!user) {
        // 创建新用户
        user = await this.prisma.user.create({
          data: {
            wechatOpenid: openid,
            email: `wx_${openid}@placeholder.com`, // 临时邮箱
            emailVerified: true,
          },
        })
      }

      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
      })

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar,
        },
      }
    }

    throw new UnauthorizedException('微信授权功能待实现')
  }

  /**
   * 验证 JWT Token
   */
  async validateUser(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
    }
  }
}
