<script setup lang="ts">
/**
 * 食物识别结果页面
 *
 * 显示 AI 识别结果，允许调整份量并记录到日记
 */
import { ref } from 'vue'
import { useNutritionStore, calculateNutrition } from '@diet-lens/core'
import { MealType } from '@diet-lens/core/types/diary'

const nutritionStore = useNutritionStore()
const food = nutritionStore.currentFood
const portion = ref<number>(food?.portion ?? 100)
const selectedMeal = ref<MealType>(MealType.LUNCH)

function handleSave() {
  if (!food) return
  nutritionStore.addEntry(food, selectedMeal.value, portion.value)
  uni.navigateBack()
}
</script>

<template>
  <view class="page-container p-4">
    <template v-if="food">
      <!-- 食物信息 -->
      <view class="card mb-4">
        <view class="text-xl font-bold mb-2">
          {{ food.name }}
        </view>
        <view
          v-if="food.confidence"
          class="text-sm text-gray-500"
        >
          置信度: {{ Math.round(food.confidence * 100) }}%
        </view>
      </view>

      <!-- 份量调节 -->
      <view class="card mb-4">
        <view class="text-sm text-gray-500 mb-2">
          份量 (g)
        </view>
        <slider
          :value="portion"
          :min="10"
          :max="500"
          :step="10"
          active-color="#38e07b"
          @change="(e: any) => portion = e.detail.value"
        />
        <view class="text-center font-bold text-lg mt-2">
          {{ portion }}g
        </view>
      </view>

      <!-- 记录按钮 -->
      <view
        class="btn text-center text-lg"
        @tap="handleSave"
      >
        记录到日记
      </view>
    </template>

    <!-- 空状态 -->
    <view
      v-else
      class="text-center text-gray-400 py-20"
    >
      暂无识别结果
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
