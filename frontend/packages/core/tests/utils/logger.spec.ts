/**
 * logger.ts 单元测试
 *
 * 测试日志功能
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// 在导入前设置环境变量，禁用自动初始化
process.env.NODE_ENV = 'test'

import { logger, LogLevel, initLogger } from '../../src/utils/logger'

describe('logger', () => {
  let mockLog: ReturnType<typeof vi.spyOn>
  let mockWarn: ReturnType<typeof vi.spyOn>
  let mockError: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // Mock console 方法
    mockLog = vi.spyOn(console, 'log').mockImplementation(() => {})
    mockWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockError = vi.spyOn(console, 'error').mockImplementation(() => {})

    // 重置日志级别为 INFO
    initLogger('info')
  })

  afterEach(() => {
    mockLog.mockRestore()
    mockWarn.mockRestore()
    mockError.mockRestore()
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
      mockLog.mockClear() // 清除之前的调用
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

    it('应支持多个参数', () => {
      initLogger('info')
      logger.info('message', { key: 'value' })

      expect(mockLog).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        'message',
        { key: 'value' }
      )
    })
  })

  describe('warn', () => {
    it('应在 WARN 级别输出警告', () => {
      initLogger('warn')
      logger.warn('warn message')

      expect(mockWarn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        'warn message'
      )
    })

    it('应在 DEBUG 级别输出警告', () => {
      initLogger('debug')
      logger.warn('warn message')

      expect(mockWarn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        'warn message'
      )
    })

    it('应在 ERROR 级别输出警告', () => {
      initLogger('error')
      logger.warn('warn message')

      expect(mockWarn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        'warn message'
      )
    })

    it('应在 NONE 级别不输出警告', () => {
      initLogger('none')
      logger.warn('warn message')

      expect(mockWarn).not.toHaveBeenCalled()
    })

    it('应支持多个参数', () => {
      initLogger('warn')
      logger.warn('message', { error: 'details' })

      expect(mockWarn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        'message',
        { error: 'details' }
      )
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

    it('应在 DEBUG 级别输出错误', () => {
      initLogger('debug')
      logger.error('error message')

      expect(mockError).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'error message'
      )
    })

    it('应在 ERROR 级别输出错误', () => {
      initLogger('error')
      logger.error('error message')

      expect(mockError).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'error message'
      )
    })

    it('应支持 Error 对象', () => {
      initLogger('error')
      const error = new Error('Test error')
      logger.error('Something failed', error)

      expect(mockError).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'Something failed',
        error
      )
    })

    it('应支持多个参数', () => {
      initLogger('error')
      logger.error('message', { context: 'test' }, 'additional')

      expect(mockError).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'message',
        { context: 'test' },
        'additional'
      )
    })
  })

  describe('security', () => {
    it('应在所有级别输出安全日志', () => {
      initLogger('none')
      logger.security('security event')

      expect(mockError).toHaveBeenCalledWith(
        expect.stringContaining('[SECURITY]'),
        'security event'
      )
    })

    it('应在 DEBUG 级别输出安全日志', () => {
      initLogger('debug')
      logger.security('security event')

      expect(mockError).toHaveBeenCalledWith(
        expect.stringContaining('[SECURITY]'),
        'security event'
      )
    })
  })

  describe('日志格式', () => {
    it('应包含时间戳', () => {
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

      initLogger('info')
      logger.info('info')
      expect(mockLog.mock.calls[0][0]).toContain('[INFO]')

      initLogger('warn')
      logger.warn('warn')
      expect(mockWarn.mock.calls[0][0]).toContain('[WARN]')

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
        expect.stringContaining('[INFO]')
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

    it('应处理对象参数', () => {
      initLogger('info')
      const obj = { key: 'value', nested: { data: 123 } }
      logger.info(obj)

      expect(mockLog).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        obj
      )
    })

    it('应处理数组参数', () => {
      initLogger('info')
      const arr = [1, 2, 3, 'four']
      logger.info(arr)

      expect(mockLog).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        arr
      )
    })

    it('应处理无参数', () => {
      initLogger('info')
      logger.info()

      expect(mockLog).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]')
      )
    })
  })
})
