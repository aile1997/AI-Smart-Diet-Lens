<script setup lang="ts">
/**
 * AI 智能烹饪助手详情页面
 *
 * 显示食谱详情、营养分析、食材清单、烹饪步骤
 */
import { ref } from "vue";

// 食材数据类型
interface Ingredient {
  name: string;
  amount: string;
  checked: boolean;
}

// 烹饪步骤类型
interface Step {
  number: number;
  title: string;
  description: string;
  image?: string;
}

// 食谱数据
const recipe = ref({
  name: "香煎三文鱼配芦笋",
  description: "富含 Omega-3 的优质蛋白，搭配鲜嫩芦笋，15分钟即可享受的米其林级美味。",
  tags: ["Keto Friendly"],
  rating: 4.9,
  reviewCount: 128,
  time: "20 分钟",
  difficulty: "简单",
  calories: 450,
  // 营养素百分比
  proteinPercent: 85,
  fatPercent: 40,
  carbsPercent: 15,
  // 营养素实际值
  protein: 35,
  fat: 12,
  carbs: 5,
  // 食材
  ingredients: [
    { name: "三文鱼排", amount: "200g", checked: false },
    { name: "鲜嫩芦笋", amount: "100g", checked: false },
    { name: "初榨橄榄油", amount: "1勺", checked: false },
    { name: "海盐与黑胡椒", amount: "适量", checked: false },
  ] as Ingredient[],
});

// 烹饪步骤
const steps = ref<Step[]>([
  {
    number: 1,
    title: "准备食材",
    description: "将三文鱼清洗干净，用厨房纸吸干水分。芦笋去除老根，洗净沥干。",
    image: "/static/images/food/food_22.jpg",
  },
  {
    number: 2,
    title: "腌制调味",
    description: "在鱼肉两面均匀撒上海盐和现磨黑胡椒，静置5分钟入味。同时在芦笋上淋少许橄榄油。",
  },
  {
    number: 3,
    title: "煎制鱼皮",
    description: "平底锅中火加热，倒入橄榄油。将三文鱼皮朝下放入锅中，用铲子轻压，中小火煎3-4分钟至鱼皮金黄酥脆。",
  },
  {
    number: 4,
    title: "完成出锅",
    description: "翻面继续煎2-3分钟，同时放入芦笋一同煎熟。待鱼肉变色且熟透后即可装盘。",
  },
]);

// AI 语音助手开关状态
const voiceAssistantEnabled = ref(false);

// 切换语音助手
const toggleVoiceAssistant = () => {
  voiceAssistantEnabled.value = !voiceAssistantEnabled.value;
};

// 切换食材勾选状态
const toggleIngredient = (index: number) => {
  recipe.value.ingredients[index].checked = !recipe.value.ingredients[index].checked;
};

// 加入购物清单
const addToShoppingList = () => {
  uni.navigateTo({
    url: "/pages/shopping-list/index",
  });
};

// 返回
const navigateBack = () => {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
  } else {
    uni.reLaunch({ url: "/pages/index/index" });
  }
};

// 开始烹饪
const startCooking = () => {
  uni.showToast({
    title: "开始烹饪模式",
    icon: "success",
  });
};

// 查看营养详情
const viewNutritionDetail = () => {
  uni.showToast({
    title: "查看营养详情",
    icon: "none",
  });
};
</script>

