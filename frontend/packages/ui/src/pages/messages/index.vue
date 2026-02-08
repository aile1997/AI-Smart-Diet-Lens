<script setup lang="ts">
/**
 * 消息中心页面
 *
 * 显示系统通知、点赞收藏、互动评论、私信等
 */
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@diet-lens/core'
import { getApi, NotificationsService } from '@diet-lens/core'
import BottomNav from '@/components/BottomNav.vue'
import type { Notification } from '@diet-lens/core'

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)

const loading = ref(false)
const error = ref<string | null>(null)
const notifications = ref<Notification[]>([])

// 搜索
const searchQuery = ref('')

// 过滤后的通知
const filteredNotifications = computed(() => {
  if (!searchQuery.value) return notifications.value
  const query = searchQuery.value.toLowerCase()
  return notifications.value.filter(n =>
    n.title.toLowerCase().includes(query) ||
    n.content.toLowerCase().includes(query)
  )
})

// 未读数量
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.isRead).length
})

// 获取通知列表
async function fetchNotifications() {
  if (!isLoggedIn.value) return

  loading.value = true
  error.value = null

  try {
    const api = getApi()
    const notificationsService = new NotificationsService(api)
    const response = await notificationsService.getMessages()
    notifications.value = response?.messages || []
  } catch (err) {
    const message = err instanceof Error ? err.message : '获取通知失败'
    error.value = message
    console.error('获取通知失败:', err)
  } finally {
    loading.value = false
  }
}

// 全部已读
async function markAllRead() {
  try {
    const api = getApi()
    const notificationsService = new NotificationsService(api)
    await notificationsService.markAllAsRead()

    // 更新本地状态
    notifications.value.forEach(n => n.isRead = true)

    uni.showToast({
      title: '全部已读',
      icon: 'success'
    })
  } catch (err) {
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    })
  }
}

// 点击通知
async function handleNotificationClick(item: Notification) {
  // 标记为已读
  if (!item.isRead) {
    try {
      const api = getApi()
      const notificationsService = new NotificationsService(api)
      await notificationsService.markAsRead(item.id)
      item.isRead = true
    } catch (err) {
      console.error('标记已读失败:', err)
    }
  }

  // 根据通知类型跳转
  // TODO: 实现跳转逻辑
  uni.showToast({
    title: item.type === 'achievement' ? '成就解锁' : '通知',
    icon: 'none'
  })
}

// 返回
const navigateBack = () => {
  uni.navigateBack()
}

// 页面加载时获取通知
onMounted(() => {
  if (isLoggedIn.value) {
    fetchNotifications()
  }
})
</script>

<template>
  <view class="relative w-full min-h-screen bg-[#F5F7F8]">
    <!-- 未登录状态 -->
    <view v-if="!isLoggedIn" class="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <text class="material-symbols-outlined text-6xl text-slate-300 mb-4">lock</text>
      <text class="text-lg font-bold text-slate-700 mb-2">请先登录</text>
      <text class="text-sm text-slate-500 mb-6">登录后查看您的消息通知</text>
      <view @tap="navigateToLogin" class="px-6 py-3 bg-primary text-white rounded-2xl font-bold">
        立即登录
      </view>
    </view>

    <!-- 已登录状态 -->
    <template v-else>
      <!-- Header -->
      <view class="sticky top-0 z-30 px-4 pt-14 pb-4 bg-[#F5F7F8]/90 backdrop-blur-md flex items-center justify-between">
        <view @tap="navigateBack" class="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-800 active:bg-black/5 active:bg-black/10 transition-colors">
          <text class="material-symbols-outlined text-2xl">arrow_back_ios_new</text>
        </view>
        <text class="text-base font-bold text-slate-900 tracking-tight absolute left-1/2 -translate-x-1/2">消息中心</text>
        <view class="w-10 h-10 flex items-center justify-center">
          <view @tap="markAllRead" class="text-slate-900">
            <text class="material-symbols-outlined text-2xl">mark_chat_read</text>
          </view>
        </view>
      </view>

      <!-- Search -->
      <view class="px-5 mb-6 mt-2">
        <view class="relative group">
          <view class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <text class="material-symbols-outlined text-gray-400 text-xl">search</text>
          </view>
          <input
            v-model="searchQuery"
            class="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl bg-white shadow-sm text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#769f96]/50 transition-shadow"
            placeholder="搜索通知..."
            type="text"
          />
        </view>
      </view>

      <!-- Loading -->
      <view v-if="loading" class="flex items-center justify-center py-12">
        <text class="text-slate-400">加载中...</text>
      </view>

      <!-- Error -->
      <view v-else-if="error" class="flex items-center justify-center py-12">
        <text class="text-red-400">{{ error }}</text>
      </view>

      <!-- Empty State -->
      <view v-else-if="filteredNotifications.length === 0" class="flex flex-col items-center justify-center py-12 px-6 text-center">
        <text class="material-symbols-outlined text-6xl text-slate-300 mb-4">mail</text>
        <text class="text-base font-bold text-slate-700 mb-1">暂无通知</text>
        <text class="text-sm text-slate-500">当有新消息时会显示在这里</text>
      </view>

      <!-- Notifications List -->
      <view v-else class="px-5 pb-10 space-y-4">
        <view class="bg-white rounded-2xl shadow-card overflow-hidden">
          <view
            v-for="item in filteredNotifications"
            :key="item.id"
            @tap="handleNotificationClick(item)"
            class="group relative flex items-center p-4 border-b border-gray-50 last:border-b-0 active:bg-gray-50 transition-colors"
          >
            <view class="relative mr-4 shrink-0">
              <!-- 根据类型显示不同图标和颜色 -->
              <view :class="[
                'w-12 h-12 rounded-full flex items-center justify-center border',
                item.type === 'achievement' ? 'bg-amber-50 text-amber-500 border-amber-100' : '',
                item.type === 'reminder' ? 'bg-blue-50 text-blue-500 border-blue-100' : '',
                item.type === 'system' ? 'bg-sage-50 text-sage-500 border-sage-100' : ''
              ]">
                <text class="material-symbols-outlined filled text-2xl">
                  {{ item.type === 'achievement' ? 'emoji_events' : item.type === 'reminder' ? 'notifications' : 'info' }}
                </text>
              </view>
              <view v-if="!item.isRead" class="absolute top-0 right-0 w-3 h-3 bg-[#34C759] rounded-full border-2 border-white shadow-sm"></view>
            </view>
            <view class="flex-1 min-w-0">
              <view class="flex justify-between items-center mb-1">
                <text class="font-bold text-base text-slate-900">{{ item.title }}</text>
                <text class="text-xs text-gray-400 font-medium">{{ formatTime(item.createdAt) }}</text>
              </view>
              <text class="text-sm text-gray-500 leading-snug block">{{ item.content }}</text>
            </view>
          </view>
        </view>
      </view>
    </template>

    <BottomNav />
  </view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "",
    "navigationStyle": "custom"
  }
}
</route>

<script lang="ts">
// 时间格式化
function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`

  return `${date.getMonth() + 1}/${date.getDate()}`
}

function navigateToLogin() {
  uni.navigateTo({ url: '/pages/onboarding/login' })
}
</script>

<style scoped>
/* 消息中心页面特定样式 */
</style>
