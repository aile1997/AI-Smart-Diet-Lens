import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'
import {
  AchievementsResponse,
  AchievementBadge,
} from './dto/achievement.dto'

/**
 * 游戏化服务
 */
@Injectable()
export class GamificationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /gamification/achievements
   * 获取用户成就墙
   */
  async getAchievements(userId: string): Promise<AchievementsResponse> {
    // 获取所有成就定义
    const allAchievements = await this.prisma.achievement.findMany()

    // 获取用户成就进度
    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    })

    // 创建用户成就映射
    const userAchievementMap = new Map(
      userAchievements.map((ua) => [ua.achievementId, ua]),
    )

    // 计算连续打卡天数
    const streakDays = await this.calculateStreakDays(userId)

    // 计算用户等级
    const level = this.calculateLevel(userAchievements)

    // 构建徽章列表
    const badges: AchievementBadge[] = allAchievements.map((achievement) => {
      const userAchievement = userAchievementMap.get(achievement.id)

      return {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        category: achievement.category,
        icon: achievement.icon,
        target: achievement.target,
        unlocked: userAchievement?.unlocked || false,
        progress: userAchievement?.progress || 0,
        unlockedAt: userAchievement?.unlockedAt || undefined,
      }
    })

    return {
      streak_days: streakDays,
      level,
      badges,
    }
  }

  /**
   * 更新成就进度（内部方法，由其他模块触发）
   */
  async updateProgress(
    userId: string,
    achievementId: string,
    increment: number,
  ): Promise<void> {
    const userAchievement = await this.prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
    })

    if (!userAchievement) {
      // 创建新的用户成就记录
      await this.prisma.userAchievement.create({
        data: {
          userId,
          achievementId,
          progress: increment,
          unlocked: increment >= 0, // 简化：假设 target <= 0 时解锁
        },
      })
      return
    }

    // 更新进度
    const newProgress = userAchievement.progress + increment

    // 获取成就目标
    const achievement = await this.prisma.achievement.findUnique({
      where: { id: achievementId },
    })

    if (!achievement) {
      throw new NotFoundException('成就不存在')
    }

    // 检查是否解锁
    const unlocked = newProgress >= achievement.target

    await this.prisma.userAchievement.update({
      where: { id: userAchievement.id },
      data: {
        progress: newProgress,
        unlocked: unlocked || userAchievement.unlocked,
        unlockedAt: unlocked && !userAchievement.unlocked ? new Date() : userAchievement.unlockedAt,
      },
    })
  }

  /**
   * 计算连续打卡天数
   * 基于用户记录饮食日记的天数计算
   */
  private async calculateStreakDays(userId: string): Promise<number> {
    const entries = await this.prisma.diaryEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      select: { date: true },
      distinct: ['date'],
    })

    if (entries.length === 0) {
      return 0
    }

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const entry of entries) {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)

      const diffDays = Math.floor(
        (currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24),
      )

      if (diffDays === streak) {
        streak++
        currentDate = entryDate
      } else {
        break
      }
    }

    return streak
  }

  /**
   * 根据解锁的成就数量计算用户等级
   */
  private calculateLevel(userAchievements: any[]): number {
    const unlockedCount = userAchievements.filter((ua) => ua.unlocked).length
    // 简单的等级公式：每解锁 3 个成就升一级
    return Math.floor(unlockedCount / 3) + 1
  }
}
