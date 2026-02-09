<script setup lang="ts">
/**
 * 系统设置页面
 *
 * 个人信息、同步设置、通知权限、缓存管理
 */
import { ref, computed, onMounted } from "vue";
import BottomNav from "@/components/BottomNav.vue";
import { useUserStore } from "@diet-lens/core";

const userStore = useUserStore();

// 用户显示名称
const userName = computed(() => userStore.displayName);

// 返回
const navigateBack = () => {
  uni.navigateBack();
};

// Apple Health 同步开关
const syncAppleHealth = ref(true);

// 从本地存储读取同步设置
onMounted(() => {
  const savedSync = uni.getStorageSync("syncAppleHealth");
  if (savedSync !== "") {
    syncAppleHealth.value = savedSync;
  }
});

// 切换开关
const toggleSync = () => {
  syncAppleHealth.value = !syncAppleHealth.value;
  uni.setStorageSync("syncAppleHealth", syncAppleHealth.value);
  uni.showToast({
    title: syncAppleHealth.value ? "已开启同步" : "已关闭同步",
    icon: "none",
  });
};

// 点击菜单项
const handleMenuClick = (type: string) => {
  switch (type) {
    case "profile":
      // 跳转到个人资料编辑页
      uni.navigateTo({ url: "/pages/profile/edit" });
      break;
    case "notifications":
      uni.openSetting({
        success: (res) => {
          console.log("通知设置结果", res);
        },
      });
      break;
    case "cache":
      uni.showModal({
        title: "清除缓存",
        content: "确定要清除缓存吗？",
        success: (res) => {
          if (res.confirm) {
            clearCache();
          }
        },
      });
      break;
  }
};

// 清除缓存
const clearCache = () => {
  try {
    // 获取存储信息
    const storageInfo = uni.getStorageInfoSync();
    const cacheSize = storageInfo.currentSize || 0;

    // 清除除 token 外的缓存
    const token = uni.getStorageSync("token");
    uni.clearStorageSync();

    // 恢复 token
    if (token) {
      uni.setStorageSync("token", token);
    }

    uni.showToast({
      title: `已清除 ${cacheSize}KB 缓存`,
      icon: "success",
    });

    // 重新计算缓存大小
    calculateCacheSize();
  } catch (error) {
    console.error("清除缓存失败:", error);
    uni.showToast({
      title: "清除失败",
      icon: "error",
    });
  }
};

// 计算缓存大小
const calculateCacheSize = () => {
  try {
    const storageInfo = uni.getStorageInfoSync();
    const sizeKB = storageInfo.currentSize || 0;
    const sizeMB = (sizeKB / 1024).toFixed(1);
    cacheSize.value = `${sizeMB} MB`;
  } catch (error) {
    cacheSize.value = "0 MB";
  }
};

// 缓存大小
const cacheSize = ref("0 MB");

// App 版本
const appVersion = ref("v1.0.4");

// 获取应用版本信息
onMounted(() => {
  calculateCacheSize();

  // 尝试从 manifest.json 获取版本
  // #ifdef APP-PLUS
  const appid = plus?.runtime?.appid;
  if (appid) {
    plus.runtime.getProperty(appid, (wgtInfo) => {
      appVersion.value = `v${wgtInfo.version}`;
    });
  }
  // #endif
});
</script>

