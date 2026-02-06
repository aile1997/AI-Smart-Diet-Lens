<script setup lang="ts">
/**
 * 首页 - 仪表盘
 *
 * 显示今日热量环形图、健康指标卡片
 */
import { ref, computed } from 'vue'

/** 餐别类型 */
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

/** 根据当前时间获取推荐餐别 */
function getCurrentMealType(): MealType {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 10) return 'breakfast'
  if (hour >= 10 && hour < 14) return 'lunch'
  if (hour >= 14 && hour < 20) return 'dinner'
  return 'snack'
}

/** 获取餐别中文名称 */
function getMealTypeName(type: MealType): string {
  const names = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '加餐'
  }
  return names[type]
}

/** 获取中文问候语 */
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return '早上好'
  if (hour >= 12 && hour < 18) return '下午好'
  return '晚上好'
}

/** 获取中文日期 */
function getChineseDate(): string {
  const now = new Date()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const month = now.getMonth() + 1
  const day = now.getDate()
  const weekday = weekdays[now.getDay()]
  return `${month}月${day}日 ${weekday}`
}

// 卡路里数据
const consumed = ref(530)
const target = ref(2200)
const remaining = computed(() => target.value - consumed.value)

// 当前推荐餐别
const currentMealType = computed<MealType>(() => getCurrentMealType())
const currentMealName = computed(() => getMealTypeName(currentMealType.value))

// 日期和问候语
const chineseDate = computed(() => getChineseDate())
const greeting = computed(() => getGreeting())

const navigateTo = (path: string) => {
  // 判断是否为 tabBar 页面
  const tabBarPages = ['/pages/index/index', '/pages/scan/index', '/pages/diary/index', '/pages/wiki/index', '/pages/profile/index']
  if (tabBarPages.includes(path)) {
    uni.switchTab({ url: path })
  } else {
    uni.navigateTo({ url: path })
  }
}

const addWater = () => {
  // 添加水分逻辑
  console.log('Added water')
}

const logMeal = () => {
  // 跳转到拍照识别页面
  uni.switchTab({ url: '/pages/scan/index' })
}

// 跳转到烹饪助手页面（直接生成）
const goToCookingAssistant = () => {
  uni.navigateTo({
    url: '/pages/cooking-assistant/index'
  })
}

// 跳转到 AI 聊天页面（对话定制）
const goToAIChat = () => {
  uni.navigateTo({
    url: '/pages/ai-chat/index'
  })
}
</script>

