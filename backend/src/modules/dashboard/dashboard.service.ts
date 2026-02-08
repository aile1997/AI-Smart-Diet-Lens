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

/**
 * UI 策略枚举（API 层统一使用大写+下划线）
 */
export type UiStrategy = 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_MUSCLE'

export interface DashboardSummary {
  ui_strategy: UiStrategy
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
   * 数据库 goal 值映射到 UI 策略枚举
   * 数据库存储: lose_weight | maintain | gain_muscle
   * API 返回: LOSE_WEIGHT | MAINTAIN | GAIN_MUSCLE
   */
  private mapGoalToStrategy(goal: string | null): UiStrategy {
    const goalMap: Record<string, UiStrategy> = {
      'lose_weight': 'LOSE_WEIGHT',
      'maintain': 'MAINTAIN',
      'gain_muscle': 'GAIN_MUSCLE',
    }
    return goalMap[goal || ''] || 'MAINTAIN'
  }

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

    // 映射数据库 goal 值到 API 策略枚举
    const uiStrategy = this.mapGoalToStrategy(user.goal)

    // 根据策略生成 UI 组件
    const heroComponent: HeroComponent = this.generateHeroComponent(
      uiStrategy,
      totalProtein,
      totalCalories,
      user.dailyCalorieTarget || 2000,
      user.proteinTarget || 180,
    )

    // 智能弹窗（根据数据判断）
    const smartAlert = this.generateSmartAlert(
      user,
      diaryEntries,
      uiStrategy,
    )

    return {
      ui_strategy: uiStrategy,
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
    strategy: UiStrategy,
    protein: number,
    calories: number,
    targetCalories: number,
    proteinTarget: number,
  ): HeroComponent {
    if (strategy === 'GAIN_MUSCLE') {
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
