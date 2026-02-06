<script setup lang="ts">
/**
 * 饮食日记页面
 *
 * 显示每日营养摄入记录和 AI 分析建议
 */
import { ref, computed, onMounted } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { useAuthStore, useDiary } from '@diet-lens/core'

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)

const {
  loading,
  error,
  selectedDate,
  dailySummary,
  macros,
  meals,
  fetchAll,
  refresh,
} = useDiary()

// 选中的日期索引（用于周视图）
const selectedDayIndex = ref(2) // 默认今天

const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

// 获取本周日期
const getWeekDates = () => {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - dayOfWeek)

  const dates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}

const weekDates = getWeekDates()

// 选择日期
const selectDay = async (index: number) => {
  selectedDayIndex.value = index
  const date = weekDates[index]
  await fetchAll(date)
}

// 今日摄入总量
const totalCalories = computed(() => dailySummary.value?.totalCalories || 0)
const targetCalories = computed(() => dailySummary.value?.targetCalories || 2000)

const navigateBack = () => {
  uni.navigateBack()
}

// 跳转到数据分析页面
const navigateToAnalysis = () => {
  uni.navigateTo({ url: '/pages/analysis/index' })
}

// 跳转到登录页
const goToLogin = () => {
  uni.navigateTo({ url: '/pages/onboarding/login' })
}

// 页面加载时获取数据
onMounted(async () => {
  if (isLoggedIn.value) {
    await fetchAll()
  }
})
</script>

<template>
  <view class="page-container pb-24 overflow-y-auto no-scrollbar bg-gray-50">
    <!-- 未登录提示 -->
    <view v-if="!isLoggedIn" class="flex flex-col items-center justify-center px-10" style="min-height: 80vh;">
      <text class="material-symbols-outlined text-slate-300 text-6xl mb-4">lock</text>
      <text class="text-base font-medium text-slate-600 mb-2">需要登录</text>
      <text class="text-sm text-slate-400 text-center mb-6">请先登录以查看饮食日记</text>
      <view class="bg-[#34C759] text-white py-3 px-8 rounded-full font-medium" @tap="goToLogin">
        去登录
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-else-if="loading" class="flex items-center justify-center" style="min-height: 50vh;">
      <view class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#34C759]"></view>
    </view>

    <!-- 主内容 -->
    <template v-else>
      <!-- Header -->
      <view class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shrink-0">
        <view class="flex items-center justify-between p-4">
          <view @tap="navigateBack" class="w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-200">
            <text class="material-symbols-outlined text-gray-900">arrow_back</text>
          </view>
          <text class="text-lg font-bold text-gray-900">每日饮食日记</text>
          <view @tap="navigateToAnalysis" class="w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-200">
            <text class="material-symbols-outlined text-[#34C759]">insights</text>
          </view>
        </view>
        <!-- Week Strip -->
        <scroll-view scroll-x class="w-full pb-4" :show-scrollbar="false">
          <view class="flex px-4 gap-2">
            <view v-for="(day, idx) in weekDays" :key="idx" class="flex flex-col items-center gap-1 shrink-0">
              <text :class="['text-[10px] font-medium', selectedDayIndex === idx ? 'text-primary' : 'text-gray-500']">{{ day }}</text>
              <view @tap="selectDay(idx)" :class="[
                'w-10 h-10 rounded-full text-sm font-bold flex items-center justify-center transition-all',
                selectedDayIndex === idx
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                  : 'text-gray-700 active:bg-gray-100'
              ]">
                <text>{{ 22 + idx }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="px-4 pt-6 space-y-8">
        <!-- Summary Card -->
        <view class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <view class="flex justify-between items-end mb-4">
            <view>
              <text class="text-xs font-medium text-gray-500 block mb-1">今日摄入 (Intake)</text>
              <view class="flex items-baseline gap-1">
                <text class="text-3xl font-extrabold text-gray-900 leading-none">{{ totalCalories.toLocaleString() }}</text>
                <text class="text-xs font-medium text-gray-400">/ {{ targetCalories.toLocaleString() }} kcal</text>
              </view>
            </view>
            <view class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <text class="material-symbols-outlined text-2xl">local_fire_department</text>
            </view>
          </view>
          <!-- Bars -->
          <view class="grid grid-cols-3 gap-4">
            <view v-for="(m, i) in macros" :key="i" class="flex flex-col gap-1.5">
              <view class="flex justify-between text-[10px] font-medium">
                <text class="text-gray-600">{{ m.label }}</text>
                <text class="text-gray-400">{{ m.val }}</text>
              </view>
              <view class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <view :class="[m.color, 'h-full rounded-full']" :style="{ width: m.pct }"></view>
              </view>
            </view>
          </view>
        </view>

        <!-- Meals List -->
        <view class="space-y-6">
          <view v-if="meals.length === 0" class="text-center py-8">
            <text class="material-symbols-outlined text-slate-300 text-5xl">no_meals</text>
            <text class="text-sm text-slate-500 mt-2 block">今天还没有记录饮食</text>
            <view class="mt-4 text-primary text-sm font-medium" @tap="navigateBack">
              返回首页添加记录
            </view>
          </view>
          <view v-for="(meal, idx) in meals" :key="idx" class="space-y-3">
            <view class="flex items-center justify-between">
              <view class="flex items-center gap-2">
                <view :class="['w-2 h-2 rounded-full', meal.color]"></view>
                <text class="text-base font-bold text-gray-900">{{ meal.name }}</text>
              </view>
              <text class="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{{ meal.cal }} kcal</text>
            </view>

            <view class="flex flex-col gap-3">
              <view v-for="(item, i) in meal.items" :key="i" class="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm border border-transparent active:border-gray-200 transition-all">
                <view class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <image :src="item.img" mode="aspectFill" class="w-full h-full" />
                </view>
                <view class="flex-1 min-w-0">
                  <view class="flex justify-between items-start mb-0.5">
                    <text class="font-bold text-gray-900 text-sm truncate">{{ item.title }}</text>
                    <text class="font-bold text-sm text-gray-900 ml-2">{{ item.c }}</text>
                  </view>
                  <text class="text-xs text-gray-500 block truncate">{{ item.desc }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- AI Analysis Card -->
        <view class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-6 shadow-sm mb-8">
          <view class="absolute -top-6 -right-6 text-blue-100/50">
            <text class="material-symbols-outlined" style="font-size: 100px">auto_awesome</text>
          </view>
          <view class="relative z-10 flex flex-col gap-2">
            <view class="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <text class="material-symbols-outlined text-lg">smart_toy</text>
              <text>AI 智能分析</text>
            </view>
            <text class="text-gray-600 text-xs leading-relaxed">
              您的蛋白质摄入非常理想，达到了目标的 110%。但晚餐后的脂肪摄入略高。建议明天早餐增加全麦面包来平衡碳水比例。
            </text>
            <view @tap="navigateToAnalysis" class="text-xs font-bold text-primary flex items-center gap-1 mt-2 active:opacity-70">
              <text>查看详细报告</text>
              <text class="material-symbols-outlined text-xs">arrow_forward</text>
            </view>
          </view>
        </view>
      </view>
    </template>

    <BottomNav />
  </view>
</template>

<style scoped>
.no-scrollbar ::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}
</style>
