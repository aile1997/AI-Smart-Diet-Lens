<script setup lang="ts">
/**
 * 首页 - 仪表盘
 *
 * 显示今日热量环形图、健康指标卡片
 */
import { computed, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { useDashboard, useDiary } from "@diet-lens/core";
import { useAuthStore } from "@diet-lens/core";

const authStore = useAuthStore();
const { loading, error, calories, fetchDashboard } = useDashboard();
const { todayMealCount, nextMealPrompt, fetchAll: fetchDiary } = useDiary();

// 检查登录状态
const isLoggedIn = computed(() => authStore.isLoggedIn);

// 热量环形图进度计算
const circleProgress = computed(() => {
  const progress = calories.value.current / calories.value.target;
  const circumference = 2 * Math.PI * 110; // r=110
  return circumference * (1 - progress);
});

/** 餐别类型 */
type MealType = "breakfast" | "lunch" | "dinner" | "snack";

/** 根据当前时间获取推荐餐别 */
function getCurrentMealType(): MealType {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) return "breakfast";
  if (hour >= 10 && hour < 14) return "lunch";
  if (hour >= 14 && hour < 20) return "dinner";
  return "snack";
}

/** 获取餐别中文名称 */
function getMealTypeName(type: MealType): string {
  const names = {
    breakfast: "早餐",
    lunch: "午餐",
    dinner: "晚餐",
    snack: "加餐",
  };
  return names[type];
}

/** 获取中文问候语 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "早上好";
  if (hour >= 12 && hour < 18) return "下午好";
  return "晚上好";
}

/** 获取中文日期 */
function getChineseDate(): string {
  const now = new Date();
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekday = weekdays[now.getDay()];
  return `${month}月${day}日 ${weekday}`;
}

// 当前推荐餐别
const currentMealType = computed<MealType>(() => getCurrentMealType());
const currentMealName = computed(() => getMealTypeName(currentMealType.value));

// 日期和问候语
const chineseDate = computed(() => getChineseDate());
const greeting = computed(() => getGreeting());

// 用户名
const userName = computed(() => {
  // 从 authStore 或 userStore 获取用户名
  return "Alex";
});

const navigateTo = (path: string) => {
  // 判断是否为 tabBar 页面
  const tabBarPages = ["/pages/index/index", "/pages/scan/index", "/pages/diary/index", "/pages/wiki/index", "/pages/profile/index"];
  if (tabBarPages.includes(path)) {
    uni.switchTab({ url: path });
  } else {
    uni.navigateTo({ url: path });
  }
};

const logMeal = () => {
  // 跳转到拍照识别页面
  uni.switchTab({ url: "/pages/scan/index" });
};

// 跳转到烹饪助手页面（直接生成）
const goToCookingAssistant = () => {
  uni.navigateTo({
    url: "/pages/cooking-assistant/index",
  });
};

// 跳转到 AI 聊天页面（对话定制）
const goToAIChat = () => {
  uni.navigateTo({
    url: "/pages/ai-chat/index",
  });
};

// 页面加载时获取仪表盘数据
onMounted(async () => {
  if (isLoggedIn.value) {
    try {
      await Promise.all([fetchDashboard(), fetchDiary()]);
    } catch (err) {
      console.error("获取仪表盘数据失败:", err);
    }
  }
});

// 页面显示时刷新数据（从其他页面返回时触发）
onShow(async () => {
  if (isLoggedIn.value) {
    try {
      await Promise.all([fetchDashboard(), fetchDiary()]);
    } catch (err) {
      console.error("刷新仪表盘数据失败:", err);
    }
  }
});
</script>

