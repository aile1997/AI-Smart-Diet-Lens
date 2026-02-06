import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 创建初始成就数据
  const achievements = [
    // 减脂成就
    {
      id: 'a_weight_loss_3kg',
      name: '减脂先锋',
      description: '累计减重 3kg',
      category: 'weight_loss',
      icon: 'weight_loss',
      target: 3,
    },
    {
      id: 'a_weight_loss_5kg',
      name: '瘦身达人',
      description: '累计减重 5kg',
      category: 'weight_loss',
      icon: 'weight_loss',
      target: 5,
    },
    {
      id: 'a_weight_loss_10kg',
      name: '焕然一新',
      description: '累计减重 10kg',
      category: 'weight_loss',
      icon: 'weight_loss',
      target: 10,
    },

    // 营养成就
    {
      id: 'a_protein_king',
      name: '蛋白质之王',
      description: '单日蛋白质达标 30 天',
      category: 'nutrition',
      icon: 'protein',
      target: 30,
    },
    {
      id: 'a_calorie_control',
      name: '热量控制大师',
      description: '连续 7 天热量不超标',
      category: 'nutrition',
      icon: 'calorie',
      target: 7,
    },
    {
      id: 'a_balanced_diet',
      name: '均衡饮食',
      description: '连续 14 天三大营养素达标',
      category: 'nutrition',
      icon: 'balance',
      target: 14,
    },

    // AI 探索者成就
    {
      id: 'a_ai_explorer',
      name: 'AI 探索者',
      description: '使用 AI 识别食物 10 次',
      category: 'ai_explorer',
      icon: 'camera',
      target: 10,
    },
    {
      id: 'a_ai_master',
      name: 'AI 专家',
      description: '使用 AI 识别食物 50 次',
      category: 'ai_explorer',
      icon: 'camera',
      target: 50,
    },
    {
      id: 'a_variety_seeker',
      name: '美食探索家',
      description: '识别 50 种不同食物',
      category: 'ai_explorer',
      icon: 'search',
      target: 50,
    },

    // 坚持成就
    {
      id: 'a_streak_7',
      name: '初出茅庐',
      description: '连续记录 7 天',
      category: 'consistency',
      icon: 'calendar',
      target: 7,
    },
    {
      id: 'a_streak_30',
      name: '坚持一月',
      description: '连续记录 30 天',
      category: 'consistency',
      icon: 'calendar',
      target: 30,
    },
    {
      id: 'a_streak_100',
      name: '百日挑战',
      description: '连续记录 100 天',
      category: 'consistency',
      icon: 'trophy',
      target: 100,
    },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { id: achievement.id },
      update: {},
      create: achievement,
    })
  }

  console.log('🌱 成就数据初始化完成')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
