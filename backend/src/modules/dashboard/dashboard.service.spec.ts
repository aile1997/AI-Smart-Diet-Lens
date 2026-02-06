import { Test, TestingModule } from '@nestjs/testing'
import { DashboardService } from './dashboard.service'
import { PrismaService } from '../../common/prisma.service'

describe('DashboardService', () => {
  let service: DashboardService
  let prismaService: PrismaService

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    diaryEntry: {
      findMany: jest.fn(),
    },
    healthMetric: {
      findMany: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<DashboardService>(DashboardService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getSummary', () => {
    const mockUserId = 'user_123'
    const mockDate = '2026-02-05'

    beforeEach(() => {
      mockPrismaService.user.findUnique = jest.fn().mockResolvedValue({
        goal: 'FAT_LOSS',
        dailyCalorieTarget: 2000,
        proteinTarget: 150,
        carbsTarget: 200,
        fatTarget: 65,
      })

      mockPrismaService.diaryEntry.findMany = jest.fn().mockResolvedValue([
        {
          id: 'entry_1',
          mealType: 'BREAKFAST',
          calories: 500,
          protein: 20,
          carbs: 60,
          fat: 15,
        },
      ])

      mockPrismaService.healthMetric.findMany = jest.fn().mockResolvedValue([
        {
          type: 'STEPS',
          value: 8000,
        },
        {
          type: 'WEIGHT',
          value: 75,
        },
      ])
    })

    it('should return dashboard summary with all required fields', async () => {
      const result = await service.getSummary(mockUserId, mockDate)

      expect(result).toHaveProperty('ui_strategy')
      expect(result).toHaveProperty('date')
      expect(result).toHaveProperty('hero_component')
      expect(result).toHaveProperty('widgets')
    })

    it('should return FAT_LOSS strategy with CALORIE_RING component', async () => {
      const result = await service.getSummary(mockUserId, mockDate)

      expect(result.ui_strategy).toBe('FAT_LOSS')
      expect(result.hero_component.type).toBe('CALORIE_RING')
    })

    it('should return MUSCLE_GAIN strategy with DUAL_BAR_CHART component', async () => {
      mockPrismaService.user.findUnique = jest.fn().mockResolvedValue({
        goal: 'MUSCLE_GAIN',
        dailyCalorieTarget: 2700,
        proteinTarget: 180,
        carbsTarget: 300,
        fatTarget: 80,
      })

      const result = await service.getSummary(mockUserId, mockDate)

      expect(result.ui_strategy).toBe('MUSCLE_GAIN')
      expect(result.hero_component.type).toBe('DUAL_BAR_CHART')
    })

    it('should calculate nutrition totals from diary entries', async () => {
      mockPrismaService.diaryEntry.findMany = jest.fn().mockResolvedValue([
        {
          calories: 500,
          protein: 20,
          carbs: 60,
          fat: 15,
        },
        {
          calories: 300,
          protein: 30,
          carbs: 40,
          fat: 10,
        },
      ])

      const result = await service.getSummary(mockUserId, mockDate)

      // FAT_LOSS 模式: primary 是 Calories, secondary 是 Protein
      expect(result.hero_component.data.primary.current).toBe(800) // 500 + 300
      expect(result.hero_component.data.secondary.current).toBe(50) // 20 + 30
    })

    it('should not include smart_alert when no alerts triggered', async () => {
      mockPrismaService.user.findUnique = jest.fn().mockResolvedValue({
        goal: 'MUSCLE_GAIN',
        dailyCalorieTarget: 2700,
        proteinTarget: 180,
        carbsTarget: 300,
        fatTarget: 80,
      })

      mockPrismaService.healthMetric.findMany = jest.fn().mockResolvedValue([
        {
          type: 'BODY_FAT',
          value: 22,
        },
        {
          type: 'BODY_FAT',
          value: 25,
        },
      ])

      const result = await service.getSummary(mockUserId, mockDate)

      // TODO: generateSmartAlert 功能待实现
      expect(result.smart_alert).toBeUndefined()
    })
  })
})