<template>
  <view class="page-container pb-24 overflow-y-auto bg-[#F5F7F6]">
    <!-- Header -->
    <view class="flex items-center justify-between px-6 pt-12 pb-4 bg-[#F5F7F6]/90 sticky top-0 z-30 backdrop-blur-md">
      <view class="flex flex-col">
        <text class="text-xs font-semibold text-slate-500 mb-0.5">{{ chineseDate }}</text>
        <text class="text-xl font-bold text-[#0e1a13] leading-tight">{{ greeting }}，{{ userName }}</text>
      </view>
      <view class="relative group" @tap="navigateTo('/pages/profile/index')">
        <image
          src="/static/images/food/food_9.jpg"
          class="w-10 h-10 rounded-full border-2 border-white shadow-sm"
        ></image>
        <view class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-primary border-2 border-white rounded-full"></view>
      </view>
    </view>

    <!-- 未登录状态 -->
    <view v-if="!isLoggedIn" class="flex-1 px-6 py-12 flex flex-col items-center justify-center text-center">
      <text class="material-symbols-outlined text-6xl text-slate-300 mb-4">lock</text>
      <text class="text-lg font-bold text-slate-700 mb-2">请先登录</text>
      <text class="text-sm text-slate-500 mb-6">登录后查看您的健康数据</text>
      <view @tap="navigateTo('/pages/onboarding/login')" class="px-6 py-3 bg-primary text-white rounded-2xl font-bold"> 立即登录 </view>
    </view>

    <!-- 已登录状态 -->
    <view v-else class="flex-1 px-6 space-y-8">
      <!-- 加载状态 -->
      <view v-if="loading" class="flex items-center justify-center py-12">
        <text class="text-slate-400">加载中...</text>
      </view>

      <!-- 错误状态 -->
      <view v-else-if="error" class="flex items-center justify-center py-12">
        <text class="text-red-400">{{ error }}</text>
      </view>

      <!-- 正常状态 -->
      <template v-else>
        <!-- Calorie Ring -->
        <view class="flex flex-col items-center pt-4" @tap="navigateTo('/pages/diary/index')">
          <view class="relative w-72 h-72 flex items-center justify-center">
            <view class="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-20 animate-pulse"></view>
            <svg class="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 256 256">
              <circle class="text-sage-100 dark:text-sage-800/40" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" stroke-width="18"></circle>
              <circle
                class="text-primary progress-ring-circle"
                cx="128"
                cy="128"
                fill="transparent"
                r="110"
                stroke="currentColor"
                stroke-dasharray="691"
                :stroke-dashoffset="circleProgress"
                stroke-linecap="round"
                stroke-width="18"
              ></circle>
            </svg>
            <view class="absolute flex flex-col items-center justify-center text-center inset-0 z-10">
              <text class="text-slate-400 dark:text-sage-300 text-sm font-semibold uppercase tracking-widest mb-1">剩余可摄入</text>
              <text class="text-5xl font-extrabold text-[#0e1a13] dark:text-white tracking-tight">{{ calories.remaining.toLocaleString() }}</text>
              <text class="text-slate-500 dark:text-sage-300 text-sm font-medium mt-1">千卡预算</text>
            </view>
          </view>
          <view class="flex items-center justify-center gap-12 mt-[-10px] z-10">
            <view class="flex flex-col items-center group">
              <view class="w-2 h-2 rounded-full bg-primary mb-2 group-hover:scale-125 transition-transform"></view>
              <text class="text-2xl font-bold text-[#0e1a13] dark:text-white leading-none">{{ calories.current }}</text>
              <text class="text-xs font-medium text-slate-500 dark:text-sage-300 mt-1">已摄入</text>
            </view>
            <view class="w-px h-8 bg-slate-200 dark:bg-sage-800"></view>
            <view class="flex flex-col items-center group">
              <view class="w-2 h-2 rounded-full bg-slate-300 dark:bg-sage-700 mb-2 group-hover:scale-125 transition-transform"></view>
              <text class="text-2xl font-bold text-[#0e1a13] dark:text-white leading-none">{{ calories.target.toLocaleString() }}</text>
              <text class="text-xs font-medium text-slate-500 dark:text-sage-300 mt-1">目标</text>
            </view>
          </view>
        </view>

        <!-- AI Cooking Assistant -->
        <view
          class="relative w-full overflow-hidden rounded-[24px] bg-white dark:bg-[#1A2C22] border border-slate-100 dark:border-white/5 p-6 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.05)]"
        >
          <!-- 背景装饰光晕 -->
          <view class="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/10 blur-[50px] dark:bg-primary/5"></view>

          <view class="relative z-10 flex flex-col h-full">
            <!-- 标题栏 -->
            <view class="mb-3 flex items-center gap-2.5">
              <view class="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 dark:bg-primary/10">
                <text class="material-symbols-outlined text-[18px] text-primary" style="font-variation-settings: &quot;FILL&quot; 1">skillet</text>
              </view>
              <text class="text-xs font-bold uppercase tracking-wider text-primary">AI 智能烹饪助手</text>
            </view>

            <!-- 主标题 -->
            <text class="mb-2 text-xl font-extrabold leading-tight text-slate-900 dark:text-white"> AI 为你定制今日餐单 </text>

            <!-- 描述文字 -->
            <text class="mb-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              通过 AI 对话表达你的口味偏好，或直接为您智能匹配最佳营养方案。
            </text>

            <!-- 餐次提示 -->
            <text v-if="todayMealCount < 4" class="mb-4 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-lg inline-block">
              {{ nextMealPrompt }}
            </text>

            <!-- 操作按钮 -->
            <view class="mt-auto flex gap-3">
              <button
                class="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border-2 border-primary bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all after:border-none"
                hover-class="opacity-90 scale-[0.98]"
                :hover-stay-time="100"
                @tap="goToAIChat"
              >
                <text class="material-symbols-outlined text-[20px]">chat_bubble</text>
                <text>对话定制</text>
              </button>

              <button
                class="flex-1 flex-row items-center justify-center rounded-xl bg-transparent py-3.5 text-sm font-bold text-primary transition-all"
                style="border: 2px solid #e2e8f0;"
                hover-class="bg-primary/5 scale-[0.98]"
                :hover-stay-time="100"
                @tap="goToCookingAssistant"
              >
                直接生成
              </button>
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
          <view
            class="relative w-full rounded-3xl bg-white dark:bg-sage-900/30 border-2 border-dashed border-sage-200 dark:border-sage-800 p-8 flex flex-col items-center text-center"
          >
            <view class="relative w-28 h-28 mb-4">
              <view class="absolute inset-2 rounded-full border border-slate-200 dark:border-sage-700 bg-sage-50 dark:bg-sage-800/50"></view>
              <view class="absolute inset-4 rounded-full border border-slate-100 dark:border-sage-700/50 shadow-inner"></view>
              <view class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-300 dark:text-sage-600">
                <text class="material-symbols-outlined text-4xl">restaurant_menu</text>
              </view>
            </view>
            <text class="text-base font-bold text-[#0e1a13] dark:text-white mb-1">
              {{ todayMealCount === 0 ? '您的餐盘是空的' : `已记录 ${todayMealCount} 餐` }}
            </text>
            <text class="text-sm text-slate-500 dark:text-sage-400 max-w-[200px] leading-relaxed">
              {{ nextMealPrompt }}
            </text>
            <view
              @tap="logMeal"
              class="mt-5 px-5 py-2.5 rounded-full bg-sage-100 dark:bg-sage-800 text-slate-700 dark:text-sage-200 text-sm font-bold hover:bg-sage-200 dark:hover:bg-sage-700 transition-colors inline-flex items-center gap-2"
            >
              <text class="material-symbols-outlined text-lg">add</text>
              <text>记录{{ currentMealName }}</text>
            </view>
          </view>
        </view>
      </template>
    </view>
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
/* 环形进度条动画 */
.progress-ring-circle {
  transition: stroke-dashoffset 1s ease-in-out;
  transform-origin: 50% 50%;
}

/* Material Symbols 填充效果 */
.font-variation-FILL-1 {
  font-variation-settings:
    "FILL" 1,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}

/* 解决小程序 button 默认样式干扰 */
button {
  margin: 0;
  line-height: inherit;
  border-radius: 0.75rem; /* rounded-xl */
}
button::after {
  border: none;
}
</style>
