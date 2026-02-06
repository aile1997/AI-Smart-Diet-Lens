import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { PrismaService } from '../../common/prisma.service'
import { JwtService } from '@nestjs/jwt'
import {
  OnboardingDto,
  GoalType,
  ActivityLevel,
  Gender,
} from './dto/onboarding.dto'

describe('UserService', () => {
  let service: UserService
  let prismaService: PrismaService
  let jwtService: JwtService

  const mockPrismaService = {
    user: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    healthMetric: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  }

  const mockJwtService = {
    sign: jest.fn(() => 'mock_jwt_token'),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    prismaService = module.get<PrismaService>(PrismaService)
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('onboarding', () => {
    it('should calculate BMR correctly for male', () => {
      const weight = 75
      const height = 178
      const age = 30
      const gender = Gender.MALE

      // Mifflin-St Jeor: 10*75 + 6.25*178 - 5*30 + 5 = 750 + 1112.5 - 150 + 5 = 1717.5
      // @ts-ignore - accessing private method for testing
      const bmr = service.calculateBMR(gender, weight, height, age)
      expect(Math.round(bmr)).toBe(1718)
    })

    it('should calculate BMR correctly for female', () => {
      const weight = 60
      const height = 165
      const age = 28
      const gender = Gender.FEMALE

      // Mifflin-St Jeor: 10*60 + 6.25*165 - 5*28 - 161 = 600 + 1031.25 - 140 - 161 = 1330.25
      // @ts-ignore
      const bmr = service.calculateBMR(gender, weight, height, age)
      expect(Math.round(bmr)).toBe(1330)
    })

    it('should adjust calories for fat loss goal', () => {
      const tdee = 2000
      const goalType = GoalType.FAT_LOSS

      // @ts-ignore
      const calories = service.adjustCaloriesForGoal(tdee, goalType)
      expect(calories).toBe(1500) // TDEE - 500
    })

    it('should adjust calories for muscle gain without high body fat', () => {
      const tdee = 2500
      const goalType = GoalType.MUSCLE_GAIN
      const bodyFat = 18

      // @ts-ignore
      const calories = service.adjustCaloriesForGoal(tdee, goalType, bodyFat)
      expect(calories).toBe(2800) // TDEE + 300
    })

    it('should adjust calories for muscle gain with high body fat', () => {
      const tdee = 2500
      const goalType = GoalType.MUSCLE_GAIN
      const bodyFat = 28

      // @ts-ignore
      const calories = service.adjustCaloriesForGoal(tdee, goalType, bodyFat)
      expect(calories).toBe(2600) // TDEE + 100 (lean bulk)
    })

    it('should calculate macros with correct ratios for fat loss', () => {
      const calories = 1500
      const goalType = GoalType.FAT_LOSS
      const weightKg = 75

      // @ts-ignore
      const macros = service.calculateMacros(calories, goalType, weightKg)

      // Fat loss: 35% protein, 40% carbs, 25% fat
      expect(macros.protein).toBeGreaterThanOrEqual(120) // at least 1.6g/kg
      expect(macros.carbs).toBeGreaterThan(0)
      expect(macros.fat).toBeGreaterThan(0)
    })
  })

  describe('calculateAge', () => {
    it('should calculate age correctly from date of birth', () => {
      const dob = '1995-05-20'
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentMonth = currentDate.getMonth() + 1
      const currentDay = currentDate.getDate()

      // 如果生日还没到，年龄要减 1
      const expectedAge =
        currentYear - 1995 - (currentMonth < 5 || (currentMonth === 5 && currentDay < 20) ? 1 : 0)

      // @ts-ignore
      const age = service.calculateAge(dob)
      expect(age).toBe(expectedAge)
    })

    it('should handle birthday that has not occurred yet this year', () => {
      const dob = '1995-12-31'
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentMonth = currentDate.getMonth() + 1

      const expectedAge = currentYear - 1995 - (currentMonth < 12 ? 1 : 0)

      // @ts-ignore
      const age = service.calculateAge(dob)
      expect(age).toBe(expectedAge)
    })
  })
})
