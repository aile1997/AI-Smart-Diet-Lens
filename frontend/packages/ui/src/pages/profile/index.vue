<script setup lang="ts">
/**
 * 个人中心页面
 *
 * 显示用户信息、成就、设置等
 */
import { ref } from 'vue'

const navigateTo = (path: string) => {
  uni.navigateTo({ url: path })
}

const logout = () => {
  uni.reLaunch({ url: '/pages/index/index' })
}
</script>

<template>
  <view class="page-container pb-32 overflow-y-auto no-scrollbar bg-gray-50">
    <!-- Header -->
    <view class="sticky top-0 z-30 px-6 pt-14 pb-4 bg-white/95 backdrop-blur-md flex justify-between items-center border-b border-transparent shrink-0">
      <text class="text-2xl font-extrabold text-gray-900 tracking-tight">个人中心</text>
      <view class="flex items-center gap-3">
        <view class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary active:scale-95 transition-transform border border-gray-100">
          <text class="material-symbols-outlined text-xl">notifications</text>
        </view>
        <view class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary active:scale-95 transition-transform border border-gray-100">
          <text class="material-symbols-outlined text-xl">settings</text>
        </view>
      </view>
    </view>

    <view class="px-6 mt-4 space-y-6">
      <!-- User Info Card -->
      <view class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
        <view class="absolute -right-10 -top-10 w-40 h-40 bg-gray-50 rounded-full blur-3xl opacity-60 pointer-events-none"></view>
        <view class="flex items-center gap-5 relative z-10">
          <view class="relative">
            <view class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shadow-inner overflow-hidden border-2 border-white">
              <text class="material-symbols-outlined text-4xl">person</text>
            </view>
            <view class="absolute -bottom-1 -right-1 bg-gray-800 text-white p-1 rounded-full border-2 border-white flex items-center justify-center">
              <text class="material-symbols-outlined text-[10px]">edit</text>
            </view>
          </view>
          <view class="flex-1 min-w-0">
            <text class="text-xl font-bold text-gray-900 leading-tight block truncate">Alex Chen</text>
            <text class="text-[10px] text-gray-500 font-medium mt-0.5 block">ID: 883902</text>
            <view class="mt-2 flex items-center gap-1.5 bg-gray-900 px-3 py-1 rounded-full w-fit active:opacity-80 transition-all">
              <text class="material-symbols-outlined text-sm text-yellow-400">workspace_premium</text>
              <text class="text-[9px] font-bold tracking-wide text-white uppercase">PRO 会员</text>
              <text class="material-symbols-outlined text-xs text-white/60">chevron_right</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Stats Grid -->
      <view class="grid grid-cols-3 gap-3">
        <view v-for="(stat, idx) in [
          { label: '连续记录', val: '12', unit: '天' },
          { label: '当前体重', val: '65.4', unit: 'kg' },
          { label: '今日消耗', val: '420', unit: 'kcal' }
        ]" :key="idx" class="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center justify-center gap-0.5">
          <text class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{{ stat.label }}</text>
          <view class="flex items-baseline gap-0.5">
            <text class="text-xl font-extrabold text-gray-800">{{ stat.val }}</text>
            <text class="text-[10px] font-medium text-gray-400">{{ stat.unit }}</text>
          </view>
        </view>
      </view>

      <!-- Menu Sections -->
      <view class="space-y-6">
        <!-- Section 1 -->
        <view class="space-y-3">
          <text class="px-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">目标与策略</text>
          <view class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50 divide-y divide-gray-50">
            <view @tap="navigateTo('/pages/onboarding/index')" class="flex items-center justify-between p-4 active:bg-gray-50 transition-colors">
              <view class="flex items-center gap-3.5 min-w-0">
                <view class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 shrink-0">
                  <text class="material-symbols-outlined text-xl">flag</text>
                </view>
                <view class="min-w-0">
                  <text class="text-sm font-semibold text-gray-900 block">我的计划</text>
                  <text class="text-[10px] text-gray-500 mt-0.5 block truncate">当前: 减脂模式 (Fat Loss)</text>
                </view>
              </view>
              <text class="material-symbols-outlined text-gray-300">chevron_right</text>
            </view>
            <view @tap="navigateTo('/pages/onboarding/index')" class="flex items-center justify-between p-4 active:bg-gray-50 transition-colors">
              <view class="flex items-center gap-3.5 min-w-0">
                <view class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                  <text class="material-symbols-outlined text-xl">accessibility_new</text>
                </view>
                <text class="text-sm font-semibold text-gray-900">身体数据</text>
              </view>
              <text class="material-symbols-outlined text-gray-300">chevron_right</text>
            </view>
          </view>
        </view>

        <!-- Section 2 -->
        <view class="space-y-3">
          <text class="px-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">成就系统</text>
          <view class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50">
            <view @tap="navigateTo('/pages/achievements/index')" class="flex items-center justify-between p-4 active:bg-gray-50 transition-colors">
              <view class="flex items-center gap-3.5 min-w-0">
                <view class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                  <text class="material-symbols-outlined text-xl">military_tech</text>
                </view>
                <view class="min-w-0">
                  <text class="text-sm font-semibold text-gray-900 block">成就勋章</text>
                  <text class="text-[10px] text-gray-500 mt-0.5 block">已解锁 5 枚</text>
                </view>
              </view>
              <view class="flex items-center gap-2">
                <view class="flex -space-x-2">
                  <view class="w-5 h-5 rounded-full bg-amber-400 border-2 border-white"></view>
                  <view class="w-5 h-5 rounded-full bg-gray-200 border-2 border-white"></view>
                </view>
                <text class="material-symbols-outlined text-gray-300">chevron_right</text>
              </view>
            </view>
          </view>
        </view>

        <!-- Section 3 -->
        <view class="space-y-3 pb-8">
          <text class="px-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">应用设置</text>
          <view class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50 divide-y divide-gray-50">
            <view class="flex items-center justify-between p-4 active:bg-gray-50 transition-colors">
              <view class="flex items-center gap-3.5">
                <view class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                  <text class="material-symbols-outlined text-xl">notifications_active</text>
                </view>
                <text class="text-sm font-semibold text-gray-900">通知提醒</text>
              </view>
              <view class="w-10 h-6 bg-primary rounded-full relative transition-colors">
                <view class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></view>
              </view>
            </view>
            <view class="flex items-center justify-between p-4 active:bg-gray-50 transition-colors">
              <view class="flex items-center gap-3.5">
                <view class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                  <text class="material-symbols-outlined text-xl">translate</text>
                </view>
                <text class="text-sm font-semibold text-gray-900">语言</text>
              </view>
              <view class="flex items-center gap-1">
                <text class="text-xs text-gray-400">简体中文</text>
                <text class="material-symbols-outlined text-gray-300">chevron_right</text>
              </view>
            </view>
          </view>

          <view @tap="logout" class="w-full py-4 rounded-2xl text-center text-sm font-bold text-red-500 bg-red-50/50 active:bg-red-50 transition-colors mt-4">
            退出登录
          </view>
        </view>
      </view>
    </view>
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
