<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useAuthStore, setupRouteGuard } from '@diet-lens/core'

const authStore = useAuthStore()

onLaunch(async () => {
  console.log('App Launch')
  // 初始化认证状态（从 Storage 恢复 token）
  await authStore.initAuth()
  // 设置路由守卫
  setupRouteGuard()
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<template>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
}

page {
  background-color: #f8f8f8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  height: 100%;
  display: flex;
  flex-direction: column;
}

page,
view,
text,
image {
  box-sizing: border-box;
}

.page-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 448px;
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-color: #f8f8f8;
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

.font-variation-FILL-1 {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}

::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
/* 彻底隐藏 Uniapp 原生 TabBar 元素 */
uni-tabbar,
.uni-tabbar,
.uni-tabbar-bottom,
.uni-app--showtabbar uni-page-wrapper::after {
  display: none !important;
}

/* 移除原生 TabBar 占位高度 */
.uni-app--showtabbar uni-page-wrapper {
  height: 100% !important;
  padding-bottom: 0 !important;
}
</style>
