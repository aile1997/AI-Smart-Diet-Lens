<script setup lang="ts">
/**
 * 拍照识别页面
 *
 * 调用相机拍照或从相册选择，进行 AI 食物识别
 */
import { useFoodRecognition } from '@diet-lens/core'
import { httpAdapter, cameraAdapter } from '@/utils/adapters'

const { loading, error, result, recognizeByCamera, recognizeByAlbum } = useFoodRecognition(
  httpAdapter,
  cameraAdapter,
)

async function handleCamera() {
  await recognizeByCamera()
}

async function handleAlbum() {
  await recognizeByAlbum()
}
</script>

<template>
  <view class="page-container p-4 flex flex-col items-center justify-center min-h-screen">
    <view class="text-2xl font-bold mb-8">
      AI 食物识别
    </view>

    <!-- 拍照按钮 -->
    <view
      class="w-40 h-40 rounded-full bg-primary flex items-center justify-center mb-6 active:opacity-80"
      @tap="handleCamera"
    >
      <view class="text-white text-lg font-bold">
        {{ loading ? '识别中...' : '拍照识别' }}
      </view>
    </view>

    <!-- 相册选择 -->
    <view
      class="btn bg-gray-200 text-gray-700"
      @tap="handleAlbum"
    >
      从相册选择
    </view>

    <!-- 错误提示 -->
    <view
      v-if="error"
      class="mt-4 text-red-500 text-sm"
    >
      {{ error }}
    </view>
  </view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "拍照识别"
  }
}
</route>
