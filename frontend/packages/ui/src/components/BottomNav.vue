<script setup lang="ts">
/**
 * 底部导航栏组件
 *
 * 仅在非 TabBar 页面显示（如 food-detail、messages 等二级页面）
 * 主 TabBar 页面使用 pages.json 中的原生 tabBar
 */
import { ref, computed, onMounted, watch } from 'vue'

interface NavItem {
  path: string
  icon: string
  label: string
  isFab?: boolean
}

const navItems: NavItem[] = [
  { path: '/pages/index/index', icon: 'home', label: '首页' },
  { path: '/pages/diary/index', icon: 'menu_book', label: '日记' },
  { path: '/pages/scan/index', icon: 'qr_code_scanner', label: '识别', isFab: true },
  { path: '/pages/wiki/index', icon: 'bar_chart', label: '百科' },
  { path: '/pages/profile/index', icon: 'person', label: '我的' },
]

// 主 TabBar 页面列表（使用原生 tabBar，不需要自定义 BottomNav）
const mainTabBarPages = [
  '/pages/index/index',
  '/pages/scan/index',
  '/pages/diary/index',
  '/pages/wiki/index',
  '/pages/profile/index'
]

const visible = ref(false)

const checkVisibility = () => {
  const pages = getCurrentPages()
  if (pages.length === 0) {
    visible.value = false
    return
  }

  const currentPage = pages[pages.length - 1]
  const route = currentPage.route || ''
  const fullPath = route.startsWith('/') ? route : '/' + route

  // 如果当前页面是主 TabBar 页面，不显示自定义 BottomNav
  const isMainTabPage = mainTabBarPages.some(page => fullPath === page || fullPath.startsWith(page.replace('/index', '') + '/'))
  visible.value = !isMainTabPage
}

onMounted(() => {
  checkVisibility()
})

// 监听页面栈变化
watch(
  () => getCurrentPages().length,
  () => {
    checkVisibility()
  }
)

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
  uni.switchTab({ url: path })
}

const isActive = (path: string) => {
  return currentPath.value === path
}
</script>

<template>
  <view v-if="visible" class="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-200 pb-8 pt-3 px-6 z-50">
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
          <view class="w-14 h-14 rounded-full bg-[#34C759] text-white shadow-lg shadow-[#34C759]/40 flex items-center justify-center -mt-10 active:scale-95 transition-all border-4 border-white">
            <text class="material-symbols-outlined text-[28px]">photo_camera</text>
          </view>
          <text class="text-[10px] font-medium text-gray-400 mt-1 block">{{ item.label }}</text>
        </template>

        <!-- 普通标签 -->
        <template v-else>
          <text
            class="material-symbols-outlined text-[26px]"
            :class="isActive(item.path) ? 'text-[#34C759] fill-current' : 'text-gray-400'"
          >
            {{ item.icon }}
          </text>
          <text
            class="text-[10px] font-medium"
            :class="isActive(item.path) ? 'text-[#34C759]' : 'text-gray-400'"
          >
            {{ item.label }}
          </text>
        </template>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* 底部导航栏样式 */
</style>