<template>
  <view class="page-container pb-24 overflow-y-auto no-scrollbar bg-[#F5F7FA]">
    <!-- Header -->
    <view class="sticky top-0 z-30 bg-[#F5F7FA]/90 backdrop-blur-md border-b border-transparent">
      <view class="flex flex-col gap-2 px-4 pb-2 pt-2">
        <view @tap="navigateBack" class="flex items-center h-10 justify-between">
          <view class="flex items-center gap-1 text-[#34C759]">
            <text class="material-symbols-outlined -ml-2">arrow_back_ios_new</text>
            <text class="text-base font-medium">设置</text>
          </view>
        </view>
        <text class="text-slate-900 tracking-tight text-3xl font-bold leading-tight">系统设置</text>
      </view>
    </view>

    <view class="flex flex-col gap-6 mt-4">
      <!-- 用户信息卡片 -->
      <view class="mx-4 overflow-hidden rounded-xl bg-white shadow-card">
        <view class="flex items-center gap-4 p-4">
          <view class="w-14 h-14 rounded-full bg-[#34C759]/10 flex items-center justify-center text-[#34C759]">
            <text class="material-symbols-outlined filled text-3xl">person</text>
          </view>
          <view class="flex-1">
            <text class="text-slate-900 text-lg font-medium block">{{ userName }}</text>
            <text class="text-slate-500 text-sm">查看和编辑个人资料</text>
          </view>
          <text class="material-symbols-outlined text-slate-400 text-xl">chevron_right</text>
        </view>
      </view>

      <!-- 同步与通知 -->
      <view class="mx-4 overflow-hidden rounded-xl bg-white shadow-card flex flex-col">
        <!-- Apple Health 同步 -->
        <view class="flex items-center justify-between p-4 border-b border-slate-100">
          <view class="flex items-center gap-4 overflow-hidden">
            <view class="flex items-center justify-center rounded-lg bg-[#34C759]/10 w-8 h-8 text-[#34C759]">
              <text class="material-symbols-outlined filled text-xl">favorite</text>
            </view>
            <view>
              <text class="text-slate-900 text-base font-medium block">同步 Apple Health</text>
              <text class="text-slate-500 text-xs">自动同步健康数据</text>
            </view>
          </view>
          <view
            @tap="toggleSync"
            class="relative flex h-[31px] w-[51px] items-center rounded-full p-0.5 transition-colors duration-300"
            :class="syncAppleHealth ? 'bg-[#34C759] justify-end' : 'bg-slate-200 justify-start'"
          >
            <view class="h-full w-[27px] rounded-full bg-white shadow-sm"></view>
          </view>
        </view>

        <!-- 通知权限 -->
        <view @tap="handleMenuClick('notifications')" class="flex items-center justify-between p-4 active:bg-slate-50 transition-colors">
          <view class="flex items-center gap-4 overflow-hidden">
            <view class="flex items-center justify-center rounded-lg bg-[#34C759]/10 w-8 h-8 text-[#34C759]">
              <text class="material-symbols-outlined filled text-xl">notifications</text>
            </view>
            <view>
              <text class="text-slate-900 text-base font-medium block">通知权限</text>
              <text class="text-slate-500 text-xs">接收消息和提醒</text>
            </view>
          </view>
          <view class="flex items-center gap-2">
            <text class="text-slate-500 text-sm font-medium">去设置</text>
            <text class="material-symbols-outlined text-slate-400 text-xl">chevron_right</text>
          </view>
        </view>
      </view>

      <!-- 清除缓存 -->
      <view class="mx-4 overflow-hidden rounded-xl bg-white shadow-card">
        <view @tap="handleMenuClick('cache')" class="flex items-center justify-between p-4 active:bg-slate-50 transition-colors">
          <view class="flex items-center gap-4 overflow-hidden">
            <view class="flex items-center justify-center rounded-lg bg-[#34C759]/10 w-8 h-8 text-[#34C759]">
              <text class="material-symbols-outlined text-xl">cleaning_services</text>
            </view>
            <view>
              <text class="text-slate-900 text-base font-medium block">清除缓存</text>
              <text class="text-slate-500 text-xs">释放本地存储空间</text>
            </view>
          </view>
          <view class="flex items-center gap-2">
            <text class="text-slate-500 text-sm font-medium">{{ cacheSize }}</text>
            <text class="material-symbols-outlined text-slate-400 text-xl">chevron_right</text>
          </view>
        </view>
      </view>

      <!-- Footer -->
      <view class="mt-6 flex flex-col items-center justify-center gap-2 px-4 pb-8">
        <view class="h-16 w-16 rounded-[14px] bg-white shadow-sm flex items-center justify-center mb-2 overflow-hidden border border-slate-100">
          <view class="h-full w-full bg-gradient-to-br from-blue-400 to-[#34C759] flex items-center justify-center">
            <text class="material-symbols-outlined text-white text-3xl">local_dining</text>
          </view>
        </view>
        <text class="text-sm font-semibold text-slate-900">AI Smart-Diet Lens</text>
        <text class="text-xs text-slate-400 font-medium">版本 {{ appVersion }}</text>
      </view>
    </view>

    <BottomNav />
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
.shadow-card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.filled {
  font-variation-settings:
    "FILL" 1,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}
</style>
