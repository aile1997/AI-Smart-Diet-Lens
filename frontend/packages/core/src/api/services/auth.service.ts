/**
 * 认证服务
 *
 * POST /api/auth/send-code - 发送验证码（邮箱）
 * POST /api/auth/login/email - 邮箱验证码登录
 * POST /api/auth/login/wechat - 微信授权登录
 */

import type { ApiClient } from '../client'

/**
 * 发送验证码响应
 */
export interface SendCodeResponse {
  success: boolean
  message?: string
  expires_in?: number  // 验证码过期时间（秒）
}

/**
 * 邮箱验证码登录响应
 */
export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    nickname?: string
    avatar?: string
    emailVerified: boolean
  }
}

/**
 * 微信登录响应
 */
export interface WechatLoginResponse {
  token: string
  user: {
    id: string
    email: string
    nickname?: string
    avatar?: string
  }
}

export class AuthService {
  constructor(private client: ApiClient) {}

  /**
   * 发送邮箱验证码
   *
   * @param email 邮箱地址
   */
  async sendCode(email: string): Promise<SendCodeResponse> {
    return this.client.post<SendCodeResponse>('/auth/send-code', { email })
  }

  /**
   * 邮箱验证码登录
   *
   * @param email 邮箱地址
   * @param code 验证码
   */
  async loginWithEmail(email: string, code: string): Promise<LoginResponse> {
    return this.client.post<LoginResponse>('/auth/login/email', { email, code })
  }

  /**
   * 微信授权登录
   *
   * @param code 微信授权码
   * @param openid 微信 OpenID（可选）
   */
  async loginWithWechat(code: string, openid?: string): Promise<WechatLoginResponse> {
    return this.client.post<WechatLoginResponse>('/auth/login/wechat', { code, openid })
  }
}
