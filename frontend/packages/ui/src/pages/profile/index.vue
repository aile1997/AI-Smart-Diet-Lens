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

const navigateToMessages = () => {
  uni.navigateTo({
    url: '/pages/messages/index'
  })
}

const navigateToSettings = () => {
  uni.showToast({
    title: '设置页面',
    icon: 'none'
  })
}

const logout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.reLaunch({ url: '/pages/index/index' })
      }
    }
  })
}

// 统计数据
const stats = ref([
  { label: '连续记录', value: '12', unit: '天' },
  { label: '当前体重', value: '65.4', unit: 'kg' },
  { label: '今日消耗', value: '420', unit: 'kcal' }
])

// 我的互动菜单
const interactionMenus = ref([
  {
    icon: 'favorite',
    iconFilled: true,
    label: '我的收藏',
    color: 'red',
    path: '/pages/favorites/index'
  },
  {
    icon: 'article',
    iconFilled: false,
    label: '我的发布',
    color: 'indigo',
    path: '/pages/my-posts/index'
  },
  {
    icon: 'rate_review',
    iconFilled: false,
    label: '我的评价',
    color: 'emerald',
    path: '/pages/my-reviews/index'
  }
])

// 目标与策略菜单
const strategyMenus = ref([
  {
    icon: 'flag',
    iconFilled: false,
    label: '我的计划',
    desc: '当前: 减脂模式 (Fat Loss)',
    color: 'sage',
    path: '/pages/onboarding/index'
  },
  {
    icon: 'accessibility_new',
    iconFilled: false,
    label: '身体数据',
    desc: '',
    color: 'orange',
    path: '/pages/onboarding/body-metrics'
  }
])

// 成就菜单
const achievementMenu = ref({
  icon: 'military_tech',
  iconFilled: true,
  label: '成就勋章',
  desc: '已解锁 5 枚',
  color: 'amber',
  path: '/pages/achievements/index',
  unlocked: 5
})

// 应用设置菜单
const settingMenus = ref([
  {
    icon: 'notifications_active',
    iconFilled: false,
    label: '通知提醒',
    desc: '',
    color: 'blue',
    type: 'toggle',
    value: true
  },
  {
    icon: 'translate',
    iconFilled: false,
    label: '语言',
    desc: '简体中文',
    color: 'gray',
    type: 'select'
  }
])

// 切换开关
const toggleSwitch = (index: number) => {
  settingMenus.value[index].value = !settingMenus.value[index].value
}

// 点击菜单项
const handleMenuClick = (item: any) => {
  if (item.path) {
    navigateTo(item.path)
  }
}
</script>

