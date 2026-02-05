<script setup lang="ts">
/**
 * 欢迎页
 *
 * 首次使用时的引导页面
 */
const navigateToHome = () => {
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<template>
  <view class="w-full h-screen flex flex-col items-center justify-center bg-gray-50 p-6 max-w-md mx-auto">
    <view class="text-center space-y-8">
      <view>
        <text class="material-symbols-outlined text-8xl text-primary">auto_awesome</text>
      </view>
      <view>
        <text class="text-3xl font-bold text-gray-900 mb-4">欢迎来到 AI Smart Diet</text>
        <text class="text-gray-500 text-lg mb-6">开始您的健康饮食之旅</text>
      </view>
      <view
        @tap="navigateToHome"
        class="px-8 py-4 bg-primary text-gray-900 font-bold text-lg rounded-2xl shadow-lg active:opacity-80"
      >
        <text>开始使用</text>
      </view>
    </view>
  </view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "欢迎",
    "navigationStyle": "custom"
  }
}
</route>

<style scoped>
/* Onboarding page specific styles */
</style>
