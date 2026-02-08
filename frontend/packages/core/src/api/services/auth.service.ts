/**
 * 认证服务
 *
 * POST /api/auth/login/simple - 简化登录（只需邮箱）
 * POST /api/auth/send-code - 发送验证码（邮箱）
 * POST /api/auth/register/email - 邮箱验证码注册
 * POST /api/auth/register/password - 邮箱+密码+验证码注册
 * POST /api/auth/login/email - 邮箱验证码登录
 * POST /api/auth/login/password - 邮箱+密码登录
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
 * 用户信息
 */
export interface UserInfo {
  id: string
  email: string
  nickname?: string
  avatar?: string
  emailVerified: boolean
  needOnboarding?: boolean  // 是否需要完成入职引导
}

/**
 * 认证响应（注册/登录通用）
 */
export interface AuthResponse {
  token: string
  user: UserInfo
}

/**
 * 微信登录响应
 */
export interface WechatLoginResponse {
  token: string
  user: UserInfo
}

export class AuthService {
  constructor(private client: ApiClient) {}

  /**
   * 简化登录 - 只需要邮箱
   *
   * @param email 邮箱地址
   */
  async loginSimple(email: string): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/auth/login/simple', { email })
  }

  /**
   * 发送邮箱验证码
   *
   * @param email 邮箱地址
   */
  async sendCode(email: string): Promise<SendCodeResponse> {
    return this.client.post<SendCodeResponse>('/auth/send-code', { email })
  }

  /**
   * 邮箱验证码注册
   *
   * @param email 邮箱地址
   * @param code 验证码
   */
  async registerWithEmail(email: string, code: string): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/auth/register/email', { email, code })
  }

  /**
   * 邮箱验证码登录
   *
   * @param email 邮箱地址
   * @param code 验证码
   */
  async loginWithEmail(email: string, code: string): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/auth/login/email', { email, code })
  }

  /**
   * 微信授权登录（微信内置浏览器）
   *
   * @param code 微信授权码
   * @param openid 微信 OpenID（可选）
   */
  async loginWithWechat(code: string, openid?: string): Promise<WechatLoginResponse> {
    return this.client.post<WechatLoginResponse>('/auth/login/wechat', { code, openid })
  }

  /**
   * 邮箱+密码+验证码注册
   *
   * @param email 邮箱地址
   * @param password 密码
   * @param code 验证码
   */
  async registerWithPassword(email: string, password: string, code: string): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/auth/register/password', { email, password, code })
  }

  /**
   * 邮箱+密码登录
   *
   * @param email 邮箱地址
   * @param password 密码
   */
  async loginWithPassword(email: string, password: string): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/auth/login/password', { email, password })
  }
}
