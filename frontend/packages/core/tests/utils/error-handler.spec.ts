/**
 * error-handler.ts 单元测试
 *
 * 测试全局错误处理功能
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  AppError,
  ErrorType,
  getUserMessage,
  handleError,
  withRetry,
  withErrorHandling
} from '../../src/utils/error-handler'
import { logger } from '../../src/utils/logger'

// Mock logger
vi.mock('../../src/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn()
  }
}))

describe('AppError', () => {
  it('应创建标准错误对象', () => {
    const error = new AppError('Something went wrong')
    expect(error.message).toBe('Something went wrong')
    expect(error.name).toBe('AppError')
    expect(error.type).toBe(ErrorType.UNKNOWN)
  })

  it('应支持指定错误类型', () => {
    const error = new AppError('Network failed', ErrorType.NETWORK)
    expect(error.type).toBe(ErrorType.NETWORK)
  })

  it('应支持自定义用户消息', () => {
    const error = new AppError('Internal error', ErrorType.SERVER, '服务器开小差了')
    expect(error.userMessage).toBe('服务器开小差了')
  })

  it('应支持错误代码', () => {
    const error = new AppError('Auth failed', ErrorType.AUTH, '登录失败', 'AUTH_001')
    expect(error.code).toBe('AUTH_001')
  })

  it('应自动生成默认用户消息', () => {
    const error = new AppError('Network error', ErrorType.NETWORK)
    expect(error.userMessage).toBe('网络连接失败，请检查网络设置')
  })
})

describe('getUserMessage', () => {
  it('应返回 AppError 的 userMessage', () => {
    const error = new AppError('Error', ErrorType.NETWORK, '自定义消息')
    const message = getUserMessage(error)
    expect(message).toBe('自定义消息')
  })

  it('应处理标准 Error', () => {
    const error = new Error('NETWORK_ERROR')
    const message = getUserMessage(error)
    expect(message).toBe('网络连接失败，请检查网络设置')
  })

  it('应映射网络错误消息', () => {
    const error = new Error('network connection failed')
    const message = getUserMessage(error)
    expect(message).toBe('网络连接失败，请检查网络设置')
  })

  it('应映射超时错误', () => {
    const error = new Error('request timeout')
    const message = getUserMessage(error)
    expect(message).toBe('请求超时，请重试')
  })

  it('应映射 401 错误', () => {
    const error = new Error('401 unauthorized')
    const message = getUserMessage(error)
    expect(message).toBe('登录已过期，请重新登录')
  })

  it('应映射 403 错误', () => {
    const error = new Error('403 forbidden')
    const message = getUserMessage(error)
    expect(message).toBe('无权访问该资源')
  })

  it('应映射 404 错误', () => {
    const error = new Error('404 not found')
    const message = getUserMessage(error)
    expect(message).toBe('请求的资源不存在')
  })

  it('应映射 500 错误', () => {
    const error = new Error('500 server error')
    const message = getUserMessage(error)
    expect(message).toBe('服务器异常，请稍后重试')
  })

  it('应映射 UNAUTHORIZED 错误码', () => {
    const error = new Error('UNAUTHORIZED')
    const message = getUserMessage(error)
    expect(message).toBe('登录已过期，请重新登录')
  })

  it('应映射 TOKEN_EXPIRED 错误码', () => {
    const error = new Error('TOKEN_EXPIRED')
    const message = getUserMessage(error)
    expect(message).toBe('登录已过期，请重新登录')
  })

  it('应返回原始消息作为后备', () => {
    const error = new Error('Some unknown error')
    const message = getUserMessage(error)
    expect(message).toBe('Some unknown error')
  })

  it('应处理空消息', () => {
    const error = new Error('')
    const message = getUserMessage(error)
    expect(message).toBe('操作失败，请重试')
  })

  it('非 Error 对象应返回默认消息', () => {
    expect(getUserMessage('string error')).toBe('操作失败，请重试')
    expect(getUserMessage(null)).toBe('操作失败，请重试')
    expect(getUserMessage(undefined)).toBe('操作失败，请重试')
    expect(getUserMessage(123)).toBe('操作失败，请重试')
  })
})

describe('handleError', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应记录错误日志', () => {
    const error = new Error('Test error')
    handleError(error, 'TestContext')

    expect(logger.error).toHaveBeenCalledWith(
      '[TestContext]',
      'Test error',
      error.stack
    )
  })

  it('应返回用户友好消息', () => {
    const error = new Error('NETWORK_ERROR')
    const message = handleError(error, 'TestContext')

    expect(message).toBe('网络连接失败，请检查网络设置')
  })

  it('应处理非 Error 对象并返回默认消息', () => {
    const message = handleError('String error', 'TestContext')

    expect(logger.error).toHaveBeenCalledWith('[TestContext]', 'String error')
    expect(message).toBe('操作失败，请重试')
  })

  it('应处理 null 错误并返回默认消息', () => {
    const message = handleError(null, 'TestContext')

    expect(logger.error).toHaveBeenCalledWith('[TestContext]', 'null')
    expect(message).toBe('操作失败，请重试')
  })

  it('应处理 undefined 错误并返回默认消息', () => {
    const message = handleError(undefined, 'TestContext')

    expect(logger.error).toHaveBeenCalledWith('[TestContext]', 'undefined')
    expect(message).toBe('操作失败，请重试')
  })

  it('应支持省略上下文', () => {
    const error = new Error('Test')
    handleError(error)

    expect(logger.error).toHaveBeenCalledWith('[Unknown]', 'Test', error.stack)
  })
})

describe('withRetry', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  it('应在成功时返回结果', async () => {
    const fn = vi.fn().mockResolvedValue('success')
    const wrappedFn = withRetry(fn)

    const result = await wrappedFn()
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('应在可重试错误时重试', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('NETWORK_ERROR'))
      .mockResolvedValue('success')

    const wrappedFn = withRetry(fn, 3, 10)

    const result = await wrappedFn()
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('应在达到最大重试次数后抛出错误', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('NETWORK_ERROR'))
    const wrappedFn = withRetry(fn, 2, 10)

    await expect(wrappedFn()).rejects.toThrow('NETWORK_ERROR')
    expect(fn).toHaveBeenCalledTimes(3)  // 首次 + 2次重试
  })

  it('应在不可重试错误时立即抛出', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('403 forbidden'))
    const wrappedFn = withRetry(fn, 3, 10)

    await expect(wrappedFn()).rejects.toThrow()
    expect(fn).toHaveBeenCalledTimes(1)  // 不重试
  })

  it('应传递参数给原函数', async () => {
    const fn = vi.fn().mockResolvedValue('result')
    const wrappedFn = withRetry(fn)

    await wrappedFn('arg1', 'arg2')
    expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('应支持自定义重试次数', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('NETWORK_ERROR'))
    const wrappedFn = withRetry(fn, 5, 10)

    await expect(wrappedFn()).rejects.toThrow()
    expect(fn).toHaveBeenCalledTimes(6)  // 首次 + 5次重试
  })

  it('应支持自定义重试延迟', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('NETWORK_ERROR'))
      .mockResolvedValue('success')

    const startTime = Date.now()
    const wrappedFn = withRetry(fn, 2, 100)

    await wrappedFn()
    const elapsed = Date.now() - startTime

    // 应该至少等待 100ms
    expect(elapsed).toBeGreaterThanOrEqual(100)
  })

  it('应处理 5xx 服务器错误', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('500 Internal Server Error'))
      .mockResolvedValue('success')

    const wrappedFn = withRetry(fn, 2, 10)
    const result = await wrappedFn()

    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('应验证可重试错误类型', async () => {
    const retryableErrors = [
      'network error',
      'fetch failed',
      'request timeout',
      '500 server error',
      '502 Bad Gateway'
    ]

    for (const errorMsg of retryableErrors) {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error(errorMsg))
        .mockResolvedValue('success')

      const wrappedFn = withRetry(fn, 1, 10)
      const result = await wrappedFn()

      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    }
  })

  it('应验证不可重试错误类型', async () => {
    const nonRetryableErrors = [
      '400 Bad Request',
      '403 Forbidden',
      '404 Not Found'
    ]

    for (const errorMsg of nonRetryableErrors) {
      const fn = vi.fn().mockRejectedValue(new Error(errorMsg))
      const wrappedFn = withRetry(fn, 3, 10)

      await expect(wrappedFn()).rejects.toThrow()
      expect(fn).toHaveBeenCalledTimes(1)  // 不重试
    }
  })
})

describe('withErrorHandling', () => {
  it('应在成功时返回结果', async () => {
    const fn = vi.fn().mockResolvedValue('success')
    const wrappedFn = withErrorHandling(fn)

    const result = await wrappedFn()
    expect(result).toBe('success')
  })

  it('应在错误时显示 toast 并重新抛出', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Test error'))
    const wrappedFn = withErrorHandling(fn, 'TestContext')

    await expect(wrappedFn()).rejects.toThrow()
  })
})
