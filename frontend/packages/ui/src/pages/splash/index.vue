<script setup lang="ts">
/**
 * 启动页
 *
 * 应用启动时的欢迎屏幕
 */
import { onMounted } from 'vue'

onMounted(() => {
  // 模拟启动页延迟
  const timer = setTimeout(() => {
    uni.redirectTo({ url: '/pages/onboarding/index' })
  }, 2000)

  return () => clearTimeout(timer)
})
</script>

<template>
  <view class="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/20 to-gray-50 max-w-md mx-auto">
    <view class="text-center">
      <view class="mb-8">
        <text class="material-symbols-outlined text-8xl text-primary">nutrition</text>
      </view>
      <text class="text-4xl font-bold text-gray-900 mb-2">AI Smart Diet</text>
      <text class="text-gray-500 text-lg">您的个人健康食谱助手</text>
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
/* Splash page specific styles */
</style>
