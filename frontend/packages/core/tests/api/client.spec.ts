/**
 * API 客户端单元测试
 *
 * 测试 HTTP 请求封装功能
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ApiClient } from '../../src/api/client'
import type { ApiResponse } from '../../src/api/types'

// Mock fetch 函数
const mockFetch = vi.fn()

describe('ApiClient', () => {
  let api: ApiClient
  let mockUnauthorizedCallback: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockUnauthorizedCallback = vi.fn()

    // 创建 API 客户端实例
    api = new ApiClient({
      baseURL: 'http://test.com/api',
      tokenGetter: () => 'test-token',
      fetchProvider: mockFetch as unknown as typeof fetch,
      onUnauthorized: mockUnauthorizedCallback
    })

    mockFetch.mockReset()
  })

  describe('GET 请求', () => {
    it('应成功发送 GET 请求', async () => {
      const mockResponse: ApiResponse<{ id: string }> = {
        success: true,
        data: { id: '123' }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response)

      const result = await api.get<{ id: string }>('/test')

      expect(result).toEqual({ id: '123' })
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('应添加查询参数', async () => {
      const mockResponse: ApiResponse<null> = { success: true, data: null }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response)

      await api.get('/test', { params: { page: '1', size: '10' } })

      const url = new URL(mockFetch.mock.calls[0][0])
      expect(url.searchParams.get('page')).toBe('1')
      expect(url.searchParams.get('size')).toBe('10')
    })

    it('应添加 Authorization header', async () => {
      const mockResponse: ApiResponse<null> = { success: true, data: null }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response)

      await api.get('/test')

      const headers = mockFetch.mock.calls[0][1]?.headers as HeadersInit
      expect(headers?.['Authorization']).toBe('Bearer test-token')
    })

    it('应处理网络错误', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(api.get('/test')).rejects.toThrow('Network error')
    })
  })

  describe('POST 请求', () => {
    it('应成功发送 POST 请求', async () => {
      const mockResponse: ApiResponse<{ id: string }> = {
        success: true,
        data: { id: '123' }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse
      } as Response)

      const result = await api.post<{ id: string }>('/test', { name: 'test' })

      expect(result).toEqual({ id: '123' })
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('应序列化请求体', async () => {
      const mockResponse: ApiResponse<null> = { success: true, data: null }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse
      } as Response)

      await api.post('/test', { name: 'test', value: 123 })

      const body = mockFetch.mock.calls[0][1]?.body
      expect(body).toBe(JSON.stringify({ name: 'test', value: 123 }))
    })
  })

  describe('PUT 请求', () => {
    it('应成功发送 PUT 请求', async () => {
      const mockResponse: ApiResponse<null> = { success: true, data: null }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response)

      await api.put('/test/123', { name: 'updated' })

      const config = mockFetch.mock.calls[0][1]
      expect(config?.method).toBe('PUT')
    })
  })

  describe('PATCH 请求', () => {
    it('应成功发送 PATCH 请求', async () => {
      const mockResponse: ApiResponse<null> = { success: true, data: null }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response)

      await api.patch('/test/123', { name: 'patched' })

      const config = mockFetch.mock.calls[0][1]
      expect(config?.method).toBe('PATCH')
    })
  })

  describe('DELETE 请求', () => {
    it('应成功发送 DELETE 请求', async () => {
      const mockResponse: ApiResponse<null> = { success: true, data: null }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response)

      await api.delete('/test/123')

      const config = mockFetch.mock.calls[0][1]
      expect(config?.method).toBe('DELETE')
    })
  })

  describe('错误处理', () => {
    it('应处理 401 未授权错误', async () => {
      const mockResponse = { error: 'Unauthorized' }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockResponse
      } as Response)

      await expect(api.get('/test')).rejects.toThrow('Unauthorized')
      expect(mockUnauthorizedCallback).toHaveBeenCalledTimes(1)
    })

    it('应处理 403 禁止访问错误', async () => {
      const mockResponse = { error: 'Forbidden' }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => mockResponse
      } as Response)

      await expect(api.get('/test')).rejects.toThrow('Forbidden')
    })

    it('应处理 404 未找到错误', async () => {
      const mockResponse = { error: 'Not Found' }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => mockResponse
      } as Response)

      await expect(api.get('/test')).rejects.toThrow('Not Found')
    })

    it('应处理 500 服务器错误', async () => {
      const mockResponse = { error: 'Internal Server Error' }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => mockResponse
      } as Response)

      await expect(api.get('/test')).rejects.toThrow('Internal Server Error')
    })

    it('应处理业务逻辑错误 (success: false)', async () => {
      const mockResponse: ApiResponse<null> = {
        success: false,
        error: '业务逻辑错误'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response)

      await expect(api.get('/test')).rejects.toThrow('业务逻辑错误')
    })
  })

  describe('Token 处理', () => {
    it('无 Token 时不应添加 Authorization header', async () => {
      const apiWithoutToken = new ApiClient({
        baseURL: 'http://test.com/api',
        tokenGetter: () => null,
        fetchProvider: mockFetch as unknown as typeof fetch
      })

      const mockResponse: ApiResponse<null> = { success: true, data: null }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response)

      await apiWithoutToken.get('/test')

      const headers = mockFetch.mock.calls[0][1]?.headers as HeadersInit
      expect(headers?.['Authorization']).toBeUndefined()
    })

    it('应支持动态 Token 更新', async () => {
      let currentToken = 'token1'
      const apiWithDynamicToken = new ApiClient({
        baseURL: 'http://test.com/api',
        tokenGetter: () => currentToken,
        fetchProvider: mockFetch as unknown as typeof fetch
      })

      const mockResponse: ApiResponse<null> = { success: true, data: null }
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response)

      await apiWithDynamicToken.get('/test')

      let headers = mockFetch.mock.calls[0][1]?.headers as HeadersInit
      expect(headers?.['Authorization']).toBe('Bearer token1')

      // 更新 token
      currentToken = 'token2'
      mockFetch.mockClear()

      await apiWithDynamicToken.get('/test')

      headers = mockFetch.mock.calls[0][1]?.headers as HeadersInit
      expect(headers?.['Authorization']).toBe('Bearer token2')
    })
  })

  describe('setOnUnauthorized', () => {
    it('应允许更新 401 回调', async () => {
      const newCallback = vi.fn()
      api.setOnUnauthorized(newCallback)

      const mockResponse = { error: 'Unauthorized' }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockResponse
      } as Response)

      await expect(api.get('/test')).rejects.toThrow()

      expect(newCallback).toHaveBeenCalledTimes(1)
      expect(mockUnauthorizedCallback).not.toHaveBeenCalled()
    })
  })

  describe('URL 构建', () => {
    it('应正确拼接 baseURL 和 endpoint', async () => {
      const mockResponse: ApiResponse<null> = { success: true, data: null }
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response)

      // endpoint 不带 / 前缀时，会直接拼接到 baseURL 后面
      await api.get('users')

      expect(mockFetch.mock.calls[0][0]).toBe('http://test.com/api/users')
    })

    it('应处理以 / 开头的 endpoint（替换 baseURL 路径）', async () => {
      const mockResponse: ApiResponse<null> = { success: true, data: null }
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response)

      // endpoint 带 / 前缀时，会自动去除斜杠后拼接
      await api.get('/users')

      expect(mockFetch.mock.calls[0][0]).toBe('http://test.com/api/users')
    })

    it('应处理绝对路径 endpoint', async () => {
      const mockResponse: ApiResponse<null> = { success: true, data: null }
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response)

      await api.get('http://other.com/api/test')

      expect(mockFetch.mock.calls[0][0]).toContain('http://other.com/api/test')
    })
  })
})
