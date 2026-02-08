<script setup lang="ts">
/**
 * 欢迎页
 *
 * 首次使用时的引导页面
 * 体验版可以直接进入模式设置
 */
const navigateToLogin = () => {
  uni.navigateTo({ url: "/pages/onboarding/login" });
};

const navigateToRegister = () => {
  uni.navigateTo({ url: "/pages/onboarding/register" });
};

// 体验版：直接进入模式设置
const startTrial = () => {
  uni.navigateTo({ url: "/pages/onboarding/body-metrics" });
};
</script>

<template>
  <view class="w-full h-screen flex flex-col relative overflow-hidden max-w-md mx-auto">
    <!-- Full Screen Background Image -->
    <view class="fixed inset-0 z-0">
      <!-- Initial slight dim -->
      <view class="absolute inset-0 bg-black/20 z-10"></view>
      <!-- Background Image -->
      <image
        src="/static/images/food/food_8.jpg"
        class="w-full h-full bg-cover bg-center"
        mode="aspectFill"
      ></image>
      <!-- Bottom Gradient Overlay -->
      <view class="absolute inset-x-0 bottom-0 h-3/4 scrim-gradient z-20 pointer-events-none"></view>
    </view>

    <!-- Header / Status Bar Area -->
    <view class="relative z-30 w-full pt-14 px-6 flex justify-center">
      <!-- Glassmorphism Pill Badge -->
      <view class="flex items-center gap-2.5 bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2.5 rounded-full shadow-lg">
        <view class="bg-primary rounded-full p-1 flex items-center justify-center">
          <text class="material-symbols-outlined text-gray-900 text-base">qr_code_scanner</text>
        </view>
        <text class="text-white text-xs font-bold tracking-widest uppercase opacity-90">AI Smart-Diet Lens</text>
      </view>
    </view>

    <!-- Main Content Area -->
    <view class="relative z-30 flex-1 flex flex-col justify-end px-6 pb-12 w-full">
      <!-- Headlines -->
      <view class="flex flex-col items-start mb-10">
        <text class="text-white text-5xl font-extrabold leading-[1.05] tracking-tight mb-4"> Eat Smarter, </text>
        <text class="text-5xl font-extrabold leading-[1.05] tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-200">
          Not Less
        </text>
        <text class="text-gray-200 text-lg font-medium leading-relaxed max-w-[90%]">
          Unlock your metabolic potential with AI-powered nutrition tracking for a better you.
        </text>
      </view>

      <!-- Action Buttons -->
      <view class="flex flex-col gap-4 w-full">
        <!-- Primary Action Button -->
        <view
          @tap="startTrial"
          class="relative w-full h-14 overflow-hidden rounded-2xl p-[1px] shadow-[0_0_40px_-10px_rgba(56,224,123,0.6)] active:scale-[0.98] transition-transform duration-200"
        >
          <!-- Button Border Gradient -->
          <view class="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 rounded-2xl opacity-100"></view>
          <!-- Button Inner Background -->
          <view class="relative h-full w-full bg-primary/90 backdrop-blur-md rounded-[14px] flex items-center justify-center gap-2">
            <text class="text-gray-900 text-base font-bold tracking-wide">立即体验</text>
            <text class="material-symbols-outlined text-gray-900 text-xl">arrow_forward</text>
          </view>
        </view>

        <!-- Secondary Actions -->
        <view class="flex gap-3">
          <view @tap="navigateToLogin" class="flex-1 py-3 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm active:scale-[0.98] transition-transform">
            <text class="text-white/90 text-sm font-semibold tracking-wide">登录</text>
          </view>
          <view @tap="navigateToRegister" class="flex-1 py-3 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm active:scale-[0.98] transition-transform">
            <text class="text-white/90 text-sm font-semibold tracking-wide">注册</text>
          </view>
        </view>
      </view>

      <!-- Footer -->
      <view class="mt-8 flex justify-center">
        <text class="text-white/40 text-[10px] font-medium tracking-wider uppercase text-center"> Powered by Smart-Diet AI Engine </text>
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
/* Scrim gradient for bottom fade */
.scrim-gradient {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.6) 30%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0) 100%);
}

.bg-gradient-to-r {
  background: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-primary\/80 {
  --tw-gradient-from: rgba(56, 224, 123, 0.8);
  --tw-gradient-to: rgba(56, 224, 123, 0.8);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-primary\/40 {
  --tw-gradient-to: rgba(56, 224, 123, 0.4);
}

.from-primary {
  --tw-gradient-from: #38e07b;
  --tw-gradient-to: #38e07b;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-green-200 {
  --tw-gradient-to: #bcefd6;
}

.bg-clip-text {
  background-clip: text;
  -webkit-background-clip: text;
}

.text-transparent {
  color: transparent;
}

.bg-primary\/90 {
  background-color: rgba(56, 224, 123, 0.9);
}
</style>
