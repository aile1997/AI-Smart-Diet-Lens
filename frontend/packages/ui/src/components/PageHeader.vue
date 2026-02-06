<script setup lang="ts">
/**
 * 页面头部组件
 *
 * 统一的页面头部样式，支持返回按钮、标题、右侧操作按钮
 */
import { computed } from 'vue'
import { PRIMARY } from '@/constants/theme'

interface Props {
  /** 页面标题 */
  title?: string
  /** 是否显示返回按钮 */
  showBack?: boolean
  /** 返回按钮文字 */
  backText?: string
  /** 右侧操作按钮图标 */
  rightIcon?: string
  /** 右侧操作按钮点击事件 */
  onRightClick?: () => void
  /** 自定义样式类名 */
  customClass?: string
  /** 是否使用透明背景（用于滚动时切换） */
  transparent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showBack: true,
  backText: '',
  rightIcon: '',
  onRightClick: undefined,
  customClass: '',
  transparent: false
})

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'rightClick'): void
}>()

// 返回上一页
const handleBack = () => {
  emit('back')
  uni.navigateBack()
}

// 右侧按钮点击
const handleRightClick = () => {
  emit('rightClick')
  if (props.onRightClick) {
    props.onRightClick()
  }
}

// 头部样式
const headerClass = computed(() => {
  const base = 'sticky top-0 z-30 px-4 pt-12 pb-4 backdrop-blur-md'
  const bg = props.transparent
    ? 'bg-transparent'
    : 'bg-[#F5F7F8]/90'
  return `${base} ${bg} ${props.customClass}`
})
</script>

<template>
  <view :class="headerClass" :style="transparent ? '' : 'border-bottom: 1px solid rgba(0,0,0,0.05)'">
    <view class="flex items-center justify-between">
      <!-- 左侧：返回按钮 -->
      <view v-if="showBack" @tap="handleBack" class="w-10 h-10 -ml-2 rounded-full flex items-center justify-center active:scale-95 transition-transform">
        <view class="flex items-center gap-1" :style="{ color: PRIMARY }">
          <text class="material-symbols-outlined">{{ backText || 'arrow_back_ios_new' }}</text>
          <text v-if="backText" class="text-base font-medium">{{ backText }}</text>
        </view>
      </view>
      <view v-else class="w-10"></view>

      <!-- 中间：标题 -->
      <text class="text-lg font-bold text-slate-900 tracking-tight">{{ title }}</text>

      <!-- 右侧：操作按钮 -->
      <view class="w-10 flex items-center justify-end">
        <view v-if="rightIcon" @tap="handleRightClick" class="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-transform">
          <text class="material-symbols-outlined text-slate-900">{{ rightIcon }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
}
</style>
