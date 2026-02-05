<script setup lang="ts">
/**
 * 食物识别结果页面
 *
 * 显示 AI 识别结果，允许调整份量并记录到日记
 */
import { ref, computed } from 'vue'

const portion = ref(250)
const basePortion = 250 // 基础分量
const baseCalories = 450 // 基础卡路里

// 计算营养数据比例
const calorieRatio = computed(() => (portion.value / basePortion).toFixed(2))
const calories = computed(() => Math.round(baseCalories * Number(calorieRatio.value)))

const navigateBack = () => {
  uni.navigateBack()
}

const saveToDiary = () => {
  uni.navigateTo({ url: '/pages/diary/index' })
}
</script>

<template>
  <view class="page-container">
    <!-- Top Image Area -->
    <view class="relative h-[40vh] w-full shrink-0">
      <view class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuD4okC0hHdn3KHTuhDrx6xp8mDEkn5jbe7BZiwHFYNGahUNYOKaU-P-wp4QPUaoE_-BCukvONG3Sae8E0mfPO3Y_06RQNmL_7k9xY0yDEjb9STqrajykm7h_P-GJy90l1QKgmPIELcCu7QWIpKcVFjc2MXU46MW4pZAX078eN02KA6KUebKHDU54pfwir8U9sU5ic4ki7-QYykkUCwsS62DQoA5oakcMbvNAQx_f69msJTTsiOE_gZU36fX8O86ZT3UGhSn1MTjx7GG')">
        <view class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></view>
      </view>

      <view class="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-start z-10">
        <view @tap="navigateBack" class="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-white">
          <text class="material-symbols-outlined">arrow_back</text>
        </view>
        <view class="flex items-center gap-2 px-4 h-10 rounded-full bg-white/20 text-white">
          <text class="material-symbols-outlined text-[20px]">photo_camera</text>
          <text class="text-sm font-semibold">重拍</text>
        </view>
      </view>

      <view class="absolute bottom-10 left-6 z-10">
        <view class="flex items-center gap-2 mb-2">
          <text class="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-black uppercase tracking-wider">AI 置信度 98%</text>
        </view>
        <text class="text-3xl font-bold text-white leading-tight drop-shadow-sm">香煎三文鱼蔬菜沙拉碗</text>
      </view>
    </view>

    <!-- Detail Sheet -->
    <view class="flex-1 relative -mt-8 bg-white rounded-t-3xl shadow-lg overflow-hidden flex flex-col z-20">
      <view class="w-full flex justify-center pt-3 pb-1 shrink-0">
        <view class="w-12 h-1.5 bg-gray-300 rounded-full"></view>
      </view>

      <view class="flex-1 overflow-y-auto px-6 pt-2 pb-28">
        <view class="flex items-end justify-between mb-8">
          <view>
            <text class="text-sm font-medium text-gray-500 mb-1">总热量</text>
            <text class="text-5xl font-extrabold text-gray-900 tracking-tight">{{ calories }} <text class="text-2xl font-semibold text-gray-400 ml-1">kcal</text></text>
          </view>
          <view class="text-right pb-1">
            <view class="flex items-center gap-1 justify-end text-primary font-bold">
              <text class="material-symbols-outlined text-sm">check_circle</text>
              <text>健康</text>
            </view>
            <text class="text-xs text-gray-400">在日常目标内</text>
          </view>
        </view>

        <!-- Slider -->
        <view class="mb-8 p-5 bg-gray-50 rounded-2xl border border-gray-100">
          <view class="flex justify-between items-center mb-4">
            <text class="text-base font-bold text-gray-900">分量大小</text>
            <view class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
              <text class="font-bold text-gray-900">{{ portion }}</text>
              <text class="text-sm font-medium text-gray-400">g</text>
            </view>
          </view>
          <slider
            :value="portion"
            :min="50"
            :max="500"
            :step="10"
            active-color="#38e07b"
            @change="(e: any) => portion = e.detail.value"
            class="w-full h-1 bg-gray-200 rounded-lg"
          />
          <view class="flex justify-between mt-2 text-xs font-medium text-gray-400">
            <text>50g</text>
            <text>500g</text>
          </view>
        </view>

        <!-- Macros List -->
        <view class="space-y-6">
          <text class="text-sm uppercase tracking-wider font-bold text-gray-500">宏量营养素</text>

          <view>
            <view class="flex justify-between items-end mb-2">
              <view class="flex items-center gap-2">
                <view class="w-2 h-2 rounded-full bg-primary"></view>
                <text class="font-semibold text-gray-700">蛋白质</text>
              </view>
              <view class="text-right">
                <text class="text-lg font-bold text-gray-900">35g</text>
                <text class="text-xs font-medium text-gray-400 ml-1">/ 140g</text>
              </view>
            </view>
            <view class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <view class="bg-primary h-full rounded-full" style="width: 31%"></view>
            </view>
          </view>

          <view>
            <view class="flex justify-between items-end mb-2">
              <view class="flex items-center gap-2">
                <view class="w-2 h-2 rounded-full bg-amber-400"></view>
                <text class="font-semibold text-gray-700">碳水</text>
              </view>
              <view class="text-right">
                <text class="text-lg font-bold text-gray-900">12g</text>
                <text class="text-xs font-medium text-gray-400 ml-1">/ 250g</text>
              </view>
            </view>
            <view class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <view class="bg-amber-400 h-full rounded-full" style="width: 10%"></view>
            </view>
          </view>

          <view>
            <view class="flex justify-between items-end mb-2">
              <view class="flex items-center gap-2">
                <view class="w-2 h-2 rounded-full bg-sky-400"></view>
                <text class="font-semibold text-gray-700">脂肪</text>
              </view>
              <view class="text-right">
                <text class="text-lg font-bold text-gray-900">18g</text>
                <text class="text-xs font-medium text-gray-400 ml-1">/ 70g</text>
              </view>
            </view>
            <view class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <view class="bg-sky-400 h-full rounded-full" style="width: 25%"></view>
            </view>
          </view>
        </view>

        <view class="h-px w-full bg-gray-100 my-8"></view>

        <view class="grid grid-cols-3 gap-4 pb-4">
          <view class="bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
            <text class="text-xs text-gray-500 mb-1">钠</text>
            <text class="font-bold text-gray-900">450mg</text>
          </view>
          <view class="bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
            <text class="text-xs text-gray-500 mb-1">膳食纤维</text>
            <text class="font-bold text-gray-900">6.2g</text>
          </view>
          <view class="bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
            <text class="text-xs text-gray-500 mb-1">糖</text>
            <text class="font-bold text-gray-900">3.1g</text>
          </view>
        </view>
      </view>

      <!-- Sticky Footer -->
      <view class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-10">
        <view
          @tap="saveToDiary"
          class="w-full bg-primary text-gray-900 font-bold text-lg h-14 rounded-2xl shadow-lg flex items-center justify-center gap-2"
        >
          <text>保存到日记</text>
          <text class="material-symbols-outlined">arrow_forward</text>
        </view>
      </view>
    </view>
  </view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "识别结果"
  }
}
</route>

<style scoped>
/* FoodResult page specific styles */
</style>
