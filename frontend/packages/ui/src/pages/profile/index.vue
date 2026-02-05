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
  <view class="page-container pb-32 overflow-y-auto">
    <view class="sticky top-0 z-30 px-6 pt-14 pb-4 bg-white/95 backdrop-blur-md flex justify-between items-center transition-all duration-300 border-b border-transparent">
      <text class="text-[28px] font-extrabold text-gray-900 tracking-tight">个人中心</text>
      <view class="flex items-center gap-3">
        <view class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary active:scale-95 transition-transform">
          <text class="material-symbols-outlined">notifications</text>
        </view>
        <view class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary active:scale-95 transition-transform">
          <text class="material-symbols-outlined">settings</text>
        </view>
      </view>
    </view>

    <view class="px-6 mt-4 mb-8">
      <view class="bg-white rounded-3xl p-5 shadow-sm border border-white/50 relative overflow-hidden group">
        <view class="absolute -right-10 -top-10 w-40 h-40 bg-gray-100 rounded-full blur-3xl opacity-60 pointer-events-none"></view>
        <view class="flex items-center gap-5 relative z-10">
          <view class="relative">
            <view class="w-[72px] h-[72px] rounded-full bg-gray-200 flex items-center justify-center text-gray-600 shadow-inner overflow-hidden border-[3px] border-white">
              <text class="material-symbols-outlined text-4xl">person</text>
            </view>
            <view class="absolute -bottom-1 -right-1 bg-gray-500 text-white p-1 rounded-full border-[2px] border-white flex items-center justify-center">
              <text class="material-symbols-outlined text-[12px]">edit</text>
            </view>
          </view>
          <view class="flex-1">
            <view class="flex items-center justify-between">
              <view>
                <text class="text-xl font-bold text-gray-900 leading-tight">Alex Chen</text>
                <text class="text-xs text-gray-500 font-medium mt-0.5">ID: 883902</text>
              </view>
            </view>
            <view class="mt-2.5 flex items-center gap-1.5 bg-gray-800 px-3 py-1.5 rounded-full shadow-lg active:scale-95 transition-all w-fit">
              <text class="material-symbols-outlined text-[16px] text-yellow-400">workspace_premium</text>
              <text class="text-[11px] font-bold tracking-wide text-white uppercase">PRO 会员</text>
              <text class="material-symbols-outlined text-[14px] text-white/60">chevron_right</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="px-6 mb-8">
      <view class="grid grid-cols-3 gap-3">
        <view class="bg-white p-3.5 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1">
          <text class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">连续记录</text>
          <view class="flex items-baseline gap-0.5">
            <text class="text-2xl font-extrabold text-gray-600">12</text>
            <text class="text-xs font-medium text-gray-400">天</text>
          </view>
        </view>
        <view class="bg-white p-3.5 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1">
          <text class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">当前体重</text>
          <view class="flex items-baseline gap-0.5">
            <text class="text-2xl font-extrabold text-gray-600">65.4</text>
            <text class="text-xs font-medium text-gray-400">kg</text>
          </view>
        </view>
        <view class="bg-white p-3.5 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1">
          <text class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">今日消耗</text>
          <view class="flex items-baseline gap-0.5">
            <text class="text-2xl font-extrabold text-gray-600">420</text>
            <text class="text-xs font-medium text-gray-400">kcal</text>
          </view>
        </view>
      </view>
    </view>

    <view class="px-6 space-y-6">
      <view class="space-y-3">
        <text class="px-1 text-xs font-bold text-gray-400 uppercase tracking-widest">目标与策略</text>
        <view class="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          <view @tap="navigateTo('/pages/onboarding/index')" class="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors group">
            <view class="flex items-center gap-3.5">
              <view class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600">
                <text class="material-symbols-outlined">flag</text>
              </view>
              <view>
                <text class="text-[15px] font-semibold text-gray-900">我的计划</text>
                <text class="text-xs text-gray-500 mt-0.5">当前: 减脂模式 (Fat Loss)</text>
              </view>
            </view>
            <text class="material-symbols-outlined text-gray-300">chevron_right</text>
          </view>
          <view @tap="navigateTo('/pages/onboarding/index')" class="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors group">
            <view class="flex items-center gap-3.5">
              <view class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                <text class="material-symbols-outlined">accessibility_new</text>
              </view>
              <view>
                <text class="text-[15px] font-semibold text-gray-900">身体数据</text>
              </view>
            </view>
            <text class="material-symbols-outlined text-gray-300">chevron_right</text>
          </view>
        </view>
      </view>

      <view class="space-y-3">
        <text class="px-1 text-xs font-bold text-gray-400 uppercase tracking-widest">成就</text>
        <view class="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          <view @tap="navigateTo('/pages/achievements/index')" class="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors group">
            <view class="flex items-center gap-3.5">
              <view class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                <text class="material-symbols-outlined">military_tech</text>
              </view>
              <view>
                <text class="text-[15px] font-semibold text-gray-900">成就勋章</text>
                <view class="flex items-center gap-1 mt-1">
                  <text class="text-xs text-gray-500">已解锁 5 枚</text>
                </view>
              </view>
            </view>
            <view class="flex items-center gap-2">
              <view class="flex -space-x-2 mr-1">
                <view class="w-5 h-5 rounded-full bg-amber-400 border-2 border-white"></view>
                <view class="w-5 h-5 rounded-full bg-gray-300 border-2 border-white"></view>
              </view>
              <text class="material-symbols-outlined text-gray-300">chevron_right</text>
            </view>
          </view>
        </view>
      </view>

      <view class="space-y-3">
        <text class="px-1 text-xs font-bold text-gray-400 uppercase tracking-widest">应用设置</text>
        <view class="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          <view class="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors group">
            <view class="flex items-center gap-3.5">
              <view class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <text class="material-symbols-outlined">notifications_active</text>
              </view>
              <view>
                <text class="text-[15px] font-semibold text-gray-900">通知提醒</text>
              </view>
            </view>
            <view class="w-10 h-6 bg-gray-500 rounded-full relative shadow-inner">
              <view class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></view>
            </view>
          </view>
          <view class="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors group">
            <view class="flex items-center gap-3.5">
              <view class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
                <text class="material-symbols-outlined">translate</text>
              </view>
              <view>
                <text class="text-[15px] font-semibold text-gray-900">语言</text>
              </view>
            </view>
            <view class="flex items-center gap-2">
              <text class="text-xs font-medium text-gray-400">简体中文</text>
              <text class="material-symbols-outlined text-gray-300">chevron_right</text>
            </view>
          </view>
        </view>
      </view>

      <view @tap="logout" class="w-full py-3.5 rounded-xl text-center text-[15px] font-semibold text-red-500 active:bg-red-50 transition-colors mb-6">
        <text>退出登录</text>
      </view>
    </view>
  </view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "我的"
  }
}
</route>

<style scoped>
/* Profile page specific styles */
</style>
