<script setup lang="ts">
/**
 * 底部导航栏组件
 * 
 * 统一应用底部导航，解决原生 TabBar 图标加载问题
 * 采用 Material Symbols 设计风格，与 food-detail 页面保持一致
 */
import { computed } from 'vue'

interface NavItem {
  path: string
  icon: string
  label: string
  isFab?: boolean
}

const navItems: NavItem[] = [
  { path: '/pages/index/index', icon: 'home', label: '首页' },
  { path: '/pages/diary/index', icon: 'menu_book', label: '日记' },
  { path: '/pages/scan/index', icon: 'photo_camera', label: '识别', isFab: true },
  { path: '/pages/wiki/index', icon: 'bar_chart', label: '百科' },
  { path: '/pages/profile/index', icon: 'person', label: '我的' },
]

const getCurrentPagePath = () => {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const route = pages[pages.length - 1].route
    return route.startsWith('/') ? route : '/' + route
  }
  return ''
}

const currentPath = computed(() => getCurrentPagePath())

const navigateToTab = (path: string) => {
  // 由于移除了原生 tabBar，这里使用 reLaunch 或 redirectTo 来模拟切换
  // 如果是主页面，建议使用 reLaunch 保持状态干净
  uni.reLaunch({ url: path })
}

const isActive = (path: string) => {
  const current = currentPath.value
  // 兼容带 /index 和不带 /index 的路径
  return current === path || current === path.replace('/index', '')
}
</script>

<template>
  <view class="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-200 pb-8 pt-3 px-6 z-50">
    <view class="flex justify-between items-center max-w-sm mx-auto">
      <view
        v-for="item in navItems"
        :key="item.path"
        @tap="navigateToTab(item.path)"
        class="flex flex-col items-center gap-1"
        :class="item.isFab ? 'w-14 relative' : 'w-12'"
      >
        <!-- FAB 中心按钮 -->
        <template v-if="item.isFab">
          <view class="w-14 h-14 rounded-full bg-[#38e07b] text-white shadow-lg shadow-[#38e07b]/40 flex items-center justify-center -mt-10 active:scale-95 transition-all border-4 border-white">
            <text class="material-symbols-outlined text-[28px]">{{ item.icon }}</text>
          </view>
          <text class="text-[10px] font-medium text-gray-400 mt-1 block">{{ item.label }}</text>
        </template>

        <!-- 普通标签 -->
        <template v-else>
          <text
            class="material-symbols-outlined text-[26px]"
            :class="isActive(item.path) ? 'text-[#38e07b] fill-current' : 'text-gray-400'"
          >
            {{ item.icon }}
          </text>
          <text
            class="text-[10px] font-medium"
            :class="isActive(item.path) ? 'text-[#38e07b]' : 'text-gray-400'"
          >
            {{ item.label }}
          </text>
        </template>
      </view>
    </view>
  </view>
</template>

<style scoped>
.fill-current {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}

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
