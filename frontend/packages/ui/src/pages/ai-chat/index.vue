<script setup lang="ts">
/**
 * AI 营养师对话页面
 *
 * 支持问答模式，用户可以通过对话获取个性化餐单建议
 * 无需登录即可使用
 */
import { ref, computed, nextTick, onMounted } from "vue";
import { useAuthStore, useChat, type UIMessage, sanitizeHTML } from "@diet-lens/core";

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);

const { loading, error, messages, isTyping, sendMessage: sendChatMessage, fetchHistory, clearHistory } = useChat();

// 输入框内容
const inputMessage = ref("");
const textareaDisabled = ref(false);

// 滚动位置 - 使用递增值确保每次都能触发滚动
const scrollTop = ref(0);
const scrollTrigger = ref(0);

// 安全的消息列表（清理富文本内容）
const safeMessages = computed(() => {
  return messages.value.map((msg) => ({
    ...msg,
    safeRichContent: msg.richContent ? sanitizeHTML(msg.richContent) : undefined,
  }));
});

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || textareaDisabled.value) return;

  const content = inputMessage.value;
  inputMessage.value = "";

  try {
    await sendChatMessage(content);
    scrollToBottom();
  } catch (err) {
    console.error("发送消息失败:", err);
  }
};

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    // 递增 scrollTrigger 确保每次都能触发滚动
    scrollTrigger.value += 1;
    scrollTop.value = scrollTrigger.value * 10000;
  });
};

// 输入框聚焦
const onInputFocus = () => {
  // 延迟滚动，确保键盘弹出后再滚动
  setTimeout(() => {
    scrollToBottom();
  }, 300);
};

// 返回
const navigateBack = () => {
  uni.navigateBack();
};

// 查看食谱详情
const viewRecipe = (recipe: any) => {
  // 将食谱数据转换为 JSON 字符串并通过 URL 参数传递
  const recipeData = encodeURIComponent(JSON.stringify(recipe));
  uni.navigateTo({
    url: `/pages/recipe-detail/index?data=${recipeData}`,
  });
};

// 跳转到登录页
const goToLogin = () => {
  uni.navigateTo({ url: "/pages/onboarding/login" });
};

// 页面加载时获取对话历史
onMounted(async () => {
  console.log("[ai-chat] 页面加载，登录状态:", isLoggedIn.value);

  if (isLoggedIn.value) {
    console.log("[ai-chat] 已登录，开始获取对话历史...");
    await fetchHistory();
    console.log("[ai-chat] fetchHistory 完成，当前消息数量:", messages.value.length);
  } else {
    console.log("[ai-chat] 未登录，跳过获取历史");
  }
});
</script>

