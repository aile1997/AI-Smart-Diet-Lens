<script setup lang="ts">
/**
 * 成就页面
 *
 * 显示用户成就和挑战进度
 */
const navigateBack = () => {
  uni.navigateBack()
}

interface Badge {
  name: string
  sub: string
  icon: string
  color: string
  active?: boolean
  locked?: boolean
}

const badges: Badge[] = [
  { name: '减脂先锋', sub: '累计减脂5kg', icon: 'fitness_center', color: 'bg-amber-100 text-amber-600', active: true },
  { name: '营养达人', sub: '连续记录30天', icon: 'restaurant_menu', color: 'bg-gray-100 text-gray-600', active: true },
  { name: '热量燃烧', sub: '单日500kcal', icon: 'local_fire_department', color: 'bg-orange-100 text-orange-500', active: true },
  { name: 'AI探索者', sub: '识别100种食物', icon: 'smart_toy', color: 'bg-blue-100 text-blue-500', active: true },
  { name: '马拉松', sub: '累计跑42km', icon: 'directions_run', color: 'bg-gray-100 text-gray-600', locked: true },
  { name: '深度睡眠', sub: '睡眠分>90', icon: 'nightlight', color: 'bg-gray-100 text-gray-600', locked: true },
]
</script>

<template>
  <scroll-view scroll-y class="flex flex-col h-full min-h-screen bg-gray-50 pb-24 relative max-w-md mx-auto w-full">
    <!-- Background Blobs -->
    <view class="fixed top-[-20%] left-[-20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none opacity-40"></view>
    <view class="fixed bottom-[-20%] right-[-20%] w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none opacity-30"></view>

    <view class="sticky top-0 z-30 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md">
      <view @tap="navigateBack" class="w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-100 text-gray-900">
        <text class="material-symbols-outlined">arrow_back_ios_new</text>
      </view>
      <text class="text-lg font-bold text-gray-900">成就与荣誉</text>
      <view class="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
        <text class="material-symbols-outlined text-amber-500 text-base">military_tech</text>
        <text class="text-xs font-bold text-gray-900">Lv. 5</text>
      </view>
    </view>

    <view class="px-4 space-y-8 z-10 pt-4">
      <view>
        <view class="flex justify-between items-end mb-4">
          <text class="text-xl font-bold text-gray-900">正在进行的挑战</text>
          <text class="text-primary text-sm font-semibold">查看全部</text>
        </view>
        <view class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
          <view class="absolute top-0 right-0 bg-primary/10 text-gray-600 px-2 py-1 rounded-bl-xl text-xs font-bold">剩2天</view>
          <view class="flex items-start gap-4 mb-4">
            <view class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
              <text class="material-symbols-outlined text-2xl">wb_twilight</text>
            </view>
            <view>
              <text class="font-bold text-gray-900 text-lg">早起挑战</text>
              <text class="text-gray-500 text-sm">已坚持 5/7 天</text>
            </view>
          </view>
          <view class="relative">
            <view class="flex justify-between text-xs font-medium text-gray-500 mb-1.5">
              <text>进度</text>
              <text>71%</text>
            </view>
            <view class="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <view class="h-full bg-gradient-to-r from-primary to-emerald-400 w-[71%] rounded-full"></view>
            </view>
          </view>
        </view>
      </view>

      <view>
        <view class="flex justify-between items-center mb-6">
          <text class="text-xl font-bold text-gray-900">荣誉勋章</text>
          <text class="text-sm font-medium text-gray-400">12/50</text>
        </view>

        <view class="grid grid-cols-3 gap-y-8 gap-x-4">
          <view v-for="(badge, idx) in badges" :key="idx" :class="['flex flex-col items-center gap-2', badge.locked ? 'opacity-50 grayscale' : '']">
            <view :class="['relative w-20 h-20 rounded-full flex items-center justify-center shadow-sm', badge.locked ? 'bg-gray-100' : 'bg-white']">
              <view v-if="badge.locked" class="absolute inset-0 bg-gray-200/50 rounded-full flex items-center justify-center z-10">
                <text class="material-symbols-outlined text-gray-500">lock</text>
              </view>
              <view :class="['w-16 h-16 rounded-full flex items-center justify-center', badge.color]">
                <text class="material-symbols-outlined text-3xl">{{ badge.icon }}</text>
              </view>
            </view>
            <view class="text-center">
              <text class="text-sm font-bold text-gray-900">{{ badge.name }}</text>
              <text class="text-[10px] text-gray-500 mt-0.5">{{ badge.sub }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "成就"
  }
}
</route>

<style scoped>
/* Achievements page specific styles */
</style>
