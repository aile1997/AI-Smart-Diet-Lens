/**
 * 表单验证工具
 *
 * 提供常用的表单字段验证函数
 */

/**
 * 验证结果接口
 */
export interface ValidationResult {
  valid: boolean
  message?: string
}

/**
 * 邮箱格式验证正则
 * 支持常见邮箱格式
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

/**
 * 手机号验证正则（中国大陆）
 */
const PHONE_REGEX = /^1[3-9]\d{9}$/

/**
 * 验证码格式正则（6位数字）
 */
const CODE_REGEX = /^\d{6}$/

/**
 * 密码强度验证正则
 * 至少 8 位，包含字母和数字
 */
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/

/**
 * 验证邮箱格式
 *
 * @param email 邮箱地址
 * @returns 验证结果
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: '请输入邮箱地址' }
  }

  const trimmed = email.trim()

  if (!trimmed) {
    return { valid: false, message: '请输入邮箱地址' }
  }

  if (trimmed.length > 254) {
    return { valid: false, message: '邮箱地址过长' }
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, message: '邮箱格式不正确' }
  }

  return { valid: true }
}

/**
 * 验证手机号格式
 *
 * @param phone 手机号
 * @returns 验证结果
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, message: '请输入手机号' }
  }

  const trimmed = phone.trim()

  if (!trimmed) {
    return { valid: false, message: '请输入手机号' }
  }

  if (!PHONE_REGEX.test(trimmed)) {
    return { valid: false, message: '手机号格式不正确' }
  }

  return { valid: true }
}

/**
 * 验证验证码格式
 *
 * @param code 验证码
 * @returns 验证结果
 */
export function validateCode(code: string): ValidationResult {
  if (!code || typeof code !== 'string') {
    return { valid: false, message: '请输入验证码' }
  }

  const trimmed = code.trim()

  if (!trimmed) {
    return { valid: false, message: '请输入验证码' }
  }

  if (!CODE_REGEX.test(trimmed)) {
    return { valid: false, message: '请输入6位数字验证码' }
  }

  return { valid: true }
}

/**
 * 验证邮箱或手机号格式（统一账号验证）
 *
 * @param account 邮箱或手机号
 * @returns 验证结果
 */
export function validateAccount(account: string): ValidationResult {
  if (!account || typeof account !== 'string') {
    return { valid: false, message: '请输入手机号或邮箱' }
  }

  const trimmed = account.trim()

  if (!trimmed) {
    return { valid: false, message: '请输入手机号或邮箱' }
  }

  // 先尝试手机号验证
  const phoneResult = validatePhone(trimmed)
  if (phoneResult.valid) {
    return { valid: true }
  }

  // 再尝试邮箱验证
  const emailResult = validateEmail(trimmed)
  if (emailResult.valid) {
    return { valid: true }
  }

  return { valid: false, message: '请输入正确的手机号或邮箱' }
}

/**
 * 验证密码强度
 *
 * @param password 密码
 * @returns 验证结果
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: '请输入密码' }
  }

  if (password.length < 8) {
    return { valid: false, message: '密码至少需要8位' }
  }

  if (!PASSWORD_REGEX.test(password)) {
    return { valid: false, message: '密码需包含字母和数字' }
  }

  return { valid: true }
}

/**
 * 通用必填验证
 *
 * @param value 值
 * @param fieldName 字段名称
 * @returns 验证结果
 */
export function validateRequired(value: string, fieldName = '此项'): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { valid: false, message: `请输入${fieldName}` }
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return { valid: false, message: `请输入${fieldName}` }
  }

  return { valid: true }
}

/**
 * 验证字符串长度
 *
 * @param value 值
 * @param min 最小长度
 * @param max 最大长度
 * @param fieldName 字段名称
 * @returns 验证结果
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName = '此项'
): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { valid: false, message: `请输入${fieldName}` }
  }

  const trimmed = value.trim()
  const length = trimmed.length

  if (length < min) {
    return { valid: false, message: `${fieldName}至少需要${min}个字符` }
  }

  if (length > max) {
    return { valid: false, message: `${fieldName}最多${max}个字符` }
  }

  return { valid: true }
}
