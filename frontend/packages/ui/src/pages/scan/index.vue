<script setup lang="ts">
/**
 * 拍照识别页面
 *
 * 模拟相机取景器和 AI 识别动画
 */
import { ref, onMounted, onUnmounted } from 'vue'

const scanned = ref(false)
let timer: number | undefined

onMounted(() => {
  timer = setTimeout(() => {
    scanned.value = true
  }, 2500)
})

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})

const navigateBack = () => {
  uni.navigateBack()
}

const navigateToResult = () => {
  uni.navigateTo({ url: '/pages/food-result/index' })
}
</script>

<template>
  <view class="relative h-screen w-full bg-black overflow-hidden">
    <!-- Background Camera Feed (Simulated) -->
    <view class="absolute inset-0 z-0">
      <image
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP9ZqyvoNOkfUKn5kUom1CwhefOCGiIdSYFYymfFT1VUmw6O-k3omUWe5luc3WeEs-uBCmKtQLsTg9IQUkb8xHVOQ56ozg4Bawg1pQQlmj5rbvHS-AfoduqbnrupeBU1FNX3owz6befdRHYWoSgOlr-sLcpQ56f2KWbRzjXJ-VhuvxilFUGTrGIqZ9IF8h1_Vfe_BM05yXui0Ce61rsDJ8s_CMrdJuhmJTLq1siOmcBk7hCVEmEOxTQ8D2IlzGIoiDE4377mGFAy63"
        class="w-full h-full opacity-90"
        mode="aspectFill"
      />
      <view class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></view>
    </view>

    <!-- Controls -->
    <view class="relative z-10 flex flex-col h-full justify-between py-12 px-4">
      <!-- Top Bar -->
      <view class="flex justify-between items-center w-full">
        <view @tap="navigateBack" class="flex items-center justify-center w-10 h-10 rounded-full bg-black/30 text-white border border-white/20">
          <text class="material-symbols-outlined">close</text>
        </view>
        <view class="flex gap-4">
          <view class="flex items-center justify-center w-10 h-10 rounded-full bg-black/30 text-white border border-white/20">
            <text class="material-symbols-outlined">flash_on</text>
          </view>
        </view>
      </view>

      <!-- Reticle Area -->
      <view :class="['absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500', scanned ? 'opacity-0' : 'opacity-100']">
        <view class="relative w-72 h-72">
          <view class="absolute w-full h-0.5 bg-primary/80 shadow-[0_0_15px_rgba(56,224,123,0.8)] animate-scan z-10 top-0"></view>
          <!-- Reticle Corners -->
          <view class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl"></view>
          <view class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl"></view>
          <view class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl"></view>
          <view class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl"></view>
          <view class="absolute inset-4 border border-white/20 rounded-lg"></view>
        </view>
        <text class="mt-6 text-white font-bold tracking-widest text-sm drop-shadow-md animate-pulse">正在识别...</text>
      </view>

      <!-- Result Card (Slides Up) -->
      <view v-if="scanned" class="w-full bg-white/90 rounded-3xl p-5 shadow-2xl animate-slide-up">
        <view class="flex justify-between items-start mb-4">
          <view>
            <view class="flex items-center gap-1.5 mb-1 text-primary">
              <text class="material-symbols-outlined text-xl">check_circle</text>
              <text class="text-xs font-bold uppercase tracking-wider">识别成功</text>
            </view>
            <text class="text-gray-900 text-2xl font-bold">牛油果吐司</text>
            <text class="text-gray-500 text-sm font-medium">健康脂肪来源</text>
          </view>
          <view class="flex flex-col items-end">
            <text class="text-3xl font-extrabold text-primary">320</text>
            <text class="text-xs text-gray-500 font-bold uppercase">kcal</text>
          </view>
        </view>
        <!-- Macros -->
        <view class="grid grid-cols-3 gap-3 mb-6">
          <view class="flex flex-col gap-1.5">
            <view class="flex justify-between items-end">
              <text class="text-[10px] font-bold text-gray-500 uppercase">蛋白质</text>
              <text class="text-xs font-bold text-gray-900">12g</text>
            </view>
            <view class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <view class="h-full bg-blue-400 rounded-full w-[40%]"></view>
            </view>
          </view>
          <view class="flex flex-col gap-1.5">
            <view class="flex justify-between items-end">
              <text class="text-[10px] font-bold text-gray-500 uppercase">碳水</text>
              <text class="text-xs font-bold text-gray-900">24g</text>
            </view>
            <view class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <view class="h-full bg-primary rounded-full w-[65%]"></view>
            </view>
          </view>
          <view class="flex flex-col gap-1.5">
            <view class="flex justify-between items-end">
              <text class="text-[10px] font-bold text-gray-500 uppercase">脂肪</text>
              <text class="text-xs font-bold text-gray-900">18g</text>
            </view>
            <view class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <view class="h-full bg-amber-400 rounded-full w-[55%]"></view>
            </view>
          </view>
        </view>
        <view @tap="navigateToResult" class="w-full py-4 bg-primary text-gray-900 font-bold text-base rounded-2xl shadow-lg flex items-center justify-center gap-2">
          <text class="material-symbols-outlined">add_circle</text>
          <text>确认并添加</text>
        </view>
      </view>
    </view>
  </view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "拍照识别",
    "navigationBarBackgroundColor": "#000000",
    "navigationBarTextStyle": "white"
  }
}
</route>

<style scoped>
@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}

@keyframes slideUp {
  0% { transform: translateY(100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.animate-scan {
  animation: scan 2s linear infinite;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
}
</style>