<template>
  <view class="page-container">
    <!-- 未登录提示 -->
    <view v-if="!isLoggedIn" class="login-required">
      <view class="login-icon">
        <text class="material-symbols-outlined">lock</text>
      </view>
      <text class="login-title">需要登录</text>
      <text class="login-desc">请先登录以使用 AI 营养师</text>
      <view class="login-btn" @tap="goToLogin">
        <text>去登录</text>
      </view>
    </view>

    <template v-else>
      <!-- Header -->
      <view class="header">
        <view @tap="navigateBack" class="header-btn">
          <text class="material-symbols-outlined">arrow_back_ios_new</text>
        </view>
        <view class="header-center">
          <text class="header-title">AI 营养师对话</text>
          <view v-if="isTyping" class="typing-dot"></view>
        </view>
        <view class="header-btn">
          <text class="material-symbols-outlined">more_horiz</text>
        </view>
      </view>

      <!-- Chat Messages -->
      <scroll-view class="chat-scroll" scroll-y :scroll-top="scrollTop" :scroll-with-animation="true">
        <view class="date-badge">
          <text>今天</text>
        </view>

        <!-- 空状态 -->
        <view v-if="messages.length === 0 && !loading" class="empty-state">
          <view class="empty-icon">
            <text class="material-symbols-outlined filled">smart_toy</text>
          </view>
          <text class="empty-title">你好！我是 AI 营养师</text>
          <text class="empty-desc">告诉我你的口味偏好或现有食材，我来为你推荐健康食谱</text>
        </view>

        <view class="messages-list">
          <!-- AI Message -->
          <view v-for="msg in safeMessages" :key="msg.id" :class="['message-item', msg.isUser ? 'user-message' : 'ai-message']">
            <!-- AI Avatar -->
            <view v-if="!msg.isUser" class="ai-avatar">
              <text class="material-symbols-outlined filled">smart_toy</text>
            </view>

            <!-- Message Content -->
            <view :class="['message-content', msg.isUser ? 'user-content' : 'ai-content']">
              <view v-if="!msg.isUser" class="message-sender">AI 营养师</view>

              <!-- Text Message -->
              <view :class="['message-bubble', msg.isUser ? 'user-bubble' : 'ai-bubble']">
                <rich-text v-if="msg.safeRichContent" :nodes="msg.safeRichContent" class="message-text"></rich-text>
                <text v-else class="message-text">{{ msg.content }}</text>
              </view>

              <!-- Recipe Card (if exists) -->
              <view v-if="msg.recipeCard" class="recipe-card" @tap="viewRecipe(msg.recipeCard)">
                <view class="recipe-image">
                  <view class="recipe-image-bg">
                    <text class="material-symbols-outlined">skillet</text>
                  </view>
                  <view class="recipe-calories">
                    <text class="material-symbols-outlined">local_fire_department</text>
                    <text>{{ msg.recipeCard.calories }} 千卡</text>
                  </view>
                </view>
                <view class="recipe-info">
                  <text class="recipe-name">{{ msg.recipeCard.name }}</text>
                  <text class="recipe-desc">{{ msg.recipeCard.description }}</text>
                  <view class="recipe-meta">
                    <view class="meta-item">
                      <text class="material-symbols-outlined">schedule</text>
                      <text>{{ msg.recipeCard.time }}</text>
                    </view>
                    <view class="meta-item">
                      <text class="material-symbols-outlined">restaurant</text>
                      <text>{{ msg.recipeCard.difficulty }}</text>
                    </view>
                    <view class="recipe-action">
                      <text>查看食谱</text>
                      <text class="material-symbols-outlined">chevron_right</text>
                    </view>
                  </view>
                </view>
              </view>

              <!-- Timestamp -->
              <text v-if="msg.isUser" class="message-time">{{ msg.timestamp }}</text>
            </view>
          </view>

          <!-- Typing Indicator -->
          <view v-if="isTyping" class="message-item ai-message">
            <view class="ai-avatar">
              <text class="material-symbols-outlined filled">smart_toy</text>
            </view>
            <view class="message-content ai-content">
              <view class="message-bubble ai-bubble typing-bubble">
                <view class="typing-dots">
                  <view class="typing-dot"></view>
                  <view class="typing-dot"></view>
                  <view class="typing-dot"></view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="scroll-spacer"></view>
      </scroll-view>

      <!-- Input Footer -->
      <view class="input-footer">
        <view class="input-container">
          <view class="input-wrapper">
            <textarea
              v-model="inputMessage"
              @confirm="sendMessage"
              @focus="onInputFocus"
              @blur="onInputFocus"
              :disabled="isTyping"
              class="input-textarea"
              :placeholder="isTyping ? 'AI 正在输入...' : '输入回复...'"
              :auto-height="true"
              :maxlength="500"
              :hold-keyboard="true"
              :cursor-spacing="10"
            />
            <view class="input-mic">
              <text class="material-symbols-outlined">mic</text>
            </view>
          </view>
          <view @tap="sendMessage" :class="['send-btn', isTyping ? 'send-btn-disabled' : 'send-btn-active']">
            <text class="material-symbols-outlined filled">send</text>
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
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f7fa;
  overflow: hidden;
}

/* 未登录提示 */
.login-required {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 0 40px;
}

.login-icon {
  margin-bottom: 16px;
}

.login-icon .material-symbols-outlined {
  font-size: 48px;
  color: #cbd5e1;
}

.login-title {
  font-size: 16px;
  font-weight: 500;
  color: #475569;
  margin-bottom: 8px;
}

.login-desc {
  font-size: 14px;
  color: #94a3b8;
  text-align: center;
  margin-bottom: 24px;
}

.login-btn {
  background: #34c759;
  color: white;
  padding: 12px 32px;
  border-radius: 9999px;
  font-weight: 500;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 12px;
  background: rgba(245, 247, 248, 0.9);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
}

.header-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
}

.header-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #0e1a13;
  display: flex;
  align-items: center;
  gap: 8px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #34c759;
  box-shadow: 0 0 8px rgba(52, 199, 89, 0.6);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Chat Scroll */
.chat-scroll {
  flex: 1;
  padding: 16px;
  padding-bottom: 24px;
  overflow-y: auto;
}

