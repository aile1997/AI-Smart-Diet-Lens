/**
 * 统一日志工具
 *
 * 根据环境变量控制日志输出，生产环境自动禁用
 */

/**
 * 日志级别
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

/**
 * 当前日志级别配置
 */
let currentLogLevel: LogLevel = LogLevel.INFO

/**
 * 初始化日志配置
 *
 * @param level 日志级别字符串
 */
export function initLogger(level: string = 'info') {
  const levelMap: Record<string, LogLevel> = {
    debug: LogLevel.DEBUG,
    info: LogLevel.INFO,
    warn: LogLevel.WARN,
    error: LogLevel.ERROR,
    none: LogLevel.NONE
  }
  currentLogLevel = levelMap[level] || LogLevel.INFO
}

/**
 * 从环境变量初始化日志
 */
export function initLoggerFromEnv() {
  const envLevel = import.meta.env?.VITE_LOG_LEVEL || 'info'
  initLogger(envLevel)
}

/**
 * 检查是否应该输出日志
 */
function shouldLog(level: LogLevel): boolean {
  return level >= currentLogLevel
}

/**
 * 格式化日志前缀
 */
function formatPrefix(level: string): string {
  const timestamp = new Date().toISOString()
  return `[${timestamp}] [${level.toUpperCase()}]`
}

/**
 * 日志工具类
 */
export const logger = {
  /**
   * 调试级别日志
   */
  debug(...args: unknown[]) {
    if (shouldLog(LogLevel.DEBUG)) {
      console.log(formatPrefix('debug'), ...args)
    }
  },

  /**
   * 信息级别日志
   */
  info(...args: unknown[]) {
    if (shouldLog(LogLevel.INFO)) {
      console.log(formatPrefix('info'), ...args)
    }
  },

  /**
   * 警告级别日志
   */
  warn(...args: unknown[]) {
    if (shouldLog(LogLevel.WARN)) {
      console.warn(formatPrefix('warn'), ...args)
    }
  },

  /**
   * 错误级别日志
   */
  error(...args: unknown[]) {
    if (shouldLog(LogLevel.ERROR)) {
      console.error(formatPrefix('error'), ...args)
    }
  },

  /**
   * 安全日志（始终记录）
   * 用于安全审计和关键操作追踪
   */
  security(...args: unknown[]) {
    // 安全日志始终记录，不受日志级别控制
    console.error(formatPrefix('security'), ...args)
  }
}

/**
 * 快捷方法导出
 */
export const log = logger.info
export const debug = logger.debug
export const warn = logger.warn
export const error = logger.error
export const security = logger.security

/**
 * 自动初始化开关
 * 在测试环境可以通过环境变量禁用自动初始化
 */
const AUTO_INIT = import.meta.env?.VITE_LOGGER_AUTO_INIT !== 'false'

// 延迟初始化，避免模块加载时的副作用
if (AUTO_INIT && typeof window !== 'undefined') {
  // 仅在非测试环境自动初始化
  if (typeof process === 'undefined' || process.env?.NODE_ENV !== 'test') {
    initLoggerFromEnv()
  }
}
