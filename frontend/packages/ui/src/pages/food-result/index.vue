<script setup lang="ts">
/**
 * 营养确认页面
 *
 * AI 识别后确认营养信息，调整份量并记录
 */
import { ref, computed, onMounted } from "vue";
import { useDiary } from "@diet-lens/core";

// 使用 useDiary 组合函数
const { addEntry } = useDiary();

/** 餐别类型（小写，用于本地逻辑） */
type LocalMealType = "breakfast" | "lunch" | "dinner" | "snack";

/** 餐别类型（大写，用于 API） */
type ApiMealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";

/** 根据当前时间获取餐别 */
function getCurrentMealType(): LocalMealType {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) return "breakfast";
  if (hour >= 10 && hour < 14) return "lunch";
  if (hour >= 14 && hour < 20) return "dinner";
  return "snack";
}

/** 获取餐别中文名称 */
function getMealTypeName(type: LocalMealType): string {
  const names = {
    breakfast: "早餐",
    lunch: "午餐",
    dinner: "晚餐",
    snack: "加餐",
  };
  return names[type];
}

/** 将本地餐别类型转换为 API 餐别类型 */
function toApiMealType(type: LocalMealType): ApiMealType {
  const map: Record<LocalMealType, ApiMealType> = {
    breakfast: "BREAKFAST",
    lunch: "LUNCH",
    dinner: "DINNER",
    snack: "SNACK",
  };
  return map[type];
}

// 当前餐别
const currentMealType = computed<LocalMealType>(() => getCurrentMealType());
const currentMealName = computed(() => getMealTypeName(currentMealType.value));

// 传递的食物数据（从 URL 参数解析）
const foodData = ref<{
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: number; // AI 识别的份量（克）
  imageUrl?: string;
} | null>(null);

// 加载状态
const isLoading = ref(true);

// 份量和营养数据
const detectedPortion = ref<number>(100); // AI 识别的份量（克）
const portion = ref<number>(100); // 用户调整的份量（克）
const basePortion = 100; // 用于计算每 100g 的基准

// 从 URL 参数中解析食物数据
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = (currentPage as any).options || {};

  if (options.data) {
    try {
      const decoded = decodeURIComponent(options.data);
      const parsed = JSON.parse(decoded);
      console.log("识别的食物数据:", parsed);

      // 初始化份量：优先使用识别的份量，否则使用 100g
      detectedPortion.value = parsed.portion || 100;
      portion.value = parsed.portion || 100;

      foodData.value = parsed;
    } catch (error) {
      console.error("解析食物数据失败:", error);
      // 使用默认数据
      foodData.value = {
        foodName: "未知食物",
        calories: 100,
        protein: 0,
        carbs: 0,
        fat: 0,
        portion: 100, // 默认 100g
        imageUrl: undefined,
      };
      detectedPortion.value = 100;
      portion.value = 100;
    }
  } else {
    // 没有 data 参数，使用默认值
    foodData.value = {
      foodName: "未知食物",
      calories: 100,
      protein: 0,
      carbs: 0,
      fat: 0,
      portion: 100, // 默认 100g
      imageUrl: undefined,
    };
    detectedPortion.value = 100;
    portion.value = 100;
  }

  isLoading.value = false;
});

// 计算每 100g 的基础营养值
// 后端返回的是总营养值（基于识别的份量），需要转换为每 100g
const baseCalories = computed(() => {
  if (!foodData.value) return 100;
  const ratio = basePortion / detectedPortion.value;
  return Math.round((foodData.value.calories || 100) * ratio);
});

const baseNutrients = computed(() => {
  if (!foodData.value) return { protein: 0, carbs: 0, fat: 0, sodium: 0, fiber: 0, sugar: 0 };
  const ratio = basePortion / detectedPortion.value;
  return {
    protein: Math.round((foodData.value.protein || 0) * ratio),
    carbs: Math.round((foodData.value.carbs || 0) * ratio),
    fat: Math.round((foodData.value.fat || 0) * ratio),
    sodium: 0, // AI 识别不提供
    fiber: 0, // AI 识别不提供
    sugar: 0, // AI 识别不提供
  };
});

// 计算实际营养值（根据用户调整的份量）
const userRatio = computed(() => portion.value / basePortion);
const calories = computed(() => Math.round(baseCalories.value * userRatio.value));

const protein = computed(() => Math.round(baseNutrients.value.protein * userRatio.value));
const carbs = computed(() => Math.round(baseNutrients.value.carbs * userRatio.value));
const fat = computed(() => Math.round(baseNutrients.value.fat * userRatio.value));

// 每日目标
const dailyTargets = {
  protein: 140,
  carbs: 250,
  fat: 70,
};

// 进度条百分比
const proteinPercent = computed(() => Math.min((protein.value / dailyTargets.protein) * 100, 100));
const carbsPercent = computed(() => Math.min((carbs.value / dailyTargets.carbs) * 100, 100));
const fatPercent = computed(() => Math.min((fat.value / dailyTargets.fat) * 100, 100));