.date-badge {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.date-badge text {
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 4px 12px;
  border-radius: 9999px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(52, 199, 89, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.empty-icon .material-symbols-outlined {
  font-size: 32px;
  color: #34c759;
}

.empty-title {
  font-size: 16px;
  font-weight: 500;
  color: #475569;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: #94a3b8;
  text-align: center;
  max-width: 200px;
}

/* Messages List */
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.message-item {
  display: flex;
  gap: 12px;
}

.message-item.user-message {
  justify-content: flex-end;
}

.ai-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(to bottom right, #34c759, #28a745);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(52, 199, 89, 0.2);
  flex-shrink: 0;
}

.ai-avatar .material-symbols-outlined {
  color: white;
  font-size: 20px;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 85%;
}

.user-content {
  align-items: flex-end;
  max-width: 80%;
}

.message-sender {
  font-size: 10px;
  color: #94a3b8;
  margin-left: 4px;
}

.message-bubble {
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.03);
}

.ai-bubble {
  background: white;
  color: #334155;
  border-radius: 16px 16px 16px 4px;
  border: 1px solid rgba(248, 250, 252, 0.5);
}

.user-bubble {
  background: #34c759;
  color: white;
  border-radius: 16px 4px 16px 16px;
  box-shadow: 0 0 25px -5px rgba(52, 199, 89, 0.4);
}

.message-text {
  font-size: 15px;
  line-height: 1.6;
}

.user-bubble .message-text {
  color: white;
}

/* Recipe Card */
.recipe-card {
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
  margin-top: 4px;
}

.recipe-image {
  position: relative;
  height: 128px;
  background: #fed7aa;
  overflow: hidden;
}

.recipe-image-bg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
}

.recipe-image-bg .material-symbols-outlined {
  font-size: 64px;
  color: #fb923c;
}

.recipe-calories {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.recipe-calories .material-symbols-outlined {
  font-size: 12px;
  color: #f97316;
}

.recipe-info {
  padding: 12px;
}

.recipe-name {
  font-weight: 700;
  color: #1e293b;
  font-size: 16px;
  margin-bottom: 4px;
}

.recipe-desc {
  font-size: 12px;
  color: #64748b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

.recipe-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #e2e8f0;
  padding-top: 10px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #64748b;
  font-weight: 500;
}

.meta-item .material-symbols-outlined {
  font-size: 16px;
}

.recipe-action {
  font-size: 12px;
  font-weight: 700;
  color: #34c759;
  display: flex;
  align-items: center;
}

.recipe-action .material-symbols-outlined {
  font-size: 16px;
}

.message-time {
  font-size: 10px;
  color: #94a3b8;
  margin-right: 4px;
}

/* Typing Bubble */
.typing-bubble {
  background: white !important;
  color: #94a3b8 !important;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-bubble .typing-dot {
  width: 8px;
  height: 8px;
  background: #cbd5e1;
  border-radius: 50%;
  animation: typing-bounce 1.4s ease-in-out infinite;
}

.typing-bubble .typing-dot:nth-child(1) {
  animation-delay: 0ms;
}

.typing-bubble .typing-dot:nth-child(2) {
  animation-delay: 150ms;
}

.typing-bubble .typing-dot:nth-child(3) {
  animation-delay: 300ms;
}

@keyframes typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-8px);
  }
}

/* Scroll Spacer */
.scroll-spacer {
  height: 100px;
}

/* Input Footer */
.input-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  z-index: 100;
  box-shadow: 0 -4px 20px -2px rgba(0, 0, 0, 0.05);
}

.input-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.input-wrapper {
  flex: 1;
  background: #f1f5f9;
  border-radius: 20px;
  display: flex;
  align-items: center;
  height: 44px;
  width: 55px;
  transition: background 0.2s;
}

.input-wrapper:focus-within {
  background: white;
  box-shadow: 0 0 0 2px rgba(52, 199, 89, 0.2);
}

.input-textarea {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0;
  font-size: 15px;
  color: #1e293b;
  line-height: 22px;
  height: 22px;
  max-height: 22px;
  margin-left: 12px;
}

.input-textarea::placeholder {
  color: #94a3b8;
}

.input-mic {
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  margin-left: 4px;
}

.input-mic .material-symbols-outlined {
  font-size: 22px;
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-btn-active {
  background: #34c759;
  box-shadow: 0 8px 16px -4px rgba(52, 199, 89, 0.3);
}

.send-btn-active:active {
  transform: scale(0.95);
}

.send-btn-disabled {
  background: #cbd5e1;
}

.send-btn .material-symbols-outlined {
  color: white;
  font-size: 20px;
}

.filled {
  font-variation-settings:
    "FILL" 1,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}
</style>
