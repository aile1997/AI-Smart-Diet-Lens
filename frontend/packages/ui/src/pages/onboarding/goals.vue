<script setup lang="ts">
/**
 * 目标选择页面 (Step 2 of 2)
 *
 * 用户选择减脂/增肌/健康维持目标
 * AI 根据目标调整推荐策略
 */
import { ref } from "vue";
import { getApi } from "@diet-lens/core";
import { logger } from "@diet-lens/core";

type GoalType = "fat-loss" | "muscle-gain" | "wellness" | null;

const selectedGoal = ref<GoalType>("muscle-gain");

const goals = [
  {
    id: "fat-loss" as const,
    name: "减脂模式",
    desc: "热量缺口与营养密度",
    icon: "local_fire_department",
    color: "text-[#007AFF]",
    bgColor: "bg-[#007AFF]/10",
  },
  {
    id: "muscle-gain" as const,
    name: "增肌模式",
    desc: "肌肥大与蛋白质追踪",
    icon: "fitness_center",
    color: "text-[#FF3B30]",
    bgColor: "bg-[#FF3B30]/10",
  },
  {
    id: "wellness" as const,
    name: "健康维持",
    desc: "多样性与抗炎饮食",
    icon: "spa",
    color: "text-[#34C759]",
    bgColor: "bg-[#34C759]/10",
  },
];

// AI 预览文案（根据选中目标动态变化）
const aiPreview = ref({
  title: "AI 预览",
  content: '已为您开启 "蛋白质过剩预警" 与 "渐进负荷建议"。AI 将优先识别高生物利用度蛋白食物并同步您的训练消耗数据。',
});

// 选择目标
const selectGoal = (goalId: GoalType) => {
  selectedGoal.value = goalId;
  updateAIPreview(goalId);
};

// 更新 AI 预览
const updateAIPreview = (goalId: GoalType) => {
  switch (goalId) {
    case "fat-loss":
      aiPreview.value = {
        title: "AI 预览",
        content: '已为您开启 "热量密度可视化" 与 "间歇性断食建议"。AI 将优先推荐低卡高纤维食物，并在晚餐后自动停止热量追踪。',
      };
      break;
    case "muscle-gain":
      aiPreview.value = {
        title: "AI 预览",
        content: '已为您开启 "蛋白质过剩预警" 与 "渐进负荷建议"。AI 将优先识别高生物利用度蛋白食物并同步您的训练消耗数据。',
      };
      break;
    case "wellness":
      aiPreview.value = {
        title: "AI 预览",
        content: '已为您开启 "营养多样性评分" 与 "抗炎食谱推荐"。AI 将重点关注 omega-3 脂肪酸与抗氧化食材摄入。',
      };
      break;
  }
};

// 返回
const navigateBack = () => {
  uni.navigateBack();
};

// 开启计划
const startPlan = async () => {
  if (!selectedGoal.value) {
    uni.showToast({ title: "请选择目标", icon: "none" });
    return;
  }

  try {
    // 调用后端 API 保存目标策略
    const api = getApi();
    // 映射前端目标 ID 到后端 GoalType
    const backendGoalMap: Record<string, string> = {
      "fat-loss": "FAT_LOSS",
      "muscle-gain": "MUSCLE_GAIN",
      wellness: "MAINTAIN",
    };

    await api.post("/user/strategy/switch", {
      new_strategy: backendGoalMap[selectedGoal.value],
      target_weight: undefined,
    });

    logger.debug("保存目标成功", { goal: selectedGoal.value });

    // 保存目标到本地存储（用于前端快速访问）
    uni.setStorageSync("user_goal", selectedGoal.value);
  } catch (err) {
    logger.error("保存目标失败:", err);
    // 即使保存失败也继续，本地存储已有目标
    uni.setStorageSync("user_goal", selectedGoal.value);
  }

  // 跳转到首页
  uni.switchTab({ url: "/pages/index/index" });
};
</script>

<template>
  <view class="relative flex h-full min-h-screen w-full max-w-md mx-auto flex-col bg-[#F5F7FA]">
    <!-- Header -->
    <view class="flex items-center justify-between px-6 pt-6 pb-2 z-10">
      <view @tap="navigateBack" class="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
        <text class="material-symbols-outlined text-2xl">arrow_back_ios_new</text>
      </view>
      <!-- Progress Dots -->
      <view class="flex gap-1.5">
        <view class="h-1.5 w-12 rounded-full bg-[#34C759]/30"></view>
        <view class="h-1.5 w-12 rounded-full bg-[#34C759] shadow-sm"></view>
      </view>
    </view>

    <view class="flex-1 flex flex-col px-6 pt-6 pb-8">
      <!-- Title -->
      <view class="mb-8">
        <text class="text-[#34C759] font-bold text-[10px] tracking-[0.1em] uppercase block mb-2">Step 2 of 2</text>
        <text class="text-slate-900 text-2xl font-extrabold leading-tight tracking-tight block">你的目标是什么？</text>
        <text class="text-slate-500 text-sm leading-relaxed">选择你的目标模式，AI 将根据此为你定制营养方案和食谱推荐</text>
      </view>

      <!-- Goal Options -->
      <view class="space-y-4 mb-8">
        <view
          v-for="goal in goals"
          :key="goal.id"
          @tap="selectGoal(goal.id)"
          class="flex items-center p-5 bg-white rounded-3xl border-2 transition-all relative"
          :class="selectedGoal === goal.id ? 'border-[#34C759] shadow-lg' : 'border-transparent shadow-sm'"
        >
          <view :class="`w-14 h-14 rounded-2xl ${goal.bgColor} flex items-center justify-center mr-4`">
            <text class="material-symbols-outlined text-2xl" :class="goal.color">{{ goal.icon }}</text>
          </view>
          <view class="flex-1">
            <text class="text-slate-900 font-semibold text-base block">{{ goal.name }}</text>
            <text class="text-slate-400 text-xs">{{ goal.desc }}</text>
          </view>
          <!-- Selected Indicator -->
          <view v-if="selectedGoal === goal.id" class="bg-[#34C759] w-6 h-6 rounded-full flex items-center justify-center">
            <text class="material-symbols-outlined text-white text-base">check</text>
          </view>
          <!-- Unselected Arrow -->
          <text v-else class="material-symbols-outlined text-slate-300">chevron_right</text>
        </view>
      </view>

      <!-- AI Preview Card -->
      <view class="bg-[#34C759]/5 rounded-2xl p-5 border border-[#34C759]/10 mb-8">
        <view class="flex items-center gap-2 mb-2">
          <text class="material-symbols-outlined text-[#34C759] text-xl filled">auto_awesome</text>
          <text class="text-xs font-bold text-[#34C759] tracking-widest uppercase">{{ aiPreview.title }}</text>
        </view>
        <text class="text-slate-600 text-xs leading-relaxed">{{ aiPreview.content }}</text>
      </view>

      <!-- Start Button -->
      <view class="mt-auto">
        <view
          @tap="startPlan"
          class="w-full py-3 bg-[#34C759] text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style="box-shadow: 0 0 15px rgba(52, 199, 89, 0.25)"
        >
          <text>开启计划</text>
          <text class="material-symbols-outlined text-xl">bolt</text>
        </view>
        <text class="text-center text-slate-400 text-[10px] mt-3 block">您可以随时在设置中更改您的目标</text>
      </view>
    </view>

    <view class="h-8 bg-[#F5F7FA] w-full"></view>
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
.shadow-sm {
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.03),
    0 1px 2px rgba(0, 0, 0, 0.04);
}

.shadow-lg {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.filled {
  font-variation-settings:
    "FILL" 1,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}
</style>
