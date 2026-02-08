/**
 * API 集成测试
 *
 * 验证 baseURL + endpoint = 正确的完整 URL
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiClient } from '../../src/api/client'
import { AuthService } from '../../src/api/services/auth.service'

describe('API URL 拼接集成测试', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  let apiClient: ApiClient
  let authService: AuthService

  beforeEach(() => {
    mockFetch = vi.fn()
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: { token: 'test-token' } })
    } as Response)

    // 使用与实际环境相同的 baseURL
    apiClient = new ApiClient({
      baseURL: 'http://localhost:3000/api',
      tokenGetter: () => null,
      fetchProvider: mockFetch as unknown as typeof fetch
    })

    authService = new AuthService(apiClient)
  })

  it('AuthService.sendCode 应请求正确的完整 URL', async () => {
    await authService.sendCode('test@example.com')

    // 验证 fetch 被调用时使用了正确的 URL
    const calledUrl = mockFetch.mock.calls[0][0]

    expect(calledUrl).toBe('http://localhost:3000/api/auth/send-code')
  })

  it('AuthService.loginWithEmail 应请求正确的完整 URL', async () => {
    await authService.loginWithEmail('test@example.com', '123456')

    const calledUrl = mockFetch.mock.calls[0][0]

    expect(calledUrl).toBe('http://localhost:3000/api/auth/login/email')
  })

  it('ApiClient 应正确处理带 / 前缀的 endpoint', async () => {
    await apiClient.get('/user/profile')

    const calledUrl = mockFetch.mock.calls[0][0]

    expect(calledUrl).toBe('http://localhost:3000/api/user/profile')
  })

  it('ApiClient 应正确处理不带 / 前缀的 endpoint', async () => {
    await apiClient.get('dashboard/summary')

    const calledUrl = mockFetch.mock.calls[0][0]

    expect(calledUrl).toBe('http://localhost:3000/api/dashboard/summary')
  })

  it('应正确添加查询参数', async () => {
    await apiClient.get('/diary/summary', { params: { date: '2024-01-15' } })

    const calledUrl = mockFetch.mock.calls[0][0]

    expect(calledUrl).toContain('http://localhost:3000/api/diary/summary')
    expect(calledUrl).toContain('date=2024-01-15')
  })
})
