<script setup lang="ts">
/**
 * 底部导航栏组件
 *
 * 统一应用底部导航，解决原生 TabBar 图标加载问题
 * 采用 Material Symbols 设计风格
 *
 * 顺序必须与 pages.json 中的 tabBar.list 保持一致
 */
import { computed } from 'vue'
import { PRIMARY } from '@/constants/theme'

interface NavItem {
  path: string
  icon: string
  label: string
  isFab?: boolean
}

const navItems: NavItem[] = [
  { path: '/pages/index/index', icon: 'home', label: '首页' },
  { path: '/pages/scan/index', icon: 'photo_camera', label: '拍照' },
  { path: '/pages/diary/index', icon: 'menu_book', label: '日记' },
  { path: '/pages/wiki/index', icon: 'menu_book', label: '百科' },
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
  // 恢复使用 switchTab，这是 Tab 页面切换的标准方式
  uni.switchTab({ 
    url: path,
    fail: (err) => {
      console.error('Navigation failed:', err)
      // 如果 switchTab 失败（可能不是 Tab 页面），尝试 navigateTo
      uni.navigateTo({ url: path })
    }
  })
}

const isActive = (path: string) => {
  const current = currentPath.value
  // 移除开头的斜杠进行比较，确保匹配稳定性
  const normalizedCurrent = current.startsWith('/') ? current.substring(1) : current
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path
  
  return normalizedCurrent === normalizedPath || 
         normalizedCurrent === normalizedPath.replace('/index', '') ||
         normalizedCurrent.replace('/index', '') === normalizedPath
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
          <view
            class="w-14 h-14 rounded-full flex items-center justify-center -mt-10 active:scale-95 transition-all border-4 border-white"
            :style="{ backgroundColor: PRIMARY, color: 'white', boxShadow: `0 10px 40px -10px ${PRIMARY}66` }"
          >
            <text class="material-symbols-outlined text-[28px]">{{ item.icon }}</text>
          </view>
          <text class="text-[10px] font-medium text-gray-400 mt-1 block">{{ item.label }}</text>
        </template>

        <!-- 普通标签 -->
        <template v-else>
          <text
            class="material-symbols-outlined text-[26px]"
            :class="isActive(item.path) ? 'fill-current' : 'text-gray-400'"
            :style="{ color: isActive(item.path) ? PRIMARY : '' }"
          >
            {{ item.icon }}
          </text>
          <text
            class="text-[10px] font-medium"
            :style="{ color: isActive(item.path) ? PRIMARY : '' }"
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