<template>
  <view class="relative w-full min-h-screen pb-28 bg-[#F5F7F8]">
    <!-- Header -->
    <view class="sticky top-0 z-30 px-6 pt-14 pb-4 bg-[#F5F7F8]/90 backdrop-blur-md flex justify-between items-center">
      <text class="text-[28px] font-extrabold text-[#273936] tracking-tight">个人中心</text>
      <view class="flex items-center gap-3">
        <view @tap="navigateToMessages" class="relative w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#5a847b] active:scale-95 transition-transform">
          <text class="material-symbols-outlined">notifications</text>
          <view class="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></view>
        </view>
        <view @tap="navigateToSettings" class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#5a847b] active:scale-95 transition-transform">
          <text class="material-symbols-outlined">settings</text>
        </view>
      </view>
    </view>

    <view class="px-6 mt-4 mb-8">
      <!-- User Info Card -->
      <view class="bg-white rounded-3xl p-5 shadow-soft border border-white/50 relative overflow-hidden">
        <view class="absolute -right-10 -top-10 w-40 h-40 bg-[#e3ebe5] dark:bg-[#38544d]/50 rounded-full blur-3xl opacity-60 pointer-events-none"></view>
        <view class="flex items-center gap-5 relative z-10">
          <view class="relative">
            <view class="w-[72px] h-[72px] rounded-full bg-[#c5d8cb] flex items-center justify-center text-[#5a847b] shadow-inner overflow-hidden border-[3px] border-white">
              <text class="material-symbols-outlined text-4xl filled">person</text>
            </view>
            <view class="absolute -bottom-1 -right-1 bg-[#5a847b] text-white p-1 rounded-full border-[2px] border-white flex items-center justify-center">
              <text class="material-symbols-outlined text-[12px]">edit</text>
            </view>
          </view>
          <view class="flex-1">
            <view class="flex items-center justify-between">
              <view>
                <text class="text-xl font-bold text-[#1C1C1E] leading-tight">Alex Chen</text>
                <text class="text-xs text-[#5a847b] font-medium mt-0.5 block">ID: 883902</text>
              </view>
            </view>
            <view class="mt-2.5 flex items-center gap-1.5 bg-[#2f4540] px-3 py-1.5 rounded-full shadow-lg active:scale-95 transition-all w-fit">
              <text class="material-symbols-outlined text-[16px] text-[#d4b368] filled">workspace_premium</text>
              <text class="text-[11px] font-bold tracking-wide text-white uppercase">PRO 会员</text>
              <text class="material-symbols-outlined text-[14px] text-white/60">chevron_right</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="px-6 mb-8">
      <!-- Stats Grid -->
      <view class="grid grid-cols-3 gap-3">
        <view v-for="(stat, idx) in stats" :key="idx" class="bg-white p-3.5 rounded-2xl shadow-soft flex flex-col items-center justify-center gap-1">
          <text class="text-[10px] font-bold text-[#769f96] uppercase tracking-wider">{{ stat.label }}</text>
          <view class="flex items-baseline gap-0.5">
            <text class="text-2xl font-extrabold text-[#5a847b]">{{ stat.value }}</text>
            <text class="text-xs font-medium text-[#769f96]">{{ stat.unit }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="px-6 space-y-6">
      <!-- 我的互动 -->
      <view class="space-y-3">
        <text class="px-1 text-xs font-bold text-[#769f96] uppercase tracking-widest">我的互动</text>
        <view class="bg-white rounded-2xl shadow-soft overflow-hidden divide-y divide-gray-50">
          <view
            v-for="(item, index) in interactionMenus"
            :key="index"
            @tap="handleMenuClick(item)"
            class="flex items-center justify-between p-4 active:bg-[#f4f7f5] transition-colors"
          >
            <view class="flex items-center gap-3.5">
              <view :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                item.color === 'red' ? 'bg-red-50 text-red-500' : '',
                item.color === 'indigo' ? 'bg-indigo-50 text-indigo-500' : '',
                item.color === 'emerald' ? 'bg-emerald-50 text-emerald-500' : ''
              ]">
                <text class="material-symbols-outlined" :class="item.iconFilled ? 'filled' : ''">{{ item.icon }}</text>
              </view>
              <text class="text-[15px] font-semibold text-[#1C1C1E]">{{ item.label }}</text>
            </view>
            <text class="material-symbols-outlined text-gray-300">chevron_right</text>
          </view>
        </view>
      </view>

      <!-- 目标与策略 -->
      <view class="space-y-3">
        <text class="px-1 text-xs font-bold text-[#769f96] uppercase tracking-widest">目标与策略</text>
        <view class="bg-white rounded-2xl shadow-soft overflow-hidden divide-y divide-gray-50">
          <view
            v-for="(item, index) in strategyMenus"
            :key="index"
            @tap="handleMenuClick(item)"
            class="flex items-center justify-between p-4 active:bg-[#f4f7f5] transition-colors"
          >
            <view class="flex items-center gap-3.5 min-w-0 flex-1">
              <view :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                item.color === 'sage' ? 'bg-[#f4f7f5] text-[#5a847b]' : '',
                item.color === 'orange' ? 'bg-orange-50 text-orange-500' : ''
              ]">
                <text class="material-symbols-outlined">{{ item.icon }}</text>
              </view>
              <view class="min-w-0">
                <text class="text-[15px] font-semibold text-[#1C1C1E] block">{{ item.label }}</text>
                <text v-if="item.desc" class="text-xs text-[#5a847b] mt-0.5 block truncate">{{ item.desc }}</text>
              </view>
            </view>
            <text class="material-symbols-outlined text-gray-300 shrink-0">chevron_right</text>
          </view>
        </view>
      </view>

      <!-- 成就 -->
      <view class="space-y-3">
        <text class="px-1 text-xs font-bold text-[#769f96] uppercase tracking-widest">成就</text>
        <view class="bg-white rounded-2xl shadow-soft overflow-hidden">
          <view @tap="handleMenuClick(achievementMenu)" class="flex items-center justify-between p-4 active:bg-[#f4f7f5] transition-colors">
            <view class="flex items-center gap-3.5 min-w-0">
              <view class="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <text class="material-symbols-outlined filled">military_tech</text>
              </view>
              <view class="min-w-0">
                <text class="text-[15px] font-semibold text-[#1C1C1E] block">{{ achievementMenu.label }}</text>
                <view class="flex items-center gap-1 mt-1">
                  <text class="text-xs text-[#5a847b]">已解锁 {{ achievementMenu.unlocked }} 枚</text>
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

      <!-- 应用设置 -->
      <view class="space-y-3">
        <text class="px-1 text-xs font-bold text-[#769f96] uppercase tracking-widest">应用设置</text>
        <view class="bg-white rounded-2xl shadow-soft overflow-hidden divide-y divide-gray-50">
          <!-- 通知提醒 -->
          <view class="flex items-center justify-between p-4">
            <view class="flex items-center gap-3.5">
              <view class="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                <text class="material-symbols-outlined">notifications_active</text>
              </view>
              <text class="text-[15px] font-semibold text-[#1C1C1E]">通知提醒</text>
            </view>
            <view @tap="toggleSwitch(0)" class="w-10 h-6 bg-[#5a847b] rounded-full relative shadow-inner">
              <view class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></view>
            </view>
          </view>
          <!-- 语言 -->
          <view class="flex items-center justify-between p-4 active:bg-[#f4f7f5] transition-colors">
            <view class="flex items-center gap-3.5">
              <view class="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center">
                <text class="material-symbols-outlined">translate</text>
              </view>
              <text class="text-[15px] font-semibold text-[#1C1C1E]">语言</text>
            </view>
            <view class="flex items-center gap-2">
              <text class="text-xs font-medium text-gray-400">简体中文</text>
              <text class="material-symbols-outlined text-gray-300">chevron_right</text>
            </view>
          </view>
        </view>

        <view @tap="logout" class="w-full py-3.5 rounded-xl text-center text-[15px] font-semibold text-red-500 bg-red-50/50 active:bg-red-50 transition-colors">
          退出登录
        </view>
      </view>
    </view>
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
/* 个人中心页面特定样式 */
</style>
