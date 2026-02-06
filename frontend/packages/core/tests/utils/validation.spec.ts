/**
 * validation.ts 单元测试
 *
 * 测试表单验证功能
 */

import { describe, it, expect } from 'vitest'
import { validateEmail, validatePhone, validateCode, validatePassword } from '../../src/utils/validation'

describe('validateEmail', () => {
  describe('有效邮箱地址', () => {
    it('应接受标准格式', () => {
      const result = validateEmail('user@example.com')
      expect(result.valid).toBe(true)
      expect(result.message).toBeUndefined()
    })

    it('应接受带数字的邮箱', () => {
      const result = validateEmail('user123@example.com')
      expect(result.valid).toBe(true)
    })

    it('应接受带连字符的邮箱', () => {
      const result = validateEmail('user-name@example.com')
      expect(result.valid).toBe(true)
    })

    it('应接受带点号的邮箱', () => {
      const result = validateEmail('user.name@example.com')
      expect(result.valid).toBe(true)
    })

    it('应接受带子域名的邮箱', () => {
      const result = validateEmail('user@mail.example.com')
      expect(result.valid).toBe(true)
    })

    it('应接受常见邮箱服务商', () => {
      const emails = [
        'user@gmail.com',
        'user@qq.com',
        'user@163.com',
        'user@126.com',
        'user@outlook.com',
        'user@hotmail.com',
        'user@icloud.com',
        'user@yeah.net'
      ]
      emails.forEach(email => {
        const result = validateEmail(email)
        expect(result.valid).toBe(true)
      })
    })
  })

  describe('无效邮箱地址', () => {
    it('应拒绝空字符串', () => {
      const result = validateEmail('')
      expect(result.valid).toBe(false)
      expect(result.message).toBeDefined()
    })

    it('应拒绝缺少 @ 符号', () => {
      const result = validateEmail('userexample.com')
      expect(result.valid).toBe(false)
    })

    it('应拒绝缺少域名', () => {
      const result = validateEmail('user@')
      expect(result.valid).toBe(false)
    })

    it('应拒绝缺少用户名', () => {
      const result = validateEmail('@example.com')
      expect(result.valid).toBe(false)
    })

    it('应拒绝多个 @ 符号', () => {
      const result = validateEmail('user@@example.com')
      expect(result.valid).toBe(false)
    })

    it('应拒绝中文邮箱 (暂不支持)', () => {
      const result = validateEmail('用户@example.com')
      expect(result.valid).toBe(false)
    })

    it('应拒绝只有空格', () => {
      const result = validateEmail('   ')
      expect(result.valid).toBe(false)
    })
  })
})

describe('validatePhone', () => {
  describe('有效手机号', () => {
    it('应接受 11 位手机号', () => {
      const result = validatePhone('13800138000')
      expect(result.valid).toBe(true)
    })

    it('应接受 1 开头的手机号 (3-9段)', () => {
      const validPrefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
                            '150', '151', '152', '153', '155', '156', '157', '158', '159',
                            '170', '176', '177', '178',
                            '180', '181', '182', '183', '184', '185', '186', '187', '188', '189']
      validPrefixes.forEach(prefix => {
        const result = validatePhone(prefix + '12345678')
        expect(result.valid).toBe(true)
      })
    })

    it('应接受 19 开头的手机号', () => {
      const result = validatePhone('19800198000')
      expect(result.valid).toBe(true)
    })

    it('应接受 166 开头的手机号', () => {
      const result = validatePhone('16600166000')
      expect(result.valid).toBe(true)
    })
  })

  describe('无效手机号', () => {
    it('应拒绝空字符串', () => {
      const result = validatePhone('')
      expect(result.valid).toBe(false)
    })

    it('应拒绝非 1 开头', () => {
      const result = validatePhone('23400234000')
      expect(result.valid).toBe(false)
    })

    it('应拒绝 2 开头 (不符合 3-9 规则)', () => {
      const result = validatePhone('12345678901')
      expect(result.valid).toBe(false)
    })

    it('应拒绝少于 11 位', () => {
      const result = validatePhone('1380013800')
      expect(result.valid).toBe(false)
    })

    it('应拒绝多于 11 位', () => {
      const result = validatePhone('138001380000')
      expect(result.valid).toBe(false)
    })

    it('应拒绝包含字母', () => {
      const result = validatePhone('1380013800a')
      expect(result.valid).toBe(false)
    })

    it('应拒绝包含特殊字符', () => {
      const result = validatePhone('138-0013-8000')
      expect(result.valid).toBe(false)
    })

    it('应拒绝空格', () => {
      const result = validatePhone('138 0013 8000')
      expect(result.valid).toBe(false)
    })
  })
})

