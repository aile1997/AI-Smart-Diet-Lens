import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'

/**
 * 仪表盘数据类型
 */
export interface HeroComponent {
  type: 'DUAL_BAR_CHART' | 'CALORIE_RING' | 'PROGRESS_RING'
  data: {
    primary: { label: string; current: number; target: number; unit: string }
    secondary: { label: string; current: number; target: number; unit: string }
  }
}

export interface SmartAlert {
  type: string
  title: string
  message: string
  action: string
}

export interface DashboardSummary {
  ui_strategy: string
  date: string
  hero_component: HeroComponent
  widgets: {
    steps: { current: number; target: number }
    water: { current: number; target: number }
    sleep: { hours: number; quality: string }
  }
  smart_alert?: SmartAlert
}

/**
 * 仪表盘服务
 */
@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /api/dashboard/summary
   * 获取今日聚合视图
   */
  async getSummary(userId: string, date: string): Promise<DashboardSummary> {
    // 获取用户信息
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('用户不存在')
    }

    // 获取当日饮食记录
    const diaryEntries = await this.prisma.diaryEntry.findMany({
      where: {
        userId,
        date,
      },
    })

    // 计算今日摄入
    const totalCalories = diaryEntries.reduce((sum, entry) => sum + entry.calories, 0)
    const totalProtein = diaryEntries.reduce((sum, entry) => sum + entry.protein, 0)

    // 获取用户策略模式
    const strategyMode = user.goal || 'MAINTAIN'

    // 根据策略生成 UI 组件
    const heroComponent: HeroComponent = this.generateHeroComponent(
      strategyMode,
      totalProtein,
      totalCalories,
      user.dailyCalorieTarget || 2000,
    )

    // 智能弹窗（根据数据判断）
    const smartAlert = this.generateSmartAlert(
      user,
      diaryEntries,
      strategyMode,
    )

    return {
      ui_strategy: strategyMode,
      date,
      hero_component: heroComponent,
      widgets: {
        steps: { current: 5430, target: 10000 }, // TODO: 从健康数据获取
        water: { current: 4, target: 8 }, // TODO: 从健康数据获取
        sleep: { hours: 7.5, quality: 'GOOD' }, // TODO: 从健康数据获取
      },
      smart_alert: smartAlert,
    }
  }

  /**
   * 根据策略生成主组件
   */
  private generateHeroComponent(
    strategy: string,
    protein: number,
    calories: number,
    targetCalories: number,
  ): HeroComponent {
    const proteinTarget = 180 // TODO: 根据体重计算

    if (strategy === 'MUSCLE_GAIN') {
      return {
        type: 'DUAL_BAR_CHART',
        data: {
          primary: {
            label: 'Protein',
            current: protein,
            target: proteinTarget,
            unit: 'g',
          },
          secondary: {
            label: 'Calories',
            current: calories,
            target: targetCalories,
            unit: 'kcal',
          },
        },
      }
    }

    return {
      type: 'CALORIE_RING',
      data: {
        primary: {
          label: 'Calories',
          current: calories,
          target: targetCalories,
          unit: 'kcal',
        },
        secondary: {
          label: 'Protein',
          current: protein,
          target: proteinTarget,
          unit: 'g',
        },
      },
    }
  }

  /**
   * 生成智能弹窗
   */
  private generateSmartAlert(
    user: any,
    entries: any[],
    strategy: string,
  ): SmartAlert | undefined {
    // TODO: 实现智能分析逻辑
    return undefined
  }
}
