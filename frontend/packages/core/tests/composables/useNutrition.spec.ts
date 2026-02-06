/**
 * useNutrition 组合式函数单元测试
 */

import { describe, it, expect } from 'vitest'
import { calculateBMR, calculateDailyCalorieTarget } from '../../src/utils/calculate'
import { ActivityLevel, GoalType } from '../../src/types/user'

describe('calculateBMR', () => {
  it('应正确计算男性 BMR', () => {
    // Mifflin-St Jeor: 10 * 75 + 6.25 * 175 - 5 * 30 + 5 = 1698.75 ≈ 1699
    const result = calculateBMR(75, 175, 30, 'male')
    expect(result).toBe(1699)
  })

  it('应正确计算女性 BMR', () => {
    // Mifflin-St Jeor: 10 * 60 + 6.25 * 165 - 5 * 25 - 161 = 1345.25 ≈ 1345
    const result = calculateBMR(60, 165, 25, 'female')
    expect(result).toBe(1345)
  })
})

describe('calculateDailyCalorieTarget', () => {
  it('减脂模式应减少 500 kcal', () => {
    const bmr = 1694
    const target = calculateDailyCalorieTarget(
      bmr,
      ActivityLevel.MODERATE,
      GoalType.LOSE_WEIGHT,
    )
    // TDEE = 1694 * 1.55 = 2625.7 → 2626, 减 500 = 2126
    const expectedTDEE = Math.round(bmr * 1.55)
    expect(target).toBe(expectedTDEE - 500)
  })

  it('维持模式应保持 TDEE', () => {
    const bmr = 1694
    const target = calculateDailyCalorieTarget(
      bmr,
      ActivityLevel.LIGHT,
      GoalType.MAINTAIN,
    )
    const expectedTDEE = Math.round(bmr * 1.375)
    expect(target).toBe(expectedTDEE)
  })

  it('增肌模式应增加 300 kcal', () => {
    const bmr = 1694
    const target = calculateDailyCalorieTarget(
      bmr,
      ActivityLevel.HEAVY,
      GoalType.GAIN_MUSCLE,
    )
    const expectedTDEE = Math.round(bmr * 1.725)
    expect(target).toBe(expectedTDEE + 300)
  })
})
