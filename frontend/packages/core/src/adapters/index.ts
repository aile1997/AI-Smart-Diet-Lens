/**
 * 适配器接口导出
 *
 * 所有平台相关操作必须通过适配器接口抽象，
 * 确保 Core 层 100% 纯 TypeScript
 */

export type { IHttp, HttpConfig, HttpResponse } from './IHttp'
export type { IStorage } from './IStorage'
export type { ICamera, CameraResult } from './ICamera'
