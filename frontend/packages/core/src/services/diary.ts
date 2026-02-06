/**
 * 饮食日记服务
 *
 * 提供饮食记录的增删改查 API
 */

import type { IHttp } from '../adapters/IHttp'
import type {
  CreateDiaryEntryRequest,
  UpdateDiaryEntryRequest,
  GetDiaryListResponse,
  GetDailySummaryResponse,
  MealType,
} from '@diet-lens/shared-api'

const API_BASE = 'http://localhost:3000/api'

/**
 * 获取日记列表
 *
 * @param http - HTTP 适配器
 * @param date - 日期 (YYYY-MM-DD)
 * @returns 日记条目列表
 */
export async function getDiaryList(
  http: IHttp,
  date?: string
): Promise<GetDiaryListResponse['data']> {
  const query = date ? `?date=${date}` : ''

  const response = await http.request<GetDiaryListResponse>({
    url: `${API_BASE}/diary${query}`,
    method: 'GET',
  })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '获取日记列表失败')
  }

  return response.data.data
}

/**
 * 获取每日营养汇总
 *
 * @param http - HTTP 适配器
 * @param date - 日期 (YYYY-MM-DD)
 * @returns 每日营养汇总
 */
export async function getDailySummary(
  http: IHttp,
  date?: string
): Promise<GetDailySummaryResponse['data']> {
  const query = date ? `?date=${date}` : ''

  const response = await http.request<GetDailySummaryResponse>({
    url: `${API_BASE}/diary/summary${query}`,
    method: 'GET',
  })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '获取营养汇总失败')
  }

  return response.data.data
}

/**
 * 创建饮食记录
 *
 * @param http - HTTP 适配器
 * @param data - 创建日记请求
 * @returns 创建成功
 */
export async function createDiaryEntry(
  http: IHttp,
  data: CreateDiaryEntryRequest
): Promise<void> {
  const response = await http.request<{ success: boolean }>({
    url: `${API_BASE}/diary/entry`,
    method: 'POST',
    data,
  })

  if (!response.data.success) {
    throw new Error(response.data.message || '创建饮食记录失败')
  }
}

/**
 * 更新饮食记录
 *
 * @param http - HTTP 适配器
 * @param id - 日记条目 ID
 * @param data - 更新请求
 */
export async function updateDiaryEntry(
  http: IHttp,
  id: string,
  data: UpdateDiaryEntryRequest
): Promise<void> {
  const response = await http.request<{ success: boolean }>({
    url: `${API_BASE}/diary/entry/${id}`,
    method: 'PATCH',
    data,
  })

  if (!response.data.success) {
    throw new Error(response.data.message || '更新饮食记录失败')
  }
}

/**
 * 删除饮食记录
 *
 * @param http - HTTP 适配器
 * @param id - 日记条目 ID
 */
export async function deleteDiaryEntry(http: IHttp, id: string): Promise<void> {
  const response = await http.request<{ success: boolean }>({
    url: `${API_BASE}/diary/entry/${id}`,
    method: 'DELETE',
  })

  if (!response.data.success) {
    throw new Error(response.data.message || '删除饮食记录失败')
  }
}
