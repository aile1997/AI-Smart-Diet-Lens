<script setup lang="ts">
/**
 * 识别失败页面
 *
 * AI 识别失败时的处理界面
 */
import { ref } from 'vue'

// 返回上一页
const navigateBack = () => {
  uni.navigateBack()
}

// 手动输入 - 跳转到搜索页面
const manualInput = () => {
  // TODO: 跳转到手动输入/搜索食物页面
  uni.navigateTo({
    url: '/pages/wiki/index'
  })
}

// 重新拍摄 - 跳回拍照页面
const retakePhoto = () => {
  uni.switchTab({
    url: '/pages/scan/index'
  })
}
</script>

<template>
  <view class="h-screen w-full flex flex-col bg-[#F6F8F7]">
    <!-- Top App Bar -->
    <view class="flex items-center p-4 sticky top-0 z-10 bg-[#F6F8F7]/80 backdrop-blur-md">
      <view @tap="navigateBack" class="flex items-center justify-center w-10 h-10 rounded-full active:bg-black/5 transition-colors">
        <text class="material-symbols-outlined text-2xl">arrow_back</text>
      </view>
    </view>

    <!-- Main Content Area -->
    <view class="flex-1 flex flex-col items-center justify-center px-6 pb-24 relative">
      <!-- Illustration Container -->
      <view class="relative w-full aspect-square max-w-[320px] mb-8 flex items-center justify-center">
        <!-- Abstract shapes for premium feel -->
        <view class="absolute inset-0 bg-[#38e07b]/5 dark:bg-[#38e07b]/10 rounded-full blur-3xl transform scale-90"></view>
        <view class="relative z-10 w-full h-full rounded-2xl overflow-hidden bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 flex items-center justify-center">
          <!-- Blurred food image -->
          <image
            src="https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_30.jpg?imageMogr2/format/webp/quality/85"
            class="bg-center bg-no-repeat bg-cover w-full h-full opacity-60"
            mode="aspectFill"
          />
          <view class="absolute inset-0 bg-gradient-to-t from-[#F6F8F7] via-transparent to-transparent"></view>
        </view>

        <!-- Floating Icon Badge -->
        <view class="absolute -bottom-4 bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center z-20">
          <text class="material-symbols-outlined text-[#38e07b] text-3xl">broken_image</text>
        </view>
      </view>

      <!-- Status Message -->
      <view class="text-center space-y-3 max-w-[280px]">
        <text class="text-xl font-extrabold tracking-tight text-[#0e1a13] dark:text-white">
          识别失败
        </text>
        <text class="text-sm font-medium text-[#5c6f62] dark:text-[#a3b8aa] leading-relaxed">
          未识别出食物，请尝试更好的光线或手动搜索。
        </text>
      </view>
    </view>

    <!-- Bottom Actions -->
    <view class="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#F6F8F7] via-[#F6F8F7] to-transparent pb-8">
      <view class="flex flex-col gap-3 max-w-md mx-auto w-full">
        <!-- Primary Action -->
        <view
          @tap="manualInput"
          class="group flex w-full cursor-pointer items-center justify-center rounded-2xl h-14 px-5 bg-[#38e07b] hover:bg-[#2ec268] active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg shadow-[#38e07b]/20"
        >
          <text class="material-symbols-outlined mr-2 text-[#0e1a13] text-xl group-hover:scale-110 transition-transform">edit_note</text>
          <text class="text-[#0e1a13] text-lg font-bold tracking-wide">手动输入</text>
        </view>

        <!-- Secondary Action -->
        <view
          @tap="retakePhoto"
          class="flex w-full cursor-pointer items-center justify-center rounded-2xl h-14 px-5 bg-transparent border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 active:scale-[0.98] transition-all duration-200 text-[#5c6f62] dark:text-[#a3b8aa] hover:text-[#0e1a13] dark:hover:text-white"
        >
          <text class="material-symbols-outlined mr-2 text-xl">cached</text>
          <text class="text-base font-bold tracking-wide">重新拍摄</text>
        </view>
      </view>
    </view>
  </view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "识别失败",
    "navigationStyle": "custom"
  }
}
</route>

<style scoped>
/* 识别失败页面特定样式 */
</style>