describe('validateCode', () => {
  describe('有效验证码 (仅 6 位数字)', () => {
    it('应接受 6 位数字验证码', () => {
      const result = validateCode('123456')
      expect(result.valid).toBe(true)
    })

    it('应接受全零验证码', () => {
      const result = validateCode('000000')
      expect(result.valid).toBe(true)
    })

    it('应接受全九验证码', () => {
      const result = validateCode('999999')
      expect(result.valid).toBe(true)
    })
  })

  describe('无效验证码', () => {
    it('应拒绝空字符串', () => {
      const result = validateCode('')
      expect(result.valid).toBe(false)
    })

    it('应拒绝非数字字符', () => {
      const result = validateCode('12345a')
      expect(result.valid).toBe(false)
    })

    it('应拒绝纯字母', () => {
      const result = validateCode('abcdef')
      expect(result.valid).toBe(false)
    })

    it('应拒绝特殊字符', () => {
      const result = validateCode('12-456')
      expect(result.valid).toBe(false)
    })

    it('应拒绝少于 6 位', () => {
      const result = validateCode('12345')
      expect(result.valid).toBe(false)
    })

    it('应拒绝 4 位验证码 (仅支持 6 位)', () => {
      const result = validateCode('1234')
      expect(result.valid).toBe(false)
    })

    it('应拒绝多于 6 位', () => {
      const result = validateCode('1234567')
      expect(result.valid).toBe(false)
    })

    it('应拒绝只有空格', () => {
      const result = validateCode('      ')
      expect(result.valid).toBe(false)
    })

    it('应拒绝包含空格', () => {
      const result = validateCode('123 456')
      expect(result.valid).toBe(false)
    })
  })
})

describe('validatePassword', () => {
  describe('有效密码 (需要同时包含字母和数字)', () => {
    it('应接受字母数字混合密码', () => {
      const result = validatePassword('abc12345')
      expect(result.valid).toBe(true)
    })

    it('应接受带特殊字符的密码', () => {
      const result = validatePassword('abc@1234')
      expect(result.valid).toBe(true)
    })

    it('应接受 16 位长密码', () => {
      const result = validatePassword('abc123456789012')
      expect(result.valid).toBe(true)
    })

    it('应接受大写字母加数字', () => {
      const result = validatePassword('ABC12345')
      expect(result.valid).toBe(true)
    })

    it('应接受混合大小写加数字', () => {
      const result = validatePassword('Abc12345')
      expect(result.valid).toBe(true)
    })
  })

  describe('无效密码', () => {
    it('应拒绝空字符串', () => {
      const result = validatePassword('')
      expect(result.valid).toBe(false)
    })

    it('应拒绝少于 8 位', () => {
      const result = validatePassword('1234567')
      expect(result.valid).toBe(false)
    })

    it('应拒绝纯数字密码 (需要字母)', () => {
      const result = validatePassword('12345678')
      expect(result.valid).toBe(false)
    })

    it('应拒绝纯字母密码 (需要数字)', () => {
      const result = validatePassword('abcdefgh')
      expect(result.valid).toBe(false)
    })

    it('应拒绝包含空格', () => {
      const result = validatePassword('abc 1234')
      expect(result.valid).toBe(false)
    })

    it('应拒绝包含中文', () => {
      const result = validatePassword('abc密码123')
      expect(result.valid).toBe(false)
    })

    it('应拒绝只有空格', () => {
      const result = validatePassword('        ')
      expect(result.valid).toBe(false)
    })
  })
})

describe('边界值测试', () => {
  it('应处理 undefined 输入', () => {
    const result = validateEmail(undefined as any)
    expect(result.valid).toBe(false)
  })

  it('应处理 null 输入', () => {
    const result = validateEmail(null as any)
    expect(result.valid).toBe(false)
  })

  it('应处理数字输入', () => {
    const result = validateEmail(123 as any)
    expect(result.valid).toBe(false)
  })
})
