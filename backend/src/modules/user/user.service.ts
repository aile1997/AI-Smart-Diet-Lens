import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'
import { JwtService } from '@nestjs/jwt'
import {
  OnboardingDto,
  GoalType,
  ActivityLevel,
  StrategyConfig,
} from './dto/onboarding.dto'
import {
  HealthSyncDto,
  HealthSyncResponse,
  SwitchStrategyDto,
  UpdateMetricsDto,
} from './dto/health-sync.dto'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 用户入职引导 - 完成档案创建并计算初始代谢
   */
  async onboarding(userId: string, dto: OnboardingDto) {
    // 计算年龄
    const age = this.calculateAge(dto.dob)

    // 计算 BMR (基础代谢率) - Mifflin-St Jeor 公式
    const bmr = this.calculateBMR(
      dto.gender,
      dto.weight_kg,
      dto.height_cm,
      age,
    )

    // 计算 TDEE (每日总消耗)
    const tdee = Math.round(bmr * dto.activity_level)

    // 根据目标调整热量
    const dailyCalories = this.adjustCaloriesForGoal(
      tdee,
      dto.goal_type,
      dto.body_fat,
    )

    // 计算宏量营养素分配
    const macros = this.calculateMacros(
      dailyCalories,
      dto.goal_type,
      dto.weight_kg,
    )

    // 更新用户信息
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        gender: dto.gender,
        // 将 dob 转换为 Date 对象或存储年龄
        age,
        height: dto.height_cm,
        weight: dto.weight_kg,
        goal: dto.goal_type,
        activityLevel: dto.activity_level,
        dailyCalorieTarget: dailyCalories,
        onboardingCompleted: true,
      },
    })

    // 生成 JWT Token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    })

    return {
      user_id: user.id,
      token,
      strategy_config: {
        mode: dto.goal_type,
        daily_calories: dailyCalories,
        macros,
      } as StrategyConfig,
    }
  }

  /**
   * 计算年龄
   */
  private calculateAge(dob: string): number {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--
    }
    return age
  }

  /**
   * 计算 BMR (基础代谢率)
   * Mifflin-St Jeor 公式
   */
  private calculateBMR(
    gender: string,
    weightKg: number,
    heightCm: number,
    age: number,
  ): number {
    if (gender === 'MALE') {
      return 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    }
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  }

  /**
   * 根据目标调整热量
   */
  private adjustCaloriesForGoal(
    tdee: number,
    goalType: GoalType,
    bodyFat?: number,
  ): number {
    switch (goalType) {
      case GoalType.FAT_LOSS:
        // 减脂：TDEE - 500
        return Math.max(1200, tdee - 500)
      case GoalType.MUSCLE_GAIN:
        // 增肌：TDEE + 300（防止 dirty bulk）
        // 如果体脂 > 25%，则只增加 100
        return bodyFat && bodyFat > 25
          ? tdee + 100
          : tdee + 300
      case GoalType.MAINTAIN:
        return tdee
      default:
        return tdee
    }
  }

  /**
   * 计算宏量营养素分配
   */
  private calculateMacros(
    calories: number,
    goalType: GoalType,
    weightKg: number,
  ) {
    let proteinRatio: number
    let fatRatio: number
    let carbsRatio: number

    switch (goalType) {
      case GoalType.FAT_LOSS:
        proteinRatio = 0.35
        fatRatio = 0.25
        carbsRatio = 0.40
        break
      case GoalType.MUSCLE_GAIN:
        proteinRatio = 0.30
        fatRatio = 0.25
        carbsRatio = 0.45
        break
      case GoalType.MAINTAIN:
      default:
        proteinRatio = 0.25
        fatRatio = 0.30
        carbsRatio = 0.45
        break
    }

    // 蛋白质至少 1.6g/kg 体重
    const minProtein = Math.round(weightKg * 1.6)
    const calculatedProtein = Math.round((calories * proteinRatio) / 4)
    const protein = Math.max(minProtein, calculatedProtein)

    const fat = Math.round((calories * fatRatio) / 9)
    const carbs = Math.round((calories - protein * 4 - fat * 9) / 4)

    return {
      protein,
      carbs,
      fat,
    }
  }

  async findById(id: string, currentUserId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    // 所有权检查：只允许查看自己的资料
    if (currentUserId && id !== currentUserId) {
      throw new NotFoundException('无权访问其他用户资料')
    }

    return user
  }

  async updateProfile(id: string, data: Record<string, unknown>, currentUserId?: string) {
    // 所有权检查：只允许修改自己的资料
    if (currentUserId && id !== currentUserId) {
      throw new NotFoundException('无权修改其他用户资料')
    }

    return this.prisma.user.update({
      where: { id },
      data,
    })
  }

  /**
   * POST /user/health-sync
   * 批量同步健康数据
   */
  async healthSync(userId: string, dto: HealthSyncDto): Promise<HealthSyncResponse> {
    let tdeeUpdated = false
    let newDailyBudget: number | undefined

    // 批量插入健康指标
    await this.prisma.healthMetric.createMany({
      data: dto.metrics.map((metric) => ({
        userId,
        type: metric.type,
        value: metric.value,
        recordedAt: new Date(metric.recorded_at),
        source: metric.source || dto.platform,
      })),
      skipDuplicates: true,
    })

    // 检查是否需要更新 TDEE（如果有新的体重或体脂数据）
    const hasWeightOrFat = dto.metrics.some(
      (m) => m.type === 'WEIGHT' || m.type === 'BODY_FAT',
    )

    if (hasWeightOrFat) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          gender: true,
          height: true,
          age: true,
          activityLevel: true,
          goal: true,
          dailyCalorieTarget: true,
        },
      })

      if (user && user.activityLevel) {
        // 获取最新的体重和体脂数据
        const latestWeight = await this.prisma.healthMetric.findFirst({
          where: { userId, type: 'WEIGHT' },
          orderBy: { recordedAt: 'desc' },
        })

        const latestBodyFat = await this.prisma.healthMetric.findFirst({
          where: { userId, type: 'BODY_FAT' },
          orderBy: { recordedAt: 'desc' },
        })

        if (latestWeight) {
          // 更新用户体重
          await this.prisma.user.update({
            where: { id: userId },
            data: { weight: latestWeight.value },
          })

          // 重新计算 TDEE
          const activityLevel = user.activityLevel || 1.375
          const bmr = this.calculateBMR(
            user.gender || 'MALE',
            latestWeight.value,
            user.height || 170,
            user.age || 30,
          )
          const tdee = Math.round(bmr * activityLevel)

          // 根据目标调整热量
          const goal = user.goal as GoalType
          const bodyFat = latestBodyFat?.value
          const newCalories = this.adjustCaloriesForGoal(tdee, goal, bodyFat)

          // 更新每日热量目标
          await this.prisma.user.update({
            where: { id: userId },
            data: { dailyCalorieTarget: newCalories },
          })

          // 更新宏量营养素目标
          const macros = this.calculateMacros(newCalories, goal, latestWeight.value)
          await this.prisma.user.update({
            where: { id: userId },
            data: {
              proteinTarget: macros.protein,
              carbsTarget: macros.carbs,
              fatTarget: macros.fat,
            },
          })

          tdeeUpdated = true
          newDailyBudget = newCalories
        }
      }
    }

    return {
      status: 'synced',
      tdee_updated: tdeeUpdated,
      new_daily_budget: newDailyBudget,
    }
  }

  /**
   * POST /user/strategy/switch
   * 切换核心策略
   */
  async switchStrategy(
    userId: string,
    dto: SwitchStrategyDto,
  ): Promise<{ strategy_config: StrategyConfig }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        gender: true,
        weight: true,
        height: true,
        age: true,
        activityLevel: true,
        bodyFat: true,
      },
    })

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    // 计算新的热量和宏量营养素
    const activityLevel = user.activityLevel || 1.375
    const weight = user.weight || 70
    const bmr = this.calculateBMR(
      user.gender || 'MALE',
      weight,
      user.height || 170,
      user.age || 30,
    )
    const tdee = Math.round(bmr * activityLevel)

    const newCalories = this.adjustCaloriesForGoal(
      tdee,
      dto.new_strategy as GoalType,
      user.bodyFat || undefined,
    )

    const macros = this.calculateMacros(newCalories, dto.new_strategy as GoalType, weight)

    // 更新用户策略
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        goal: dto.new_strategy,
        targetWeight: dto.target_weight,
        dailyCalorieTarget: newCalories,
        proteinTarget: macros.protein,
        carbsTarget: macros.carbs,
        fatTarget: macros.fat,
      },
    })

    return {
      strategy_config: {
        mode: dto.new_strategy as unknown as GoalType,
        daily_calories: newCalories,
        macros,
      },
    }
  }

  /**
   * PATCH /user/profile/metrics
   * 更新身体指标
   */
  async updateMetrics(userId: string, dto: UpdateMetricsDto) {
    const updateData: Record<string, number | undefined> = {}

    if (dto.weight !== undefined) {
      updateData.weight = dto.weight
    }
    if (dto.body_fat !== undefined) {
      updateData.bodyFat = dto.body_fat
    }
    if (dto.height !== undefined) {
      updateData.height = dto.height
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    return user
  }
}
