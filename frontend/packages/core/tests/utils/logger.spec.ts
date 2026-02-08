/**
 * logger.ts 单元测试
 *
 * 测试日志功能
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { logger, initLogger, __setConsole, __getCurrentLogLevel, __shouldLog, __testLevelMap, LogLevel } from '../../src/utils/logger'

describe('logger', () => {
  let mockLog: ReturnType<typeof vi.fn>
  let mockWarn: ReturnType<typeof vi.fn>
  let mockError: ReturnType<typeof vi.fn>
  let originalConsole: Console

  beforeEach(() => {
    // 保存原始 console
    originalConsole = console

    // 创建 mock 函数
    mockLog = vi.fn()
    mockWarn = vi.fn()
    mockError = vi.fn()

    // 创建 mock console 对象
    const mockConsole = {
      log: mockLog,
      warn: mockWarn,
      error: mockError,
    } as unknown as Console

    // 使用 __setConsole 设置 mock
    __setConsole(mockConsole)

    // 重置日志级别为 INFO
    initLogger('info')
  })

  afterEach(() => {
    // 恢复原始 console
    __setConsole(originalConsole)
  })

  describe('initLogger', () => {
    it('应允许设置日志级别', () => {
      initLogger('error')

      logger.info('should not log')
      logger.error('should log')

      expect(mockLog).not.toHaveBeenCalled()
      expect(mockError).toHaveBeenCalled()
    })

    it('应支持切换日志级别', () => {
      initLogger('warn')
      logger.info('no log')
      logger.warn('warn log')

      expect(mockLog).not.toHaveBeenCalled()
      expect(mockWarn).toHaveBeenCalledTimes(1)

      initLogger('debug')
      mockLog.mockClear()
      logger.info('info log')

      expect(mockLog).toHaveBeenCalledTimes(1)
    })

    it('应处理无效的日志级别', () => {
      initLogger('invalid' as any)

      // 应该回退到默认的 INFO 级别
      logger.info('info log')
      expect(mockLog).toHaveBeenCalled()
    })
  })

  describe('debug', () => {
    it('应在 DEBUG 级别输出日志', () => {
      initLogger('debug')
      logger.debug('debug message')

      expect(mockLog).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        'debug message'
      )
    })

    it('应在 INFO 级别不输出 debug 日志', () => {
      initLogger('info')
      logger.debug('debug message')

      expect(mockLog).not.toHaveBeenCalled()
    })

    it('应在 WARN 级别不输出 debug 日志', () => {
      initLogger('warn')
      logger.debug('debug message')

      expect(mockLog).not.toHaveBeenCalled()
    })

    it('应支持多个参数', () => {
      initLogger('debug')
      logger.debug('message', { data: 'test' }, 123)

      expect(mockLog).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        'message',
        { data: 'test' },
        123
      )
    })
  })

  describe('info', () => {
    it('应在 DEBUG 级别输出日志', () => {
      initLogger('debug')
      logger.info('info message')

      expect(mockLog).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        'info message'
      )
    })

    it('应在 INFO 级别输出日志', () => {
      initLogger('info')
      logger.info('info message')

      expect(mockLog).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        'info message'
      )
    })

    it('应在 WARN 级别不输出 info 日志', () => {
      initLogger('warn')
      logger.info('info message')

      expect(mockLog).not.toHaveBeenCalled()
    })
  })

  describe('warn', () => {
    it('应在 DEBUG 级别输出日志', () => {
      initLogger('debug')
      logger.warn('warn message')

      expect(mockWarn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        'warn message'
      )
    })

    it('应在 INFO 级别输出日志', () => {
      initLogger('info')
      logger.warn('warn message')

      expect(mockWarn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        'warn message'
      )
    })

    it('应在 WARN 级别输出日志', () => {
      initLogger('warn')
      logger.warn('warn message')

      expect(mockWarn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        'warn message'
      )
    })

    it('应在 ERROR 级别不输出警告', () => {
      initLogger('error')
      logger.warn('warn message')

      expect(mockWarn).not.toHaveBeenCalled()
    })
  })

  describe('error', () => {
    it('应在所有级别输出错误（包括 NONE）', () => {
      initLogger('none')
      logger.error('error message')

      expect(mockError).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'error message'
      )
    })

    it('应支持多个参数', () => {
      initLogger('error')
      logger.error('error', { details: 'test' })

      expect(mockError).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'error',
        { details: 'test' }
      )
    })
  })

  describe('security', () => {
    it('应始终输出安全日志', () => {
      initLogger('none')
      logger.security('security event')

      expect(mockError).toHaveBeenCalledWith(
        expect.stringContaining('[SECURITY]'),
        'security event'
      )
    })
  })

  describe('日志格式', () => {
    it('应包含 ISO 时间戳', () => {
      initLogger('info')
      logger.info('test')

      const call = mockLog.mock.calls[0][0] as string
      // 应该包含 ISO 格式时间戳
      expect(call).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })

    it('应包含日志级别', () => {
      initLogger('info')
      logger.info('test')

      const call = mockLog.mock.calls[0][0] as string
      expect(call).toContain('[INFO]')
    })

    it('应为不同级别包含不同的标签', () => {
      initLogger('debug')
      logger.debug('debug')
      expect(mockLog.mock.calls[0][0]).toContain('[DEBUG]')

      mockLog.mockClear()
      initLogger('info')
      logger.info('info')
      expect(mockLog.mock.calls[0][0]).toContain('[INFO]')

      mockWarn.mockClear()
      initLogger('warn')
      logger.warn('warn')
      expect(mockWarn.mock.calls[0][0]).toContain('[WARN]')

      mockError.mockClear()
      initLogger('error')
      logger.error('error')
      expect(mockError.mock.calls[0][0]).toContain('[ERROR]')
    })
  })

  describe('边界情况', () => {
    it('应处理空消息', () => {
      initLogger('info')
      logger.info('')

      expect(mockLog).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        ''
      )
    })

    it('应处理 undefined 参数', () => {
      initLogger('info')
      logger.info(undefined)

      expect(mockLog).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        undefined
      )
    })

    it('应处理 null 参数', () => {
      initLogger('info')
      logger.info(null)

      expect(mockLog).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        null
      )
    })

    it('应处理大量参数', () => {
      initLogger('debug')
      const args = Array.from({ length: 100 }, (_, i) => `arg${i}`)
      logger.debug(...args)

      expect(mockLog).toHaveBeenCalled()
      expect(mockLog.mock.calls[0].length).toBe(101) // 前缀 + 100 个参数
    })
  })

  describe('调试测试', () => {
    it('调试：验证 debug 级别设置', () => {
      // 测试 levelMap 映射
      const mappedLevel = __testLevelMap('debug')
      expect(mappedLevel).toBe(LogLevel.DEBUG)

      // 现在测试 initLogger
      initLogger('debug')

      // 验证日志级别
      const currentLevel = __getCurrentLogLevel()
      expect(currentLevel).toBe(LogLevel.DEBUG)
    })
  })
})