<template>
  <view class="relative min-h-screen w-full flex flex-col bg-[#F5F7F8]">
    <!-- Top Image Section -->
    <view class="relative w-full h-[420px] shrink-0">
      <view class="absolute inset-0 bg-cover bg-center" style="background-image: url(&quot;/static/images/food/food_10.jpg&quot;)">
        <view class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></view>
      </view>

      <!-- Top Bar -->
      <view class="absolute top-0 left-0 right-0 flex items-center justify-between p-6 pt-12 z-20">
        <view
          @tap="navigateBack"
          class="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 active:bg-black/40 transition-colors"
        >
          <text class="material-symbols-outlined text-white text-2xl">arrow_back</text>
        </view>
        <view class="flex gap-3">
          <view
            class="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 active:bg-black/40 transition-colors"
          >
            <text class="material-symbols-outlined text-white text-2xl">share</text>
          </view>
          <view
            class="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 active:bg-black/40 transition-colors"
          >
            <text class="material-symbols-outlined text-white text-2xl">bookmark_border</text>
          </view>
        </view>
      </view>

      <!-- Bottom Info -->
      <view class="absolute bottom-0 left-0 w-full p-6 pb-2 z-10">
        <view class="flex items-center gap-2 mb-3">
          <text
            class="px-2.5 py-1 rounded-md bg-[#36e27b]/20 backdrop-blur-sm border border-[#36e27b]/30 text-[#36e27b] text-xs font-semibold tracking-wider uppercase"
          >
            {{ recipe.tags[0] }}
          </text>
          <view class="flex items-center gap-1 text-gray-200 text-xs font-medium">
            <text class="material-symbols-outlined text-[#36e27b] text-sm">star</text>
            <text>{{ recipe.rating }}</text>
            <text class="text-gray-400">•</text>
            <text>{{ recipe.reviewCount }} 评价</text>
          </view>
        </view>
        <text class="text-2xl font-bold text-white leading-tight mb-2 tracking-tight">{{ recipe.name }}</text>
        <text class="text-gray-300 text-sm line-clamp-2">{{ recipe.description }}</text>
      </view>
    </view>

    <!-- Content Section -->
    <view class="relative flex-1 px-6 pb-24 -mt-2 z-10">
      <!-- Quick Stats -->
      <view class="flex gap-3 py-4 overflow-x-auto">
        <view class="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-white border border-gray-100 px-4 shadow-sm">
          <text class="material-symbols-outlined text-[#36e27b] text-lg">schedule</text>
          <text class="text-[#111827] text-sm font-medium">{{ recipe.time }}</text>
        </view>
        <view class="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-white border border-gray-100 px-4 shadow-sm">
          <text class="material-symbols-outlined text-[#36e27b] text-lg">signal_cellular_alt</text>
          <text class="text-[#111827] text-sm font-medium">{{ recipe.difficulty }}</text>
        </view>
        <view class="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-white border border-gray-100 px-4 shadow-sm">
          <text class="material-symbols-outlined text-[#36e27b] text-lg">local_fire_department</text>
          <text class="text-[#111827] text-sm font-medium">{{ recipe.calories }} kcal</text>
        </view>
      </view>

      <!-- Nutrition Analysis -->
      <view class="mt-6">
        <view class="flex items-center justify-between mb-4">
          <text class="text-lg font-bold text-[#111827]">营养分析</text>
          <view @tap="viewNutritionDetail" class="text-xs text-[#36e27b] font-medium flex items-center gap-1">
            <text>查看详情</text>
            <text class="material-symbols-outlined text-xs">chevron_right</text>
          </view>
        </view>
        <view class="grid grid-cols-3 gap-3">
          <!-- Protein -->
          <view class="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm relative overflow-hidden">
            <view class="absolute top-0 right-0 p-2 opacity-5">
              <text class="material-symbols-outlined text-black text-4xl">egg_alt</text>
            </view>
            <view class="relative w-12 h-12 mb-2">
              <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  class="text-gray-100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                ></path>
                <path
                  class="text-[#36e27b] drop-shadow-[0_0_2px_rgba(54,226,123,0.3)]"
                  :stroke-dasharray="`${recipe.proteinPercent}, 100`"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                ></path>
              </svg>
              <text class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#111827]">{{ recipe.proteinPercent }}%</text>
            </view>
            <text class="text-2xl font-bold text-[#111827] leading-none">{{ recipe.protein }}g</text>
            <text class="text-[10px] uppercase tracking-wider text-[#9CA3AF] mt-1">蛋白质</text>
          </view>
          <!-- Fat -->
          <view class="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm relative overflow-hidden">
            <view class="relative w-12 h-12 mb-2">
              <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  class="text-gray-100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                ></path>
                <path class="text-orange-400" :stroke-dasharray="`${recipe.fatPercent}, 100`" fill="none" stroke="currentColor" stroke-width="3"></path>
              </svg>
              <text class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#111827]">{{ recipe.fatPercent }}%</text>
            </view>
            <text class="text-2xl font-bold text-[#111827] leading-none">{{ recipe.fat }}g</text>
            <text class="text-[10px] uppercase tracking-wider text-[#9CA3AF] mt-1">脂肪</text>
          </view>
          <!-- Carbs -->
          <view class="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm relative overflow-hidden">
            <view class="relative w-12 h-12 mb-2">
              <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  class="text-gray-100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                ></path>
                <path class="text-blue-400" :stroke-dasharray="`${recipe.carbsPercent}, 100`" fill="none" stroke="currentColor" stroke-width="3"></path>
              </svg>
              <text class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#111827]">{{ recipe.carbsPercent }}%</text>
            </view>
            <text class="text-2xl font-bold text-[#111827] leading-none">{{ recipe.carbs }}g</text>
            <text class="text-[10px] uppercase tracking-wider text-[#9CA3AF] mt-1">碳水</text>
          </view>
        </view>
      </view>

      <!-- Voice Assistant Toggle -->
      <view class="mt-8 mb-6 p-4 rounded-2xl bg-white border border-gray-100 shadow-lg flex items-center justify-between relative overflow-hidden">
        <view class="absolute -right-10 -top-10 w-32 h-32 bg-[#36e27b]/10 rounded-full blur-2xl"></view>
        <view class="flex items-center gap-3 z-10">
          <view class="w-10 h-10 rounded-full bg-[#36e27b]/10 flex items-center justify-center text-[#36e27b]">
            <text class="material-symbols-outlined" :class="voiceAssistantEnabled ? 'animate-pulse' : ''">mic</text>
          </view>
          <view>
            <text class="text-[#111827] font-semibold text-sm">AI 语音助手</text>
            <text class="text-xs text-[#4B5563]">实时语音指导步骤</text>
          </view>
        </view>
        <label class="relative inline-flex items-center cursor-pointer z-10">
          <input :checked="voiceAssistantEnabled" @change="toggleVoiceAssistant" class="sr-only peer" type="checkbox" />
          <view
            class="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#36e27b] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"
          ></view>
        </label>
      </view>

      <!-- Ingredients -->
      <view class="mt-2">
        <view class="flex items-center justify-between mb-4">
          <text class="text-lg font-bold text-[#111827]"
            >所需食材 <text class="text-[#9CA3AF] font-normal text-sm ml-1">({{ recipe.ingredients.length }}项)</text></text
          >
          <view
            @tap="addToShoppingList"
            class="text-emerald-600 text-sm font-medium border border-emerald-600/30 px-3 py-1.5 rounded-lg flex items-center gap-1"
          >
            <text class="material-symbols-outlined text-sm">add</text>
            <text>加入清单</text>
          </view>
        </view>
        <view class="space-y-3">
          <view
            v-for="(item, index) in recipe.ingredients"
            :key="index"
            @tap="toggleIngredient(index)"
            class="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 active:bg-gray-50 transition-colors"
          >
            <view class="w-6 h-6 flex items-center justify-center shrink-0">
              <view
                class="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center transition-colors"
                :class="item.checked ? 'bg-[#36e27b] border-[#36e27b]' : 'border-gray-300'"
              >
                <text v-if="item.checked" class="material-symbols-outlined text-white text-xs">check</text>
              </view>
            </view>
            <view class="flex-1 flex justify-between items-center">
              <text class="text-[#111827] text-sm font-medium">{{ item.name }}</text>
              <text class="text-[#9CA3AF] text-sm">{{ item.amount }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Cooking Steps -->
      <view class="mt-8 pb-8">
        <text class="text-lg font-bold text-[#111827] mb-6">烹饪步骤</text>
        <view class="relative border-l-2 border-gray-200 ml-3 mt-4 space-y-8">
          <view v-for="(step, index) in steps" :key="index" class="relative pl-8">
            <view
              class="absolute -left-[9px] top-0 w-4 h-4 rounded-full"
              :class="index === 0 ? 'bg-[#36e27b] shadow-[0_0_8px_rgba(54,226,123,0.5)]' : 'bg-gray-200 border-2 border-gray-400 shadow-sm'"
            ></view>
            <text class="text-[#111827] font-semibold text-base mb-2">{{ step.title }}</text>
            <text class="text-[#4B5563] text-sm leading-relaxed mb-3 block">{{ step.description }}</text>
            <image v-if="step.image" :src="step.image" class="w-full h-32 rounded-lg bg-cover bg-center shadow-sm" mode="aspectFill" />
          </view>
        </view>
      </view>
    </view>

    <!-- Sticky Footer -->
    <view class="fixed bottom-0 left-0 right-0 p-4 pt-0 bg-gradient-to-t from-[#F5F7F8] via-[#F5F7F8] to-transparent z-30 pointer-events-none">
      <view
        class="pointer-events-auto max-w-[480px] mx-auto flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-2xl"
      >
        <view class="flex flex-col">
          <text class="text-[10px] text-[#9CA3AF] uppercase tracking-wide">预计耗时</text>
          <text class="text-[#111827] font-bold text-lg">20:00</text>
        </view>
        <view
          @tap="startCooking"
          class="flex-1 flex-row items-center justify-center bg-[#36e27b] text-black font-bold text-base py-3 px-6 rounded-xl active:scale-[0.98] transition-all gap-2 shadow-[0_4px_12px_rgba(54,226,123,0.4)]"
        >
          <text class="material-symbols-outlined">play_arrow</text>
          <text>开始烹饪</text>
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
/* 烹饪助手页面特定样式 */
</style>