const navigateBack = () => {
  uni.navigateBack();
};

const retakePhoto = () => {
  // TODO: 重新拍照逻辑
  // scan 是 tabBar 页面，需要使用 switchTab
  uni.switchTab({ url: "/pages/scan/index" });
};

const saveToDiary = async () => {
  if (!foodData.value) {
    uni.showToast({ title: "没有食物数据", icon: "none" });
    return;
  }

  try {
    // 显示加载提示
    uni.showLoading({ title: "保存中..." });

    // 调用 API 保存数据
    await addEntry({
      mealType: toApiMealType(currentMealType.value),
      items: [
        {
          name: foodData.value.foodName,
          portion: portion.value,
          calories: calories.value,
          protein: protein.value,
          carbs: carbs.value,
          fat: fat.value,
        },
      ],
      imageKey: foodData.value.imageUrl,
    });

    uni.hideLoading();

    // 显示成功提示
    uni.showToast({ title: "已保存到日记", icon: "success" });

    // 延迟导航，让用户看到成功提示
    setTimeout(() => {
      // diary 是 tabBar 页面，需要使用 switchTab
      uni.switchTab({ url: "/pages/diary/index" });
    }, 500);
  } catch (err) {
    uni.hideLoading();
    console.error("保存到日记失败:", err);
    uni.showToast({ title: "保存失败，请重试", icon: "none" });
  }
};
</script>

