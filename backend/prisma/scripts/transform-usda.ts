/**
 * USDA 数据转换脚本
 * 将 USDA FoodData Central 数据转换为项目所需格式
 *
 * 使用方法:
 * 1. 下载 USDA 数据到 ../seed-data/
 * 2. 运行: npx ts-node prisma/scripts/transform-usda.ts
 */
import * as fs from 'fs'
import * as path from 'path'

interface USDAFood {
  fdcId: number
  description: string
  foodNutrients: Array<{
    nutrientId: number
    nutrientName: string
    unitName: string
    value: number
  }>
}

interface TransformedFood {
  id: string
  nameEn: string
  nameCn: string
  category: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sodium: number
  sugar: number
}

// 营养素 ID 映射 (USDA FoodData Central)
const NUTRIENT_IDS = {
  ENERGY: 1008,      // 热量 (kcal)
  PROTEIN: 1003,     // 蛋白质 (g)
  FAT: 1004,         // 脂肪 (g)
  CARBS: 1005,       // 碳水化合物 (g)
  FIBER: 1079,       // 膳食纤维 (g)
  SUGAR: 2000,       // 糖 (g)
  SODIUM: 1093,      // 钠 (mg)
}

// 食物分类关键词映射
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  '蔬菜': [
    'vegetable', 'lettuce', 'spinach', 'carrot', 'broccoli', 'cabbage', 'tomato',
    'pepper', 'onion', 'garlic', 'celery', 'cucumber', 'zucchini', 'squash',
    'eggplant', 'asparagus', 'artichoke', 'beet', 'radish', 'turnip', 'kale',
    'collard', 'chard', 'arugula', 'endive', 'leek', 'scallion', 'mushroom',
  ],
  '水果': [
    'fruit', 'apple', 'banana', 'orange', 'grape', 'berry', 'melon', 'mango',
    'pineapple', 'peach', 'pear', 'plum', 'cherry', 'strawberry', 'blueberry',
    'raspberry', 'blackberry', 'kiwi', 'papaya', 'guava', 'lemon', 'lime',
    'grapefruit', 'tangerine', 'apricot', 'fig', 'date', 'pomegranate', 'coconut',
  ],
  '肉类': [
    'beef', 'pork', 'chicken', 'lamb', 'meat', 'poultry', 'turkey', 'duck',
    'goose', 'veal', 'venison', 'rabbit', 'bacon', 'ham', 'sausage', 'salami',
    'pepperoni', 'liver', 'kidney', 'heart', 'tongue', 'tripe',
  ],
  '海鲜': [
    'fish', 'salmon', 'tuna', 'shrimp', 'crab', 'seafood', 'shellfish', 'lobster',
    'oyster', 'mussel', 'clam', 'scallop', 'squid', 'octopus', 'anchovy',
    'sardine', 'mackerel', 'herring', 'cod', 'halibut', 'tilapia', 'trout',
    'catfish', 'bass', 'snapper', 'grouper', 'mahi', 'swordfish',
  ],
  '谷物': [
    'rice', 'wheat', 'bread', 'pasta', 'cereal', 'grain', 'oat', 'barley',
    'corn', 'flour', 'noodle', 'cracker', 'tortilla', 'bagel', 'muffin',
    'croissant', 'biscuit', 'roll', 'quinoa', 'couscous', 'bulgur',
  ],
  '豆类': [
    'bean', 'lentil', 'pea', 'soy', 'tofu', 'legume', 'chickpea', 'hummus',
    'edamame', 'tempeh', 'black bean', 'kidney bean', 'pinto bean', 'navy bean',
  ],
  '乳制品': [
    'milk', 'cheese', 'yogurt', 'cream', 'butter', 'dairy', 'ice cream',
    'cottage cheese', 'ricotta', 'mozzarella', 'cheddar', 'parmesan', 'brie',
    'gouda', 'swiss', 'feta', 'goat cheese', 'sour cream', 'whey', 'casein',
  ],
  '坚果': [
    'nut', 'almond', 'walnut', 'cashew', 'peanut', 'pistachio', 'pecan',
    'hazelnut', 'macadamia', 'chestnut', 'pine nut', 'seed', 'sunflower',
    'pumpkin seed', 'flax', 'chia', 'sesame',
  ],
  '零食': [
    'snack', 'chip', 'cookie', 'candy', 'chocolate', 'cake', 'pie', 'pastry',
    'donut', 'brownie', 'popcorn', 'pretzel', 'cracker', 'granola bar',
  ],
  '饮品': [
    'juice', 'coffee', 'tea', 'soda', 'drink', 'beverage', 'smoothie', 'shake',
    'lemonade', 'wine', 'beer', 'cocktail', 'water', 'milk',
  ],
  '调味品': [
    'sauce', 'oil', 'vinegar', 'spice', 'salt', 'condiment', 'dressing',
    'mayonnaise', 'ketchup', 'mustard', 'relish', 'salsa', 'soy sauce',
    'worcestershire', 'hot sauce', 'bbq sauce', 'teriyaki', 'honey', 'syrup',
    'jam', 'jelly', 'marmalade', 'pesto', 'hummus',
  ],
  '蛋类': [
    'egg', 'omelette', 'frittata', 'quiche',
  ],
}

