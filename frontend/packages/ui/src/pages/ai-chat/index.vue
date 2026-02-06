<script setup lang="ts">
/**
 * AI 营养师对话页面
 *
 * 支持问答模式，用户可以通过对话获取个性化餐单建议
 */
import { ref, nextTick } from 'vue'

// 消息类型
interface ChatMessage {
  id: string
  isUser: boolean
  content: string
  timestamp: string
  recipeCard?: {
    name: string
    image: string
    calories: number
    time: string
    difficulty: string
    description: string
  }
}

// 聊天消息列表
const messages = ref<ChatMessage[]>([
  {
    id: '1',
    isUser: false,
    content: '你好 Alex！今天想吃点什么？你可以告诉我你的口味偏好或者现有的食材。',
    timestamp: '今天 12:30'
  },
  {
    id: '2',
    isUser: true,
    content: '我想吃点清淡的，家里有鸡胸肉和西兰花。',
    timestamp: '已读'
  },
  {
    id: '3',
    isUser: false,
    content: '没问题，为您推荐一道非常适合的低卡高蛋白食谱。',
    timestamp: '',
    recipeCard: {
      name: '清炒蒜香西兰花鸡胸',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2QbdAYzKfGfiSa3xXlhGqt9Lg7YpVrJcXQhQnKxWfVzRkpDqJGtVnYzL9zPv8hRfKnXDxLrVpF8mKyWdNqQxPTjGgBvCvhHdVpFzJqRfNkHpQxLrVpF8mKyWdNqQ',
      calories: 340,
      time: '15分钟',
      difficulty: '简单',
      description: '清淡爽口，最大程度保留食材营养。鸡胸肉滑嫩多汁的秘诀在于提前腌制。'
    }
  },
  {
    id: '4',
    isUser: false,
    content: '您觉得这个怎么样？或者想要更丰富的调味？',
    timestamp: ''
  }
])

// 输入框内容
const inputMessage = ref('')

// 获取当前时间
const getCurrentTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  return `今天 ${hours}:${minutes}`
}

// 发送消息
const sendMessage = () => {
  if (!inputMessage.value.trim()) return

  // 添加用户消息
  messages.value.push({
    id: Date.now().toString(),
    isUser: true,
    content: inputMessage.value,
    timestamp: '已读'
  })

  // 清空输入框
  const userMessage = inputMessage.value
  inputMessage.value = ''

  // 模拟 AI 响应
  setTimeout(() => {
    messages.value.push({
      id: (Date.now() + 1).toString(),
      isUser: false,
      content: '收到！正在为您分析...',
      timestamp: ''
    })
    scrollToBottom()
  }, 500)

  scrollToBottom()
}

// 滚动到底部
const scrollViewRef = ref()
const scrollToBottom = () => {
  nextTick(() => {
    // TODO: 实现滚动到底部
  })
}

// 返回
const navigateBack = () => {
  uni.navigateBack()
}

// 查看食谱详情
const viewRecipe = () => {
  uni.navigateTo({
    url: '/pages/recipe-detail/index'
  })
}
</script>

