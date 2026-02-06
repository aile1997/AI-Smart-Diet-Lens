/**
 * 健康指标类型枚举
 */
export enum HealthMetricType {
  STEPS = 'STEPS',
  BODY_FAT = 'BODY_FAT',
  WEIGHT = 'WEIGHT',
  SLEEP = 'SLEEP',
  ACTIVE_CALORIES = 'ACTIVE_CALORIES',
}

/**
 * 健康指标条目
 */
export interface HealthMetricItem {
  type: HealthMetricType
  value: number
  recorded_at: string
  source?: string
}

/**
 * 健康数据同步请求
 */
export interface HealthSyncRequest {
  platform: 'ios' | 'android'
  device_model?: string
  metrics: HealthMetricItem[]
}

/**
 * 健康数据同步响应
 */
export interface HealthSyncResponse {
  status: string
  tdee_updated: boolean
  new_daily_budget?: number
}

/**
 * POST /api/user/health-sync
 */
export interface HealthSyncApiResponse extends ApiResponse {
  data: HealthSyncResponse
}

/**
 * 策略切换请求
 */
export interface SwitchStrategyRequest {
  new_strategy: GoalType
  target_weight?: number
}

/**
 * POST /api/user/strategy/switch
 */
export interface SwitchStrategyApiResponse extends ApiResponse {
  data: { strategy_config: import('./user').StrategyConfig }
}

/**
 * 更新身体指标请求
 */
export interface UpdateMetricsRequest {
  weight?: number
  body_fat?: number
  height?: number
}
