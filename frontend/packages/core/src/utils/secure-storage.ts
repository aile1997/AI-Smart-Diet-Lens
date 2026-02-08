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
 * UTF-8 兼容的 Base64 编码
 * 支持中文和 Unicode 字符
 *
 * @param str 原始字符串
 * @returns Base64 编码后的字符串
 */
function base64Encode(str: string): string {
  // 使用 TextEncoder 将字符串转换为 UTF-8 字节数组
  const encoder = new TextEncoder()
  const data = encoder.encode(str)

  // 将字节数组转换为二进制字符串
  let binary = ''
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i])
  }

  // 使用 btoa 进行 Base64 编码
  return btoa(binary)
}

/**
 * UTF-8 兼容的 Base64 解码
 * 支持中文和 Unicode 字符
 *
 * @param base64 Base64 编码的字符串
 * @returns 解码后的原始字符串
 */
function base64Decode(base64: string): string {
  try {
    // 使用 atob 进行 Base64 解码
    const binary = atob(base64)

    // 将二进制字符串转换为字节数组
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    // 使用 TextDecoder 将字节数组转换为字符串
    const decoder = new TextDecoder()
    return decoder.decode(bytes)
  } catch {
    return ''
  }
}

/**
 * 简单的异或加密（仅用于演示，生产环境请使用 AES）
 * 支持 UTF-8 编码
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
  return base64Encode(result) // 使用 UTF-8 兼容的 Base64 编码
}

/**
 * 简单的异或解密
 * 支持 UTF-8 编码
 *
 * @param encrypted 加密的数据
 * @param key 解密密钥
 * @returns 解密后的字符串
 */
function xorDecrypt(encrypted: string, key: string): string {
  try {
    const data = base64Decode(encrypted) // 使用 UTF-8 兼容的 Base64 解码
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
