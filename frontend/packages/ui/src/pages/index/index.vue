<script setup lang="ts">
/**
 * 首页 - 仪表盘
 *
 * 显示今日热量环形图、健康指标卡片
 */
import { ref, computed } from 'vue'

// 卡路里数据
const consumed = ref(530)
const target = ref(2200)
const remaining = computed(() => target.value - consumed.value)

const navigateTo = (path: string) => {
  uni.navigateTo({ url: path })
}

const addWater = () => {
  // 添加水分逻辑
  console.log('Added water')
}
</script>

<template>
  <view class="page-container pb-24 overflow-y-auto">
    <!-- Header -->
    <view class="flex items-center justify-between px-6 pt-12 pb-4 bg-gray-50/90 sticky top-0 z-30 backdrop-blur-md">
      <view class="flex flex-col">
        <text class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">周一, 11月 24日</text>
        <text class="text-2xl font-bold text-slate-900 leading-tight">早安, Alex</text>
      </view>
      <view class="relative group" @tap="navigateTo('/pages/profile/index')">
        <image src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4ARIueyn7oeLTPKejOMX_pPCmp0S85Xj29ku1HwdDtPDdRoJLpgvSEU23aY8xES40OHagpkPIqfDk5h8PItc2_ZuNCkUoO83GnslRZ4Gx9UhngYaK5meHb23uRdd1Ue7r6Bjz93OPt83tMVKCviO5oMtJvKgZOPTe5t_pOF9YKnKnqVpqMMP0f3XfNWt1iZ5Kc46ID7smBu2WqYsT__xkslaaSj5fpZsEypEKjwo_BMUp4cmuwKUxEHETmtlH3YOqCR9fNO3K127-" class="w-10 h-10 rounded-full border-2 border-white shadow-sm"></image>
        <view class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-primary border-2 border-white rounded-full"></view>
      </view>
    </view>

    <view class="flex-1 px-6 space-y-8">
      <!-- Calorie Ring -->
      <view class="flex flex-col items-center pt-4" @tap="navigateTo('/pages/diary/index')">
        <view class="relative w-64 h-64 flex items-center justify-center">
          <view class="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-30 animate-pulse"></view>
          <svg class="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 256 256">
            <circle class="text-sage-100" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" stroke-width="18"></circle>
            <circle class="text-primary transition-all duration-1000 ease-out" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" stroke-dasharray="691" stroke-dashoffset="200" stroke-linecap="round" stroke-width="18"></circle>
          </svg>
          <view class="absolute flex flex-col items-center justify-center text-center inset-0 z-10">
            <text class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">剩余</text>
            <text class="text-5xl font-extrabold text-slate-900 tracking-tight">{{ remaining }}</text>
            <text class="text-slate-500 text-xs font-medium mt-1">Kcal 预算</text>
          </view>
        </view>
        <view class="flex items-center justify-center gap-12 mt-[-10px] z-10">
          <view class="flex flex-col items-center">
            <view class="w-2 h-2 rounded-full bg-primary mb-2"></view>
            <text class="text-xl font-bold text-slate-900 leading-none">{{ consumed }}</text>
            <text class="text-xs font-medium text-slate-500 mt-1">已摄入</text>
          </view>
          <view class="w-px h-8 bg-slate-200"></view>
          <view class="flex flex-col items-center">
            <view class="w-2 h-2 rounded-full bg-slate-300 mb-2"></view>
            <text class="text-xl font-bold text-slate-900 leading-none">{{ target }}</text>
            <text class="text-xs font-medium text-slate-500 mt-1">目标</text>
          </view>
        </view>
      </view>

      <!-- Metric Grid -->
      <view class="grid grid-cols-2 gap-4">
        <view class="p-5 bg-white rounded-3xl border border-sage-100 shadow-card flex flex-col justify-between h-40 relative overflow-hidden active:scale-[0.98] transition-transform" @tap="navigateTo('/pages/achievements/index')">
          <view class="absolute top-2 right-2 p-2 opacity-10">
            <text class="material-symbols-outlined text-6xl">footprint</text>
          </view>
          <view class="flex items-center gap-2 mb-2">
            <text class="material-symbols-outlined text-primary text-xl">footprint</text>
            <text class="text-sm font-bold text-slate-700">步数</text>
          </view>
          <view>
            <text class="text-2xl font-bold text-slate-900">4,200</text>
            <text class="text-xs text-slate-500 mb-3">/ 10,000</text>
            <view class="h-1.5 w-full bg-sage-50 rounded-full overflow-hidden">
              <view class="h-full bg-primary rounded-full" style="width: 42%"></view>
            </view>
          </view>
        </view>

        <view class="p-5 bg-[#ebf7fd] rounded-3xl border border-transparent shadow-card flex flex-col justify-between h-40 relative overflow-hidden">
          <view class="absolute top-2 right-2 p-2 opacity-10">
            <text class="material-symbols-outlined text-6xl text-sky-500">water_drop</text>
          </view>
          <view class="flex items-center gap-2 mb-2">
            <text class="material-symbols-outlined text-sky-500 text-xl">water_drop</text>
            <text class="text-sm font-bold text-slate-700">水分</text>
          </view>
          <view class="flex items-end justify-between">
            <view>
              <text class="text-2xl font-bold text-slate-900">4</text>
              <text class="text-xs text-slate-500">/ 8 杯</text>
            </view>
            <view @tap="addWater" class="bg-white text-sky-500 rounded-full w-8 h-8 flex items-center justify-center shadow-sm active:scale-95 transition-transform">
              <text class="material-symbols-outlined text-lg font-bold">add</text>
            </view>
          </view>
        </view>

        <view class="p-5 bg-[#f0f0fa] rounded-3xl border border-transparent shadow-card flex flex-col justify-between h-40 relative overflow-hidden">
          <view class="absolute top-2 right-2 p-2 opacity-10">
            <text class="material-symbols-outlined text-6xl text-indigo-500">bedtime</text>
          </view>
          <view class="flex items-center gap-2 mb-2">
            <text class="material-symbols-outlined text-indigo-500 text-xl">bedtime</text>
            <text class="text-sm font-bold text-slate-700">睡眠</text>
          </view>
          <view>
            <text class="text-2xl font-bold text-slate-900">7</text>
            <text class="text-base text-slate-500 font-medium">h</text>
            <text class="text-2xl font-bold text-slate-900"> 20</text>
            <text class="text-base text-slate-500 font-medium">m</text>
            <view class="text-xs text-indigo-500 font-bold mt-1 flex items-center gap-1">
              <text class="material-symbols-outlined text-[10px]">trending_up</text>
              <text>恢复佳</text>
            </view>
          </view>
        </view>

        <view class="p-5 bg-[#fff8e6] rounded-3xl border border-transparent shadow-card flex flex-col justify-between h-40 relative overflow-hidden">
          <view class="absolute top-2 right-2 p-2 opacity-10">
            <text class="material-symbols-outlined text-6xl text-amber-500">sentiment_satisfied</text>
          </view>
          <view class="flex items-center gap-2 mb-2">
            <text class="material-symbols-outlined text-amber-500 text-xl">sentiment_satisfied</text>
            <text class="text-sm font-bold text-slate-700">心情</text>
          </view>
          <view>
            <text class="text-xl font-bold text-slate-900">精力充沛</text>
            <text class="text-xs text-slate-500 mt-1">10:30 AM</text>
          </view>
        </view>
      </view>

      <!-- Meal Log Empty State -->
      <view class="pb-8">
        <view class="flex items-center justify-between mb-4 px-1">
          <text class="text-lg font-bold text-slate-900">今日餐食</text>
          <view @tap="navigateTo('/pages/diary/index')" class="text-primary text-sm font-bold">查看全部</view>
        </view>

        <!-- Quick Access to Recipe -->
        <view @tap="navigateTo('/pages/recipe-detail/index')" class="w-full rounded-3xl bg-white border border-sage-100 p-4 flex gap-4 items-center shadow-card active:scale-[0.98] transition-transform">
          <image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjzSEoi6HdN7_oDhZ1YSC_cxw8HLvaz15PmOoZBhJsWUfsRtTFhRh0iWcGq1oJQXIxGnh7carV5qEUHOSau3MVSUpBLpVF--Fogwn__vECHTzsWfbZlYMQJIlKW7lgGNreZra2Ga9iwmn7Azn2t2Ecn9kcjULEF6NLAIeMe5RViTl-EbsQHB4hjYpTN6tY3Y6TLXHfKSit9IHrF3U0nPTpNsq1K2fYBboezJt3N7KntyVDDB64o-U2V05l46-OFzFTwW9dpUxYEQuq" class="w-20 h-20 bg-cover bg-center rounded-2xl"></image>
          <view class="flex-1">
            <view class="flex items-center gap-2 mb-1">
              <text class="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-[10px] font-bold">推荐食谱</text>
              <text class="text-[10px] text-slate-400">450 kcal</text>
            </view>
            <text class="text-base font-bold text-slate-900 leading-tight mb-1">香煎三文鱼配芦笋</text>
            <text class="text-xs text-slate-500">15分钟快手菜 · 优质蛋白</text>
          </view>
          <view class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <text class="material-symbols-outlined text-slate-400">chevron_right</text>
          </view>
        </view>

        <!-- Empty State -->
        <view class="w-full mt-4 rounded-3xl bg-white border-2 border-dashed border-sage-200 p-8 flex flex-col items-center text-center">
          <view class="w-20 h-20 bg-sage-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
            <text class="material-symbols-outlined text-4xl">restaurant_menu</text>
          </view>
          <text class="text-base font-bold text-slate-900 mb-1">您的日记还没满</text>
          <text class="text-sm text-slate-500 max-w-[200px] leading-relaxed mb-5">
            记录您的第一餐以解锁个性化建议。
          </text>
          <view @tap="navigateTo('/pages/scan/index')" class="px-6 py-2.5 rounded-full bg-sage-100 text-slate-700 text-sm font-bold inline-flex items-center gap-2">
            <text class="material-symbols-outlined text-lg">add</text>
            <text>记录早餐</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "AI Smart Diet Lens",
    "navigationStyle": "default"
  }
}
</route>

<style scoped>
/* Home page specific styles */
</style>
