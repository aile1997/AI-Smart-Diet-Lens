/**
 * AuthService 单元测试
 *
 * 测试认证相关 API 服务
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuthService } from '../../src/api/services/auth.service'
import { ApiClient } from '../../src/api/client'

// Mock ApiClient
vi.mock('../../src/api/client')

describe('AuthService', () => {
  let authService: AuthService
  let mockClient: {
    get: ReturnType<typeof vi.fn>
    post: ReturnType<typeof vi.fn>
    put: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    // 创建 mock ApiClient
    mockClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    }

    // Mock ApiClient constructor
    vi.mocked(ApiClient).mockImplementation(() => mockClient as any)

    authService = new AuthService(mockClient as any)
  })

  describe('sendCode', () => {
    it('应成功发送验证码', async () => {
      const mockResponse = {
        success: true,
        message: '验证码已发送',
        expires_in: 300
      }

      mockClient.post.mockResolvedValue(mockResponse)

      const result = await authService.sendCode('test@example.com')

      expect(result).toEqual(mockResponse)
      expect(mockClient.post).toHaveBeenCalledWith('/auth/send-code', { email: 'test@example.com' })
    })

    it('应处理发送失败', async () => {
      mockClient.post.mockRejectedValue(new Error('网络错误'))

      await expect(authService.sendCode('test@example.com')).rejects.toThrow('网络错误')
    })
  })

  describe('loginWithEmail', () => {
    it('应成功登录', async () => {
      const mockResponse = {
        token: 'jwt-token-123',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          nickname: 'Test User',
          avatar: 'http://example.com/avatar.jpg',
          emailVerified: true
        }
      }

      mockClient.post.mockResolvedValue(mockResponse)

      const result = await authService.loginWithEmail('test@example.com', '123456')

      expect(result).toEqual(mockResponse)
      expect(mockClient.post).toHaveBeenCalledWith('/auth/login/email', {
        email: 'test@example.com',
        code: '123456'
      })
    })

    it('应处理验证码错误', async () => {
      mockClient.post.mockRejectedValue(new Error('验证码错误'))

      await expect(authService.loginWithEmail('test@example.com', '000000')).rejects.toThrow('验证码错误')
    })

    it('应处理用户不存在', async () => {
      mockClient.post.mockRejectedValue(new Error('用户不存在'))

      await expect(authService.loginWithEmail('new@example.com', '123456')).rejects.toThrow('用户不存在')
    })
  })

  describe('loginWithWechat', () => {
    it('应成功微信登录', async () => {
      const mockResponse = {
        token: 'wechat-jwt-token',
        user: {
          id: 'wechat-user-123',
          email: 'wechat@example.com',
          nickname: '微信用户',
          avatar: 'http://wechat.com/avatar.jpg'
        }
      }

      mockClient.post.mockResolvedValue(mockResponse)

      const result = await authService.loginWithWechat('wx-code', 'wx-openid')

      expect(result).toEqual(mockResponse)
      expect(mockClient.post).toHaveBeenCalledWith('/auth/login/wechat', {
        code: 'wx-code',
        openid: 'wx-openid'
      })
    })

    it('应支持不带 openid 的微信登录', async () => {
      const mockResponse = {
        token: 'wechat-jwt-token',
        user: {
          id: 'wechat-user-456',
          email: 'wechat2@example.com',
          nickname: '微信用户2'
        }
      }

      mockClient.post.mockResolvedValue(mockResponse)

      const result = await authService.loginWithWechat('wx-code')

      expect(result).toEqual(mockResponse)
      expect(mockClient.post).toHaveBeenCalledWith('/auth/login/wechat', {
        code: 'wx-code',
        openid: undefined
      })
    })

    it('应处理微信授权码无效', async () => {
      mockClient.post.mockRejectedValue(new Error('授权码无效'))

      await expect(authService.loginWithWechat('invalid-code')).rejects.toThrow('授权码无效')
    })
  })
})
