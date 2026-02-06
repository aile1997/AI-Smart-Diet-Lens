<script setup lang="ts">
/**
 * 注册页面
 *
 * 用户注册界面，包含手机号验证码注册流程
 */
import { ref } from 'vue'
import { logger } from '@diet-lens/core'

const phone = ref<string>('')
const code = ref<string>('')
const password = ref<string>('')
const agreePrivacy = ref<boolean>(false)

const navigateBack = () => {
  uni.navigateBack()
}

const navigateToLogin = () => {
  uni.redirectTo({ url: '/pages/onboarding/login' })
}

const navigateToBodyMetrics = () => {
  uni.navigateTo({ url: '/pages/onboarding/body-metrics' })
}

const handleGetCode = () => {
  // TODO: 实现获取验证码逻辑
  logger.debug('请求发送验证码')
}

const handleRegister = () => {
  if (!agreePrivacy.value) {
    uni.showToast({ title: '请同意用户协议', icon: 'none' })
    return
  }
  // TODO: 实现注册逻辑
  logger.debug('用户注册请求')
  navigateToBodyMetrics()
}
</script>

<template>
  <view class="relative w-full min-h-screen flex flex-col px-6 pt-12 pb-10 max-w-md mx-auto bg-[#F5F7F8]">
    <!-- Back Button -->
    <view class="mb-8">
      <view @tap="navigateBack" class="flex items-center text-primary -ml-1 active:opacity-70">
        <text class="material-symbols-outlined text-[28px]">chevron_left</text>
        <text class="text-[17px]">返回</text>
      </view>
    </view>

    <!-- Header -->
    <view class="mb-10">
      <text class="text-[32px] font-bold tracking-tight text-[#1C1C1E]">创建新账号</text>
      <text class="text-[#8E8E93] mt-2 text-[15px]">开启您的 AI 智能健康饮食之旅</text>
    </view>

    <!-- Form -->
    <view class="flex-1 flex flex-col gap-5">
      <!-- Phone -->
      <view class="space-y-1.5">
        <text class="text-[13px] font-semibold text-[#8E8E93] ml-1 uppercase tracking-wider">手机号</text>
        <view class="relative">
          <input
            v-model="phone"
            class="w-full h-[54px] bg-white border border-[#E5E5EA] rounded-2xl px-4 text-[16px] placeholder:text-[#C7C7CC] transition-all"
            placeholder="请输入您的手机号"
            type="tel"
          />
        </view>
      </view>

      <!-- Verification Code -->
      <view class="space-y-1.5">
        <text class="text-[13px] font-semibold text-[#8E8E93] ml-1 uppercase tracking-wider">验证码</text>
        <view class="relative flex gap-3">
          <input
            v-model="code"
            class="flex-1 h-[54px] bg-white border border-[#E5E5EA] rounded-2xl px-4 text-[16px] placeholder:text-[#C7C7CC] transition-all"
            placeholder="输入 6 位验证码"
            type="text"
            maxlength="6"
          />
          <view
            @tap="handleGetCode"
            class="px-5 h-[54px] bg-white border border-primary text-primary font-semibold rounded-2xl text-[14px] whitespace-nowrap flex items-center justify-center active:bg-primary/5 transition-colors"
          >
            获取验证码
          </view>
        </view>
      </view>

      <!-- Password -->
      <view class="space-y-1.5">
        <text class="text-[13px] font-semibold text-[#8E8E93] ml-1 uppercase tracking-wider">设置密码</text>
        <view class="relative">
          <input
            v-model="password"
            class="w-full h-[54px] bg-white border border-[#E5E5EA] rounded-2xl px-4 text-[16px] placeholder:text-[#C7C7CC] transition-all pr-12"
            placeholder="至少 8 位包含数字与字母"
            type="password"
          />
          <view class="absolute right-4 top-1/2 -translate-y-1/2 text-[#C7C7CC]">
            <text class="material-symbols-outlined">visibility_off</text>
          </view>
        </view>
      </view>

      <!-- Privacy Agreement -->
      <view class="flex items-start gap-3 mt-2 px-1">
        <view
          @tap="agreePrivacy = !agreePrivacy"
          class="relative flex items-center"
        >
          <view
            :class="[
              'w-5 h-5 rounded-md border flex items-center justify-center transition-all',
              agreePrivacy ? 'bg-primary border-primary' : 'border-[#D1D1D6]'
            ]"
          >
            <text v-if="agreePrivacy" class="material-symbols-outlined text-white text-sm">check</text>
          </view>
        </view>
        <text class="text-[13px] text-[#8E8E93] leading-[1.4]">
          我已阅读并同意 <text class="text-primary font-medium">用户服务协议</text> 和 <text class="text-primary font-medium">隐私政策</text>
        </text>
      </view>
    </view>

    <!-- Register Button -->
    <view class="mt-8 flex flex-col gap-6">
      <view
        @tap="handleRegister"
        class="w-full h-[58px] bg-primary text-white font-bold text-[17px] rounded-2xl shadow-[0_8px_20px_-4px_rgba(52,199,89,0.3)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
      >
        注册
      </view>
      <view class="flex justify-center">
        <view @tap="navigateToLogin" class="text-[15px] font-medium text-[#1C1C1E]">
          已有账号？<text class="text-primary">立即登录</text>
        </view>
      </view>
    </view>

    <!-- Footer -->
    <view class="mt-12 flex flex-col items-center opacity-30">
      <view class="bg-[#1C1C1E] rounded-full p-1.5 mb-2">
        <text class="material-symbols-outlined text-white text-base">qr_code_scanner</text>
      </view>
      <text class="text-[10px] font-bold tracking-[0.2em] uppercase">AI Smart-Diet Lens</text>
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
/* Register page specific styles */
input {
  -webkit-tap-highlight-color: transparent;
}
</style>
