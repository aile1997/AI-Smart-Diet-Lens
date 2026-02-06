<script setup lang="ts">
/**
 * 营养确认页面
 *
 * AI 识别后确认营养信息，调整份量并记录
 */
import { ref, computed } from 'vue'

/** 餐别类型 */
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

/** 根据当前时间获取餐别 */
function getCurrentMealType(): MealType {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 10) return 'breakfast'
  if (hour >= 10 && hour < 14) return 'lunch'
  if (hour >= 14 && hour < 20) return 'dinner'
  return 'snack'
}

/** 获取餐别中文名称 */
function getMealTypeName(type: MealType): string {
  const names = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '加餐'
  }
  return names[type]
}

// 当前餐别
const currentMealType = computed<MealType>(() => getCurrentMealType())
const currentMealName = computed(() => getMealTypeName(currentMealType.value))

// 份量和营养数据
const portion = ref<number>(250)
const basePortion = 250
const baseCalories = 450

// 营养素基础数据（每250g）
const baseNutrients = {
  protein: 35,
  carbs: 12,
  fat: 18,
  sodium: 450,
  fiber: 6.2,
  sugar: 3.1
}

// 计算实际营养值（根据份量比例）
const ratio = computed(() => portion.value / basePortion)
const calories = computed(() => Math.round(baseCalories * ratio.value))

const protein = computed(() => Math.round(baseNutrients.protein * ratio.value))
const carbs = computed(() => Math.round(baseNutrients.carbs * ratio.value))
const fat = computed(() => Math.round(baseNutrients.fat * ratio.value))

// 每日目标
const dailyTargets = {
  protein: 140,
  carbs: 250,
  fat: 70
}

// 进度条百分比
const proteinPercent = computed(() => Math.min((protein.value / dailyTargets.protein) * 100, 100))
const carbsPercent = computed(() => Math.min((carbs.value / dailyTargets.carbs) * 100, 100))
const fatPercent = computed(() => Math.min((fat.value / dailyTargets.fat) * 100, 100))

// 微量营养素展开状态
const showMicronutrients = ref(false)

// 计算微量营养素值（避免模板中的类型错误）
const sodium = computed(() => Math.round(baseNutrients.sodium * ratio.value))
const fiber = computed(() => (baseNutrients.fiber * ratio.value).toFixed(1))
const sugar = computed(() => (baseNutrients.sugar * ratio.value).toFixed(1))

const navigateBack = () => {
  uni.navigateBack()
}

const retakePhoto = () => {
  // TODO: 重新拍照逻辑
  // scan 是 tabBar 页面，需要使用 switchTab
  uni.switchTab({ url: '/pages/scan/index' })
}

const saveToDiary = () => {
  // TODO: 保存到日记
  // diary 是 tabBar 页面，需要使用 switchTab
  uni.switchTab({ url: '/pages/diary/index' })
}
</script>