<template>
  <view class="page-container pb-24 overflow-y-auto bg-[#F5F7F6]">
    <!-- Header -->
    <view class="flex items-center justify-between px-6 pt-12 pb-4 bg-[#F5F7F6]/90 sticky top-0 z-30 backdrop-blur-md">
      <view class="flex flex-col">
        <text class="text-xs font-semibold text-slate-500 mb-0.5">{{ chineseDate }}</text>
        <text class="text-xl font-bold text-[#0e1a13] leading-tight">{{ greeting }}，Alex</text>
      </view>
      <view class="relative group" @tap="navigateTo('/pages/profile/index')">
        <image src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4ARIueyn7oeLTPKejOMX_pPCmp0S85Xj29ku1HwdDtPDdRoJLpgvSEU23aY8xES40OHagpkPIqfDk5h8PItc2_ZuNCkUoO83GnslRZ4Gx9UhngYaK5meHb23uRdd1Ue7r6Bjz93OPt83tMVKCviO5oMtJvKgZOPTe5t_pOF9YKnKnqVpqMMP0f3XfNWt1iZ5Kc46ID7smBu2WqYsT__xkslaaSj5fpZsEypEKjwo_BMUp4cmuwKUxEHETmtlH3YOqCR9fNO3K127-" class="w-10 h-10 rounded-full border-2 border-white shadow-sm"></image>
        <view class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-primary border-2 border-white rounded-full"></view>
      </view>
    </view>

    <view class="flex-1 px-6 space-y-8">
      <!-- Calorie Ring -->
      <view class="flex flex-col items-center pt-4" @tap="navigateTo('/pages/diary/index')">
        <view class="relative w-72 h-72 flex items-center justify-center">
          <view class="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-20 animate-pulse"></view>
          <svg class="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 256 256">
            <circle class="text-sage-100 dark:text-sage-800/40" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" stroke-width="18"></circle>
            <circle class="text-primary progress-ring-circle" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" stroke-dasharray="691" stroke-dashoffset="200" stroke-linecap="round" stroke-width="18"></circle>
          </svg>
          <view class="absolute flex flex-col items-center justify-center text-center inset-0 z-10">
            <text class="text-slate-400 dark:text-sage-300 text-sm font-semibold mb-1">剩余</text>
            <text class="text-5xl font-extrabold text-[#0e1a13] dark:text-white tracking-tight">{{ remaining.toLocaleString() }}</text>
            <text class="text-slate-500 dark:text-sage-300 text-sm font-medium mt-1">千卡预算</text>
          </view>
        </view>
        <view class="flex items-center justify-center gap-12 mt-[-10px] z-10">
          <view class="flex flex-col items-center group">
            <view class="w-2 h-2 rounded-full bg-primary mb-2 group-hover:scale-125 transition-transform"></view>
            <text class="text-2xl font-bold text-[#0e1a13] dark:text-white leading-none">{{ consumed }}</text>
            <text class="text-xs font-medium text-slate-500 dark:text-sage-300 mt-1">已摄入</text>
          </view>
          <view class="w-px h-8 bg-slate-200 dark:bg-sage-800"></view>
          <view class="flex flex-col items-center group">
            <view class="w-2 h-2 rounded-full bg-slate-300 dark:bg-sage-700 mb-2 group-hover:scale-125 transition-transform"></view>
            <text class="text-2xl font-bold text-[#0e1a13] dark:text-white leading-none">{{ target.toLocaleString() }}</text>
            <text class="text-xs font-medium text-slate-500 dark:text-sage-300 mt-1">目标</text>
          </view>
        </view>
      </view>

      <!-- Metric Grid -->
      <view class="grid grid-cols-2 gap-4">
        <view class="flex flex-col p-5 bg-white dark:bg-sage-900/40 rounded-3xl border border-sage-100 dark:border-sage-800 shadow-card group hover:border-primary/30 transition-colors cursor-pointer relative overflow-hidden">
          <view class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <text class="material-symbols-outlined text-6xl">footprint</text>
          </view>
          <view class="flex items-center gap-2 mb-3">
            <text class="material-symbols-outlined text-primary text-xl font-variation-FILL-1">footprint</text>
          </view>
          <text class="text-sm font-bold text-slate-700 dark:text-sage-200">步数</text>
          <view class="mt-auto">
            <text class="text-2xl font-bold text-[#0e1a13] dark:text-white">4,200</text>
            <text class="text-xs text-slate-500 dark:text-sage-400 mb-3">/ 10,000</text>
            <view class="h-1.5 w-full bg-sage-50 dark:bg-sage-800 rounded-full overflow-hidden">
              <view class="h-full bg-primary rounded-full" style="width: 42%"></view>
            </view>
          </view>
        </view>

        <view class="flex flex-col p-5 bg-[#ebf7fd] dark:bg-slate-800/40 rounded-3xl border border-transparent dark:border-sage-800 shadow-card relative overflow-hidden">
          <view class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <text class="material-symbols-outlined text-6xl text-sky-500">water_drop</text>
          </view>
          <view class="flex items-center gap-2 mb-3">
            <text class="material-symbols-outlined text-sky-500 text-xl font-variation-FILL-1">water_drop</text>
          </view>
          <text class="text-sm font-bold text-slate-700 dark:text-sage-200">水分</text>
          <view class="mt-auto flex items-end justify-between">
            <view>
              <text class="text-2xl font-bold text-[#0e1a13] dark:text-white">4</text>
              <text class="text-xs text-slate-500 dark:text-sage-400">/ 8 杯</text>
            </view>
            <view @tap="addWater" class="bg-white dark:bg-sage-800 text-sky-500 rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform">
              <text class="material-symbols-outlined text-lg font-bold">add</text>
            </view>
          </view>
        </view>

        <view class="flex flex-col p-5 bg-[#f0f0fa] dark:bg-indigo-900/20 rounded-3xl border border-transparent dark:border-sage-800 shadow-card relative overflow-hidden">
          <view class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <text class="material-symbols-outlined text-6xl text-indigo-500">bedtime</text>
          </view>
          <view class="flex items-center gap-2 mb-3">
            <text class="material-symbols-outlined text-indigo-500 text-xl font-variation-FILL-1">bedtime</text>
          </view>
          <text class="text-sm font-bold text-slate-700 dark:text-sage-200">睡眠</text>
          <view class="mt-auto">
            <text class="text-2xl font-bold text-[#0e1a13] dark:text-white">7<text class="text-base font-medium text-slate-500 dark:text-sage-400">小时</text> 20<text class="text-base font-medium text-slate-500 dark:text-sage-400">分</text></text>
            <text class="text-xs text-indigo-500 dark:text-indigo-400 font-medium mt-1 flex items-center gap-1">
              <text class="material-symbols-outlined text-[10px]">trending_up</text>
              <text>恢复良好</text>
            </text>
          </view>
        </view>

        <view class="flex flex-col p-5 bg-[#fff8e6] dark:bg-amber-900/20 rounded-3xl border border-transparent dark:border-sage-800 shadow-card relative overflow-hidden">
          <view class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <text class="material-symbols-outlined text-6xl text-amber-500">sentiment_satisfied</text>
          </view>
          <view class="flex items-center gap-2 mb-3">
            <text class="material-symbols-outlined text-amber-500 text-xl font-variation-FILL-1">sentiment_satisfied</text>
          </view>
          <text class="text-sm font-bold text-slate-700 dark:text-sage-200">心情</text>
          <view class="mt-auto">
            <text class="text-xl font-bold text-[#0e1a13] dark:text-white leading-tight">精力充沛</text>
            <text class="text-xs text-slate-500 dark:text-sage-400 mt-1">10:30</text>
          </view>
        </view>
      </view>

      <!-- AI Cooking Assistant -->
      <view class="relative overflow-hidden rounded-3xl bg-white dark:bg-sage-900/40 border border-sage-100 dark:border-sage-800 shadow-card p-6 flex flex-col">
        <view class="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></view>
        <view class="relative z-10">
          <view class="flex items-center gap-2 mb-2">
            <view class="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
              <text class="material-symbols-outlined text-lg font-variation-FILL-1">skillet</text>
            </view>
            <text class="text-xs font-bold text-primary tracking-wider uppercase">AI 智能烹饪助手</text>
          </view>
          <text class="text-xl font-bold text-[#0e1a13] dark:text-white mb-2">AI 为你定制今日餐单</text>
          <text class="text-sm text-slate-500 dark:text-sage-400 mb-5 leading-relaxed">
            通过 AI 对话表达你的口味偏好，或直接为您智能匹配。
          </text>
          <view class="flex gap-3">
            <view
              @tap="goToCookingAssistant"
              class="flex-1 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-glow active:scale-95 transition-transform text-center"
            >
              <text>直接生成</text>
            </view>
            <view
              @tap="goToAIChat"
              class="flex-1 py-3 bg-transparent border border-primary text-primary rounded-2xl font-bold text-sm active:scale-95 transition-transform flex items-center justify-center gap-1.5 active:bg-primary/5"
            >
              <text class="material-symbols-outlined text-lg">chat_bubble</text>
              <text>对话定制</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Today's Meals -->
      <view class="pb-8">
        <view class="flex items-center justify-between mb-4 px-1">
          <text class="text-lg font-bold text-[#0e1a13] dark:text-white">今日饮食</text>
          <view @tap="navigateTo('/pages/diary/index')" class="text-primary text-sm font-semibold">查看全部</view>
        </view>

        <!-- Empty State -->
        <view class="relative w-full rounded-3xl bg-white dark:bg-sage-900/30 border-2 border-dashed border-sage-200 dark:border-sage-800 p-8 flex flex-col items-center text-center">
          <view class="relative w-28 h-28 mb-4">
            <view class="absolute inset-2 rounded-full border border-slate-200 dark:border-sage-700 bg-sage-50 dark:bg-sage-800/50"></view>
            <view class="absolute inset-4 rounded-full border border-slate-100 dark:border-sage-700/50 shadow-inner"></view>
            <view class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-300 dark:text-sage-600">
              <text class="material-symbols-outlined text-4xl">restaurant_menu</text>
            </view>
          </view>
          <text class="text-base font-bold text-[#0e1a13] dark:text-white mb-1">餐盘是空的</text>
          <text class="text-sm text-slate-500 dark:text-sage-400 max-w-[200px] leading-relaxed">
            记录第一餐解锁个性化洞察
          </text>
          <view @tap="logMeal" class="mt-5 px-5 py-2.5 rounded-full bg-sage-100 dark:bg-sage-800 text-slate-700 dark:text-sage-200 text-sm font-bold hover:bg-sage-200 dark:hover:bg-sage-700 transition-colors inline-flex items-center gap-2">
            <text class="material-symbols-outlined text-lg">add</text>
            <text>记录{{ currentMealName }}</text>
          </view>
        </view>
      </view>
    </view>
    <BottomNav />
  </view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "智能健康仪表盘",
    "navigationStyle": "default"
  }
}
</route>

<style scoped>
.progress-ring-circle {
  transition: stroke-dashoffset 1s ease-in-out;
  transform-origin: 50% 50%;
}

.font-variation-FILL-1 {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