// 常见食物中英文映射 (扩展版)
const TRANSLATION_MAP: Record<string, string> = {
  // 水果
  'apple': '苹果',
  'banana': '香蕉',
  'orange': '橙子',
  'grape': '葡萄',
  'strawberry': '草莓',
  'blueberry': '蓝莓',
  'raspberry': '覆盆子',
  'blackberry': '黑莓',
  'watermelon': '西瓜',
  'cantaloupe': '哈密瓜',
  'honeydew': '蜜瓜',
  'mango': '芒果',
  'pineapple': '菠萝',
  'peach': '桃子',
  'pear': '梨',
  'plum': '李子',
  'cherry': '樱桃',
  'kiwi': '猕猴桃',
  'papaya': '木瓜',
  'guava': '番石榴',
  'lemon': '柠檬',
  'lime': '青柠',
  'grapefruit': '葡萄柚',
  'tangerine': '橘子',
  'apricot': '杏',
  'fig': '无花果',
  'date': '枣',
  'pomegranate': '石榴',
  'coconut': '椰子',
  'avocado': '牛油果',

  // 蔬菜
  'tomato': '番茄',
  'potato': '土豆',
  'carrot': '胡萝卜',
  'broccoli': '西兰花',
  'spinach': '菠菜',
  'lettuce': '生菜',
  'cabbage': '卷心菜',
  'onion': '洋葱',
  'garlic': '大蒜',
  'ginger': '生姜',
  'celery': '芹菜',
  'cucumber': '黄瓜',
  'zucchini': '西葫芦',
  'eggplant': '茄子',
  'pepper': '辣椒',
  'bell pepper': '甜椒',
  'mushroom': '蘑菇',
  'corn': '玉米',
  'pea': '豌豆',
  'green bean': '青豆',
  'asparagus': '芦笋',
  'cauliflower': '花椰菜',
  'kale': '羽衣甘蓝',
  'sweet potato': '红薯',
  'pumpkin': '南瓜',
  'squash': '南瓜',
  'beet': '甜菜',
  'radish': '萝卜',
  'turnip': '芜菁',

  // 肉类
  'chicken': '鸡肉',
  'beef': '牛肉',
  'pork': '猪肉',
  'lamb': '羊肉',
  'turkey': '火鸡',
  'duck': '鸭肉',
  'bacon': '培根',
  'ham': '火腿',
  'sausage': '香肠',
  'steak': '牛排',
  'ground beef': '牛肉末',
  'chicken breast': '鸡胸肉',
  'chicken thigh': '鸡腿',
  'chicken wing': '鸡翅',
  'pork chop': '猪排',
  'ribs': '排骨',

  // 海鲜
  'fish': '鱼',
  'salmon': '三文鱼',
  'tuna': '金枪鱼',
  'shrimp': '虾',
  'crab': '螃蟹',
  'lobster': '龙虾',
  'oyster': '牡蛎',
  'mussel': '贻贝',
  'clam': '蛤蜊',
  'scallop': '扇贝',
  'squid': '鱿鱼',
  'octopus': '章鱼',
  'cod': '鳕鱼',
  'tilapia': '罗非鱼',
  'trout': '鳟鱼',
  'sardine': '沙丁鱼',
  'mackerel': '鲭鱼',
  'herring': '鲱鱼',

  // 乳制品
  'milk': '牛奶',
  'cheese': '奶酪',
  'yogurt': '酸奶',
  'butter': '黄油',
  'cream': '奶油',
  'ice cream': '冰淇淋',
  'cottage cheese': '农家奶酪',
  'mozzarella': '马苏里拉奶酪',
  'cheddar': '切达奶酪',
  'parmesan': '帕玛森奶酪',

  // 谷物
  'rice': '米饭',
  'bread': '面包',
  'pasta': '意大利面',
  'noodle': '面条',
  'oat': '燕麦',
  'cereal': '麦片',
  'flour': '面粉',
  'wheat': '小麦',
  'barley': '大麦',
  'quinoa': '藜麦',
  'couscous': '古斯古斯',

  // 豆类
  'bean': '豆子',
  'tofu': '豆腐',
  'soybean': '大豆',
  'lentil': '扁豆',
  'chickpea': '鹰嘴豆',
  'black bean': '黑豆',
  'kidney bean': '红腰豆',
  'pinto bean': '斑豆',

  // 坚果
  'almond': '杏仁',
  'walnut': '核桃',
  'cashew': '腰果',
  'peanut': '花生',
  'pistachio': '开心果',
  'pecan': '山核桃',
  'hazelnut': '榛子',
  'chestnut': '栗子',
  'macadamia': '夏威夷果',
  'sunflower seed': '葵花籽',
  'pumpkin seed': '南瓜籽',
  'sesame': '芝麻',

  // 蛋类
  'egg': '鸡蛋',
  'egg white': '蛋白',
  'egg yolk': '蛋黄',

  // 调味品
  'salt': '盐',
  'sugar': '糖',
  'honey': '蜂蜜',
  'soy sauce': '酱油',
  'vinegar': '醋',
  'oil': '油',
  'olive oil': '橄榄油',
  'pepper': '胡椒',
  'ketchup': '番茄酱',
  'mayonnaise': '蛋黄酱',
  'mustard': '芥末',

  // 饮品
  'water': '水',
  'coffee': '咖啡',
  'tea': '茶',
  'juice': '果汁',
  'soda': '苏打水',
  'beer': '啤酒',
  'wine': '葡萄酒',
}

