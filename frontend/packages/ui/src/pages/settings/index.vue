<script setup lang="ts">
/**
 * 系统设置页面
 *
 * 个人信息、同步设置、通知权限、缓存管理
 */
import { ref } from 'vue'
import BottomNav from '@/components/BottomNav.vue'

// 返回
const navigateBack = () => {
  uni.navigateBack()
}

// Apple Health 同步开关
const syncAppleHealth = ref(true)

// 切换开关
const toggleSync = () => {
  syncAppleHealth.value = !syncAppleHealth.value
  uni.showToast({
    title: syncAppleHealth.value ? '已开启同步' : '已关闭同步',
    icon: 'none'
  })
}

// 点击菜单项
const handleMenuClick = (type: string) => {
  switch (type) {
    case 'profile':
      uni.showToast({ title: '个人信息修改', icon: 'none' })
      break
    case 'notifications':
      uni.showToast({ title: '通知权限已开启', icon: 'none' })
      break
    case 'cache':
      uni.showModal({
        title: '清除缓存',
        content: '确定要清除缓存吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '缓存已清除', icon: 'success' })
          }
        }
      })
      break
  }
}

// 缓存大小
const cacheSize = ref('24.5 MB')

// App 版本
const appVersion = ref('v1.0.4')
</script>

<template>
  <view class="page-container pb-24 overflow-y-auto no-scrollbar bg-[#F5F7F8]">
    <!-- Header -->
    <view class="sticky top-0 z-30 bg-[#F5F7F8]/90 backdrop-blur-md border-b border-transparent">
      <view class="flex flex-col gap-2 px-4 pb-2 pt-2">
        <view @tap="navigateBack" class="flex items-center h-10 justify-between">
          <view class="flex items-center gap-1 text-[#34C759]">
            <text class="material-symbols-outlined -ml-2">arrow_back_ios_new</text>
            <text class="text-base font-medium">设置</text>
          </view>
        </view>
        <text class="text-slate-900 tracking-tight text-[32px] font-bold leading-tight">系统设置</text>
      </view>
    </view>

    <view class="flex flex-col gap-6 mt-4">
      <!-- 个人信息 -->
      <view class="mx-4 overflow-hidden rounded-xl bg-white shadow-card">
        <view
          @tap="handleMenuClick('profile')"
          class="flex items-center justify-between p-4 active:bg-slate-50 transition-colors"
        >
          <view class="flex items-center gap-4 overflow-hidden">
            <view class="flex items-center justify-center rounded-lg bg-[#34C759]/10 w-8 h-8 text-[#34C759]">
              <text class="material-symbols-outlined filled text-[20px]">person</text>
            </view>
            <text class="text-slate-900 text-base font-medium truncate">个人信息修改</text>
          </view>
          <view class="flex items-center">
            <text class="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</text>
          </view>
        </view>
      </view>

      <!-- 同步与通知 -->
      <view class="mx-4 overflow-hidden rounded-xl bg-white shadow-card flex flex-col">
        <!-- Apple Health 同步 -->
        <view class="flex items-center justify-between p-4 border-b border-slate-100">
          <view class="flex items-center gap-4 overflow-hidden">
            <view class="flex items-center justify-center rounded-lg bg-[#34C759]/10 w-8 h-8 text-[#34C759]">
              <text class="material-symbols-outlined filled text-[20px]">favorite</text>
            </view>
            <text class="text-slate-900 text-base font-medium truncate">同步 Apple Health</text>
          </view>
          <view @tap="toggleSync" class="relative flex h-[31px] w-[51px] items-center rounded-full p-0.5 transition-colors duration-300" :class="syncAppleHealth ? 'bg-[#34C759] justify-end' : 'bg-slate-200 justify-start'">
            <view class="h-full w-[27px] rounded-full bg-white shadow-sm"></view>
          </view>
        </view>

        <!-- 通知权限 -->
        <view
          @tap="handleMenuClick('notifications')"
          class="flex items-center justify-between p-4 active:bg-slate-50 transition-colors"
        >
          <view class="flex items-center gap-4 overflow-hidden">
            <view class="flex items-center justify-center rounded-lg bg-[#34C759]/10 w-8 h-8 text-[#34C759]">
              <text class="material-symbols-outlined filled text-[20px]">notifications</text>
            </view>
            <text class="text-slate-900 text-base font-medium truncate">通知权限</text>
          </view>
          <view class="flex items-center gap-2">
            <text class="text-slate-500 text-sm font-medium">已开启</text>
            <text class="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</text>
          </view>
        </view>
      </view>

      <!-- 清除缓存 -->
      <view class="mx-4 overflow-hidden rounded-xl bg-white shadow-card">
        <view
          @tap="handleMenuClick('cache')"
          class="flex items-center justify-between p-4 active:bg-slate-50 transition-colors"
        >
          <view class="flex items-center gap-4 overflow-hidden">
            <view class="flex items-center justify-center rounded-lg bg-[#34C759]/10 w-8 h-8 text-[#34C759]">
              <text class="material-symbols-outlined text-[20px]">cleaning_services</text>
            </view>
            <text class="text-slate-900 text-base font-medium truncate">清除缓存</text>
          </view>
          <view class="flex items-center gap-2">
            <text class="text-slate-500 text-sm font-medium">{{ cacheSize }}</text>
            <text class="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</text>
          </view>
        </view>
      </view>

      <!-- Footer -->
      <view class="mt-6 flex flex-col items-center justify-center gap-2 px-4 pb-8">
        <view class="h-16 w-16 rounded-[14px] bg-white shadow-sm flex items-center justify-center mb-2 overflow-hidden border border-slate-100">
          <view class="h-full w-full bg-gradient-to-br from-blue-400 to-[#34C759] flex items-center justify-center">
            <text class="material-symbols-outlined text-white text-[32px]">local_dining</text>
          </view>
        </view>
        <text class="text-sm font-semibold text-slate-900">AI Smart-Diet Lens</text>
        <text class="text-xs text-slate-400 font-medium">版本 {{ appVersion }}</text>
      </view>
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
.shadow-card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.filled {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
