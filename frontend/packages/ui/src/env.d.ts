/**
 * 环境变量类型声明
 *
 * Vite 会自动注入以 VITE_ 开头的环境变量
 * 此文件为这些变量提供 TypeScript 类型支持
 */

interface ImportMetaEnv {
  /** API 基础地址 */
  readonly VITE_API_BASE_URL: string

  /** 应用标题 */
  readonly VITE_APP_TITLE: string

  /** 应用版本 */
  readonly VITE_APP_VERSION: string

  /** 是否启用 Mock 数据 */
  readonly VITE_ENABLE_MOCK: string

  /** 是否启用调试模式 */
  readonly VITE_ENABLE_DEBUG: string

  /** 日志级别 */
  readonly VITE_LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
