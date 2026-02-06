<script setup lang="ts">
/**
 * 登录页面
 *
 * 支持邮箱验证码登录、微信登录
 */
import { ref, computed } from 'vue'
import { useAuthStore, validateEmail, validateCode } from '@diet-lens/core'

const authStore = useAuthStore()

// 表单状态
const email = ref<string>('')
const verificationCode = ref<string>('')
const countdown = ref<number>(0)
const emailError = ref<string>('')
const codeError = ref<string>('')

// 计算属性
const canSendCode = computed(() => email.value && authStore.canSendCode)
const canLogin = computed(() => email.value && verificationCode.value.length === 6 && !authStore.loading)

// 倒计时计时器
let countdownTimer: ReturnType<typeof setInterval> | null = null

/**
 * 验证邮箱
 */
const validateEmailInput = (): boolean => {
  const result = validateEmail(email.value)
  if (!result.valid) {
    emailError.value = result.message || '邮箱格式不正确'
    return false
  }
  emailError.value = ''
  return true
}

/**
 * 验证验证码
 */
const validateCodeInput = (): boolean => {
  const result = validateCode(verificationCode.value)
  if (!result.valid) {
    codeError.value = result.message || '验证码格式不正确'
    return false
  }
  codeError.value = ''
  return true
}

/**
 * 发送验证码
 */
const handleSendCode = async () => {
  if (!canSendCode.value) return

  // 验证邮箱格式
  if (!validateEmailInput()) {
    return
  }

  const result = await authStore.sendCode(email.value)

  if (result.success) {
    // 开始倒计时
    countdown.value = 60
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0 && countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }, 1000)

    uni.showToast({
      title: '验证码已发送',
      icon: 'success',
      duration: 2000,
    })
  } else {
    uni.showToast({
      title: result.error || '发送失败',
      icon: 'none',
      duration: 2000,
    })
  }
}

/**
 * 登录
 */
const handleLogin = async () => {
  // 验证邮箱和验证码
  const isEmailValid = validateEmailInput()
  const isCodeValid = validateCodeInput()

  if (!isEmailValid || !isCodeValid) {
    return
  }
  if (!canLogin.value) return

  const result = await authStore.loginWithEmail(email.value, verificationCode.value)

  if (result.success) {
    uni.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1500,
    })

    // 延迟跳转首页
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 500)
  } else {
    uni.showToast({
      title: result.error || '登录失败',
      icon: 'none',
      duration: 2000,
    })
  }
}

/**
 * 微信登录
 */
const handleWechatLogin = () => {
  // TODO: 实现微信登录
  uni.showToast({
    title: '微信登录待实现',
    icon: 'none',
  })
}

/**
 * 跳转注册页
 */
const navigateToRegister = () => {
  uni.redirectTo({ url: '/pages/onboarding/register' })
}

// 组件卸载时清除计时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<template>
  <view class="flex-1 w-full max-w-[430px] mx-auto px-8 flex flex-col bg-[#F5F7F8]">
    <!-- Header -->
    <view class="pt-20 pb-12 flex flex-col items-center">
      <view class="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
        <view class="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
          <text class="material-symbols-outlined text-white text-3xl">qr_code_scanner</text>
        </view>
      </view>
      <text class="text-[32px] font-bold tracking-tight text-[#1C1C1E]">欢迎回来</text>
      <text class="text-gray-400 mt-2 font-medium">请登录您的健康账号</text>
    </view>

    <!-- Form -->
    <view class="space-y-4 flex-1">
      <!-- 邮箱输入 -->
      <view class="relative">
        <input
          v-model="email"
          @blur="validateEmailInput"
          class="w-full h-14 px-5 bg-white border-none rounded-2xl shadow-sm text-[16px] placeholder:text-gray-400 transition-all"
          :class="{ 'border-2 border-red-400': emailError }"
          placeholder="请输入邮箱"
          type="text"
        />
        <text v-if="emailError" class="text-red-500 text-xs mt-1 block">{{ emailError }}</text>
      </view>

      <!-- 验证码输入 -->
      <view class="flex gap-3">
        <view class="flex-1 relative">
          <input
            v-model="verificationCode"
            @blur="validateCodeInput"
            class="w-full h-14 px-5 bg-white border-none rounded-2xl shadow-sm text-[16px] placeholder:text-gray-400 transition-all"
            :class="{ 'border-2 border-red-400': codeError }"
            placeholder="请输入验证码"
            type="text"
            maxlength="6"
          />
          <text v-if="codeError" class="text-red-500 text-xs mt-1 block absolute -bottom-5">{{ codeError }}</text>
        </view>
        <view
          @tap="handleSendCode"
          class="h-14 px-5 bg-white rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0 active:scale-[0.98] transition-all"
          :class="canSendCode ? 'text-primary' : 'text-gray-300'"
        >
          <text class="text-[14px] font-semibold">
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </text>
        </view>
      </view>

      <!-- 登录按钮 -->
      <view
        @tap="handleLogin"
        class="w-full h-14 text-white font-bold text-[17px] rounded-2xl shadow-lg flex items-center justify-center active:scale-[0.98] transition-all"
        :class="canLogin ? 'bg-primary' : 'bg-gray-300'"
      >
        <text v-if="!authStore.loading">登录</text>
        <text v-else>登录中...</text>
      </view>

      <!-- 分隔线 -->
      <view class="flex items-center gap-2 mt-8 opacity-40">
        <view class="h-[1px] flex-1 bg-gray-400"></view>
        <text class="text-[12px] uppercase tracking-widest font-bold">或者</text>
        <view class="h-[1px] flex-1 bg-gray-400"></view>
      </view>

      <!-- 微信登录 -->
      <view
        @tap="handleWechatLogin"
        class="w-full h-12 bg-white text-[#1C1C1E] border border-gray-100 flex items-center justify-center gap-2 rounded-xl px-4 shadow-sm active:scale-[0.98] transition-all"
      >
        <view class="w-6 h-6 flex items-center justify-center">
          <text class="material-symbols-outlined text-xl text-[#07C160]">chat</text>
        </view>
        <text class="text-[15px] font-semibold">微信快速登录</text>
      </view>
    </view>

    <!-- Footer -->
    <view class="pb-10 pt-6 text-center">
      <text class="text-[13px] text-gray-400">
        还没有账号？
        <text @tap="navigateToRegister" class="text-primary font-bold ml-1">立即注册</text>
      </text>
      <view class="mt-8 flex justify-center">
        <text class="text-[11px] text-gray-300 font-medium uppercase tracking-widest">
          AI Smart-Diet Engine
        </text>
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
input {
  -webkit-tap-highlight-color: transparent;
}
</style>
