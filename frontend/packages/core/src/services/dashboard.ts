/**
 * 仪表盘服务
 *
 * 提供仪表盘摘要数据 API
 */

import type { IHttp } from '../adapters/IHttp'
import type { DashboardSummaryApiResponse } from '@diet-lens/shared-api'

const API_BASE = 'http://localhost:3000/api'

/**
 * 获取仪表盘摘要
 *
 * @param http - HTTP 适配器
 * @param date - 日期 (YYYY-MM-DD)，默认今日
 * @returns 仪表盘摘要数据
 */
export async function getDashboardSummary(
  http: IHttp,
  date?: string
): Promise<DashboardSummaryApiResponse['data']> {
  const query = date ? `?date=${date}` : ''

  const response = await http.request<DashboardSummaryApiResponse>({
    url: `${API_BASE}/dashboard/summary${query}`,
    method: 'GET',
  })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '获取仪表盘数据失败')
  }

  return response.data.data
}
