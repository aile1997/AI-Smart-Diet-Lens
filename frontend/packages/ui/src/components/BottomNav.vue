<script setup lang="ts">
/**
 * 底部导航栏组件
 *
 * 用于主要页面之间的导航
 */
import { ref, computed } from 'vue'

interface NavItem {
  path: string
  icon: string
  label: string
  isFab?: boolean
}

const navItems: NavItem[] = [
  { path: '/pages/index/index', icon: 'home', label: '首页' },
  { path: '/pages/diary/index', icon: 'menu_book', label: '日记' },
  { path: '/pages/scan/index', icon: 'photo_camera', label: '', isFab: true },
  { path: '/pages/wiki/index', icon: 'nutrition', label: '百科' },
  { path: '/pages/profile/index', icon: 'person', label: '我的' },
]

// 获取当前页面路径
const getCurrentPagePath = () => {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const route = pages[pages.length - 1].route
    return route.startsWith('/') ? route : '/' + route
  }
  return ''
}

const currentPath = computed(() => getCurrentPagePath())

const navigateTo = (path: string) => {
  if (path === '/pages/scan/index') {
    uni.navigateTo({ url: path })
  } else {
    uni.switchTab({ url: path })
  }
}

const isActive = (path: string) => {
  return currentPath.value === path
}
</script>

<template>
  <view>
    <!-- Floating Action Button -->
    <view class="fixed bottom-[4.5rem] left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full pointer-events-none">
      <view
        @tap="navigateTo('/pages/scan/index')"
        class="pointer-events-auto mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-primary shadow-fab active:scale-95 transition-all border-4 border-white"
      >
        <text class="material-symbols-outlined text-gray-900 text-3xl">photo_camera</text>
      </view>
    </view>

    <!-- Navigation Bar -->
    <view class="fixed bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-40 flex items-center justify-between px-2 pb-safe max-w-md mx-auto">
      <template v-for="item in navItems" :key="item.path">
        <view v-if="item.isFab" class="flex-[0.8]"></view>
        <view v-else class="flex-1 flex justify-center">
          <view
            @tap="navigateTo(item.path)"
            :class="[
              'flex flex-col items-center gap-1 p-2 transition-colors',
              isActive(item.path) ? 'text-primary' : 'text-gray-400'
            ]"
          >
            <text 
              :class="[
                'material-symbols-outlined text-[26px]',
                isActive(item.path) ? 'font-variation-FILL-1' : ''
              ]"
            >
              {{ item.icon }}
            </text>
            <text :class="['text-[10px] font-medium', isActive(item.path) ? 'font-bold' : '']">
              {{ item.label }}
            </text>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>

<style scoped>
.shadow-fab {
  box-shadow: 0 4px 14px 0 rgba(56, 224, 123, 0.4);
}

.font-variation-FILL-1 {
  font-variation-settings: 'FILL' 1;
}

/* 适配刘海屏底部安全区 */
.pb-safe {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
