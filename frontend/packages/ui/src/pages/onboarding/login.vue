<script setup lang="ts">
/**
 * 登录页面
 *
 * 用户登录界面，支持邮箱/手机号登录、Apple 登录、微信登录
 */
import { ref } from 'vue'

const email = ref<string>('')
const password = ref<string>('')

const navigateToRegister = () => {
  uni.redirectTo({ url: '/pages/onboarding/register' })
}

const handleLogin = () => {
  // TODO: 实现登录逻辑
  console.log('Login', { email: email.value, password: password.value })
  uni.switchTab({ url: '/pages/index/index' })
}

const handleForgotPassword = () => {
  // TODO: 实现忘记密码逻辑
  console.log('Forgot password')
}

const handleAppleLogin = () => {
  // TODO: 实现 Apple 登录
  console.log('Apple login')
}

const handleWechatLogin = () => {
  // TODO: 实现微信登录
  console.log('Wechat login')
}
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
      <view class="space-y-4">
        <view class="relative">
          <input
            v-model="email"
            class="w-full h-14 px-5 bg-white border-none rounded-2xl shadow-sm text-[16px] placeholder:text-gray-400 transition-all"
            placeholder="邮箱/手机号"
            type="text"
          />
        </view>
        <view class="relative">
          <input
            v-model="password"
            class="w-full h-14 px-5 bg-white border-none rounded-2xl shadow-sm text-[16px] placeholder:text-gray-400 transition-all"
            placeholder="密码"
            type="password"
          />
        </view>
      </view>

      <view class="flex justify-end pt-1">
        <text @tap="handleForgotPassword" class="text-[14px] font-medium text-primary active:opacity-80">忘记密码？</text>
      </view>

      <view
        @tap="handleLogin"
        class="w-full h-14 bg-primary text-white font-bold text-[17px] rounded-2xl shadow-lg flex items-center justify-center active:scale-[0.98] transition-all"
      >
        登录
      </view>

      <view class="flex items-center gap-2 mt-8 opacity-40">
        <view class="h-[1px] flex-1 bg-gray-400"></view>
        <text class="text-[12px] uppercase tracking-widest font-bold">或者</text>
        <view class="h-[1px] flex-1 bg-gray-400"></view>
      </view>

      <view class="flex flex-col gap-3 mt-8">
        <view
          @tap="handleAppleLogin"
          class="w-full h-12 bg-black text-white flex items-center justify-center gap-2 rounded-xl px-4 active:scale-[0.98] transition-all"
        >
          <view class="w-5 h-5 flex items-center justify-center">
            <text class="material-symbols-outlined text-lg">apple</text>
          </view>
          <text class="text-[15px] font-semibold">通过 Apple 登录</text>
        </view>

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
/* Login page specific styles */
input {
  -webkit-tap-highlight-color: transparent;
}
</style>