<template>
  <view class="page-container flex flex-col h-screen bg-[#F5F7F8]">
    <!-- Header -->
    <view class="flex items-center justify-between px-4 pt-4 pb-3 bg-[#F5F7F8]/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/50">
      <view @tap="navigateBack" class="w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-200/50 transition-colors text-slate-600">
        <text class="material-symbols-outlined">arrow_back_ios_new</text>
      </view>
      <view class="flex flex-col items-center">
        <view class="flex items-center gap-2">
          <text class="text-base font-bold text-[#0e1a13]">AI 营养师对话</text>
          <view class="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(52,199,89,0.6)] animate-pulse"></view>
        </view>
      </view>
      <view class="w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-200/50 transition-colors text-slate-600">
        <text class="material-symbols-outlined">more_horiz</text>
      </view>
    </view>

    <!-- Chat Messages -->
    <scroll-view class="flex-1 px-4 pt-6 pb-4 overflow-y-auto" scroll-y>
      <view class="flex justify-center mb-6">
        <text class="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">今天 12:30</text>
      </view>

      <view class="space-y-6">
        <!-- AI Message -->
        <view v-for="msg in messages" :key="msg.id" :class="msg.isUser ? 'flex justify-end' : 'flex items-start gap-3'">
          <!-- AI Avatar -->
          <view v-if="!msg.isUser" class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <text class="material-symbols-outlined text-white text-lg filled">smart_toy</text>
          </view>

          <!-- Message Content -->
          <view :class="msg.isUser ? 'flex flex-col gap-1 items-end max-w-[80%]' : 'flex flex-col gap-1 max-w-[85%]'">
            <view v-if="!msg.isUser" class="text-[10px] text-slate-400 ml-1">AI 营养师</view>

            <!-- Text Message -->
            <view
              :class="[
                'p-4 rounded-2xl shadow-card',
                msg.isUser
                  ? 'bg-primary text-white rounded-tr-sm shadow-glow'
                  : 'bg-white text-slate-700 rounded-tl-sm border border-slate-100/50'
              ]"
            >
              <text class="text-[15px] leading-relaxed">{{ msg.content }}</text>
            </view>

            <!-- Recipe Card (if exists) -->
            <view v-if="msg.recipeCard" class="flex flex-col bg-slate-50 rounded-xl overflow-hidden border border-slate-100 mt-1 active:bg-slate-100 transition-colors group">
              <view class="relative h-32 w-full bg-orange-100 overflow-hidden">
                <view class="absolute inset-0 flex items-center justify-center opacity-30">
                  <text class="material-symbols-outlined text-[64px] text-orange-400">skillet</text>
                </view>
                <view class="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 flex items-center gap-1 shadow-sm">
                  <text class="material-symbols-outlined text-xs text-orange-500">local_fire_department</text>
                  <text>{{ msg.recipeCard.calories }} 千卡</text>
                </view>
              </view>
              <view class="p-3">
                <text class="font-bold text-slate-800 text-base block mb-1 group-hover:text-primary transition-colors">{{ msg.recipeCard.name }}</text>
                <text class="text-xs text-slate-500 line-clamp-2 mb-3 block">
                  {{ msg.recipeCard.description }}
                </text>
                <view class="flex items-center justify-between border-t border-slate-200 pt-2.5">
                  <view class="flex items-center gap-3">
                    <view class="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                      <text class="material-symbols-outlined text-sm">schedule</text>
                      <text>{{ msg.recipeCard.time }}</text>
                    </view>
                    <view class="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                      <text class="material-symbols-outlined text-sm">restaurant</text>
                      <text>{{ msg.recipeCard.difficulty }}</text>
                    </view>
                  </view>
                  <view @tap="viewRecipe" class="text-xs font-bold text-primary flex items-center">
                    <text>查看食谱</text>
                    <text class="material-symbols-outlined text-sm">chevron_right</text>
                  </view>
                </view>
              </view>
            </view>

            <!-- Timestamp -->
            <text v-if="msg.isUser" class="text-[10px] text-slate-400 mr-1">{{ msg.timestamp }}</text>
          </view>
        </view>
      </view>

      <view class="h-16"></view>
    </scroll-view>

    <!-- Input Footer -->
    <view class="absolute bottom-0 left-0 right-0 bg-white px-4 py-3 pb-8 z-50 shadow-up">
      <view class="flex items-end gap-3">
        <view class="flex-1 bg-slate-100 rounded-[20px] flex items-center px-4 min-h-[50px] transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20">
          <input
            v-model="inputMessage"
            @confirm="sendMessage"
            class="flex-1 bg-transparent border-none p-0 py-3 text-[15px] text-slate-800 placeholder:text-slate-400 focus:ring-0 leading-normal"
            placeholder="输入回复..."
            type="text"
          />
          <view class="text-slate-400 ml-2 p-1">
            <text class="material-symbols-outlined text-[24px]">mic</text>
          </view>
        </view>
        <view
          @tap="sendMessage"
          class="w-[50px] h-[50px] bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-all shrink-0"
        >
          <text class="material-symbols-outlined text-white filled text-[22px] ml-0.5">send</text>
        </view>
      </view>
    </view>
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

<style scoped>
.shadow-glow {
  box-shadow: 0 0 25px -5px rgba(52, 199, 89, 0.4);
}

.shadow-card {
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.03);
}

.shadow-up {
  box-shadow: 0 -4px 20px -2px rgba(0, 0, 0, 0.05);
}

.filled {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.space-y-6 > view + view {
  margin-top: 1.5rem;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