<template>
  <view class="relative h-screen w-full flex flex-col bg-[#F5F7F6]">
    <!-- Top Image Area -->
    <view class="relative h-[35vh] w-full shrink-0">
      <view class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuD4okC0hHdn3KHTuhDrx6xp8mDEkn5jbe7BZiwHFYNGahUNYOKaU-P-wp4QPUaoE_-BCukvONG3Sae8E0mfPO3Y_06RQNmL_7k9xY0yDEjb9STqrajykm7h_P-GJy90l1QKgmPIELcCu7QWIpKcVFjc2MXU46MW4pZAX078eN02KA6KUebKHDU54pfwir8U9sU5ic4ki7-QYykkUCwsS62DQoA5oakcMbvNAQx_f69msJTTsiOE_gZU36fX8O86ZT3UGhSn1MTjx7GG')">
        <view class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></view>
      </view>

      <view class="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-start z-10">
        <view @tap="navigateBack" class="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white active:bg-white/30 transition-colors">
          <text class="material-symbols-outlined text-[24px]">arrow_back</text>
        </view>
        <view @tap="retakePhoto" class="flex items-center gap-2 px-4 h-10 rounded-full bg-white/20 backdrop-blur-md text-white active:bg-white/30 transition-colors">
          <text class="material-symbols-outlined text-[20px]">photo_camera</text>
          <text class="text-sm font-semibold">重拍</text>
        </view>
      </view>

      <view class="absolute bottom-10 left-6 z-10">
        <view class="flex items-center gap-2 mb-1">
          <text class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#649678] text-white uppercase tracking-wider">AI 置信度 98%</text>
        </view>
        <text class="text-3xl font-bold text-white leading-tight shadow-sm">香煎三文鱼<br/>轻食沙拉碗</text>
      </view>
    </view>

    <!-- Detail Sheet -->
    <view class="flex-1 relative -mt-8 bg-white dark:bg-[#1E2924] rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col z-20">
      <view class="w-full flex justify-center pt-3 pb-1 shrink-0">
        <view class="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></view>
      </view>

      <view class="flex-1 overflow-y-auto px-6 pt-2 pb-28">
        <!-- Total Calories -->
        <view class="flex items-end justify-between mb-8">
          <view>
            <text class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">总热量</text>
            <text class="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ calories }} <text class="text-2xl font-semibold text-slate-400 dark:text-slate-500 ml-1">千卡</text></text>
          </view>
          <view class="text-right pb-1">
            <view class="flex items-center gap-1 justify-end text-[#649678] font-bold">
              <text class="material-symbols-outlined text-sm font-variation-FILL-1">check_circle</text>
              <text>健康推荐</text>
            </view>
            <text class="text-xs text-slate-400 dark:text-slate-500">符合每日目标</text>
          </view>
        </view>

        <!-- Portion Slider -->
        <view class="mb-8 p-5 bg-[#F5F7F6] dark:bg-[#121A16] rounded-2xl border border-slate-100 dark:border-slate-800">
          <view class="flex justify-between items-center mb-4">
            <text class="text-base font-bold text-slate-900 dark:text-white">食用份量</text>
            <view class="flex items-center gap-2 bg-white dark:bg-[#1E2924] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <input
                v-model.number="portion"
                class="w-12 text-right bg-transparent font-bold outline-none text-slate-900 dark:text-white p-0 border-none focus:ring-0"
                type="number"
              />
              <text class="text-sm font-medium text-slate-400">克</text>
            </view>
          </view>
          <view class="relative h-6 flex items-center">
            <slider
              :value="portion"
              :min="50"
              :max="500"
              :step="10"
              active-color="#649678"
              @change="(e: any) => portion = e.detail.value"
              class="w-full h-1 bg-transparent appearance-none z-20 absolute accent-primary"
            />
            <view class="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 rounded-full z-10"></view>
            <view class="absolute top-1/2 left-0 h-1 bg-[#649678] -translate-y-1/2 rounded-full z-10" :style="{ width: `${(portion / 500) * 100}%` }"></view>
          </view>
          <view class="flex justify-between mt-2 text-xs font-medium text-slate-400">
            <text>50克</text>
            <text>500克</text>
          </view>
        </view>

        <!-- Core Nutrients -->
        <view class="space-y-6">
          <text class="text-sm uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">核心营养素</text>

          <!-- Protein -->
          <view class="group">
            <view class="flex justify-between items-end mb-2">
              <view class="flex items-center gap-2">
                <view class="w-2 h-2 rounded-full bg-[#649678]"></view>
                <text class="font-semibold text-slate-700 dark:text-slate-200">蛋白质</text>
              </view>
              <view class="text-right">
                <text class="text-lg font-bold text-slate-900 dark:text-white">{{ protein }}g</text>
                <text class="text-xs font-medium text-slate-400 ml-1">/ {{ dailyTargets.protein }}g</text>
              </view>
            </view>
            <view class="w-full bg-slate-100 dark:bg-[#121A16] rounded-full h-2.5 overflow-hidden">
              <view class="bg-[#649678] h-full rounded-full animate-fill" :style="{ '--target-width': `${proteinPercent}%` }"></view>
            </view>
          </view>

          <!-- Carbs -->
          <view class="group">
            <view class="flex justify-between items-end mb-2">
              <view class="flex items-center gap-2">
                <view class="w-2 h-2 rounded-full bg-amber-400"></view>
                <text class="font-semibold text-slate-700 dark:text-slate-200">碳水化合物</text>
              </view>
              <view class="text-right">
                <text class="text-lg font-bold text-slate-900 dark:text-white">{{ carbs }}g</text>
                <text class="text-xs font-medium text-slate-400 ml-1">/ {{ dailyTargets.carbs }}g</text>
              </view>
            </view>
            <view class="w-full bg-slate-100 dark:bg-[#121A16] rounded-full h-2.5 overflow-hidden">
              <view class="bg-amber-400 h-full rounded-full animate-fill" :style="{ '--target-width': `${carbsPercent}%` }"></view>
            </view>
          </view>

          <!-- Fat -->
          <view class="group">
            <view class="flex justify-between items-end mb-2">
              <view class="flex items-center gap-2">
                <view class="w-2 h-2 rounded-full bg-sky-400"></view>
                <text class="font-semibold text-slate-700 dark:text-slate-200">脂肪</text>
              </view>
              <view class="text-right">
                <text class="text-lg font-bold text-slate-900 dark:text-white">{{ fat }}g</text>
                <text class="text-xs font-medium text-slate-400 ml-1">/ {{ dailyTargets.fat }}g</text>
              </view>
            </view>
            <view class="w-full bg-slate-100 dark:bg-[#121A16] rounded-full h-2.5 overflow-hidden">
              <view class="bg-sky-400 h-full rounded-full animate-fill" :style="{ '--target-width': `${fatPercent}%` }"></view>
            </view>
          </view>
        </view>

        <view class="h-px w-full bg-slate-100 dark:bg-slate-800 my-8"></view>

        <!-- Micronutrients -->
        <view>
          <view
            @tap="showMicronutrients = !showMicronutrients"
            class="flex items-center justify-between cursor-pointer hover:opacity-70 transition-opacity"
          >
            <text class="text-sm uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">微量营养素</text>
            <text
              :class="[
                'material-symbols-outlined text-slate-400 transition-transform duration-200',
                showMicronutrients ? 'rotate-180' : ''
              ]"
            >expand_more</text>
          </view>

          <view v-show="showMicronutrients" class="grid grid-cols-3 gap-4 mt-4">
            <view class="bg-[#F5F7F6] dark:bg-[#121A16] p-3 rounded-xl text-center border border-slate-100 dark:border-slate-800">
              <text class="text-xs text-slate-500 mb-1">钠</text>
              <text class="font-bold text-slate-900 dark:text-white">{{ sodium }}mg</text>
            </view>
            <view class="bg-[#F5F7F6] dark:bg-[#121A16] p-3 rounded-xl text-center border border-slate-100 dark:border-slate-800">
              <text class="text-xs text-slate-500 mb-1">膳食纤维</text>
              <text class="font-bold text-slate-900 dark:text-white">{{ fiber }}g</text>
            </view>
            <view class="bg-[#F5F7F6] dark:bg-[#121A16] p-3 rounded-xl text-center border border-slate-100 dark:border-slate-800">
              <text class="text-xs text-slate-500 mb-1">糖分</text>
              <text class="font-bold text-slate-900 dark:text-white">{{ sugar }}g</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Sticky Footer -->
      <view class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-[#1E2924] dark:via-[#1E2924] pt-10">
        <view
          @tap="saveToDiary"
          class="w-full bg-[#649678] hover:bg-[#4a755c] text-white font-bold text-lg h-14 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <text>确认并记录到{{ currentMealName }}</text>
          <text class="material-symbols-outlined">check_circle</text>
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
/* Nutrition Confirmation page specific styles */

/* Range slider styling */
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #649678;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  margin-top: -10px;
}

input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: #e5e7eb;
  border-radius: 2px;
}

/* Animation for progress bars */
@keyframes fillBar {
  from { width: 0%; }
  to { width: var(--target-width); }
}

.animate-fill {
  width: 0%;
  animation: fillBar 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  animation-delay: 0.3s;
}

.font-variation-FILL-1 {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
