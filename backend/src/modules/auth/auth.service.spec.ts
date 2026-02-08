import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PrismaService } from '../../common/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { MailService } from '../mail/mail.service'
import { ConfigService } from '@nestjs/config'

describe('AuthService', () => {
  let service: AuthService
  let prismaService: PrismaService
  let jwtService: JwtService
  let mailService: MailService

  // 存储生成的验证码，用于测试
  let generatedCode: string | null = null

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  }

  const mockJwtService = {
    sign: jest.fn(() => 'mock_jwt_token'),
    verify: jest.fn(),
  }

  // 创建一个真实的 MailService mock，能够捕获生成的验证码
  const mockMailService = {
    sendVerificationCode: jest.fn((email: string, code: string) => {
      generatedCode = code
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    prismaService = module.get<PrismaService>(PrismaService)
    jwtService = module.get<JwtService>(JwtService)
    mailService = module.get<MailService>(MailService)

    // 清空生成的验证码
    generatedCode = null
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('sendVerificationCode', () => {
    it('should generate and send 6-digit code', async () => {
      const email = 'test@example.com'

      await service.sendVerificationCode(email)

      expect(generatedCode).toMatch(/^\d{6}$/)
      expect(mockMailService.sendVerificationCode).toHaveBeenCalledWith(
        email,
        generatedCode,
      )
    })
  })

  describe('loginWithEmail', () => {
    const email = 'test@example.com'
    let code: string

    beforeEach(async () => {
      // 使用 sendVerificationCode 生成验证码
      await service.sendVerificationCode(email)
      code = generatedCode!
    })

    it('should login existing user with correct code', async () => {
      const mockUser = {
        id: 'user_123',
        email,
        nickname: 'Test User',
        avatar: null,
        emailVerified: true,
        onboardingCompleted: true,
      }

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)

      const result = await service.loginWithEmail(email, code)

      expect(result.token).toBe('mock_jwt_token')
      expect(result.user).toMatchObject({
        id: 'user_123',
        email,
        emailVerified: true,
        needOnboarding: false,
      })
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'user_123',
        email,
      })
    })

    // 注意: 旧测试 "should create new user when not exists" 已删除
    // 因为 loginWithEmail 现在不再自动创建用户，需要先注册

    it('should throw error when code is wrong', async () => {
      await expect(service.loginWithEmail(email, '000000')).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('should throw error when code not exists', async () => {
      await expect(
        service.loginWithEmail('nonexistent@example.com', '123456'),
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('loginWithWechat', () => {
    it('should login with openid', async () => {
      const openid = 'wx_openid_123'
      const mockUser = {
        id: 'wx_user_123',
        email: `wx_${openid}@placeholder.com`,
        nickname: null,
        avatar: null,
      }

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)

      const result = await service.loginWithWechat('dummy_code')

      expect(result.token).toBe('mock_jwt_token')
      expect(result.user.id).toBe('wx_user_123')
    })

    it('should create new user for first time wechat login', async () => {
      const openid = 'wx_openid_456'
      const newUser = {
        id: 'new_wx_user',
        email: `wx_${openid}@placeholder.com`,
        nickname: null,
        avatar: null,
      }

      mockPrismaService.user.findUnique.mockResolvedValue(null)
      mockPrismaService.user.create.mockResolvedValue(newUser)

      const result = await service.loginWithWechat('dummy_code')

      expect(mockPrismaService.user.create).toHaveBeenCalled()
      expect(result.user.id).toBe('new_wx_user')
    })

    it('should throw error when openid not provided', async () => {
      await expect(
        service.loginWithWechat('dummy_code'),
      ).rejects.toThrow(UnauthorizedException)
    })
  })
})
