import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'

@Injectable()
export class DiaryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Record<string, unknown>) {
    // TODO: Backend Builder 实现日记创建逻辑
    return { id: 'mock-diary-001', ...data, createdAt: new Date() }
  }

  async getDailySummary(date: string) {
    // TODO: Backend Builder 实现每日汇总查询
    return {
      date,
      entries: [],
      totalNutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      targetCalories: 2000,
    }
  }

  async remove(id: string) {
    // TODO: Backend Builder 实现删除逻辑
    return { deleted: true, id }
  }
}
