/**
 * DashboardService 单元测试
 *
 * 测试仪表盘 API 服务
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DashboardService } from '../../src/api/services/dashboard.service'
import type { ApiClient } from '../../src/api/client'

describe('DashboardService', () => {
  let dashboardService: DashboardService
  let mockClient: {
    get: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockClient = {
      get: vi.fn()
    }

    dashboardService = new DashboardService(mockClient as any)
  })

  describe('getSummary', () => {
    it('应成功获取仪表盘摘要（不带日期参数）', async () => {
      const mockResponse = {
        ui_strategy: 'LOSE_WEIGHT' as const,
        date: '2024-01-15',
        hero_component: {
          type: 'CALORIE_RING',
          data: {
            primary: {
              label: '已摄入',
              current: 1450,
              target: 1800,
              unit: 'kcal'
            },
            secondary: {
              label: '剩余',
              current: 350,
              target: 1800,
              unit: 'kcal'
            }
          }
        },
        widgets: {
          steps: {
            current: 8500,
            target: 10000
          },
          water: {
            current: 1500,
            target: 2000
          },
          sleep: {
            hours: 7.5,
            quality: 'GOOD' as const
          }
        }
      }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await dashboardService.getSummary()

      expect(result).toEqual(mockResponse)
      expect(mockClient.get).toHaveBeenCalledWith('/dashboard/summary', undefined)
    })

    it('应支持指定日期参数', async () => {
      const mockResponse = {
        ui_strategy: 'MAINTAIN' as const,
        date: '2024-01-10',
        hero_component: {
          type: 'CALORIE_RING',
          data: {
            primary: {
              label: '已摄入',
              current: 2000,
              target: 2000,
              unit: 'kcal'
            },
            secondary: {
              label: '完成',
              current: 100,
              target: 100,
              unit: '%'
            }
          }
        },
        widgets: {
          steps: {
            current: 12000,
            target: 10000
          },
          water: {
            current: 2500,
            target: 2000
          },
          sleep: {
            hours: 8,
            quality: 'GOOD' as const
          }
        }
      }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await dashboardService.getSummary('2024-01-10')

      expect(result).toEqual(mockResponse)
      expect(mockClient.get).toHaveBeenCalledWith('/dashboard/summary', { params: { date: '2024-01-10' } })
    })

    it('应支持增肌策略', async () => {
      const mockResponse = {
        ui_strategy: 'GAIN_MUSCLE' as const,
        date: '2024-01-15',
        hero_component: {
          type: 'CALORIE_RING',
          data: {
            primary: {
              label: '蛋白质',
              current: 120,
              target: 150,
              unit: 'g'
            },
            secondary: {
              label: '热量',
              current: 2500,
              target: 2800,
              unit: 'kcal'
            }
          }
        },
        widgets: {
          steps: {
            current: 6000,
            target: 8000
          },
          water: {
            current: 1800,
            target: 2500
          },
          sleep: {
            hours: 6.5,
            quality: 'FAIR' as const
          }
        }
      }

      mockClient.get.mockResolvedValue(mockResponse)

      const result = await dashboardService.getSummary('2024-01-15')

      expect(result.ui_strategy).toBe('GAIN_MUSCLE')
      expect(result.hero_component.data.primary.label).toBe('蛋白质')
    })

    it('应处理获取失败', async () => {
      mockClient.get.mockRejectedValue(new Error('网络错误'))

      await expect(dashboardService.getSummary()).rejects.toThrow('网络错误')
    })
  })
})
