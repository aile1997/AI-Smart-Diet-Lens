<script setup lang="ts">
/**
 * 登录页面 - 简化版
 *
 * 只需要输入邮箱即可登录
 * 如果用户不存在则自动创建
 */
import { ref, computed } from "vue";
import { useAuthStore, validateEmail } from "@diet-lens/core";

const authStore = useAuthStore();

// 表单状态
const email = ref<string>("");
const emailError = ref<string>("");

// 计算属性
const canLogin = computed(() => email.value && !authStore.loading);

/**
 * 验证邮箱
 */
const validateEmailInput = (): boolean => {
  const result = validateEmail(email.value);
  if (!result.valid) {
    emailError.value = result.message || "邮箱格式不正确";
    return false;
  }
  emailError.value = "";
  return true;
};

/**
 * 简化登录 - 只需要邮箱
 */
const handleLogin = async () => {
  // 验证邮箱格式
  if (!validateEmailInput()) {
    return;
  }
  if (!canLogin.value) return;

  const result = await authStore.loginSimple(email.value);

  if (result.success) {
    uni.showToast({
      title: "登录成功",
      icon: "success",
      duration: 1500,
    });

    // 检查用户是否完成 onboarding
    // 如果未完成，跳转到身体指标页面；否则跳转到首页
    setTimeout(() => {
      if (result.user && result.user.needOnboarding) {
        uni.navigateTo({ url: "/pages/onboarding/body-metrics" });
      } else {
        uni.switchTab({ url: "/pages/index/index" });
      }
    }, 500);
  } else {
    uni.showToast({
      title: result.error || "登录失败",
      icon: "none",
      duration: 2000,
    });
  }
};
</script>

<template>
  <view class="flex-1 w-full max-w-[430px] mx-auto px-8 flex flex-col bg-[#F5F7F8]">
    <!-- Header -->
    <view class="pt-16 pb-8 flex flex-col items-center">
      <view class="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
        <view class="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
          <text class="material-symbols-outlined text-white text-3xl">qr_code_scanner</text>
        </view>
      </view>
      <text class="text-3xl font-bold tracking-tight text-[#1C1C1E]">欢迎回来</text>
      <text class="text-gray-400 mt-2 font-medium">请登录您的健康账号</text>
    </view>

    <!-- 邮箱登录 -->
    <view class="space-y-4 flex-1">
      <!-- 邮箱输入 -->
      <view class="relative">
        <input
          v-model="email"
          @blur="validateEmailInput"
          class="w-full h-14 px-5 bg-white border-none rounded-2xl shadow-sm text-base placeholder:text-gray-400 transition-all"
          :class="{ 'border-2 border-red-400': emailError }"
          placeholder="请输入邮箱"
          type="text"
        />
        <text v-if="emailError" class="text-red-500 text-xs mt-1 block">{{ emailError }}</text>
      </view>

      <!-- 登录按钮 -->
      <view
        @tap="handleLogin"
        class="w-full h-14 text-white font-bold text-base rounded-2xl shadow-lg flex items-center justify-center active:scale-[0.98] transition-all"
        :class="canLogin ? 'bg-primary' : 'bg-gray-300'"
      >
        <text v-if="!authStore.loading">登录</text>
        <text v-else>登录中...</text>
      </view>
    </view>

    <!-- Footer -->
    <view class="pb-10 pt-6 text-center">
      <text class="text-xs text-gray-400">
        只需要邮箱即可登录，首次使用自动创建账号
      </text>
      <view class="mt-8 flex justify-center">
        <text class="text-[10px] text-gray-300 font-medium uppercase tracking-widest">
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
