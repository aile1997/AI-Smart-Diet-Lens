/**
 * 共享 API 类型定义
 * 前后端共用，确保类型一致性
 *
 * 使用方式:
 * - 后端: import { ApiResponse, User } from '@/shared/api'
 * - 前端: import { ApiResponse, User } from '@diet-lens/shared-api'
 */

// 通用类型
export * from './common'

// 系统模块
export * from './system'

// 用户模块
export * from './user'

// 健康数据模块
export * from './health'

// 仪表盘模块
export * from './dashboard'

// 食物模块
export * from './food'

// 饮食日记模块
export * from './diary'

// 游戏化模块
export * from './gamification'

// 食谱模块
export * from './recipes'
