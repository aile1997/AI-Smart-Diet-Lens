<script setup lang="ts">
/**
 * 成就页面
 *
 * 显示用户成就和挑战进度
 */
import { ref, computed, onMounted } from "vue";
import { useAuthStore, useGamification } from "@diet-lens/core";

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);

const { loading, level, streakDays, achievements, progress, fetchAchievements } = useGamification();

// 返回
const navigateBack = () => {
  uni.navigateBack();
};

// 跳转到登录页
const goToLogin = () => {
  uni.navigateTo({ url: "/pages/onboarding/login" });
};

// 获取成就图标和颜色
const getAchievementStyle = (achievement: any) => {
  const iconMap: Record<string, string> = {
    减脂先锋: "fitness_center",
    营养达人: "restaurant_menu",
    热量燃烧: "local_fire_department",
    AI探索者: "smart_toy",
    马拉松: "directions_run",
    深度睡眠: "nightlight",
    早起挑战: "wb_twilight",
  };

  const colorMap: Record<string, string> = {
    减脂先锋: "bg-amber-100 text-amber-600",
    营养达人: "bg-gray-100 text-gray-600",
    热量燃烧: "bg-orange-100 text-orange-500",
    AI探索者: "bg-blue-100 text-blue-500",
    马拉松: "bg-purple-100 text-purple-500",
    深度睡眠: "bg-indigo-100 text-indigo-500",
    早起挑战: "bg-orange-100 text-orange-500",
  };

  return {
    icon: iconMap[achievement.name] || "military_tech",
    color: colorMap[achievement.name] || "bg-gray-100 text-gray-600",
  };
};

// 正在进行的挑战 (模拟数据，可从后端获取)
const currentChallenge = computed(() => ({
  name: "早起挑战",
  progress: Math.min(streakDays.value, 7),
  total: 7,
  remainingDays: Math.max(0, 7 - streakDays.value),
}));

// 页面加载时获取成就数据
onMounted(async () => {
  if (isLoggedIn.value) {
    await fetchAchievements();
  }
});
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
        <text class="text-xs font-bold text-gray-900">Lv. {{ level }}</text>
      </view>
    </view>

    <!-- 未登录提示 -->
    <view v-if="!isLoggedIn" class="flex flex-col items-center justify-center px-10 z-10" style="min-height: 50vh">
      <text class="material-symbols-outlined text-slate-300 text-5xl mb-4">lock</text>
      <text class="text-sm font-medium text-slate-600 mb-2">需要登录</text>
      <text class="text-sm text-slate-400 text-center mb-6">请先登录以查看您的成就</text>
      <view class="bg-[#34C759] text-white py-3 px-8 rounded-full font-medium" @tap="goToLogin"> 去登录 </view>
    </view>

    <template v-else>
      <!-- Loading State -->
      <view v-if="loading" class="flex flex-col items-center justify-center py-16 z-10">
        <view class="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#34C759] animate-spin"></view>
        <text class="text-sm text-slate-400 mt-4">加载中...</text>
      </view>

      <view v-else class="px-4 space-y-8 z-10 pt-4">
        <!-- 正在进行的挑战 -->
        <view v-if="streakDays > 0">
          <view class="flex justify-between items-end mb-4">
            <text class="text-xl font-bold text-gray-900">正在进行的挑战</text>
            <text class="text-primary text-sm font-semibold">查看全部</text>
          </view>
          <view class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
            <view class="absolute top-0 right-0 bg-primary/10 text-gray-600 px-2 py-1 rounded-bl-xl text-xs font-bold">
              剩{{ currentChallenge.remainingDays }}天
            </view>
            <view class="flex items-start gap-4 mb-4">
              <view class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                <text class="material-symbols-outlined text-2xl">wb_twilight</text>
              </view>
              <view>
                <text class="font-bold text-gray-900 text-base">{{ currentChallenge.name }}</text>
                <text class="text-gray-500 text-sm">已坚持 {{ currentChallenge.progress }}/{{ currentChallenge.total }} 天</text>
              </view>
            </view>
            <view class="relative">
              <view class="flex justify-between text-xs font-medium text-gray-500 mb-1.5">
                <text>进度</text>
                <text>{{ Math.round((currentChallenge.progress / currentChallenge.total) * 100) }}%</text>
              </view>
              <view class="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <view
                  class="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                  :style="{ width: (currentChallenge.progress / currentChallenge.total) * 100 + '%' }"
                ></view>
              </view>
            </view>
          </view>
        </view>

        <!-- 荣誉勋章 -->
        <view>
          <view class="flex justify-between items-center mb-6">
            <text class="text-xl font-bold text-gray-900">荣誉勋章</text>
            <text class="text-sm font-medium text-gray-400">{{ progress.unlocked }}/{{ progress.total }}</text>
          </view>

          <!-- Empty State -->
          <view v-if="achievements.length === 0" class="flex flex-col items-center justify-center py-8">
            <view class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <text class="material-symbols-outlined text-slate-300 text-3xl">military_tech</text>
            </view>
            <text class="text-slate-600 text-sm font-medium">暂无成就</text>
            <text class="text-slate-400 text-xs mt-1">开始记录饮食来解锁成就吧</text>
          </view>

          <!-- Badges Grid -->
          <view v-else class="grid grid-cols-3 gap-y-8 gap-x-4">
            <view
              v-for="achievement in achievements"
              :key="achievement.id"
              :class="['flex flex-col items-center gap-2', achievement.unlocked ? '' : 'opacity-50 grayscale']"
            >
              <view :class="['relative w-20 h-20 rounded-full flex items-center justify-center shadow-sm', achievement.unlocked ? 'bg-white' : 'bg-gray-100']">
                <view v-if="!achievement.unlocked" class="absolute inset-0 bg-gray-200/50 rounded-full flex items-center justify-center z-10">
                  <text class="material-symbols-outlined text-gray-500">lock</text>
                </view>
                <view :class="['w-16 h-16 rounded-full flex items-center justify-center', getAchievementStyle(achievement).color]">
                  <text class="material-symbols-outlined text-3xl">{{ getAchievementStyle(achievement).icon }}</text>
                </view>
              </view>
              <view class="text-center">
                <text class="text-sm font-bold text-gray-900">{{ achievement.name }}</text>
                <text class="text-[10px] text-gray-500 mt-0.5 block">{{ achievement.description }}</text>
                <text v-if="achievement.progress" class="text-[10px] text-primary mt-1 block">{{ achievement.progress }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </template>
  </scroll-view>
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
/* Achievements page specific styles */
</style>
