/**
 * 安全存储工具
 *
 * 使用 AES 加密保护敏感数据（如 Token）
 * 注意：这只是客户端加密，真正的安全需要服务端配合
 */

/**
 * 简单的 Base64 编码（用于生产环境应使用真正的加密库）
 * 这是一个基础实现，生产环境建议使用 crypto-js 或类似库
 */

const STORAGE_PREFIX = 'secure_'
const ENCRYPTION_KEY = '__DIET_LENS__'

/**
 * 简单的异或加密（仅用于演示，生产环境请使用 AES）
 *
 * @param data 原始数据
 * @param key 加密密钥
 * @returns 加密后的字符串
 */
function xorEncrypt(data: string, key: string): string {
  let result = ''
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(
      data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    )
  }
  return btoa(result) // Base64 编码
}

/**
 * 简单的异或解密
 *
 * @param encrypted 加密的数据
 * @param key 解密密钥
 * @returns 解密后的字符串
 */
function xorDecrypt(encrypted: string, key: string): string {
  try {
    const data = atob(encrypted) // Base64 解码
    let result = ''
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      )
    }
    return result
  } catch {
    return ''
  }
}

/**
 * 安全存储接口
 */
interface SecureStorage {
  setItem(key: string, value: string): void
  getItem(key: string): string | null
  removeItem(key: string): void
}

/**
 * UniApp 安全存储实现
 */
class UniSecureStorage implements SecureStorage {
  /**
   * 存储加密数据
   */
  setItem(key: string, value: string): void {
    try {
      const encrypted = xorEncrypt(value, ENCRYPTION_KEY)
      uni.setStorageSync(STORAGE_PREFIX + key, encrypted)
    } catch (error) {
      console.error('SecureStorage setItem error:', error)
      throw new Error('存储失败')
    }
  }

  /**
   * 获取并解密数据
   */
  getItem(key: string): string | null {
    try {
      const encrypted = uni.getStorageSync(STORAGE_PREFIX + key)
      if (!encrypted) return null
      return xorDecrypt(encrypted, ENCRYPTION_KEY)
    } catch (error) {
      console.error('SecureStorage getItem error:', error)
      return null
    }
  }

  /**
   * 删除数据
   */
  removeItem(key: string): void {
    try {
      uni.removeStorageSync(STORAGE_PREFIX + key)
    } catch (error) {
      console.error('SecureStorage removeItem error:', error)
    }
  }
}

/**
 * 创建安全存储实例
 */
export function createSecureStorage(): SecureStorage {
  return new UniSecureStorage()
}

/**
 * 导出默认实例
 */
export const secureStorage = createSecureStorage()

/**
 * Token 存储快捷方法
 */
export const tokenStorage = {
  setToken(token: string): void {
    secureStorage.setItem('token', token)
  },

  getToken(): string | null {
    return secureStorage.getItem('token')
  },

  removeToken(): void {
    secureStorage.removeItem('token')
  }
}
