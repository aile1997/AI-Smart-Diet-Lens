<script setup lang="ts">
/**
 * AI 营养师对话页面
 *
 * 支持问答模式，用户可以通过对话获取个性化餐单建议
 */
import { ref, computed, nextTick, onMounted } from 'vue'
import { useAuthStore, useChat, type UIMessage, sanitizeHTML } from '@diet-lens/core'

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)

const {
  loading,
  error,
  messages,
  isTyping,
  sendMessage: sendChatMessage,
  fetchHistory,
  clearHistory,
} = useChat()

// 输入框内容
const inputMessage = ref('')

// 安全的消息列表（清理富文本内容）
const safeMessages = computed(() => {
  return messages.value.map(msg => ({
    ...msg,
    safeRichContent: msg.richContent ? sanitizeHTML(msg.richContent) : undefined
  }))
})

// 滚动视图引用
const scrollViewRef = ref()

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim()) return

  const content = inputMessage.value
  inputMessage.value = ''

  try {
    await sendChatMessage(content)
    scrollToBottom()
  } catch (err) {
    console.error('发送消息失败:', err)
  }
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    // 使用 uni.pageScrollTo 进行滚动
    uni.pageScrollTo({
      scrollTop: 999999,
      duration: 300
    })
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

// 跳转到登录页
const goToLogin = () => {
  uni.navigateTo({ url: '/pages/onboarding/login' })
}

// 页面加载时获取对话历史
onMounted(async () => {
  if (isLoggedIn.value) {
    await fetchHistory()
  }
})
</script>

<template>
  <view class="page-container flex flex-col h-screen bg-[#F5F7F8]">
    <!-- 未登录提示 -->
    <view v-if="!isLoggedIn" class="flex flex-col items-center justify-center px-10" style="min-height: 80vh;">
      <text class="material-symbols-outlined text-slate-300 text-6xl mb-4">lock</text>
      <text class="text-base font-medium text-slate-600 mb-2">需要登录</text>
      <text class="text-sm text-slate-400 text-center mb-6">请先登录以使用 AI 营养师</text>
      <view class="bg-[#34C759] text-white py-3 px-8 rounded-full font-medium" @tap="goToLogin">
        去登录
      </view>
    </view>

    <template v-else>
      <!-- Header -->
      <view class="flex items-center justify-between px-4 pt-4 pb-3 bg-[#F5F7F8]/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/50">
        <view @tap="navigateBack" class="w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-200/50 transition-colors text-slate-600">
          <text class="material-symbols-outlined">arrow_back_ios_new</text>
        </view>
        <view class="flex flex-col items-center">
          <view class="flex items-center gap-2">
            <text class="text-base font-bold text-[#0e1a13]">AI 营养师对话</text>
            <view v-if="isTyping" class="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(52,199,89,0.6)] animate-pulse"></view>
          </view>
        </view>
        <view class="w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-200/50 transition-colors text-slate-600">
          <text class="material-symbols-outlined">more_horiz</text>
        </view>
      </view>

      <!-- Chat Messages -->
      <scroll-view class="flex-1 px-4 pt-6 pb-4 overflow-y-auto" scroll-y>
        <view class="flex justify-center mb-6">
          <text class="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">今天</text>
        </view>

        <!-- 空状态 -->
        <view v-if="messages.length === 0 && !loading" class="flex flex-col items-center justify-center py-16">
          <view class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <text class="material-symbols-outlined text-primary text-3xl filled">smart_toy</text>
          </view>
          <text class="text-slate-600 text-base font-medium mb-2">你好！我是 AI 营养师</text>
          <text class="text-slate-400 text-sm text-center max-w-[200px]">告诉我你的口味偏好或现有食材，我来为你推荐健康食谱</text>
        </view>

        <view class="space-y-6">
          <!-- AI Message -->
          <view v-for="msg in safeMessages" :key="msg.id" :class="msg.isUser ? 'flex justify-end' : 'flex items-start gap-3'">
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
                <rich-text v-if="msg.safeRichContent" :nodes="msg.safeRichContent" class="text-[15px] leading-relaxed"></rich-text>
                <text v-else class="text-[15px] leading-relaxed">{{ msg.content }}</text>
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

          <!-- Typing Indicator -->
          <view v-if="isTyping" class="flex items-start gap-3">
            <view class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <text class="material-symbols-outlined text-white text-lg filled">smart_toy</text>
            </view>
            <view class="bg-white text-slate-400 p-4 rounded-2xl rounded-tl-sm border border-slate-100/50">
              <view class="flex gap-1">
                <view class="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style="animation-delay: 0ms"></view>
                <view class="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style="animation-delay: 150ms"></view>
                <view class="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style="animation-delay: 300ms"></view>
              </view>
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
              :disabled="isTyping"
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
            :class="[
              'w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all shrink-0',
              isTyping ? 'bg-slate-300' : 'bg-primary shadow-primary/30'
            ]"
          >
            <text class="material-symbols-outlined text-white filled text-[22px] ml-0.5">send</text>
          </view>
        </view>
      </view>
    </template>
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
