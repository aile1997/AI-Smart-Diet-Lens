<script setup lang="ts">
/**
 * 个人中心页面
 *
 * 显示用户信息、成就、设置等
 */
import { useUserStore } from '@diet-lens/core'

const userStore = useUserStore()
</script>

<template>
  <view class="page-container p-4">
    <!-- 用户信息卡片 -->
    <view class="card mb-4 flex items-center gap-4">
      <view class="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
        <view class="text-2xl">
          👤
        </view>
      </view>
      <view>
        <view class="text-lg font-bold">
          {{ userStore.displayName }}
        </view>
        <view class="text-sm text-gray-500">
          每日目标: {{ userStore.dailyCalorieTarget }} kcal
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="card">
      <view class="py-3 border-b border-gray-100">
        个人资料
      </view>
      <view class="py-3 border-b border-gray-100">
        成就系统
      </view>
      <view class="py-3 border-b border-gray-100">
        设置
      </view>
      <view class="py-3">
        关于
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
