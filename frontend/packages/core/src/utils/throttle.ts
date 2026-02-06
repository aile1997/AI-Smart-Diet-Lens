/**
 * 防抖和节流工具
 *
 * 用于防止函数被频繁调用，减少不必要的请求
 */

/**
 * 防抖函数
 * 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
 *
 * @param fn 要执行的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function(this: any, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 节流函数
 * 规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效
 *
 * @param fn 要执行的函数
 * @param interval 时间间隔（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  interval: number = 300
): (...args: Parameters<T>) => void {
  let last = 0
  let timer: ReturnType<typeof setTimeout> | null = null

  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now()

    if (now - last >= interval) {
      last = now
      fn.apply(this, args)
    } else if (!timer) {
      // 设置最后一次执行
      timer = setTimeout(() => {
        last = Date.now()
        fn.apply(this, args)
        timer = null
      }, interval - (now - last))
    }
  }
}

/**
 * 创建一个请求限流器
 *
 * @param maxCount 最大请求次数
 * @param timeWindow 时间窗口（毫秒）
 * @returns 限流检查函数
 */
export function createRateLimiter(maxCount: number, timeWindow: number) {
  const requests: number[] = []

  return function canMakeRequest(): boolean {
    const now = Date.now()

    // 移除时间窗口外的请求记录
    const validRequests = requests.filter(t => now - t < timeWindow)
    requests.length = 0
    requests.push(...validRequests)

    // 检查是否超过限制
    if (requests.length >= maxCount) {
      return false
    }

    // 记录本次请求
    requests.push(now)
    return true
  }
}

/**
 * 获取剩余冷却时间
 *
 * @param maxCount 最大请求次数
 * @param timeWindow 时间窗口（毫秒）
 * @param requestHistory 请求历史记录
 * @returns 剩余冷却时间（毫秒）
 */
export function getRemainingCooldown(
  maxCount: number,
  timeWindow: number,
  requestHistory: number[]
): number {
  if (requestHistory.length < maxCount) {
    return 0
  }

  const oldestRequest = requestHistory[requestHistory.length - maxCount]
  const cooldownEnd = oldestRequest + timeWindow
  const now = Date.now()

  return Math.max(0, cooldownEnd - now)
}
