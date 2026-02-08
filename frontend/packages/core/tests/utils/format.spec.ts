/**
 * format.ts 单元测试
 *
 * 测试格式化工具函数
 */

import { describe, it, expect } from 'vitest'
import { formatCalories, formatDate, formatPercentage } from '../../src/utils/format'

describe('formatCalories', () => {
  it('应直接显示小于 1000 的热量值', () => {
    expect(formatCalories(0)).toBe('0')
    expect(formatCalories(100)).toBe('100')
    expect(formatCalories(500)).toBe('500')
    expect(formatCalories(999)).toBe('999')
  })

  it('应使用 k 单位显示大于等于 1000 的热量值', () => {
    expect(formatCalories(1000)).toBe('1.0k')
    expect(formatCalories(1500)).toBe('1.5k')
    expect(formatCalories(2000)).toBe('2.0k')
    expect(formatCalories(2500)).toBe('2.5k')
    expect(formatCalories(1234)).toBe('1.2k')
  })

  it('应正确处理浮点数', () => {
    expect(formatCalories(100.5)).toBe('101')
    expect(formatCalories(150.7)).toBe('151')
    expect(formatCalories(1500.9)).toBe('1.5k')
  })

  it('应处理负数（虽然实际场景不常见）', () => {
    // 负数直接显示，因为条件是 >= 1000
    expect(formatCalories(-100)).toBe('-100')
    expect(formatCalories(-1000)).toBe('-1000')
    expect(formatCalories(-1500)).toBe('-1500')
  })
})

describe('formatDate', () => {
  it('应格式化 Date 对象为 YYYY-MM-DD', () => {
    const date = new Date('2024-01-15T00:00:00Z')
    expect(formatDate(date)).toBe('2024-01-15')
  })

  it('应正确处理时间戳', () => {
    const timestamp = new Date('2024-12-31T00:00:00Z').getTime()
    expect(formatDate(timestamp)).toBe('2024-12-31')
  })

  it('应补零月份和日期', () => {
    const date = new Date('2024-01-05T00:00:00Z')
    expect(formatDate(date)).toBe('2024-01-05')
  })

  it('应处理不同月份', () => {
    expect(formatDate(new Date('2024-06-15'))).toBe('2024-06-15')
    expect(formatDate(new Date('2024-11-30'))).toBe('2024-11-30')
  })

  it('应处理闰年日期', () => {
    expect(formatDate(new Date('2024-02-29'))).toBe('2024-02-29')
  })
})

describe('formatPercentage', () => {
  it('应计算正确的百分比', () => {
    expect(formatPercentage(50, 100)).toBe(50)
    expect(formatPercentage(25, 100)).toBe(25)
    expect(formatPercentage(75, 100)).toBe(75)
    expect(formatPercentage(100, 100)).toBe(100)
  })

  it('应处理小数', () => {
    expect(formatPercentage(33.33, 100)).toBe(33)
    expect(formatPercentage(66.67, 100)).toBe(67)
  })

  it('应在 total 为 0 时返回 0', () => {
    expect(formatPercentage(50, 0)).toBe(0)
    expect(formatPercentage(0, 0)).toBe(0)
  })

  it('应在 total 为负数时返回 0', () => {
    expect(formatPercentage(50, -100)).toBe(0)
  })

  it('应限制最大值为 100', () => {
    expect(formatPercentage(150, 100)).toBe(100)
    expect(formatPercentage(200, 100)).toBe(100)
    expect(formatPercentage(500, 200)).toBe(100)
  })

  it('应处理负数值', () => {
    // 负数直接返回计算值（未限制最小值）
    expect(formatPercentage(-50, 100)).toBe(-50)
  })

  it('应处理小总计数值', () => {
    expect(formatPercentage(1, 3)).toBe(33)
    expect(formatPercentage(2, 3)).toBe(67)
  })
})
