/**
 * 全局错误处理工具
 *
 * 统一处理应用中的错误，提供用户友好的错误提示
 */

import { logger } from './logger'

/**
 * 错误类型枚举
 */
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  AUTH = 'AUTH_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

/**
 * 应用错误类
 */
export class AppError extends Error {
  type: ErrorType
  code?: string
  userMessage: string

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    userMessage?: string,
    code?: string
  ) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.userMessage = userMessage || getDefaultUserMessage(type)
    this.code = code
  }
}

/**
 * 获取默认的用户友好错误消息
 */
function getDefaultUserMessage(type: ErrorType): string {
  const messages: Record<ErrorType, string> = {
    [ErrorType.NETWORK]: '网络连接失败，请检查网络设置',
    [ErrorType.AUTH]: '登录已过期，请重新登录',
    [ErrorType.VALIDATION]: '输入信息有误，请检查后重试',
    [ErrorType.NOT_FOUND]: '请求的资源不存在',
    [ErrorType.SERVER]: '服务器异常，请稍后重试',
    [ErrorType.UNKNOWN]: '操作失败，请重试'
  }
  return messages[type] || messages[ErrorType.UNKNOWN]
}

/**
 * 错误消息映射（用于后端返回的错误码）
 */
const ERROR_MESSAGE_MAP: Record<string, string> = {
  // 网络错误
  'NETWORK_ERROR': '网络连接失败，请检查网络设置',
  'TIMEOUT': '请求超时，请重试',
  'OFFLINE': '网络未连接，请检查网络设置',

  // 认证错误
  'UNAUTHORIZED': '登录已过期，请重新登录',
  'FORBIDDEN': '无权访问该资源',
  'TOKEN_EXPIRED': '登录已过期，请重新登录',
  'INVALID_TOKEN': '登录信息无效，请重新登录',

  // 验证错误
  'VALIDATION_ERROR': '输入信息有误，请检查后重试',
  'INVALID_EMAIL': '邮箱格式不正确',
  'INVALID_PHONE': '手机号格式不正确',
  'INVALID_CODE': '验证码格式不正确',
  'WEAK_PASSWORD': '密码强度不足',

  // 资源错误
  'NOT_FOUND': '请求的资源不存在',
  'USER_NOT_FOUND': '用户不存在',
  'RESOURCE_NOT_FOUND': '请求的资源不存在',

  // 服务器错误
  'SERVER_ERROR': '服务器异常，请稍后重试',
  'SERVICE_UNAVAILABLE': '服务暂时不可用',
  'DATABASE_ERROR': '数据异常，请稍后重试'
}

/**
 * 从错误对象中提取用户友好的错误消息
 *
 * @param error 错误对象
 * @returns 用户友好的错误消息
 */
export function getUserMessage(error: unknown): string {
  // 如果是 AppError，直接使用 userMessage
  if (error instanceof AppError) {
    return error.userMessage
  }

  // 如果是标准 Error
  if (error instanceof Error) {
    const message = error.message

    // 检查是否有映射的错误码
    for (const [code, msg] of Object.entries(ERROR_MESSAGE_MAP)) {
      if (message.includes(code)) {
        return msg
      }
    }

    // 检查消息类型
    if (message.includes('network') || message.includes('fetch')) {
      return ERROR_MESSAGE_MAP.NETWORK_ERROR
    }
    if (message.includes('timeout')) {
      return ERROR_MESSAGE_MAP.TIMEOUT
    }
    if (message.includes('401') || message.includes('unauthorized')) {
      return ERROR_MESSAGE_MAP.UNAUTHORIZED
    }
    if (message.includes('403') || message.includes('forbidden')) {
      return ERROR_MESSAGE_MAP.FORBIDDEN
    }
    if (message.includes('404') || message.includes('not found')) {
      return ERROR_MESSAGE_MAP.NOT_FOUND
    }
    if (message.includes('500') || message.includes('server error')) {
      return ERROR_MESSAGE_MAP.SERVER_ERROR
    }

    // 默认返回原始消息（已过滤敏感信息）
    return message || '操作失败，请重试'
  }

  // 处理非 Error 对象（null, undefined, string, etc.）
  return '操作失败，请重试'
}

/**
 * 统一错误处理器
 *
 * @param error 错误对象
 * @param context 错误上下文（用于日志）
 * @returns 用户友好的错误消息
 */
export function handleError(error: unknown, context?: string): string {
  const userMessage = getUserMessage(error)

  // 记录错误日志
  if (error instanceof Error) {
    logger.error(`[${context || 'Unknown'}]`, error.message, error.stack)
  } else {
    logger.error(`[${context || 'Unknown'}]`, String(error))
  }

  return userMessage
}

/**
 * 显示错误提示（UniApp）
 *
 * @param error 错误对象
 * @param context 错误上下文
 */
export function showErrorToast(error: unknown, context?: string) {
  const userMessage = handleError(error, context)

  uni.showToast({
    title: userMessage,
    icon: 'none',
    duration: 3000
  })
}

/**
 * 创建异步错误处理的包装函数
 *
 * @param fn 异步函数
 * @param context 错误上下文
 * @returns 包装后的函数
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): T {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      showErrorToast(error, context)
      throw error
    }
  }
}

/**
 * 创建带重试的异步函数
 *
 * @param fn 异步函数
 * @param maxRetries 最大重试次数
 * @param retryDelay 重试延迟（毫秒）
 * @returns 包装后的函数
 */
export function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  maxRetries: number = 3,
  retryDelay: number = 1000
): T {
  return async (...args: Parameters<T>) => {
    let lastError: unknown

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn(...args)
      } catch (error) {
        lastError = error

        // 如果是最后一次重试，抛出错误
        if (i === maxRetries) {
          throw error
        }

        // 判断是否应该重试（网络错误或5xx错误）
        const shouldRetry = isRetryableError(error)
        if (!shouldRetry) {
          throw error
        }

        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)))
      }
    }

    throw lastError
  }
}

/**
 * 判断错误是否可重试
 *
 * @param error 错误对象
 * @returns 是否可重试
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    // 网络错误可以重试
    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('timeout') ||
      message.includes('econnrefused') ||
      message.includes('etimedout')
    ) {
      return true
    }

    // 5xx 服务器错误可以重试
    if (message.includes('500') || message.includes('502') || message.includes('503') || message.includes('504')) {
      return true
    }
  }

  return false
}

/**
 * 全局错误捕获器（用于 Vue 错误处理器）
 *
 * @param error 错误对象
 * @param instance Vue 实例
 * @param info 错误信息
 */
export function globalErrorHandler(error: unknown, instance: any, info: string) {
  logger.error('[Vue Error]', info, error)

  // 在生产环境，可以上报错误到监控系统
  if (import.meta.env.PROD) {
    // TODO: 上报到错误监控系统（如 Sentry）
  }
}
