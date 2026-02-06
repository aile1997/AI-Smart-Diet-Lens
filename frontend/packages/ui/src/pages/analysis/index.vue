<script setup lang="ts">
/**
 * AI 营养分析洞察页面
 *
 * 显示热量趋势、营养分布、AI 智能建议
 */
import { computed, onMounted } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { useAuthStore, useAnalysis } from '@diet-lens/core'

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)

const {
  loading,
  error,
  timeRange,
  calorieTrend,
  nutritionDistribution,
  aiSuggestions,
  averageCalories,
  weekOverWeekChange,
  fetchTrends,
  refresh,
} = useAnalysis()

const isWeek = computed(() => timeRange.value === 'week')

const setTimeRange = async (range: 'week' | 'month') => {
  await fetchTrends(range)
}

// 跳转到登录页
const goToLogin = () => {
  uni.navigateTo({ url: '/pages/onboarding/login' })
}

// 获取柱状图高度百分比
const getBarHeight = (index: number): string => {
  if (calorieTrend.value.length === 0) return '0%'
  const maxCalories = Math.max(...calorieTrend.value.map((d) => d.target || 2000))
  const calories = calorieTrend.value[index]?.calories || 0
  return `${Math.min((calories / maxCalories) * 100, 100)}%`
}

// 获取最大值用于标签显示
const getMaxCalories = computed(() => {
  if (calorieTrend.value.length === 0) return 2000
  return Math.max(...calorieTrend.value.map((d) => d.calories))
})

// 获取最大值的索引
const maxCaloriesIndex = computed(() => {
  if (calorieTrend.value.length === 0) return -1
  return calorieTrend.value.findIndex((d) => d.calories === getMaxCalories.value)
})

