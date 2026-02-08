<script setup lang="ts">
/**
 * 注册页面
 *
 * 邮箱+密码+验证码注册流程
 */
import { ref } from 'vue'
import { useAuthStore } from '@diet-lens/core'

const authStore = useAuthStore()
const email = ref<string>('')
const code = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')
const agreePrivacy = ref<boolean>(false)
const countdown = ref<number>(0)
const passwordError = ref<string>('')
const confirmPasswordError = ref<string>('')

const navigateBack = () => {
  uni.navigateBack()
}

const navigateToLogin = () => {
  uni.redirectTo({ url: '/pages/onboarding/login' })
}

const navigateToBodyMetrics = () => {
  uni.navigateTo({ url: '/pages/onboarding/body-metrics' })
}

/**
 * 验证密码
 */
const validatePassword = (): boolean => {
  if (!password.value) {
    passwordError.value = '请输入密码'
    return false
  }
  if (password.value.length < 6) {
    passwordError.value = '密码至少 6 位'
    return false
  }
  passwordError.value = ''
  return true
}

/**
 * 验证确认密码
 */
const validateConfirmPassword = (): boolean => {
  if (!confirmPassword.value) {
    confirmPasswordError.value = '请再次输入密码'
    return false
  }
  if (confirmPassword.value !== password.value) {
    confirmPasswordError.value = '两次密码不一致'
    return false
  }
  confirmPasswordError.value = ''
  return true
}

// 获取验证码
const handleGetCode = async () => {
  if (!email.value) {
    uni.showToast({ title: '请输入邮箱', icon: 'none' })
    return
  }

  const result = await authStore.sendCode(email.value)
  if (result.success) {
    uni.showToast({ title: '验证码已发送', icon: 'success' })
    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } else {
    uni.showToast({ title: result.error || '发送失败', icon: 'none' })
  }
}

// 注册
const handleRegister = async () => {
  // 验证邮箱
  if (!email.value) {
    uni.showToast({ title: '请输入邮箱', icon: 'none' })
    return
  }

  // 验证验证码
  if (!code.value) {
    uni.showToast({ title: '请输入验证码', icon: 'none' })
    return
  }

  // 验证密码
  const isPasswordValid = validatePassword()
  if (!isPasswordValid) {
    return
  }

  // 验证确认密码
  const isConfirmPasswordValid = validateConfirmPassword()
  if (!isConfirmPasswordValid) {
    return
  }

  if (!agreePrivacy.value) {
    uni.showToast({ title: '请同意用户协议', icon: 'none' })
    return
  }

  // 使用邮箱+密码+验证码注册
  const result = await authStore.registerWithPassword(email.value, password.value, code.value)

  if (result.success) {
    // 注册成功，检查是否需要完成入职引导
    if (result.user?.needOnboarding) {
      navigateToBodyMetrics()
    } else {
      // 已完成入职引导，跳转到首页
      uni.switchTab({ url: '/pages/index/index' })
    }
  } else {
    uni.showToast({ title: result.error || '注册失败', icon: 'none' })
  }
}
</script>

<template>
  <view class="relative w-full min-h-screen flex flex-col px-6 pt-12 pb-10 max-w-md mx-auto bg-[#F5F7F8]">
    <!-- Back Button -->
    <view class="mb-8">
      <view @tap="navigateBack" class="flex items-center text-primary -ml-1 active:opacity-70">
        <text class="material-symbols-outlined text-2xl">chevron_left</text>
        <text class="text-base">返回</text>
      </view>
    </view>

    <!-- Header -->
    <view class="mb-10">
      <text class="text-3xl font-bold tracking-tight text-[#1C1C1E]">创建新账号</text>
      <text class="text-[#8E8E93] mt-2 text-sm">开启您的 AI 智能健康饮食之旅</text>
    </view>

    <!-- Form -->
    <view class="flex-1 flex flex-col gap-5">
      <!-- Email -->
      <view class="space-y-1.5">
        <text class="text-xs font-semibold text-[#8E8E93] ml-1 uppercase tracking-wider">邮箱</text>
        <view class="relative">
          <input
            v-model="email"
            class="w-full h-[54px] bg-white border border-[#E5E5EA] rounded-2xl px-4 text-base placeholder:text-[#C7C7CC] transition-all"
            placeholder="请输入您的邮箱"
            type="email"
          />
        </view>
      </view>

      <!-- Verification Code -->
      <view class="space-y-1.5">
        <text class="text-xs font-semibold text-[#8E8E93] ml-1 uppercase tracking-wider">验证码</text>
        <view class="relative flex gap-3">
          <input
            v-model="code"
            class="flex-1 h-[54px] bg-white border border-[#E5E5EA] rounded-2xl px-4 text-base placeholder:text-[#C7C7CC] transition-all"
            placeholder="输入 6 位验证码"
            type="text"
            maxlength="6"
          />
          <view
            @tap="handleGetCode"
            :class="[
              'px-5 h-[54px] border font-semibold rounded-2xl text-sm whitespace-nowrap flex items-center justify-center transition-colors',
              countdown > 0
                ? 'bg-[#F5F7F8] border-[#E5E5EA] text-[#8E8E93]'
                : 'bg-white border-primary text-primary active:bg-primary/5'
            ]"
          >
            {{ countdown > 0 ? `${countdown}秒` : '获取验证码' }}
          </view>
        </view>
      </view>

      <!-- Password -->
      <view class="space-y-1.5">
        <text class="text-xs font-semibold text-[#8E8E93] ml-1 uppercase tracking-wider">密码</text>
        <view class="relative">
          <input
            v-model="password"
            @blur="validatePassword"
            class="w-full h-[54px] bg-white border border-[#E5E5EA] rounded-2xl px-4 text-base placeholder:text-[#C7C7CC] transition-all"
            :class="{ 'border-red-500': passwordError }"
            placeholder="设置密码（至少 6 位）"
            type="password"
            maxlength="20"
          />
          <text v-if="passwordError" class="text-red-500 text-xs mt-1 block">{{ passwordError }}</text>
        </view>
      </view>

      <!-- Confirm Password -->
      <view class="space-y-1.5">
        <text class="text-xs font-semibold text-[#8E8E93] ml-1 uppercase tracking-wider">确认密码</text>
        <view class="relative">
          <input
            v-model="confirmPassword"
            @blur="validateConfirmPassword"
            class="w-full h-[54px] bg-white border border-[#E5E5EA] rounded-2xl px-4 text-base placeholder:text-[#C7C7CC] transition-all"
            :class="{ 'border-red-500': confirmPasswordError }"
            placeholder="再次输入密码"
            type="password"
            maxlength="20"
          />
          <text v-if="confirmPasswordError" class="text-red-500 text-xs mt-1 block">{{ confirmPasswordError }}</text>
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
        <text class="text-xs text-[#8E8E93] leading-[1.4]">
          我已阅读并同意 <text class="text-primary font-medium">用户服务协议</text> 和 <text class="text-primary font-medium">隐私政策</text>
        </text>
      </view>
    </view>

    <!-- Register Button -->
    <view class="mt-8 flex flex-col gap-6">
      <view
        @tap="handleRegister"
        class="w-full h-[58px] bg-primary text-white font-bold text-base rounded-2xl shadow-[0_8px_20px_-4px_rgba(52,199,89,0.3)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
      >
        注册
      </view>
      <view class="flex justify-center">
        <view @tap="navigateToLogin" class="text-sm font-medium text-[#1C1C1E]">
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
