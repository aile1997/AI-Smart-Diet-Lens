<script setup lang="ts">
/**
 * 首页 - 仪表盘
 *
 * 显示今日热量环形图、营养素进度条、快捷操作
 */
import { useNutritionStore } from '@diet-lens/core'

const nutritionStore = useNutritionStore()
</script>

<template>
  <view class="page-container p-4">
    <!-- 今日热量卡片 -->
    <view class="card mb-4">
      <view class="text-lg font-bold mb-2">
        今日摄入
      </view>
      <view class="text-3xl font-bold text-primary">
        {{ nutritionStore.todayNutrition.calories }}
        <text class="text-sm text-gray-400 font-normal">
          / {{ nutritionStore.dailyTarget }} kcal
        </text>
      </view>
    </view>

    <!-- 营养素概览 -->
    <view class="card mb-4">
      <view class="text-lg font-bold mb-2">
        营养素
      </view>
      <view class="flex justify-between">
        <view class="text-center">
          <view class="text-sm text-gray-500">
            蛋白质
          </view>
          <view class="font-bold">
            {{ nutritionStore.todayNutrition.protein }}g
          </view>
        </view>
        <view class="text-center">
          <view class="text-sm text-gray-500">
            碳水
          </view>
          <view class="font-bold">
            {{ nutritionStore.todayNutrition.carbs }}g
          </view>
        </view>
        <view class="text-center">
          <view class="text-sm text-gray-500">
            脂肪
          </view>
          <view class="font-bold">
            {{ nutritionStore.todayNutrition.fat }}g
          </view>
        </view>
      </view>
    </view>

    <!-- 占位: 更多功能由 Frontend Builder 实现 -->
    <view class="card text-center text-gray-400 py-8">
      更多功能开发中...
    </view>
  </view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "AI Smart Diet Lens"
  }
}
</route>
