<script setup lang="ts">
/**
 * 身体指标填写页面
 *
 * 用于录入身高、体重、年龄等信息，计算基础代谢率 (BMR)
 */
import { ref, computed } from 'vue'

const height = ref<number>(175)
const weight = ref<number>(70)
const age = ref<number>(28)

// BMR 计算公式 (Mifflin-St Jeor)
// 使用 computed 自动计算，身高、体重、年龄变化时实时更新
const bmr = computed<number>(() => {
  // 默认按男性计算，实际应根据性别
  // 公式: BMR = 10 * 体重 + 6.25 * 身高 - 5 * 年龄 + 5
  return Math.round(10 * weight.value + 6.25 * height.value - 5 * age.value + 5)
})

const navigateBack = () => {
  uni.navigateBack()
}

const handleContinue = () => {
  // TODO: 保存身体指标数据到后端
  console.log('Body metrics:', {
    height: height.value,
    weight: weight.value,
    age: age.value,
    bmr: bmr.value
  })
  // 跳转到首页或目标设置页面
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<template>
  <view class="relative flex h-full min-h-screen w-full max-w-md mx-auto flex-col overflow-hidden bg-[#F6F8F7]">
    <!-- Header & Nav -->
    <view class="flex items-center justify-between px-6 pt-6 pb-2 z-10">
      <view
        @tap="navigateBack"
        class="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm active:bg-gray-50 transition-colors"
      >
        <text class="material-symbols-outlined text-[24px]">arrow_back</text>
      </view>
      <view class="flex gap-1">
        <view class="h-1.5 w-8 rounded-full bg-primary"></view>
        <view class="h-1.5 w-2 rounded-full bg-gray-200"></view>
        <view class="h-1.5 w-2 rounded-full bg-gray-200"></view>
        <view class="h-1.5 w-2 rounded-full bg-gray-200"></view>
      </view>
    </view>

    <!-- Main Content -->
    <view class="flex-1 flex flex-col px-6 pt-4 pb-8 relative z-0">
      <!-- Headlines -->
      <view class="mb-8">
        <text class="text-primary font-bold text-sm tracking-wider uppercase mb-1">Step 2 of 4</text>
        <text class="text-[#1C1C1E] text-[32px] font-extrabold leading-tight tracking-tight mb-3 block">
          Body Metrics
        </text>
        <text class="text-gray-500 text-base leading-relaxed">
          We use the Mifflin-St Jeor formula for clinical accuracy to determine your metabolic baseline.
        </text>
      </view>

      <!-- BMR Live Preview Card -->
      <view class="relative w-full bg-white rounded-2xl p-6 shadow-sm mb-8 border border-gray-100 overflow-hidden">
        <view class="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <text class="material-symbols-outlined text-[120px] text-primary rotate-12">local_fire_department</text>
        </view>
        <view class="relative z-10 flex flex-col items-center text-center">
          <view class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <text class="material-symbols-outlined text-base">bolt</text>
            LIVE PREVIEW
          </view>
          <view class="flex items-baseline gap-1 mb-1">
            <text class="text-5xl font-extrabold text-[#1C1C1E] tracking-tighter">{{ bmr.toLocaleString() }}</text>
            <text class="text-sm font-medium text-gray-500">kcal/day</text>
          </view>
          <text class="text-sm font-medium text-gray-400">Basal Metabolic Rate (BMR)</text>
        </view>
      </view>

      <!-- Wheel Pickers Container -->
      <view class="relative flex-1 min-h-[280px] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <!-- Column Headers -->
        <view class="grid grid-cols-3 w-full pt-6 px-4 pb-2 border-b border-gray-50 relative z-20 bg-white">
          <text class="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Height</text>
          <text class="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Weight</text>
          <text class="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Age</text>
        </view>

        <!-- Scroll Area -->
        <view class="relative flex-1 flex items-center justify-center w-full">
          <!-- Selection Highlight Bar -->
          <view class="absolute w-[90%] h-[56px] bg-primary/10 rounded-xl border border-primary/20 pointer-events-none z-10 flex items-center justify-between px-4">
            <view class="w-1 h-1 rounded-full bg-primary/50"></view>
            <view class="w-1 h-1 rounded-full bg-primary/50"></view>
          </view>

          <!-- Picker Columns -->
          <view class="grid grid-cols-3 w-full h-[240px] relative z-0">
            <!-- Height Column -->
            <view class="flex flex-col items-center justify-center gap-0 overflow-hidden relative">
              <text class="opacity-30 text-gray-400 text-lg font-medium py-3 scale-90">{{ height - 2 }} <text class="text-xs">cm</text></text>
              <text class="opacity-60 text-gray-500 text-xl font-medium py-3 scale-95">{{ height - 1 }} <text class="text-xs">cm</text></text>
              <text class="text-[#1C1C1E] text-2xl font-bold py-3 scale-110">{{ height }} <text class="text-sm font-normal text-gray-400 ml-1">cm</text></text>
              <text class="opacity-60 text-gray-500 text-xl font-medium py-3 scale-95">{{ height + 1 }} <text class="text-xs">cm</text></text>
              <text class="opacity-30 text-gray-400 text-lg font-medium py-3 scale-90">{{ height + 2 }} <text class="text-xs">cm</text></text>
            </view>

            <!-- Weight Column -->
            <view class="flex flex-col items-center justify-center gap-0 overflow-hidden relative border-x border-dashed border-gray-100">
              <text class="opacity-30 text-gray-400 text-lg font-medium py-3 scale-90">{{ weight - 2 }} <text class="text-xs">kg</text></text>
              <text class="opacity-60 text-gray-500 text-xl font-medium py-3 scale-95">{{ weight - 1 }} <text class="text-xs">kg</text></text>
              <text class="text-[#1C1C1E] text-2xl font-bold py-3 scale-110">{{ weight }} <text class="text-sm font-normal text-gray-400 ml-1">kg</text></text>
              <text class="opacity-60 text-gray-500 text-xl font-medium py-3 scale-95">{{ weight + 1 }} <text class="text-xs">kg</text></text>
              <text class="opacity-30 text-gray-400 text-lg font-medium py-3 scale-90">{{ weight + 2 }} <text class="text-xs">kg</text></text>
            </view>

            <!-- Age Column -->
            <view class="flex flex-col items-center justify-center gap-0 overflow-hidden relative">
              <text class="opacity-30 text-gray-400 text-lg font-medium py-3 scale-90">{{ age - 2 }}</text>
              <text class="opacity-60 text-gray-500 text-xl font-medium py-3 scale-95">{{ age - 1 }}</text>
              <text class="text-[#1C1C1E] text-2xl font-bold py-3 scale-110">{{ age }}</text>
              <text class="opacity-60 text-gray-500 text-xl font-medium py-3 scale-95">{{ age + 1 }}</text>
              <text class="opacity-30 text-gray-400 text-lg font-medium py-3 scale-90">{{ age + 2 }}</text>
            </view>
          </view>

          <!-- Gradients for Wheel Effect -->
          <view class="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent z-20 pointer-events-none"></view>
          <view class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none"></view>
        </view>
      </view>

      <!-- Spacer -->
      <view class="h-6"></view>

      <!-- Continue Button -->
      <view class="mt-auto">
        <view
          @tap="handleContinue"
          class="w-full h-14 bg-primary text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <text>Continue</text>
          <text class="material-symbols-outlined">arrow_forward</text>
        </view>
      </view>
    </view>

    <!-- Bottom Safe Area -->
    <view class="h-5 bg-[#F6F8F7] w-full"></view>
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
/* Body Metrics page specific styles */
.bg-gradient-to-b {
  background: linear-gradient(to bottom, var(--tw-gradient-from), transparent);
}

.bg-gradient-to-t {
  background: linear-gradient(to top, var(--tw-gradient-from), transparent);
}

.from-white {
  --tw-gradient-from: #ffffff;
}

.to-transparent {
  --tw-gradient-to: transparent;
}
</style>
