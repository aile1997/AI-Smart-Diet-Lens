import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'
import { CreateDiaryEntryDto, UpdateDiaryEntryDto, DailySummary } from './dto/diary.dto'

/**
 * 饮食日记服务
 */
@Injectable()
export class DiaryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * POST /api/diary/entry
   * 创建日记条目
   */
  async create(userId: string, dto: CreateDiaryEntryDto) {
    // 获取用户目标热量
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { dailyCalorieTarget: true },
    })

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    // 如果是 AI 识别的结果，先保存到食物库
    let foodId: string | undefined

    if (dto.items.length === 1 && dto.image_key) {
      // 尝试查找已存在的食物
      const existingFood = await this.prisma.food.findFirst({
        where: {
          name: dto.items[0].food_name,
        },
      })

      if (!existingFood) {
        // 创建新食物记录
        const newFood = await this.prisma.food.create({
          data: {
            name: dto.items[0].food_name,
            category: 'USER_CREATED',
            calories: (dto.items[0].calories / dto.items[0].portion_g) * 100,
            protein: (dto.items[0].macros.protein / dto.items[0].portion_g) * 100,
            carbs: (dto.items[0].macros.carbs / dto.items[0].portion_g) * 100,
            fat: (dto.items[0].macros.fat / dto.items[0].portion_g) * 100,
          },
        })
        foodId = newFood.id
      } else {
        foodId = existingFood.id
      }
    }

    // 创建日记条目
    const entry = await this.prisma.diaryEntry.create({
      data: {
        userId,
        foodId: foodId ?? undefined,
        mealType: dto.meal_type,
        portion: dto.items[0]?.portion_g || 100,
        date: dto.date,
        calories: dto.items.reduce((sum, item) => sum + item.calories, 0),
        protein: dto.items.reduce((sum, item) => sum + item.macros.protein, 0),
        carbs: dto.items.reduce((sum, item) => sum + item.macros.carbs, 0),
        fat: dto.items.reduce((sum, item) => sum + item.macros.fat, 0),
        note: dto.note,
      },
    })

    return entry
  }

  /**
   * GET /api/diary
   * 获取日记列表
   */
  async getDailyList(userId: string, date: string) {
    const entries = await this.prisma.diaryEntry.findMany({
      where: {
        userId,
        date,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        food: true,
      },
    })

    return entries
  }

  /**
   * GET /api/diary/summary
   * 获取每日汇总
   */
  async getDailySummary(userId: string, date: string): Promise<DailySummary> {
    const entries = await this.getDailyList(userId, date)

    const total_nutrition = {
      calories: entries.reduce((sum, e) => sum + e.calories, 0),
      protein: entries.reduce((sum, e) => sum + e.protein, 0),
      carbs: entries.reduce((sum, e) => sum + e.carbs, 0),
      fat: entries.reduce((sum, e) => sum + e.fat, 0),
    }

    // 获取用户目标
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { dailyCalorieTarget: true },
    })

    return {
      date,
      entries,
      total_nutrition,
      target_calories: user?.dailyCalorieTarget || 2000,
    }
  }

  /**
   * PATCH /api/diary/entry/:id
   * 更新日记条目
   */
  async update(id: string, dto: UpdateDiaryEntryDto) {
    const entry = await this.prisma.diaryEntry.findUnique({
      where: { id },
    })

    if (!entry) {
      throw new NotFoundException('日记条目不存在')
    }

    // 如果更新了份量，需要重新计算营养
    let updateData: any = { ...dto }

    if (dto.portion_g !== undefined) {
      const ratio = dto.portion_g / entry.portion
      updateData = {
        ...updateData,
        calories: Math.round(entry.calories * ratio),
        protein: Math.round(entry.protein * ratio),
        carbs: Math.round(entry.carbs * ratio),
        fat: Math.round(entry.fat * ratio),
      }
    }

    return this.prisma.diaryEntry.update({
      where: { id },
      data: updateData,
    })
  }

  /**
   * DELETE /api/diary/entry/:id
   * 删除日记条目
   */
  async remove(id: string) {
    const entry = await this.prisma.diaryEntry.findUnique({
      where: { id },
    })

    if (!entry) {
      throw new NotFoundException('日记条目不存在')
    }

    await this.prisma.diaryEntry.delete({
      where: { id },
    })

    return { deleted: true, id }
  }
}
