/**
 * 统一日志工具
 *
 * 根据环境变量控制日志输出，生产环境自动禁用
 */

/**
 * 模块级 console 引用（支持测试环境 mock）
 */
let moduleConsole: Console = console

/**
 * 设置 console 引用（用于测试）
 * @internal
 */
export function __setConsole(c: Console) {
  moduleConsole = c
}

/**
 * 获取 console 引用
 */
function getConsole() {
  return moduleConsole
}

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
  const mapped = levelMap[level]
  currentLogLevel = mapped !== undefined ? mapped : LogLevel.INFO
}

/**
 * 测试 levelMap 映射（用于调试）
 * @internal
 */
export function __testLevelMap(level: string): LogLevel {
  const levelMap: Record<string, LogLevel> = {
    debug: LogLevel.DEBUG,
    info: LogLevel.INFO,
    warn: LogLevel.WARN,
    error: LogLevel.ERROR,
    none: LogLevel.NONE
  }
  return levelMap[level] ?? LogLevel.INFO
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
 * 获取当前日志级别（用于测试）
 * @internal
 */
export function __getCurrentLogLevel(): LogLevel {
  return currentLogLevel
}

/**
 * 检查是否应该输出特定级别的日志（用于测试）
 * @internal
 */
export function __shouldLog(level: LogLevel): boolean {
  return shouldLog(level)
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
    const should = shouldLog(LogLevel.DEBUG)
    if (should) {
      getConsole().log(formatPrefix('debug'), ...args)
    }
  },

  /**
   * 信息级别日志
   */
  info(...args: unknown[]) {
    if (shouldLog(LogLevel.INFO)) {
      getConsole().log(formatPrefix('info'), ...args)
    }
  },

  /**
   * 警告级别日志
   */
  warn(...args: unknown[]) {
    if (shouldLog(LogLevel.WARN)) {
      getConsole().warn(formatPrefix('warn'), ...args)
    }
  },

  /**
   * 错误级别日志（始终记录）
   * 错误日志不受日志级别控制，始终输出
   */
  error(...args: unknown[]) {
    getConsole().error(formatPrefix('error'), ...args)
  },

  /**
   * 安全日志（始终记录）
   * 用于安全审计和关键操作追踪
   */
  security(...args: unknown[]) {
    // 安全日志始终记录，不受日志级别控制
    getConsole().error(formatPrefix('security'), ...args)
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
