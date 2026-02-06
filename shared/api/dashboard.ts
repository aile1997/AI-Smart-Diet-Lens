import { ApiResponse } from './common'
import { NutritionInfo } from './user'

/**
 * 英雄组件类型
 */
export type HeroComponentType = 'DUAL_BAR_CHART' | 'CALORIE_RING' | 'PROGRESS_RING'

/**
 * 英雄组件数据
 */
export interface HeroComponent {
  type: HeroComponentType
  data: {
    primary: { label: string; current: number; target: number; unit: string }
    secondary: { label: string; current: number; target: number; unit: string }
  }
}

/**
 * 小组件数据
 */
export interface Widgets {
  steps: { current: number; target: number }
  water: { current: number; target: number }
  sleep: { hours: number; quality: string }
}

/**
 * 智能弹窗
 */
export interface SmartAlert {
  type: string
  title: string
  message: string
  action: string
}

/**
 * 仪表盘汇总数据
 */
export interface DashboardSummary {
  ui_strategy: string
  date: string
  hero_component: HeroComponent
  widgets: Widgets
  smart_alert?: SmartAlert
}

/**
 * GET /api/dashboard/summary
 */
export interface DashboardSummaryApiResponse extends ApiResponse {
  data: DashboardSummary
}
