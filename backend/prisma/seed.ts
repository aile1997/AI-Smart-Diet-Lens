import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TODAY = new Date().toISOString().split('T')[0]

async function main() {
  console.log('🌱 开始初始化测试数据...')

  // ==================== 成就数据 ====================
  console.log('📊 创建成就数据...')
  const achievements = [
    // 减脂成就
    { id: 'a_weight_loss_3kg', name: '减脂先锋', description: '累计减重 3kg', category: 'weight_loss', icon: 'weight_loss', target: 3 },
    { id: 'a_weight_loss_5kg', name: '瘦身达人', description: '累计减重 5kg', category: 'weight_loss', icon: 'weight_loss', target: 5 },
    { id: 'a_weight_loss_10kg', name: '焕然一新', description: '累计减重 10kg', category: 'weight_loss', icon: 'weight_loss', target: 10 },
    // 营养成就
    { id: 'a_protein_king', name: '蛋白质之王', description: '单日蛋白质达标 30 天', category: 'nutrition', icon: 'protein', target: 30 },
    { id: 'a_calorie_control', name: '热量控制大师', description: '连续 7 天热量不超标', category: 'nutrition', icon: 'calorie', target: 7 },
    { id: 'a_balanced_diet', name: '均衡饮食', description: '连续 14 天三大营养素达标', category: 'nutrition', icon: 'balance', target: 14 },
    // AI 探索者成就
    { id: 'a_ai_explorer', name: 'AI 探索者', description: '使用 AI 识别食物 10 次', category: 'ai_explorer', icon: 'camera', target: 10 },
    { id: 'a_ai_master', name: 'AI 专家', description: '使用 AI 识别食物 50 次', category: 'ai_explorer', icon: 'camera', target: 50 },
    { id: 'a_variety_seeker', name: '美食探索家', description: '识别 50 种不同食物', category: 'ai_explorer', icon: 'search', target: 50 },
    // 坚持成就
    { id: 'a_streak_7', name: '初出茅庐', description: '连续记录 7 天', category: 'consistency', icon: 'calendar', target: 7 },
    { id: 'a_streak_30', name: '坚持一月', description: '连续记录 30 天', category: 'consistency', icon: 'calendar', target: 30 },
    { id: 'a_streak_100', name: '百日挑战', description: '连续记录 100 天', category: 'consistency', icon: 'trophy', target: 100 },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({ where: { id: achievement.id }, update: {}, create: achievement })
  }

  // ==================== 测试用户 ====================
  console.log('👤 创建测试用户...')
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      nickname: '健身小王',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      gender: 'male',
      age: 28,
      height: 178,
      weight: 75.5,
      bodyFat: 18.5,
      goal: 'gain_muscle',
      activityLevel: 1.375,
      dailyCalorieTarget: 2700,
      targetWeight: 80.0,
      proteinTarget: 180,
      carbsTarget: 300,
      fatTarget: 80,
      onboardingCompleted: true,
      emailVerified: true,
    },
  })

  const testUser2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      nickname: '美食家小李',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy',
      gender: 'female',
      age: 26,
      height: 165,
      weight: 52.0,
      bodyFat: 22.0,
      goal: 'lose_weight',
      activityLevel: 1.2,
      dailyCalorieTarget: 1800,
      targetWeight: 50.0,
      proteinTarget: 120,
      carbsTarget: 200,
      fatTarget: 60,
      onboardingCompleted: true,
      emailVerified: true,
    },
  })

  // ==================== 食物库 ====================
  console.log('🍎 创建食物库数据...')
  const foods = [
    // 主食类
    { id: 'f_rice', name: '米饭 (熟)', category: '主食', calories: 130, protein: 2.7, carbs: 28.0, fat: 0.3, imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=200' },
    { id: 'f_brown_rice', name: '糙米饭 (熟)', category: '主食', calories: 112, protein: 2.6, carbs: 24.0, fat: 0.9, imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200' },
    { id: 'f_oatmeal', name: '燕麦片 (熟)', category: '主食', calories: 68, protein: 2.4, carbs: 12.0, fat: 1.4, imageUrl: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=200' },
    { id: 'f_sweet_potato', name: '红薯 (蒸)', category: '主食', calories: 86, protein: 1.6, carbs: 20.0, fat: 0.1, imageUrl: 'https://images.unsplash.com/photo-1569288063643-5d29ad64df09?w=200' },
    { id: 'f_pasta', name: '意大利面 (熟)', category: '主食', calories: 131, protein: 5.0, carbs: 25.0, fat: 1.1, imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200' },

    // 蛋白质类
    { id: 'f_chicken_breast', name: '鸡胸肉 (生)', category: '蛋白质', calories: 110, protein: 23.0, carbs: 0.0, fat: 1.2, imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200' },
    { id: 'f_salmon', name: '三文鱼 (生)', category: '蛋白质', calories: 208, protein: 20.0, carbs: 0.0, fat: 13.0, imageUrl: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=200' },
    { id: 'f_egg', name: '鸡蛋 (煮)', category: '蛋白质', calories: 155, protein: 13.0, carbs: 1.1, fat: 11.0, imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200' },
    { id: 'f_tofu', name: '豆腐 (嫩)', category: '蛋白质', calories: 76, protein: 8.0, carbs: 1.9, fat: 4.8, imageUrl: 'https://images.unsplash.com/photo-1582770294160-5c57f77c0d78?w=200' },
    { id: 'f_beef', name: '牛肉 (瘦)', category: '蛋白质', calories: 250, protein: 26.0, carbs: 0.0, fat: 15.0, imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200' },
    { id: 'f_shrimp', name: '虾仁 (生)', category: '蛋白质', calories: 106, protein: 20.0, carbs: 0.0, fat: 1.7, imageUrl: 'https://images.unsplash.com/photo-1626804475297-415b6e7a7809?w=200' },

    // 蔬菜类
    { id: 'f_broccoli', name: '西兰花', category: '蔬菜', calories: 34, protein: 2.8, carbs: 7.0, fat: 0.4, imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200' },
    { id: 'f_spinach', name: '菠菜', category: '蔬菜', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200' },
    { id: 'f_carrot', name: '胡萝卜', category: '蔬菜', calories: 41, protein: 0.9, carbs: 10.0, fat: 0.2, imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200' },
    { id: 'f_cucumber', name: '黄瓜', category: '蔬菜', calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1, imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200' },
    { id: 'f_tomato', name: '番茄', category: '蔬菜', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, imageUrl: 'https://images.unsplash.com/photo-1546470427-227c7369a926?w=200' },

    // 水果类
    { id: 'f_apple', name: '苹果', category: '水果', calories: 52, protein: 0.3, carbs: 14.0, fat: 0.2, imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200' },
    { id: 'f_banana', name: '香蕉', category: '水果', calories: 89, protein: 1.1, carbs: 23.0, fat: 0.3, imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200' },
    { id: 'f_blueberry', name: '蓝莓', category: '水果', calories: 57, protein: 0.7, carbs: 14.0, fat: 0.3, imageUrl: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=200' },
    { id: 'f_orange', name: '橙子', category: '水果', calories: 47, protein: 0.9, carbs: 12.0, fat: 0.1, imageUrl: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=200' },
    { id: 'f_avocado', name: '牛油果', category: '水果', calories: 160, protein: 2.0, carbs: 9.0, fat: 15.0, imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200' },

    // 坚果类
    { id: 'f_almond', name: '杏仁', category: '坚果', calories: 579, protein: 21.0, carbs: 22.0, fat: 50.0, imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=200' },
    { id: 'f_walnut', name: '核桃', category: '坚果', calories: 654, protein: 15.0, carbs: 14.0, fat: 65.0, imageUrl: 'https://images.unsplash.com/photo-1611073626414-4b875fbb0e6b?w=200' },
    { id: 'f_peanut', name: '花生', category: '坚果', calories: 567, protein: 25.0, carbs: 16.0, fat: 49.0, imageUrl: 'https://images.unsplash.com/photo-1574886218285-443d0bc3cfde?w=200' },

    // 乳制品
    { id: 'f_milk', name: '牛奶 (全脂)', category: '乳制品', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200' },
    { id: 'f_yogurt', name: '酸奶 (原味)', category: '乳制品', calories: 59, protein: 10.0, carbs: 3.6, fat: 0.4, imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200' },
    { id: 'f_cheese', name: '芝士', category: '乳制品', calories: 402, protein: 25.0, carbs: 1.3, fat: 33.0, imageUrl: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=200' },
  ]

  for (const food of foods) {
    await prisma.food.upsert({ where: { id: food.id }, update: {}, create: food })
  }

  // ==================== 饮食日记记录 ====================
  console.log('📝 创建饮食日记记录...')
  const diaryEntries = [
    // 今天早餐
    {
      userId: testUser.id,
      foodId: 'f_egg',
      mealType: 'breakfast',
      portion: 100,
      date: TODAY,
      calories: 155,
      protein: 13.0,
      carbs: 1.1,
      fat: 11.0,
    },
    {
      userId: testUser.id,
      foodId: 'f_oatmeal',
      mealType: 'breakfast',
      portion: 150,
      date: TODAY,
      calories: 102,
      protein: 3.6,
      carbs: 18.0,
      fat: 2.1,
    },
    // 今天午餐
    {
      userId: testUser.id,
      foodId: 'f_chicken_breast',
      mealType: 'lunch',
      portion: 150,
      date: TODAY,
      calories: 165,
      protein: 34.5,
      carbs: 0.0,
      fat: 1.8,
    },
    {
      userId: testUser.id,
      foodId: 'f_rice',
      mealType: 'lunch',
      portion: 150,
      date: TODAY,
      calories: 195,
      protein: 4.1,
      carbs: 42.0,
      fat: 0.5,
    },
    {
      userId: testUser.id,
      foodId: 'f_broccoli',
      mealType: 'lunch',
      portion: 100,
      date: TODAY,
      calories: 34,
      protein: 2.8,
      carbs: 7.0,
      fat: 0.4,
    },
    // 昨天数据
    {
      userId: testUser.id,
      foodId: 'f_salmon',
      mealType: 'dinner',
      portion: 120,
      date: getYesterday(),
      calories: 250,
      protein: 24.0,
      carbs: 0.0,
      fat: 15.6,
    },
  ]

  for (const entry of diaryEntries) {
    await prisma.diaryEntry.upsert({
      where: { id: `de_${entry.userId}_${entry.foodId}_${entry.date}` },
      update: {},
      create: { ...entry, id: `de_${entry.userId}_${entry.foodId}_${entry.date}` },
    })
  }

  // ==================== 健康指标 ====================
  console.log('💓 创建健康指标数据...')
  const healthMetrics = [
    { userId: testUser.id, type: 'STEPS', value: 8542, recordedAt: new Date(), source: 'APPLE_HEALTH' },
    { userId: testUser.id, type: 'WEIGHT', value: 75.5, recordedAt: new Date(), source: 'YOLANDA_SCALE' },
    { userId: testUser.id, type: 'BODY_FAT', value: 18.5, recordedAt: new Date(), source: 'YOLANDA_SCALE' },
    { userId: testUser.id, type: 'SLEEP', value: 7.5, recordedAt: new Date(), source: 'APPLE_HEALTH' },
    { userId: testUser2.id, type: 'STEPS', value: 6230, recordedAt: new Date(), source: 'APPLE_HEALTH' },
    { userId: testUser2.id, type: 'WEIGHT', value: 52.0, recordedAt: new Date(), source: 'MANUAL' },
  ]

  for (const metric of healthMetrics) {
    await prisma.healthMetric.create({ data: metric })
  }

  // ==================== 社区帖子 ====================
  console.log('👥 创建社区帖子数据...')
  const communityPosts = [
    {
      id: 'cp_1',
      userId: testUser.id,
      content: '今天做了一道减脂餐，香煎鸡胸肉配西兰花，高蛋白低脂肪，太适合增肌期了！',
      images: ['https://images.unsplash.com/photo-1547592180-85f173990554?w=400'],
      tags: ['减脂', '增肌', '高蛋白'],
      likes: 42,
    },
    {
      id: 'cp_2',
      userId: testUser2.id,
      content: '坚持健康饮食一个月，感觉整个人都轻盈了！分享我的早餐：燕麦片配蓝莓和坚果～',
      images: ['https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=400'],
      tags: ['健康饮食', '早餐', '减脂'],
      likes: 28,
    },
    {
      id: 'cp_3',
      userId: testUser.id,
      content: '连续打卡第7天！今天的三文鱼晚餐太美味了，营养满分～',
      images: ['https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400'],
      tags: ['打卡', '海鲜', '营养'],
      likes: 15,
    },
  ]

  for (const post of communityPosts) {
    await prisma.communityPost.upsert({ where: { id: post.id }, update: {}, create: post })
  }

  // ==================== 评论 ====================
  console.log('💬 创建评论数据...')
  const comments = [
    {
      postId: 'cp_1',
      userId: testUser2.id,
      content: '看起来太棒了！我也想试试这道菜',
    },
    {
      postId: 'cp_2',
      userId: testUser.id,
      content: '坚持就是胜利！一起加油💪',
    },
    {
      postId: 'cp_3',
      userId: testUser2.id,
      content: '恭喜连续打卡一周！🎉',
    },
  ]

  for (const comment of comments) {
    await prisma.comment.create({ data: comment })
  }

  // ==================== AI 对话历史 ====================
  console.log('🤖 创建 AI 对话历史...')
  const chatMessages = [
    { userId: testUser.id, isUser: true, content: '我想做一道减脂餐，需要高蛋白低热量' },
    { userId: testUser.id, isUser: false, content: '根据您的减脂目标，我为您推荐这道低热量高蛋白的食谱：香煎鸡胸肉配西兰花。这道菜富含蛋白质，脂肪含量低，非常适合减脂期食用。需要详细做法吗？' },
    { userId: testUser.id, isUser: true, content: '好的，请告诉我做法' },
    { userId: testUser.id, isUser: false, content: '做法很简单：1. 鸡胸肉切片用盐、黑胡椒腌制15分钟；2. 西兰花焯水备用；3. 平底锅少油煎鸡胸肉至两面金黄；4. 加入西兰花翻炒即可。总热量约350卡，蛋白质35g。' },
  ]

  for (const msg of chatMessages) {
    await prisma.chatMessage.create({ data: msg })
  }

  // ==================== 收藏 ====================
  console.log('⭐ 创建收藏数据...')
  const favorites = [
    { userId: testUser.id, itemId: 'f_chicken_breast', type: 'food' },
    { userId: testUser.id, itemId: 'f_salmon', type: 'food' },
    { userId: testUser.id, itemId: 'f_broccoli', type: 'food' },
    { userId: testUser2.id, itemId: 'f_oatmeal', type: 'food' },
    { userId: testUser2.id, itemId: 'f_blueberry', type: 'food' },
  ]

  for (const favorite of favorites) {
    await prisma.favorite.upsert({
      where: { userId_itemId_type: { userId: favorite.userId, itemId: favorite.itemId, type: favorite.type as 'food' | 'recipe' } },
      update: {},
      create: favorite,
    })
  }

  // ==================== 消息通知 ====================
  console.log('🔔 创建消息通知数据...')
  const messages = [
    {
      userId: testUser.id,
      type: 'achievement',
      title: '🎉 成就解锁',
      content: '恭喜您解锁了「初出茅庐」成就！连续记录 7 天，继续保持！',
    },
    {
      userId: testUser.id,
      type: 'reminder',
      title: '📋 温馨提醒',
      content: '您今天还没有记录晚餐哦，记得按时记录饮食～',
    },
    {
      userId: testUser.id,
      type: 'system',
      title: '📈 每周报告',
      content: '您本周蛋白质摄入达标 5 天，比上周进步了！继续保持！',
      isRead: true,
    },
    {
      userId: testUser2.id,
      type: 'achievement',
      title: '🎉 成就解锁',
      content: '恭喜您解锁了「减脂先锋」成就！累计减重 3kg，太棒了！',
    },
  ]

  for (const message of messages) {
    await prisma.message.create({ data: message })
  }

  // ==================== 用户成就进度 ====================
  console.log('🏆 初始化用户成就进度...')
  const userAchievements = [
    { userId: testUser.id, achievementId: 'a_streak_7', progress: 7, unlocked: true, unlockedAt: new Date() },
    { userId: testUser.id, achievementId: 'a_protein_king', progress: 15, unlocked: false },
    { userId: testUser.id, achievementId: 'a_ai_explorer', progress: 8, unlocked: false },
    { userId: testUser2.id, achievementId: 'a_weight_loss_3kg', progress: 3, unlocked: true, unlockedAt: new Date() },
    { userId: testUser2.id, achievementId: 'a_calorie_control', progress: 5, unlocked: false },
  ]

  for (const ua of userAchievements) {
    await prisma.userAchievement.upsert({
      where: { userId_achievementId: { userId: ua.userId, achievementId: ua.achievementId } },
      update: {},
      create: ua,
    })
  }

  console.log('✅ 测试数据初始化完成！')
  console.log('\n📧 测试账号信息：')
  console.log('   主账号: test@example.com')
  console.log('   副账号: user2@example.com')
}

function getYesterday(): string {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return date.toISOString().split('T')[0]
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
