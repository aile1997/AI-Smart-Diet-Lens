import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../../common/prisma.service'
import { MailService } from '../mail/mail.service'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'

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
   * 微信授权登录（微信内置浏览器）
   * @param code 微信授权码
   */
  async loginWithWechat(code: string): Promise<{ token: string; user: any }> {
    const appId = this.config.get<string>('WECHAT_APP_ID')
    const appSecret = this.config.get<string>('WECHAT_APP_SECRET')

    if (!appId || !appSecret) {
      throw new UnauthorizedException('微信登录未配置，请联系管理员')
    }

    try {
      // 调用微信 API 获取 access_token 和 openid
      const wxResponse = await fetch(
        `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`
      )
      const wxData = await wxResponse.json()

      if (wxData.errcode) {
        throw new UnauthorizedException(`微信授权失败: ${wxData.errmsg}`)
      }

      const wechatOpenid = wxData.openid

      // 查找或创建用户
      let user = await this.prisma.user.findUnique({
        where: { wechatOpenid },
      })

      if (!user) {
        // 创建新用户
        user = await this.prisma.user.create({
          data: {
            wechatOpenid,
            email: `wx_${wechatOpenid}@wechat.com`,
            nickname: '微信用户',
            emailVerified: true,
            onboardingCompleted: false,
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
          needOnboarding: !user.onboardingCompleted,
        },
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error
      }
      throw new UnauthorizedException('微信授权失败，请重试')
    }
  }

  /**
   * 获取微信授权 URL（用于跳转到微信授权页面）
   */
  getWechatAuthorizeUrl(redirectUri: string): string {
    const appId = this.config.get<string>('WECHAT_APP_ID')
    if (!appId) {
      throw new Error('微信登录未配置')
    }
    const state = Math.random().toString(36).substring(7)
    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`
  }

  /**
   * 简化登录 - 只需要邮箱
   * 如果用户不存在则自动创建，存在则直接登录
   */
  async loginSimple(email: string): Promise<{ token: string; user: any }> {
    // 查找用户
    let user = await this.prisma.user.findUnique({
      where: { email },
    })

    // 如果用户不存在，自动创建
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          emailVerified: true,
          onboardingCompleted: false,
        },
      })
    }

    // 生成 JWT Token
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
        needOnboarding: !user.onboardingCompleted,
      },
    }
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

  /**
   * 邮箱 + 密码 + 验证码注册
   * 标准的 APP 注册流程
   */
  async registerWithPassword(email: string, password: string, code: string): Promise<{ token: string; user: any }> {
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

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建新用户（未完成 onboarding）
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
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
   * 邮箱 + 密码登录
   * 主要的登录方式
   */
  async loginWithPassword(email: string, password: string): Promise<{ token: string; user: any }> {
    // 查找用户
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('账号或密码错误')
    }

    if (!user.password) {
      throw new UnauthorizedException('该账号未设置密码，请使用验证码登录')
    }

    // 验证密码
    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) {
      throw new UnauthorizedException('账号或密码错误')
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
}