// 格式化周环比变化
const formatChange = (change: number): string => {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change}%`
}

onMounted(async () => {
  if (isLoggedIn.value) {
    await fetchTrends('week')
  }
})
</script>

<template>
  <view class="page-container pb-24 overflow-y-auto no-scrollbar bg-[#F5F7F8]">
    <!-- 未登录提示 -->
    <view v-if="!isLoggedIn" class="flex flex-col items-center justify-center px-10" style="min-height: 60vh;">
      <text class="material-symbols-outlined text-slate-300 text-6xl mb-4">lock</text>
      <text class="text-base font-medium text-slate-600 mb-2">需要登录</text>
      <text class="text-sm text-slate-400 text-center mb-6">请先登录以查看营养分析数据</text>
      <view
        class="bg-[#34C759] text-white py-3 px-8 rounded-full font-medium"
        @tap="goToLogin"
      >
        去登录
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-else-if="loading" class="flex items-center justify-center" style="min-height: 50vh;">
      <view class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#34C759]"></view>
    </view>

    <!-- 错误状态 -->
    <view v-else-if="error" class="flex flex-col items-center justify-center px-10" style="min-height: 50vh;">
      <text class="material-symbols-outlined text-red-300 text-5xl mb-4">error</text>
      <text class="text-sm text-slate-500 text-center mb-4">{{ error }}</text>
      <view
        class="bg-slate-200 text-slate-700 py-2 px-6 rounded-full text-sm"
        @tap="refresh"
      >
        重试
      </view>
    </view>

    <!-- 主内容 -->
    <template v-else>
      <!-- Header -->
      <view class="sticky top-0 z-30 px-6 pt-14 pb-4 bg-[#F5F7F8]/90 backdrop-blur-md flex flex-col items-center">
        <text class="text-lg font-bold text-slate-900 mb-4">AI 营养分析洞察</text>
        <view class="flex w-full bg-slate-200/50 p-1 rounded-xl">
          <view
            @tap="setTimeRange('week')"
            :class="[
              'flex-1 py-1.5 text-sm rounded-lg transition-all',
              timeRange === 'week' ? 'font-semibold bg-white shadow-sm text-slate-900' : 'font-medium text-slate-500'
            ]"
          >
            周
          </view>
          <view
            @tap="setTimeRange('month')"
            :class="[
              'flex-1 py-1.5 text-sm rounded-lg transition-all',
              timeRange === 'month' ? 'font-semibold bg-white shadow-sm text-slate-900' : 'font-medium text-slate-500'
            ]"
          >
            月
          </view>
        </view>
      </view>

      <view class="px-5 pb-10 space-y-6">
        <!-- 摄入热量趋势 -->
        <view class="bg-white rounded-3xl p-6 shadow-card">
          <view class="flex justify-between items-center mb-6">
            <view>
              <text class="text-sm font-medium text-slate-500 block">摄入热量趋势</text>
              <text class="text-2xl font-bold text-slate-900">{{ averageCalories.toLocaleString() }} <text class="text-sm font-normal text-slate-400">平均 Kcal</text></text>
            </view>
            <view class="text-right">
              <text
                :class="[
                  'text-xs font-bold px-2 py-1 rounded-full',
                  weekOverWeekChange < 0 ? 'text-[#34C759] bg-[#34C759]/10' : 'text-red-500 bg-red-500/10'
                ]"
              >
                {{ weekOverWeekChange > 0 ? '+' : '' }}{{ weekOverWeekChange }}% 较上周
              </text>
            </view>
          </view>

          <!-- 柱状图 -->
          <view class="relative h-40 w-full flex items-end justify-between px-1">
            <view
              v-for="(day, index) in calorieTrend"
              :key="day.date"
              :style="{ height: getBarHeight(index) }"
              :class="[
                'w-2 rounded-t-full relative',
                day.calories > 0 ? 'bg-[#34C759]' : 'bg-slate-100',
                index === maxCaloriesIndex && day.calories > 0 ? 'bg-[#34C759]' : ''
              ]"
            >
              <view
                v-if="index === maxCaloriesIndex && day.calories > 0"
                class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-1.5 rounded-md whitespace-nowrap"
              >
                {{ day.calories }}
              </view>
            </view>
          </view>
          <view class="flex justify-between mt-3 px-0.5 text-[10px] font-medium text-slate-400">
            <text
              v-for="day in calorieTrend"
              :key="day.date"
              :class="day.dayLabel === '今天' ? 'text-[#34C759] font-bold' : ''"
            >
              {{ day.dayLabel }}
            </text>
          </view>
        </view>

        <!-- 营养平衡分布 -->
        <view>
          <view class="flex items-center justify-between mb-3 px-1">
            <text class="text-base font-bold text-slate-900">营养平衡分布</text>
          </view>
          <view class="bg-white rounded-3xl p-6 shadow-card">
            <view class="flex items-center gap-8">
              <!-- 圆环图 -->
              <view class="relative w-32 h-32 flex items-center justify-center">
                <view class="w-full h-full rounded-full border-8 border-slate-200 absolute"></view>
                <!-- 动态圆环图 -->
                <view
                  class="w-full h-full rounded-full"
                  :style="{
                    background: `conic-gradient(
                      #34C759 0deg ${nutritionDistribution.protein.percentage * 3.6}deg,
                      #FFCC00 ${nutritionDistribution.protein.percentage * 3.6}deg ${(nutritionDistribution.protein.percentage + nutritionDistribution.carbs.percentage) * 3.6}deg,
                      #FF3B30 ${(nutritionDistribution.protein.percentage + nutritionDistribution.carbs.percentage) * 3.6}deg 360deg
                    )`,
                    mask: 'radial-gradient(transparent 60%, black 61%)',
                    '-webkit-mask': 'radial-gradient(transparent 60%, black 61%)'
                  }"
                ></view>
                <view class="absolute text-center">
                  <text class="text-xs font-bold text-slate-400 block">均衡度</text>
                  <text class="text-lg font-bold text-slate-900">{{ Math.round((nutritionDistribution.protein.percentage + nutritionDistribution.carbs.percentage) / 2) }}</text>
                </view>
              </view>

              <!-- 图例 -->
              <view class="flex-1 space-y-4">
                <view class="flex items-center justify-between">
                  <view class="flex items-center gap-2">
                    <view class="w-2 h-2 rounded-full bg-[#34C759]"></view>
                    <text class="text-xs font-medium text-slate-600">蛋白质</text>
                  </view>
                  <text class="text-xs font-bold text-slate-900">{{ nutritionDistribution.protein.percentage }}%</text>
                </view>
                <view class="flex items-center justify-between">
                  <view class="flex items-center gap-2">
                    <view class="w-2 h-2 rounded-full bg-[#FFCC00]"></view>
                    <text class="text-xs font-medium text-slate-600">碳水</text>
                  </view>
                  <text class="text-xs font-bold text-slate-900">{{ nutritionDistribution.carbs.percentage }}%</text>
                </view>
                <view class="flex items-center justify-between">
                  <view class="flex items-center gap-2">
                    <view class="w-2 h-2 rounded-full bg-[#FF3B30]"></view>
                    <text class="text-xs font-medium text-slate-600">脂肪</text>
                  </view>
                  <text class="text-xs font-bold text-slate-900">{{ nutritionDistribution.fat.percentage }}%</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- AI 智能建议 -->
        <view class="space-y-3">
          <view class="flex items-center gap-2 px-1">
            <text class="material-symbols-outlined text-[#34C759] text-xl filled">auto_awesome</text>
            <text class="text-base font-bold text-slate-900">AI 智能建议</text>
          </view>
          <view class="space-y-3">
            <view
              v-for="(item, index) in aiSuggestions"
              :key="index"
              class="bg-white p-4 rounded-2xl shadow-card flex gap-4"
              :class="[
                item.color === 'amber' ? 'border-l-4 border-amber-400' : '',
                item.color === 'sage' ? 'border-l-4 border-[#34C759]' : '',
                item.color === 'sky' ? 'border-l-4 border-sky-400' : ''
              ]"
            >
              <view
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                  item.color === 'amber' ? 'bg-amber-50 text-amber-500' : '',
                  item.color === 'sage' ? 'bg-[#34C759]/10 text-[#34C759]' : '',
                  item.color === 'sky' ? 'bg-sky-50 text-sky-500' : ''
                ]"
              >
                <text class="material-symbols-outlined">{{ item.icon }}</text>
              </view>
              <view class="flex-1">
                <text class="text-sm font-bold text-slate-900 block">{{ item.title }}</text>
                <text class="text-xs text-slate-500 mt-1 leading-relaxed block">{{ item.desc }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </template>

    <BottomNav />
  </view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "",
    "navigationStyle": "custom"
  }
}
</route>

<style scoped>
.shadow-card {
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}

.filled {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