<template>
  <view class="relative h-screen w-full flex flex-col bg-[#F5F7FA]">
    <!-- 加载状态 -->
    <view v-if="isLoading" class="flex-1 flex items-center justify-center">
      <text class="text-slate-400">加载中...</text>
    </view>

    <!-- 主内容 -->
    <view v-else class="flex flex-col h-full">
      <!-- Top Image Area -->
      <view class="relative h-[35vh] w-full shrink-0">
        <view
          class="absolute inset-0 bg-cover bg-center"
          :style="{
            backgroundImage: foodData?.imageUrl
              ? `url('${foodData.imageUrl}')`
              : `url('https://smart-diet-1622598684-1309736368.cos.ap-beijing.myqcloud.com/public_assets/food/food_7.jpg?imageMogr2/format/webp/quality/85')`,
          }"
        >
          <view class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></view>
        </view>

        <view class="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-start z-10">
          <view
            @tap="navigateBack"
            class="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white active:bg-white/30 transition-colors"
          >
            <text class="material-symbols-outlined text-2xl">arrow_back</text>
          </view>
          <view
            @tap="retakePhoto"
            class="flex items-center gap-2 px-4 h-10 rounded-full bg-white/20 backdrop-blur-md text-white active:bg-white/30 transition-colors"
          >
            <text class="material-symbols-outlined text-xl">photo_camera</text>
            <text class="text-sm font-semibold">重拍</text>
          </view>
        </view>

        <view class="absolute bottom-10 left-6 z-10">
          <view class="flex items-center gap-2 mb-1">
            <text class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#38e07b] text-white uppercase tracking-wider">AI 置信度 98%</text>
          </view>
          <text class="text-xl font-bold text-white leading-tight shadow-sm">{{ foodData?.foodName || "未知食物" }}</text>
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
              <text class="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">总热量</text>
              <view class="flex items-baseline gap-1">
                <text class="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">{{ calories }}</text>
                <text class="text-xs font-medium text-slate-400">/ {{ Math.round(baseCalories) }} kcal (每100g)</text>
              </view>
            </view>
            <view class="text-right pb-1">
              <view class="flex items-center gap-1 justify-end text-[#38e07b] font-bold">
                <text class="material-symbols-outlined text-sm font-variation-FILL-1">check_circle</text>
                <text>健康推荐</text>
              </view>
              <text class="text-xs text-slate-400 dark:text-slate-500">符合每日目标</text>
            </view>
          </view>

          <!-- Portion Slider -->
          <view class="mb-8 p-5 bg-[#F5F7FA] dark:bg-[#121A16] rounded-2xl border border-slate-100 dark:border-slate-800">
            <view class="flex justify-between items-center mb-4">
              <text class="text-sm font-bold text-slate-900 dark:text-white">食用份量</text>
              <view class="flex items-center gap-2 bg-white dark:bg-[#1E2924] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <input
                  v-model.number="portion"
                  class="w-12 text-right bg-transparent font-bold outline-none text-slate-900 dark:text-white p-0 border-none focus:ring-0"
                  type="number"
                />
                <text class="text-xs font-medium text-slate-400">克</text>
              </view>
            </view>
            <view class="relative h-6 flex items-center">
              <slider
                :value="portion"
                :min="50"
                :max="500"
                :step="10"
                active-color="#38e07b"
                @change="(e: any) => (portion = e.detail.value)"
                class="w-full h-1 bg-transparent appearance-none z-20 absolute accent-primary"
              />
              <view class="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 rounded-full z-10"></view>
              <view class="absolute top-1/2 left-0 h-1 bg-[#38e07b] -translate-y-1/2 rounded-full z-10" :style="{ width: `${(portion / 500) * 100}%` }"></view>
            </view>
            <view class="flex justify-between mt-2 text-[10px] font-medium text-slate-400">
              <text>50克</text>
              <text>500克</text>
            </view>
          </view>

          <!-- Core Nutrients -->
          <view class="space-y-6">
            <text class="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">核心营养素</text>

            <!-- Protein -->
            <view class="group">
              <view class="flex justify-between items-end mb-2">
                <view class="flex items-center gap-2">
                  <view class="w-2 h-2 rounded-full bg-[#38e07b]"></view>
                  <text class="text-sm font-semibold text-slate-700 dark:text-slate-200">蛋白质</text>
                </view>
                <view class="text-right">
                  <text class="text-sm font-bold text-slate-900 dark:text-white">{{ protein }}g</text>
                  <text class="text-[10px] font-medium text-slate-400 ml-1">/ {{ dailyTargets.protein }}g</text>
                </view>
              </view>
              <view class="w-full bg-slate-100 dark:bg-[#121A16] rounded-full h-1.5 overflow-hidden">
                <view class="bg-[#38e07b] h-full rounded-full animate-fill" :style="{ '--target-width': `${proteinPercent}%` }"></view>
              </view>
            </view>

            <!-- Carbs -->
            <view class="group">
              <view class="flex justify-between items-end mb-2">
                <view class="flex items-center gap-2">
                  <view class="w-2 h-2 rounded-full bg-amber-400"></view>
                  <text class="text-sm font-semibold text-slate-700 dark:text-slate-200">碳水化合物</text>
                </view>
                <view class="text-right">
                  <text class="text-sm font-bold text-slate-900 dark:text-white">{{ carbs }}g</text>
                  <text class="text-[10px] font-medium text-slate-400 ml-1">/ {{ dailyTargets.carbs }}g</text>
                </view>
              </view>
              <view class="w-full bg-slate-100 dark:bg-[#121A16] rounded-full h-1.5 overflow-hidden">
                <view class="bg-amber-400 h-full rounded-full animate-fill" :style="{ '--target-width': `${carbsPercent}%` }"></view>
              </view>
            </view>

            <!-- Fat -->
            <view class="group">
              <view class="flex justify-between items-end mb-2">
                <view class="flex items-center gap-2">
                  <view class="w-2 h-2 rounded-full bg-sky-400"></view>
                  <text class="text-sm font-semibold text-slate-700 dark:text-slate-200">脂肪</text>
                </view>
                <view class="text-right">
                  <text class="text-sm font-bold text-slate-900 dark:text-white">{{ fat }}g</text>
                  <text class="text-[10px] font-medium text-slate-400 ml-1">/ {{ dailyTargets.fat }}g</text>
                </view>
              </view>
              <view class="w-full bg-slate-100 dark:bg-[#121A16] rounded-full h-1.5 overflow-hidden">
                <view class="bg-sky-400 h-full rounded-full animate-fill" :style="{ '--target-width': `${fatPercent}%` }"></view>
              </view>
            </view>
          </view>

          <view class="h-px w-full bg-slate-100 dark:bg-slate-800 my-8"></view>

          <!-- AI 识别提示 -->
          <view class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <view class="flex items-start gap-3">
              <text class="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg">info</text>
              <view class="flex-1">
                <text class="text-xs font-semibold text-amber-800 dark:text-amber-300">AI 识别说明</text>
                <text class="text-[10px] text-amber-700 dark:text-amber-400 mt-1 block">营养数据基于 AI 识别估算，仅供参考。建议根据实际食用份量调整。</text>
              </view>
            </view>
          </view>
        </view>

        <!-- Sticky Footer -->
        <view class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-[#1E2924] dark:via-[#1E2924] pt-10">
          <view
            @tap="saveToDiary"
            class="w-full bg-[#38e07b] hover:bg-[#2dc070] text-[#122017] font-bold text-base h-12 rounded-2xl shadow-lg shadow-[#38e07b]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <text>确认并记录到{{ currentMealName }}</text>
            <text class="material-symbols-outlined">check_circle</text>
          </view>
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
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #649678;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  margin-top: -10px;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: #e5e7eb;
  border-radius: 2px;
}

/* Animation for progress bars */
@keyframes fillBar {
  from {
    width: 0%;
  }
  to {
    width: var(--target-width);
  }
}

.animate-fill {
  width: 0%;
  animation: fillBar 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  animation-delay: 0.3s;
}

.font-variation-FILL-1 {
  font-variation-settings:
    "FILL" 1,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}
</style>
