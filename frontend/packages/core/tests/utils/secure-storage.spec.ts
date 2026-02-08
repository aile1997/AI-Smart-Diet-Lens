/**
 * secure-storage.ts 单元测试
 *
 * 测试 Token 加密存储功能
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { tokenStorage } from '../../src/utils/secure-storage'

describe('tokenStorage', () => {
  // tokenStorage 内部使用的存储键名
  const STORAGE_KEY = 'secure_token'

  beforeEach(() => {
    // 每个测试前清空存储
    vi.clearAllMocks()
  })

  describe('setToken', () => {
    it('应成功存储 Token', () => {
      const token = 'test-jwt-token-12345'
      tokenStorage.setToken(token)

      // 验证 uni.setStorageSync 被调用
      expect(uni.setStorageSync).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.any(String)
      )
    })

    it('应加密存储的 Token', () => {
      const token = 'my-secret-jwt-token'
      tokenStorage.setToken(token)

      // 获取存储的值
      const setCalls = vi.mocked(uni.setStorageSync).mock.calls
      const storedValue = setCalls.find(call => call[0] === STORAGE_KEY)?.[1]

      expect(storedValue).toBeDefined()
      // 存储的值应该与原值不同（已加密）
      expect(storedValue).not.toBe(token)
      expect(storedValue).not.toContain('my-secret')
    })

    it('应支持存储相同 Token 多次', () => {
      const token = 'test-token'
      tokenStorage.setToken(token)
      tokenStorage.setToken(token)

      expect(uni.setStorageSync).toHaveBeenCalledTimes(2)
    })

    it('应处理空字符串 Token', () => {
      const token = ''
      tokenStorage.setToken(token)

      expect(uni.setStorageSync).toHaveBeenCalled()
    })

    it('应处理特殊字符 Token', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature'
      tokenStorage.setToken(token)

      expect(uni.setStorageSync).toHaveBeenCalled()
    })
  })

  describe('getToken', () => {
    it('应成功获取已存储的 Token', () => {
      const token = 'test-jwt-token'
      tokenStorage.setToken(token)

      // Mock getStorageSync 返回存储的值
      const setCalls = vi.mocked(uni.setStorageSync).mock.calls
      const storedValue = setCalls.find(call => call[0] === STORAGE_KEY)?.[1]

      vi.mocked(uni.getStorageSync).mockReturnValue(storedValue || '')

      const retrieved = tokenStorage.getToken()
      expect(retrieved).toBe(token)
    })

    it('应解密获取的 Token', () => {
      const token = 'my-jwt-token-123'
      tokenStorage.setToken(token)

      // 获取存储的加密值
      const setCalls = vi.mocked(uni.setStorageSync).mock.calls
      const storedValue = setCalls.find(call => call[0] === STORAGE_KEY)?.[1]

      // Mock getStorageSync 返回加密值
      vi.mocked(uni.getStorageSync).mockReturnValue(storedValue || '')

      const retrieved = tokenStorage.getToken()

      // 获取值与原值相同（解密）
      expect(retrieved).toBe(token)
    })

    it('应在未存储时返回 null', () => {
      vi.mocked(uni.getStorageSync).mockReturnValue('')

      const retrieved = tokenStorage.getToken()
      expect(retrieved).toBeNull()
    })

    it('应支持多次获取相同 Token', () => {
      const token = 'test-token-456'
      tokenStorage.setToken(token)

      // 获取存储的加密值
      const setCalls = vi.mocked(uni.setStorageSync).mock.calls
      const storedValue = setCalls.find(call => call[0] === STORAGE_KEY)?.[1]

      // Mock getStorageSync
      vi.mocked(uni.getStorageSync).mockReturnValue(storedValue || '')

      const first = tokenStorage.getToken()
      const second = tokenStorage.getToken()

      expect(first).toBe(token)
      expect(second).toBe(token)
    })

    it('应处理长 Token', () => {
      // JWT Token 通常很长
      const token = 'a'.repeat(500)
      tokenStorage.setToken(token)

      // 获取存储的加密值
      const setCalls = vi.mocked(uni.setStorageSync).mock.calls
      const storedValue = setCalls.find(call => call[0] === STORAGE_KEY)?.[1]

      // Mock getStorageSync
      vi.mocked(uni.getStorageSync).mockReturnValue(storedValue || '')

      const retrieved = tokenStorage.getToken()
      expect(retrieved).toBe(token)
    })
  })

  describe('removeToken', () => {
    it('应成功删除已存储的 Token', () => {
      tokenStorage.removeToken()

      expect(uni.removeStorageSync).toHaveBeenCalledWith(STORAGE_KEY)
    })

    it('删除后获取应返回 null', () => {
      tokenStorage.removeToken()
      vi.mocked(uni.getStorageSync).mockReturnValue('')

      const retrieved = tokenStorage.getToken()
      expect(retrieved).toBeNull()
    })

    it('应支持删除不存在的 Token', () => {
      expect(() => {
        tokenStorage.removeToken()
      }).not.toThrow()
    })

    it('应支持重复删除', () => {
      tokenStorage.removeToken()
      tokenStorage.removeToken()

      expect(uni.removeStorageSync).toHaveBeenCalledTimes(2)
    })
  })

  describe('加密解密一致性', () => {
    it('应保证加密解密的一致性', () => {
      const tokens = [
        'simple-token',
        'token-with-dashes',
        'token_with_underscores',
        'TOKEN.WITH.DOTS',
        'token123456',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      ]

      tokens.forEach(token => {
        // 清除之前的 mock
        vi.clearAllMocks()

        tokenStorage.setToken(token)

        // 获取存储的加密值
        const setCalls = vi.mocked(uni.setStorageSync).mock.calls
        const storedValue = setCalls.find(call => call[0] === STORAGE_KEY)?.[1]

        // Mock getStorageSync
        vi.mocked(uni.getStorageSync).mockReturnValue(storedValue || '')

        const retrieved = tokenStorage.getToken()
        expect(retrieved).toBe(token)
      })
    })

    it('应正确处理不同格式的 Token', () => {
      const formats = [
        'Bearer token123',
        'token',
        'a.b.c',  // JWT 格式
        'a-b-c',
        'a_b_c'
      ]

      formats.forEach(token => {
        vi.clearAllMocks()

        tokenStorage.setToken(token)

        // 获取存储的加密值
        const setCalls = vi.mocked(uni.setStorageSync).mock.calls
        const storedValue = setCalls.find(call => call[0] === STORAGE_KEY)?.[1]

        // Mock getStorageSync
        vi.mocked(uni.getStorageSync).mockReturnValue(storedValue || '')

        const retrieved = tokenStorage.getToken()
        expect(retrieved).toBe(token)
      })
    })
  })

  describe('安全性测试', () => {
    it('存储的值不应包含原文', () => {
      const token = 'secret-token-12345'
      tokenStorage.setToken(token)

      // 获取存储的加密值
      const setCalls = vi.mocked(uni.setStorageSync).mock.calls
      const storedValue = setCalls.find(call => call[0] === STORAGE_KEY)?.[1]

      expect(storedValue).not.toContain('secret')
      expect(storedValue).not.toContain('token')
      expect(storedValue).not.toContain('12345')
    })

    it('不同 Token 应加密为不同值', () => {
      const token1 = 'token-111'
      const token2 = 'token-222'

      // 清除 mock
      vi.clearAllMocks()

      tokenStorage.setToken(token1)
      const setCalls1 = vi.mocked(uni.setStorageSync).mock.calls
      const stored1 = setCalls1.find(call => call[0] === STORAGE_KEY)?.[1]

      vi.clearAllMocks()

      tokenStorage.setToken(token2)
      const setCalls2 = vi.mocked(uni.setStorageSync).mock.calls
      const stored2 = setCalls2.find(call => call[0] === STORAGE_KEY)?.[1]

      expect(stored1).not.toBe(stored2)
    })

    it('加密结果应该是 Base64 格式', () => {
      const token = 'test-token'
      tokenStorage.setToken(token)

      // 获取存储的加密值
      const setCalls = vi.mocked(uni.setStorageSync).mock.calls
      const storedValue = setCalls.find(call => call[0] === STORAGE_KEY)?.[1]

      // Base64 编码的字符串特征
      expect(storedValue).toMatch(/^[A-Za-z0-9+/]+=*$/)
    })
  })

  describe('边界情况', () => {
    it('应处理包含中文的 Token', () => {
      const token = 'token-中文-测试'
      tokenStorage.setToken(token)

      // 获取存储的加密值
      const setCalls = vi.mocked(uni.setStorageSync).mock.calls
      const storedValue = setCalls.find(call => call[0] === STORAGE_KEY)?.[1]

      // Mock getStorageSync
      vi.mocked(uni.getStorageSync).mockReturnValue(storedValue || '')

      const retrieved = tokenStorage.getToken()
      expect(retrieved).toBe(token)
    })

    it('应处理包含特殊字符的 Token', () => {
      const token = 'token!@#$%^&*()_+-=[]{}|;:\'",.<>?/~`'
      tokenStorage.setToken(token)

      // 获取存储的加密值
      const setCalls = vi.mocked(uni.setStorageSync).mock.calls
      const storedValue = setCalls.find(call => call[0] === STORAGE_KEY)?.[1]

      // Mock getStorageSync
      vi.mocked(uni.getStorageSync).mockReturnValue(storedValue || '')

      const retrieved = tokenStorage.getToken()
      expect(retrieved).toBe(token)
    })

    it('应处理 Unicode 字符', () => {
      const token = 'token-😀-🎉-💻'
      tokenStorage.setToken(token)

      // 获取存储的加密值
      const setCalls = vi.mocked(uni.setStorageSync).mock.calls
      const storedValue = setCalls.find(call => call[0] === STORAGE_KEY)?.[1]

      // Mock getStorageSync
      vi.mocked(uni.getStorageSync).mockReturnValue(storedValue || '')

      const retrieved = tokenStorage.getToken()
      expect(retrieved).toBe(token)
    })
  })
})
