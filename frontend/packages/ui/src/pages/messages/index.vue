<script setup lang="ts">
/**
 * 消息中心页面
 *
 * 显示系统通知、点赞收藏、互动评论、私信等
 */
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import { BG_PAGE, SUCCESS } from '@/constants/theme'

const searchQuery = ref('')

// 全部已读
const markAllRead = () => {
  uni.showToast({
    title: '全部已读',
    icon: 'success'
  })
}

// 系统通知列表
const systemNotifications = ref([
  {
    icon: 'notifications',
    iconFilled: true,
    label: '系统通知',
    title: '您的每周饮食分析报告已生成，点击查看详情。',
    time: '09:41',
    unread: true,
    color: 'blue'
  },
  {
    icon: 'favorite',
    iconFilled: true,
    label: '点赞与收藏',
    title: 'Lisa 和其他 3 人赞了你的"减脂午餐"打卡。',
    time: '10分钟前',
    unread: true,
    color: 'rose'
  },
  {
    icon: 'chat_bubble',
    iconFilled: true,
    label: '互动评论',
    title: 'David: 这个食谱看起来很棒！大概多少卡路里？',
    time: '昨天',
    unread: false,
    color: 'amber'
  }
])

// 最近消息列表
const recentMessages = ref([
  {
    icon: 'face_3',
    iconFilled: true,
    name: '营养师 Sarah',
    message: '记得上传今天的晚餐照片哦！',
    time: '14:30',
    unread: true,
    color: 'sage'
  },
  {
    icon: 'face_6',
    iconFilled: true,
    name: '健身教练 Mike',
    message: '下周的训练计划已经调整好了。',
    time: '周一',
    unread: false,
    color: 'gray'
  },
  {
    icon: 'smart_toy',
    iconFilled: true,
    name: 'AI 助手',
    message: '您的 Pro 会员特权已更新。',
    time: '周日',
    unread: false,
    color: 'indigo'
  }
])

// 点击通知
const handleNotificationClick = (item: typeof systemNotifications.value[0]) => {
  uni.showToast({
    title: item.label,
    icon: 'none'
  })
}

// 点击消息
const handleMessageClick = (item: typeof recentMessages.value[0]) => {
  uni.showToast({
    title: item.name,
    icon: 'none'
  })
}
</script>

<template>
  <view class="relative w-full min-h-screen" :style="{ backgroundColor: BG_PAGE }">
    <!-- Header -->
    <PageHeader
      title="消息中心"
      :right-icon="'mark_chat_read'"
      @right-click="markAllRead"
    />

    <!-- Search -->
    <view class="px-5 mb-6 mt-2">
      <view class="relative group">
        <view class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <text class="material-symbols-outlined text-gray-400 text-[20px]">search</text>
        </view>
        <input
          v-model="searchQuery"
          class="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl bg-white shadow-sm text-sm placeholder-gray-400 focus:ring-2 focus:ring-green-400/50 transition-shadow"
          placeholder="搜索通知..."
          type="text"
        />
      </view>
    </view>

    <view class="px-5 pb-10 space-y-4">
      <!-- 系统通知 -->
      <view class="bg-white rounded-2xl shadow-card overflow-hidden">
        <view
          v-for="(item, index) in systemNotifications"
          :key="index"
          @tap="handleNotificationClick(item)"
          class="group relative flex items-center p-4 border-b border-gray-50 last:border-b-0 active:bg-gray-50 transition-colors"
        >
          <view class="relative mr-4 shrink-0">
            <view :class="[
              'w-12 h-12 rounded-full flex items-center justify-center border',
              item.color === 'blue' ? 'bg-blue-50 text-blue-500 border-blue-100' : '',
              item.color === 'rose' ? 'bg-rose-50 text-rose-500 border-rose-100' : '',
              item.color === 'amber' ? 'bg-amber-50 text-amber-500 border-amber-100' : ''
            ]">
              <text class="material-symbols-outlined filled text-[24px]">{{ item.icon }}</text>
            </view>
            <view v-if="item.unread" class="absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white shadow-sm" :style="{ backgroundColor: SUCCESS }"></view>
          </view>
          <view class="flex-1 min-w-0">
            <view class="flex justify-between items-center mb-1">
              <text class="font-bold text-[16px] text-slate-900">{{ item.label }}</text>
              <text class="text-[12px] text-gray-400 font-medium">{{ item.time }}</text>
            </view>
            <text class="text-[14px] text-gray-500 truncate leading-snug block">{{ item.title }}</text>
          </view>
        </view>
      </view>

      <!-- 最近消息标题 -->
      <view class="pt-4 px-1">
        <text class="text-xs font-bold text-gray-400 uppercase tracking-widest">最近消息</text>
      </view>

      <!-- 最近消息 -->
      <view class="bg-white rounded-2xl shadow-card overflow-hidden">
        <view
          v-for="(item, index) in recentMessages"
          :key="index"
          @tap="handleMessageClick(item)"
          class="group relative flex items-center p-4 border-b border-gray-50 last:border-b-0 active:bg-gray-50 transition-colors"
        >
          <view class="relative mr-4 shrink-0">
            <view :class="[
              'w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border border-gray-100',
              item.color === 'sage' ? 'bg-primary-light text-primary' : '',
              item.color === 'gray' ? 'bg-gray-100 text-gray-500' : '',
              item.color === 'indigo' ? 'bg-indigo-50 text-indigo-400' : ''
            ]">
              <text class="material-symbols-outlined filled text-[28px]">{{ item.icon }}</text>
            </view>
            <view v-if="item.unread" class="absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white shadow-sm" :style="{ backgroundColor: SUCCESS }"></view>
          </view>
          <view class="flex-1 min-w-0">
            <view class="flex justify-between items-center mb-1">
              <text class="font-bold text-[15px] text-slate-900">{{ item.name }}</text>
              <text class="text-[12px] text-gray-400 font-medium">{{ item.time }}</text>
            </view>
            <text :class="[
              'text-[14px] truncate leading-snug block',
              item.unread ? 'text-slate-900 font-medium' : 'text-gray-500'
            ]">{{ item.message }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
  <BottomNav />
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "",
    "navigationStyle": "custom"
  }
}
</route>

<style scoped>
/* 消息中心页面特定样式 */
</style>
