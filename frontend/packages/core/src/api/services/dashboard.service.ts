/**
 * 仪表盘服务
 *
 * GET /api/dashboard/summary - 获取仪表盘摘要
 */

import type { ApiClient } from '../client'

/**
 * 仪表盘摘要响应
 */
export interface DashboardSummary {
  ui_strategy: 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_MUSCLE'
  date: string
  hero_component: {
    type: 'CALORIE_RING'
    data: {
      primary: {
        label: string
        current: number
        target: number
        unit: string
      }
      secondary: {
        label: string
        current: number
        target: number
        unit: string
      }
    }
  }
  widgets: {
    steps: {
      current: number
      target: number
    }
    water: {
      current: number
      target: number
    }
    sleep: {
      hours: number
      quality: 'GOOD' | 'FAIR' | 'POOR'
    }
  }
}

export class DashboardService {
  constructor(private client: ApiClient) {}

  /**
   * 获取仪表盘摘要
   *
   * @param date 日期 (YYYY-MM-DD)，默认今日
   */
  async getSummary(date?: string): Promise<DashboardSummary> {
    const params = date ? { date } : undefined
    return this.client.get<DashboardSummary>('/dashboard/summary', { params })
  }
}
