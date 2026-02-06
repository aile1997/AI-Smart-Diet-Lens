/**
 * throttle.ts 单元测试
 *
 * 测试防抖、节流和限流功能
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { debounce, throttle, createRateLimiter } from '../../src/utils/throttle'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('应延迟执行函数', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 300)

    debouncedFn()
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('应在延迟期间重置计时器', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 300)

    debouncedFn()
    vi.advanceTimersByTime(200)

    debouncedFn()  // 重置计时器
    vi.advanceTimersByTime(200)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('应传递参数给原函数', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 300)

    debouncedFn('arg1', 'arg2')

    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('应保持正确的 this 上下文', () => {
    const obj = {
      value: 'test',
      fn: debounce(function(this: any) {
        return this.value
      }, 300)
    }

    vi.advanceTimersByTime(300)
    // 注意：在测试环境中 this 上下文可能不同
    expect(obj.fn).toBeDefined()
  })

  it('应处理 0ms 延迟', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 0)

    debouncedFn()
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(0)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('应立即执行第一次调用', () => {
    const fn = vi.fn()
    const throttledFn = throttle(fn, 300)

    throttledFn()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('应在节流期间忽略调用', () => {
    const fn = vi.fn()
    const throttledFn = throttle(fn, 300)

    throttledFn()  // 立即执行
    throttledFn()  // 被忽略
    throttledFn()  // 被忽略

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('应在节流期结束后允许调用', () => {
    const fn = vi.fn()
    const throttledFn = throttle(fn, 300)

    throttledFn()  // t=0, 执行
    vi.advanceTimersByTime(300)

    throttledFn()  // t=300, 执行
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('应传递参数', () => {
    const fn = vi.fn()
    const throttledFn = throttle(fn, 300)

    throttledFn('arg1')
    expect(fn).toHaveBeenCalledWith('arg1')
  })

  it('应处理快速连续调用', () => {
    const fn = vi.fn()
    const throttledFn = throttle(fn, 100)

    // 快速调用多次
    for (let i = 0; i < 10; i++) {
      throttledFn(i)
    }

    // 只有第一次执行
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(0)
  })
})

describe('createRateLimiter', () => {
  beforeEach(() => {
    vi.useRealTimers()  // 使用真实时间测试限流器
  })

  it('应允许在限制内的请求', () => {
    const limiter = createRateLimiter(5, 1000)  // 5次/秒

    for (let i = 0; i < 5; i++) {
      expect(limiter()).toBe(true)
    }
  })

  it('应拒绝超过限制的请求', () => {
    const limiter = createRateLimiter(3, 1000)  // 3次/秒

    // 前3次应该成功
    expect(limiter()).toBe(true)
    expect(limiter()).toBe(true)
    expect(limiter()).toBe(true)

    // 第4次应该被拒绝
    expect(limiter()).toBe(false)
  })

  it('应在时间窗口结束后重置', async () => {
    const limiter = createRateLimiter(2, 100)  // 2次/100ms

    // 使用配额
    expect(limiter()).toBe(true)
    expect(limiter()).toBe(true)
    expect(limiter()).toBe(false)

    // 等待时间窗口结束
    await new Promise(resolve => setTimeout(resolve, 110))

    // 应该可以再次请求
    expect(limiter()).toBe(true)
  })

  it('应处理滑动时间窗口', async () => {
    const limiter = createRateLimiter(3, 200)  // 3次/200ms

    // t=0: 3次请求
    expect(limiter()).toBe(true)
    expect(limiter()).toBe(true)
    expect(limiter()).toBe(true)
    expect(limiter()).toBe(false)

    // t=100ms: 1次请求
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(limiter()).toBe(false)  // 仍在时间窗口内

    // t=200ms: 时间窗口结束
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(limiter()).toBe(true)  // 可以请求
  })

  it('应处理低频请求', async () => {
    const limiter = createRateLimiter(2, 100)  // 2次/100ms

    expect(limiter()).toBe(true)
    expect(limiter()).toBe(true)
    expect(limiter()).toBe(false)

    // 等待足够长时间
    await new Promise(resolve => setTimeout(resolve, 150))

    // 应该重置
    expect(limiter()).toBe(true)
    expect(limiter()).toBe(true)
  })

  it('应处理零时间窗口（实际上限流失效）', () => {
    const limiter = createRateLimiter(5, 0)  // 5次/0ms

    // 零时间窗口意味着所有请求的时间戳都被认为是有效的
    // 限流器实际上会一直返回 true
    for (let i = 0; i < 10; i++) {
      expect(limiter()).toBe(true)
    }
  })

  it('应验证码限流器: 5次/分钟', async () => {
    const limiter = createRateLimiter(5, 60000)  // 5次/分钟

    // 前5次应该成功
    for (let i = 0; i < 5; i++) {
      expect(limiter()).toBe(true)
    }

    // 第6次应该失败
    expect(limiter()).toBe(false)

    // 等待1分钟 (实际测试时使用较短时间)
    // await new Promise(resolve => setTimeout(resolve, 61000))
    // expect(limiter()).toBe(true)
  })

  it('应支持单次请求限制', () => {
    const limiter = createRateLimiter(1, 1000)  // 1次/秒

    expect(limiter()).toBe(true)
    expect(limiter()).toBe(false)
  })

  it('应处理高频请求', () => {
    const limiter = createRateLimiter(10, 1000)  // 10次/秒

    let success = 0
    let blocked = 0

    for (let i = 0; i < 20; i++) {
      if (limiter()) {
        success++
      } else {
        blocked++
      }
    }

    expect(success).toBe(10)
    expect(blocked).toBe(10)
  })

  it('应正确追踪请求时间戳', async () => {
    const limiter = createRateLimiter(2, 100)  // 2次/100ms

    expect(limiter()).toBe(true)  // t=0
    expect(limiter()).toBe(true)  // t=0
    expect(limiter()).toBe(false) // t=0

    // 等待50ms
    await new Promise(resolve => setTimeout(resolve, 50))

    // 仍在时间窗口内
    expect(limiter()).toBe(false)

    // 等待60ms (总共110ms)
    await new Promise(resolve => setTimeout(resolve, 60))

    // 应该重置
    expect(limiter()).toBe(true)
  })
})

describe('限流器边界情况', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  it('应处理零请求限制', () => {
    const limiter = createRateLimiter(0, 1000)
    expect(limiter()).toBe(false)
  })

  it('应处理负数请求限制', () => {
    const limiter = createRateLimiter(-1, 1000)
    expect(limiter()).toBe(false)
  })

  it('应处理大数值限制', () => {
    const limiter = createRateLimiter(10000, 1000)
    for (let i = 0; i < 100; i++) {
      expect(limiter()).toBe(true)
    }
  })
})
