<script setup lang="ts">
/**
 * 食谱详情页
 *
 * 显示食谱详情、营养分析、食材清单和烹饪步骤
 * 支持从 AI 聊天页面传递食谱数据
 */
import { ref, computed, onMounted } from 'vue'

interface RecipeCard {
  name: string
  image: string
  calories: number
  time: string
  difficulty: string
  description: string
}

// 从 URL 参数获取食谱数据
const recipeData = ref<RecipeCard | null>(null)

// 默认食谱数据
const defaultRecipe: RecipeCard = {
  name: '香煎三文鱼配芦笋',
  image: '/static/images/food/food_10.jpg',
  calories: 450,
  time: '20 分钟',
  difficulty: '简单',
  description: '富含 Omega-3 的优质蛋白，搭配鲜嫩芦笋，15分钟即可享受的米其林级美味。'
}

const aiAssistantEnabled = ref(true)

interface NutritionStat {
  label: string
  val: string
  pct: number
  color: string
}

interface Ingredient {
  name: string
  quantity: string
}

interface CookingStep {
  title: string
  description: string
}

// 根据卡路里计算营养比例
const calculateNutrition = (calories: number) => {
  // 假设蛋白质约 30%，脂肪约 25%，碳水约 45%
  const protein = Math.round(calories * 0.3 / 4)
  const fat = Math.round(calories * 0.25 / 9)
  const carbs = Math.round(calories * 0.45 / 4)

  return {
    protein: { label: '蛋白质', val: `${protein}g`, pct: 30, color: 'text-primary' },
    fat: { label: '脂肪', val: `${fat}g`, pct: 25, color: 'text-orange-400' },
    carbs: { label: '碳水', val: `${carbs}g`, pct: 45, color: 'text-blue-400' }
  }
}

// 计算的营养数据
const nutritionStats = computed(() => {
  const calories = recipeData.value?.calories || defaultRecipe.calories
  return Object.values(calculateNutrition(calories))
})

// 模拟食材数据（根据卡路里调整）
const ingredients = computed<Ingredient[]>(() => {
  const calories = recipeData.value?.calories || defaultRecipe.calories
  if (calories < 300) {
    return [
      { name: '鸡胸肉', quantity: '150g' },
      { name: '西兰花', quantity: '100g' },
      { name: '橄榄油', quantity: '1勺' },
      { name: '海盐与黑胡椒', quantity: '适量' }
    ]
  } else if (calories > 500) {
    return [
      { name: '牛排', quantity: '200g' },
      { name: '土豆', quantity: '200g' },
      { name: '芦笋', quantity: '100g' },
      { name: '黄油', quantity: '20g' }
    ]
  } else {
    return [
      { name: '三文鱼排', quantity: '200g' },
      { name: '鲜嫩芦笋', quantity: '100g' },
      { name: '初榨橄榄油', quantity: '1勺' },
      { name: '海盐与黑胡椒', quantity: '适量' }
    ]
  }
})

// 模拟烹饪步骤
const cookingSteps: CookingStep[] = [
  { title: '准备食材', description: '将主料清洗干净，用厨房纸吸干水分。蔬菜去除老根，洗净沥干。' },
  { title: '调味腌制', description: '在主料两面均匀撒上海盐和现磨黑胡椒，静置5分钟入味。同时在蔬菜上淋少许橄榄油。' },
  { title: '开始烹饪', description: '平底锅中火加热，倒入油。将主料放入锅中，中小火煎至两面金黄。' },
  { title: '完成出锅', description: '加入蔬菜一同煎熟。待主料变色且熟透后即可装盘享用。' }
]

// 显示的食谱名称
const displayRecipeName = computed(() => recipeData.value?.name || defaultRecipe.name)
// 显示的食谱描述
const displayRecipeDesc = computed(() => recipeData.value?.description || defaultRecipe.description)
// 显示的食谱图片
const displayRecipeImage = computed(() => recipeData.value?.image || defaultRecipe.image)
// 显示的烹饪时间
const displayRecipeTime = computed(() => recipeData.value?.time || defaultRecipe.time)
// 显示的难度
const displayRecipeDifficulty = computed(() => recipeData.value?.difficulty || defaultRecipe.difficulty)
// 显示的卡路里
const displayRecipeCalories = computed(() => recipeData.value?.calories || defaultRecipe.calories)

onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = (currentPage as any).options

  if (options.data) {
    try {
      recipeData.value = JSON.parse(decodeURIComponent(options.data))
    } catch (e) {
      console.error('解析食谱数据失败:', e)
    }
  }
})

const navigateBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/index/index' })
  }
}

const navigateToScan = () => {
  uni.navigateTo({ url: '/pages/scan/index' })
}

const navigateToList = () => {
  uni.navigateTo({ url: '/pages/shopping-list/index' })
}

const startCooking = () => {
  console.log('Started cooking')
}
</script>

<template>
  <scroll-view scroll-y class="relative h-screen w-full flex flex-col bg-gray-50 max-w-md mx-auto">
    <!-- Hero Section -->
    <view class="relative w-full h-[460px] shrink-0">
      <image
        :src="displayRecipeImage"
        class="absolute inset-0 w-full h-full"
        mode="aspectFill"
      />
      <view class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></view>

      <!-- Navigation Bar -->
      <view class="absolute top-0 left-0 right-0 flex items-center justify-between p-6 pt-12 z-20">
        <view
          @tap="navigateBack"
          class="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 active:bg-black/40 text-white"
        >
          <text class="material-symbols-outlined">arrow_back</text>
        </view>
        <view class="flex gap-3">
          <view class="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 active:bg-black/40 text-white">
            <text class="material-symbols-outlined">share</text>
          </view>
          <view class="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 active:bg-black/40 text-white">
            <text class="material-symbols-outlined">bookmark_border</text>
          </view>
        </view>
      </view>

      <!-- Content Overlay -->
      <view class="absolute bottom-0 left-0 w-full p-6 pb-8 z-10">
        <view class="flex items-center gap-2 mb-3">
          <text class="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary text-xs font-semibold tracking-wide uppercase shadow-sm">
            健康推荐
          </text>
          <view class="flex items-center gap-1 text-gray-200 text-xs font-medium bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
            <text class="material-symbols-outlined text-primary text-sm">star</text>
            <text>4.9</text>
            <text class="text-gray-400 mx-1">•</text>
            <text>128 评价</text>
          </view>
        </view>
        <text class="text-3xl font-bold text-white leading-tight mb-2">{{ displayRecipeName }}</text>
        <text class="text-gray-200 text-sm leading-relaxed opacity-90">{{ displayRecipeDesc }}</text>
      </view>
    </view>

    <!-- Main Content -->
    <view class="relative flex-1 px-6 -mt-4 z-10 bg-gray-50 rounded-t-3xl shadow-lg">
      <!-- Handle Bar -->
      <view class="w-full flex justify-center pt-3 pb-1">
        <view class="w-12 h-1.5 bg-gray-300/50 rounded-full"></view>
      </view>

      <!-- Quick Stats -->
      <scroll-view scroll-x class="flex gap-3 py-4" show-scrollbar="false">
        <view class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white border border-gray-100 px-4 shadow-sm">
          <text class="material-symbols-outlined text-primary text-lg">schedule</text>
          <text class="text-gray-800 text-sm font-medium">{{ displayRecipeTime }}</text>
        </view>
        <view class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white border border-gray-100 px-4 shadow-sm">
          <text class="material-symbols-outlined text-primary text-lg">signal_cellular_alt</text>
          <text class="text-gray-800 text-sm font-medium">{{ displayRecipeDifficulty }}</text>
        </view>
        <view class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white border border-gray-100 px-4 shadow-sm">
          <text class="material-symbols-outlined text-primary text-lg">local_fire_department</text>
          <text class="text-gray-800 text-sm font-medium">{{ displayRecipeCalories }} kcal</text>
        </view>
      </scroll-view>

      <!-- Nutrition Charts -->
      <view class="mt-4">
        <view class="flex items-center justify-between mb-4">
          <text class="text-lg font-bold text-gray-900">营养分析</text>
          <view @tap="navigateToScan" class="text-xs text-primary font-bold flex items-center gap-1 active:bg-primary/5 px-2 py-1 rounded-lg">
            <text>查看详情</text>
            <text class="material-symbols-outlined text-xs">chevron_right</text>
          </view>
        </view>
        <view class="grid grid-cols-3 gap-3">
          <view v-for="(stat, idx) in nutritionStats" :key="idx" class="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <view class="relative w-12 h-12 mb-2">
              <view class="w-full h-full rounded-full border-[6px] border-gray-100"></view>
              <view :class="['absolute inset-0 rounded-full border-[6px] border-transparent', stat.color === 'text-primary' ? 'border-primary' : stat.color === 'text-orange-400' ? 'border-orange-400' : 'border-blue-400']" :style="{ borderStyle: 'solid', transform: 'rotate(' + (270 - stat.pct * 3.6) + 'deg)' }"></view>
              <view class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-900">{{ stat.pct }}%</view>
            </view>
            <text class="text-2xl font-bold text-gray-900 leading-none">{{ stat.val }}</text>
            <text class="text-[10px] uppercase tracking-wider text-gray-400 mt-1 font-bold">{{ stat.label }}</text>
          </view>
        </view>
      </view>

      <!-- AI Assistant -->
      <view class="mt-8 mb-6 p-4 rounded-2xl bg-white border border-gray-100 shadow-lg flex items-center justify-between relative overflow-hidden">
        <view class="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></view>
        <view class="flex items-center gap-3 z-10">
          <view class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <text class="material-symbols-outlined animate-pulse">mic</text>
          </view>
          <view>
            <text class="text-gray-900 font-bold text-sm">AI 语音助手</text>
            <text class="text-xs text-gray-500">实时语音指导步骤</text>
          </view>
        </view>
        <switch :checked="aiAssistantEnabled" color="#38e07b" class="transform scale-75" />
      </view>

      <!-- Ingredients -->
      <view class="mt-4">
        <view class="flex items-center justify-between mb-4">
          <text class="text-lg font-bold text-gray-900">所需食材 <text class="text-gray-400 font-normal text-sm ml-1">({{ ingredients.length }}项)</text></text>
          <view @tap="navigateToList" class="text-emerald-600 text-sm font-medium border border-emerald-600/30 active:bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
            <text class="material-symbols-outlined text-sm">add</text>
            <text>加入清单</text>
          </view>
        </view>
        <view class="space-y-3">
          <view v-for="(item, idx) in ingredients" :key="idx" class="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
            <checkbox class="scale-75" />
            <view class="flex-1 flex justify-between items-center">
              <text class="text-gray-900 text-sm font-medium">{{ item.name }}</text>
              <text class="text-gray-400 text-sm">{{ item.quantity }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Steps -->
      <view class="mt-8 pb-24">
        <text class="text-lg font-bold text-gray-900 mb-6">烹饪步骤</text>
        <view class="relative border-l-2 border-gray-200 ml-3 space-y-8">
          <view v-for="(step, idx) in cookingSteps" :key="idx" class="relative pl-8">
            <view :class="['absolute -left-[9px] top-0 w-4 h-4 rounded-full', idx === 0 ? 'bg-primary shadow-lg' : 'bg-gray-200 border-2 border-gray-400 shadow-sm']"></view>
            <text class="text-gray-900 font-semibold text-base mb-2">{{ step.title }}</text>
            <text class="text-gray-600 text-sm leading-relaxed">{{ step.description }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Floating Footer -->
    <view class="absolute bottom-0 left-0 right-0 p-4 pt-0 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent z-30">
      <view class="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
        <view class="flex flex-col">
          <text class="text-[10px] text-gray-400 uppercase tracking-wide font-medium">预计耗时</text>
          <text class="text-gray-900 font-bold text-lg">{{ displayRecipeTime }}</text>
        </view>
        <view @tap="startCooking" class="flex-1 flex-row items-center justify-center bg-primary text-gray-900 font-bold text-base py-3 px-6 rounded-xl active:scale-[0.98] gap-2 shadow-lg">
          <text class="material-symbols-outlined text-2xl">play_arrow</text>
          <text>开始烹饪</text>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "食谱详情",
    "navigationStyle": "custom"
  }
}
</route>

<style scoped>
.space-y-3 > view + view {
  margin-top: 0.75rem;
}

.space-y-8 > view + view {
  margin-top: 2rem;
}
</style>
