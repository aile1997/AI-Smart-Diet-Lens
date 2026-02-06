<script setup lang="ts">
/**
 * 通用加载组件
 *
 * 提供多种加载样式：spinner、dots、pulse
 */
import { computed } from 'vue'

interface Props {
  type?: 'spinner' | 'dots' | 'pulse' | 'skeleton'
  size?: 'small' | 'medium' | 'large'
  color?: string
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'spinner',
  size: 'medium',
  color: '#34C759',
  text: ''
})

// 尺寸映射
const sizeMap = {
  small: { w: 6, h: 6, text: 'text-xs' },
  medium: { w: 10, h: 10, text: 'text-sm' },
  large: { w: 14, h: 14, text: 'text-base' }
}

const currentSize = computed(() => sizeMap[props.size])
</script>

<template>
  <view class="flex flex-col items-center justify-center gap-3">
    <!-- Spinner 类型 -->
    <view
      v-if="type === 'spinner'"
      class="rounded-full border-2 border-transparent border-t-current"
      :class="[
        'animate-spin',
        currentSize.w === 6 ? 'w-6 h-6' : currentSize.w === 10 ? 'w-10 h-10' : 'w-14 h-14'
      ]"
      :style="{ borderColor: color, borderTopColor: color }"
    ></view>

    <!-- Dots 类型 -->
    <view v-else-if="type === 'dots'" class="flex items-center gap-1">
      <view
        class="rounded-full bg-current animate-bounce"
        :style="{
          width: size === 'small' ? '8px' : size === 'large' ? '12px' : '10px',
          height: size === 'small' ? '8px' : size === 'large' ? '12px' : '10px',
          backgroundColor: color,
          animationDelay: '0ms'
        }"
      ></view>
      <view
        class="rounded-full bg-current animate-bounce"
        :style="{
          width: size === 'small' ? '8px' : size === 'large' ? '12px' : '10px',
          height: size === 'small' ? '8px' : size === 'large' ? '12px' : '10px',
          backgroundColor: color,
          animationDelay: '150ms'
        }"
      ></view>
      <view
        class="rounded-full bg-current animate-bounce"
        :style="{
          width: size === 'small' '8px' : size === 'large' ? '12px' : '10px',
          height: size === 'small' ? '8px' : size === 'large' ? '12px' : '10px',
          backgroundColor: color,
          animationDelay: '300ms'
        }"
      ></view>
    </view>

    <!-- Pulse 类型 -->
    <view
      v-else-if="type === 'pulse'"
      class="rounded-full bg-current animate-pulse"
      :style="{
        width: size === 'small' ? '24px' : size === 'large' ? '48px' : '36px',
        height: size === 'small' ? '24px' : size === 'large' ? '48px' : '36px',
        backgroundColor: color
      }"
    ></view>

    <!-- 加载文本 -->
    <text
      v-if="text"
      class="text-slate-500 font-medium"
      :class="currentSize.text"
    >
      {{ text }}
    </text>
  </view>
</template>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes bounce {
   0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 0.6s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
