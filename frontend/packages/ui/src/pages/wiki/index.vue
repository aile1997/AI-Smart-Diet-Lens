<script setup lang="ts">
/**
 * 食材百科页面
 *
 * 浏览食材、查看营养信息和 AI 健康评分
 */
</script>

<template>
  <view class="page-container p-4">
    <view class="text-lg font-bold mb-4">
      食材百科
    </view>

    <!-- 搜索框 -->
    <view class="card mb-4">
      <input
        class="w-full"
        placeholder="搜索食材..."
        type="text"
      >
    </view>

    <!-- 占位: 由 Frontend Builder 实现 -->
    <view class="card text-center text-gray-400 py-8">
      食材百科功能开发中...
    </view>
  </view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "食材百科"
  }
}
</route>
