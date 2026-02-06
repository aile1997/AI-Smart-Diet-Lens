<script setup lang="ts">
/**
 * 骨架屏组件
 *
 * 用于内容加载时展示占位符，提升用户体验
 */
import { computed } from 'vue'

interface Props {
  type?: 'card' | 'list' | 'avatar' | 'text' | 'custom'
  rows?: number
  width?: string
  height?: string
  avatar?: boolean
  title?: boolean
  round?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'card',
  rows: 3,
  width: '100%',
  height: '100%',
  avatar: false,
  title: false,
  round: false
})

const isCustom = computed(() => props.type === 'custom')
</script>

<template>
  <!-- 卡片骨架 -->
  <view v-if="type === 'card'" class="bg-white rounded-2xl p-4 shadow-sm">
    <!-- 标题 -->
    <view v-if="title" class="w-1/3 h-4 bg-slate-200 rounded mb-4 animate-pulse"></view>
    <!-- 头像 + 内容 -->
    <view v-if="avatar" class="flex items-center gap-3 mb-3">
      <view class="w-12 h-12 rounded-full bg-slate-200 animate-pulse"></view>
      <view class="flex-1 space-y-2">
        <view class="w-3/4 h-3 bg-slate-200 rounded animate-pulse"></view>
        <view class="w-1/2 h-3 bg-slate-200 rounded animate-pulse"></view>
      </view>
    </view>
    <!-- 内容行 -->
    <view v-for="i in rows" :key="i" class="h-3 bg-slate-200 rounded mb-2 animate-pulse" :class="{ 'w-full': i < rows - 1, 'w-2/3': i === rows - 1 }"></view>
  </view>

  <!-- 列表骨架 -->
  <view v-else-if="type === 'list'" class="space-y-3">
    <view v-for="i in rows" :key="i" class="flex items-center gap-3 bg-white p-3 rounded-xl">
      <view v-if="avatar" class="w-10 h-10 rounded-full bg-slate-200 animate-pulse shrink-0"></view>
      <view class="flex-1 space-y-2">
        <view class="w-3/4 h-3 bg-slate-200 rounded animate-pulse"></view>
        <view class="w-1/2 h-3 bg-slate-200 rounded animate-pulse"></view>
      </view>
    </view>
  </view>

  <!-- 头像骨架 -->
  <view
    v-else-if="type === 'avatar'"
    class="rounded-full bg-slate-200 animate-pulse"
    :style="{ width, height }"
  ></view>

  <!-- 文本骨架 -->
  <view
    v-else-if="type === 'text'"
    class="space-y-2"
  >
    <view
      v-for="i in rows"
      :key="i"
      class="h-3 bg-slate-200 rounded animate-pulse"
      :style="{ width: i === rows ? '60%' : '100%' }"
    ></view>
  </view>

  <!-- 自定义尺寸 -->
  <view
    v-else-if="isCustom"
    class="bg-slate-200 animate-pulse"
    :style="{ width, height, borderRadius: round ? '9999px' : '8px' }"
  ></view>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
