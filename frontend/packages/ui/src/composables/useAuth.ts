/**
 * 认证功能 Composable (UI 层)
 *
 * 初始化 Core 层的 useAuth，传入 UI 层的适配器实现
 */

import { httpAdapter, storageAdapter } from '@/adapters'
import { useAuth as useCoreAuth } from '@diet-lens/core'

/**
 * 认证功能的 UI 层入口
 *
 * 使用 Core 层的业务逻辑，配合 UI 层的适配器实现
 */
export function useAuth() {
  return useCoreAuth(httpAdapter, storageAdapter)
}

// 重新导出类型
export type { LoginProvider, RegisterRequest, ThirdPartyLoginRequest } from '@diet-lens/core'