function getNutrientValue(food: USDAFood, nutrientId: number): number {
  const nutrient = food.foodNutrients.find(n => n.nutrientId === nutrientId)
  return nutrient?.value || 0
}

function categorizeFood(description: string): string {
  const lowerDesc = description.toLowerCase()
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lowerDesc.includes(kw))) {
      return category
    }
  }
  return '其他'
}

function translateToChineseSimple(description: string): string {
  const lowerDesc = description.toLowerCase()

  // 尝试精确匹配
  for (const [en, cn] of Object.entries(TRANSLATION_MAP)) {
    if (lowerDesc.includes(en)) {
      // 提取主要食物名称
      return cn
    }
  }

  // 返回原文，后续可用 AI 批量翻译
  return description
}

async function transformUSDAData() {
  console.log('开始转换 USDA 数据...')

  const seedDataDir = path.join(__dirname, '../seed-data')

  // 检查数据文件是否存在
  const possibleFiles = [
    'FoodData_Central_sr_legacy_food_json_2021-10-28.json',
    'FoodData_Central_foundation_food_json_2024-04-18.json',
    'sr_legacy_food.json',
    'foundation_food.json',
  ]

  let rawDataPath: string | null = null
  for (const file of possibleFiles) {
    const filePath = path.join(seedDataDir, file)
    if (fs.existsSync(filePath)) {
      rawDataPath = filePath
      break
    }
  }

  if (!rawDataPath) {
    console.error('错误: 未找到 USDA 数据文件')
    console.log('请下载数据到:', seedDataDir)
    console.log('下载地址: https://fdc.nal.usda.gov/download-datasets.html')
    console.log('推荐下载: SR Legacy Foods (JSON 格式)')
    process.exit(1)
  }

  console.log('读取数据文件:', rawDataPath)

  // 读取原始数据
  const rawData = fs.readFileSync(rawDataPath, 'utf-8')
  const jsonData = JSON.parse(rawData)

  // 支持不同的数据格式
  const usdaFoods: USDAFood[] = jsonData.SRLegacyFoods
    || jsonData.FoundationFoods
    || jsonData.foods
    || jsonData

  if (!Array.isArray(usdaFoods)) {
    console.error('错误: 无法解析数据格式')
    process.exit(1)
  }

  console.log(`原始数据: ${usdaFoods.length} 条`)

  // 筛选和转换
  const transformedFoods: TransformedFood[] = []
  const seenNames = new Set<string>()

  for (const food of usdaFoods) {
    // 跳过重复
    if (seenNames.has(food.description)) continue
    seenNames.add(food.description)

    // 获取营养素
    const calories = getNutrientValue(food, NUTRIENT_IDS.ENERGY)

    // 跳过无热量数据的食物
    if (calories === 0) continue

    const transformed: TransformedFood = {
      id: `usda_${food.fdcId}`,
      nameEn: food.description,
      nameCn: translateToChineseSimple(food.description),
      category: categorizeFood(food.description),
      calories: Math.round(calories),
      protein: Math.round(getNutrientValue(food, NUTRIENT_IDS.PROTEIN) * 10) / 10,
      carbs: Math.round(getNutrientValue(food, NUTRIENT_IDS.CARBS) * 10) / 10,
      fat: Math.round(getNutrientValue(food, NUTRIENT_IDS.FAT) * 10) / 10,
      fiber: Math.round(getNutrientValue(food, NUTRIENT_IDS.FIBER) * 10) / 10,
      sodium: Math.round(getNutrientValue(food, NUTRIENT_IDS.SODIUM)),
      sugar: Math.round(getNutrientValue(food, NUTRIENT_IDS.SUGAR) * 10) / 10,
    }

    transformedFoods.push(transformed)
  }

  // 按分类排序
  transformedFoods.sort((a, b) => a.category.localeCompare(b.category))

  // 保存转换后的数据
  const outputPath = path.join(seedDataDir, 'foods-transformed.json')
  fs.writeFileSync(outputPath, JSON.stringify(transformedFoods, null, 2))

  console.log(`转换完成: ${transformedFoods.length} 条`)
  console.log(`输出文件: ${outputPath}`)

  // 输出分类统计
  const categoryStats: Record<string, number> = {}
  for (const food of transformedFoods) {
    categoryStats[food.category] = (categoryStats[food.category] || 0) + 1
  }
  console.log('\n分类统计:')
  for (const [category, count] of Object.entries(categoryStats).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${category}: ${count}`)
  }

  // 统计需要翻译的数量
  const needTranslation = transformedFoods.filter(f => f.nameCn === f.nameEn).length
  console.log(`\n需要 AI 翻译: ${needTranslation} 条`)
}

transformUSDAData().catch(console.error)
