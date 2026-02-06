<script setup lang="ts">
/**
 * 空状态组件
 *
 * 用于列表无数据或页面空状态时的提示
 */
import { computed } from 'vue'

interface Props {
  // 类型：默认、无网络、无搜索结果、错误
  type?: 'default' | 'network' | 'no-search' | 'error' | 'no-favorites' | 'no-records' | 'no-achievements'
  // 图标名称（Material Symbols）
  icon?: string
  // 标题
  title?: string
  // 描述文本
  description?: string
  // 操作按钮文本
  actionText?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  icon: 'inbox',
  title: '暂无数据',
  description: '这里还没有任何内容'
})

// 类型配置
const typeConfig = computed(() => {
  const configs = {
    default: {
      icon: 'inbox',
      title: '暂无数据',
      description: '这里还没有任何内容'
    },
    network: {
      icon: 'wifi_off',
      title: '网络连接失败',
      description: '请检查网络设置后重试'
    },
    'no-search': {
      icon: 'search_off',
      title: '未找到相关内容',
      description: '试试其他搜索关键词'
    },
    error: {
      icon: 'error_outline',
      title: '加载失败',
      description: '请稍后重试'
    },
    'no-favorites': {
      icon: 'favorite_border',
      title: '暂无收藏',
      description: '快去收藏你喜欢的内容吧'
    },
    'no-records': {
      icon: 'event_note',
      title: '暂无记录',
      description: '开始记录您的第一次饮食吧'
    },
    'no-achievements': {
      icon: 'military_tech',
      title: '暂无成就',
      description: '完成目标来解锁徽章吧'
    }
  }

  return configs[props.type] || configs.default
})

// 最终显示的配置
const displayIcon = computed(() => props.icon || typeConfig.value.icon)
const displayTitle = computed(() => props.title || typeConfig.value.title)
const displayDescription = computed(() => props.description || typeConfig.value.description)
</script>

<template>
  <view class="flex flex-col items-center justify-center px-10 py-16">
    <!-- 图标 -->
    <view
      class="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4"
    >
      <text class="material-symbols-outlined text-slate-300 text-4xl">{{ displayIcon }}</text>
    </view>

    <!-- 标题 -->
    <text class="text-slate-600 text-base font-medium mb-2">{{ displayTitle }}</text>

    <!-- 描述 -->
    <text class="text-slate-400 text-sm text-center mb-6">{{ displayDescription }}</text>

    <!-- 操作按钮（可选） -->
    <view
      v-if="actionText"
      class="bg-[#34C759] text-white py-2.5 px-6 rounded-full font-medium active:scale-95 transition-transform"
      @tap="$emit('action')"
    >
      <text>{{ actionText }}</text>
    </view>
  </view>
</template>

<style scoped>
.filled {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
