<script setup lang="ts">
/**
 * 饮食日记页面
 *
 * 按日期查看饮食记录和营养汇总
 */
import { useNutritionStore, useDiaryStore } from '@diet-lens/core'

const nutritionStore = useNutritionStore()
const diaryStore = useDiaryStore()
</script>

<template>
  <view class="page-container p-4">
    <view class="text-lg font-bold mb-4">
      饮食日记
    </view>

    <!-- 日期选择 -->
    <view class="card mb-4">
      <view class="text-center text-gray-600">
        {{ diaryStore.selectedDate }}
      </view>
    </view>

    <!-- 日记列表 -->
    <view
      v-if="nutritionStore.todayEntries.length > 0"
      class="space-y-3"
    >
      <view
        v-for="entry in nutritionStore.todayEntries"
        :key="entry.id"
        class="card flex justify-between items-center"
      >
        <view>
          <view class="font-bold">
            {{ entry.food.name }}
          </view>
          <view class="text-sm text-gray-500">
            {{ entry.portion }}g
          </view>
        </view>
        <view class="text-primary font-bold">
          {{ entry.nutrition.calories }} kcal
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view
      v-else
      class="card text-center text-gray-400 py-8"
    >
      今日暂无记录，去拍照识别添加吧
    </view>
  </view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "饮食日记"
  }
}
</route>
