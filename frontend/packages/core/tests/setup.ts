/**
 * Vitest 测试环境设置
 *
 * 提供全局 mock 和测试工具
 */

import { vi, afterEach } from 'vitest'

// ============ 全局 Console Mock ============
// 必须在所有模块导入前设置，否则模块会绑定原始 console

const originalConsole = { ...global.console }

// 创建 mock 函数
export const mockConsoleLog = vi.fn()
export const mockConsoleWarn = vi.fn()
export const mockConsoleError = vi.fn()

// 替换全局 console 方法
global.console.log = mockConsoleLog
global.console.warn = mockConsoleWarn
global.console.error = mockConsoleError

// 导出恢复函数
export function restoreConsole() {
  global.console.log = originalConsole.log
  global.console.warn = originalConsole.warn
  global.console.error = originalConsole.error
}

// ============ 全局 Mock 存储 ============
const mockStorage: Record<string, string> = {}

/**
 * UniApp 全局对象 Mock
 * 完整模拟 UniApp API 用于 Node.js 测试环境
 */
const mockUni = {
  // 存储相关
  setStorageSync: vi.fn((key: string, value: string) => {
    mockStorage[key] = value
    return true
  }),
  getStorageSync: vi.fn((key: string) => {
    return mockStorage[key] || ''
  }),
  removeStorageSync: vi.fn((key: string) => {
    delete mockStorage[key]
    return true
  }),
  clearStorageSync: vi.fn(() => {
    Object.keys(mockStorage).forEach(key => {
      delete mockStorage[key]
    })
  }),

  // 网络请求相关
  request: vi.fn((options: any) => {
    // 默认返回成功响应
    setTimeout(() => {
      options.success?.({
        statusCode: 200,
        data: {},
        header: {}
      })
    }, 0)
    return {}
  }),
  uploadFile: vi.fn(),
  downloadFile: vi.fn(),

  // 导航相关
  navigateTo: vi.fn(),
  redirectTo: vi.fn(),
  switchTab: vi.fn(),
  navigateBack: vi.fn(),
  reLaunch: vi.fn(),

  // UI 反馈相关
  showToast: vi.fn(),
  hideToast: vi.fn(),
  showLoading: vi.fn(),
  hideLoading: vi.fn(),
  showModal: vi.fn(),
  showActionSheet: vi.fn(),

  // 设备信息
  getSystemInfoSync: vi.fn(() => ({
    platform: 'h5',
    system: 'test',
    model: 'test',
    screenWidth: 375,
    screenHeight: 667
  })),

  // 其他常用 API
  getProvider: vi.fn(),
  login: vi.fn(),
  getUserInfo: vi.fn(),
  getLocation: vi.fn(),
  chooseImage: vi.fn(),
  previewImage: vi.fn(),
  scanCode: vi.fn(),
  setClipboardData: vi.fn(),
  getClipboardData: vi.fn(),
  vibrateShort: vi.fn(),
  vibrateLong: vi.fn()
}

// 设置全局 uni 对象
global.uni = mockUni as any

// 设置全局 wx 对象（微信小程序兼容）
global.wx = mockUni as any

// 导出 mock 存储清理函数（用于测试间清理）
export function clearMockStorage() {
  Object.keys(mockStorage).forEach(key => {
    delete mockStorage[key]
  })
}

// 导出获取 mock 存储内容的函数
export function getMockStorage() {
  return { ...mockStorage }
}

// 在每个测试后自动清理
afterEach(() => {
  clearMockStorage()
})
