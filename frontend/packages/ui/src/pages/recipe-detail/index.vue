<script setup lang="ts">
/**
 * 食谱详情页
 *
 * 显示食谱详情、营养分析、食材清单和烹饪步骤
 */
import { ref } from 'vue'

const aiAssistantEnabled = ref(true)

interface NutritionStat {
  label: string
  val: string
  pct: number
  color: string
}

interface Ingredient {
  n: string
  q: string
}

interface CookingStep {
  t: string
  d: string
}

const nutritionStats: NutritionStat[] = [
  { label: '蛋白质', val: '35g', pct: 85, color: 'text-primary' },
  { label: '脂肪', val: '12g', pct: 40, color: 'text-orange-400' },
  { label: '碳水', val: '5g', pct: 15, color: 'text-blue-400' }
]

const ingredients: Ingredient[] = [
  { n: '三文鱼排', q: '200g' },
  { n: '鲜嫩芦笋', q: '100g' },
  { n: '初榨橄榄油', q: '1勺' },
  { n: '海盐与黑胡椒', q: '适量' }
]

const cookingSteps: CookingStep[] = [
  { t: '腌制调味', d: '在鱼肉两面均匀撒上海盐和现磨黑胡椒，静置5分钟入味。同时在芦笋上淋少许橄榄油。' },
  { t: '煎制鱼皮', d: '平底锅中火加热，倒入橄榄油。将三文鱼皮朝下放入锅中，用铲子轻压，中小火煎3-4分钟至鱼皮金黄酥脆。' },
  { t: '完成出锅', d: '翻面继续煎2-3分钟，同时放入芦笋一同煎熟。待鱼肉变色且熟透后即可装盘。' }
]

const navigateBack = () => {
  uni.navigateBack()
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
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjzSEoi6HdN7_oDhZ1YSC_cxw8HLvaz15PmOoZBhJsWUfsRtTFhRh0iWcGq1oJQXIxGnh7carV5qEUHOSau3MVSUpBLpVF--Fogwn__vECHTzsWfbZlYMQJIlKW7lgGNreZra2Ga9iwmn7Azn2t2Ecn9kcjULEF6NLAIeMe5RViTl-EbsQHB4hjYpTN6tY3Y6TLXHfKSit9IHrF3U0nPTpNsq1K2fYBboezJt3N7KntyVDDB64o-U2V05l46-OFzFTwW9dpUxYEQuq"
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
            Keto Friendly
          </text>
          <view class="flex items-center gap-1 text-gray-200 text-xs font-medium bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
            <text class="material-symbols-outlined text-primary text-sm">star</text>
            <text>4.9</text>
            <text class="text-gray-400 mx-1">•</text>
            <text>128 评价</text>
          </view>
        </view>
        <text class="text-3xl font-bold text-white leading-tight mb-2">香煎三文鱼配芦笋</text>
        <text class="text-gray-200 text-sm leading-relaxed opacity-90">富含 Omega-3 的优质蛋白，搭配鲜嫩芦笋，15分钟即可享受的米其林级美味。</text>
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
          <text class="material-symbols-outlined text-primary text-[18px]">schedule</text>
          <text class="text-gray-800 text-sm font-medium">20 分钟</text>
        </view>
        <view class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white border border-gray-100 px-4 shadow-sm">
          <text class="material-symbols-outlined text-primary text-[18px]">signal_cellular_alt</text>
          <text class="text-gray-800 text-sm font-medium">简单</text>
        </view>
        <view class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white border border-gray-100 px-4 shadow-sm">
          <text class="material-symbols-outlined text-primary text-[18px]">local_fire_department</text>
          <text class="text-gray-800 text-sm font-medium">450 kcal</text>
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
          <text class="text-lg font-bold text-gray-900">所需食材 <text class="text-gray-400 font-normal text-sm ml-1">(4项)</text></text>
          <view @tap="navigateToList" class="text-emerald-600 text-sm font-medium border border-emerald-600/30 active:bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
            <text class="material-symbols-outlined text-[16px]">add</text>
            <text>加入清单</text>
          </view>
        </view>
        <view class="space-y-3">
          <view v-for="(item, idx) in ingredients" :key="idx" class="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
            <checkbox class="scale-75" />
            <view class="flex-1 flex justify-between items-center">
              <text class="text-gray-900 text-sm font-medium">{{ item.n }}</text>
              <text class="text-gray-400 text-sm">{{ item.q }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Steps -->
      <view class="mt-8 pb-32">
        <text class="text-lg font-bold text-gray-900 mb-6">烹饪步骤</text>
        <view class="relative border-l-2 border-gray-200 ml-3 space-y-8">
          <view class="relative pl-8">
            <view class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary shadow-lg"></view>
            <text class="text-gray-900 font-semibold text-base mb-2">准备食材</text>
            <text class="text-gray-600 text-sm leading-relaxed mb-3">将三文鱼清洗干净，用厨房纸吸干水分。芦笋去除老根，洗净沥干。</text>
          </view>
          <view v-for="(step, idx) in cookingSteps" :key="idx" class="relative pl-8">
            <view class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-gray-300"></view>
            <text class="text-gray-900 font-semibold text-base mb-2">{{ step.t }}</text>
            <text class="text-gray-600 text-sm leading-relaxed">{{ step.d }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Floating Footer -->
    <view class="absolute bottom-0 left-0 right-0 p-4 pt-0 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent z-30">
      <view class="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
        <view class="flex flex-col">
          <text class="text-[10px] text-gray-400 uppercase tracking-wide font-medium">预计耗时</text>
          <text class="text-gray-900 font-bold text-lg">20:00</text>
        </view>
        <view @tap="startCooking" class="flex-1 bg-primary text-gray-900 font-bold text-base py-3 px-6 rounded-xl active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg">
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
/* RecipeDetail page specific styles */
</style>
