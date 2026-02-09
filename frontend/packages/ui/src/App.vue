<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useAuthStore, setupRouteGuard, setOnUnauthorizedCallback } from "@diet-lens/core";

const authStore = useAuthStore();

onLaunch(async () => {
  console.log("App Launch");
  // 初始化认证状态（从 Storage 恢复 token）
  await authStore.initAuth();
  // 设置 401 错误回调（使用 auth store 的 handleUnauthorized 方法）
  // 这样可以确保 store 状态与 storage 保持同步
  setOnUnauthorizedCallback(authStore.handleUnauthorized);
  // 设置路由守卫
  setupRouteGuard();
});

onShow(() => {
  console.log("App Show");
  // 每次 App 显示时，重新检查认证状态
  // 这可以捕获到 token 被清除的情况（如 401 回调清除后）
  authStore.initAuth();
});

onHide(() => {
  console.log("App Hide");
});
</script>

<template></template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");

/* ========== 全局重置 ========== */
*,
*::before,
*::after {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

/* ========== 页面基础 ========== */
page {
  /* 高级感背景色：不再是纯白，而是极淡的灰蓝/米白 */
  background-color: #f5f7fa;
  /* Apple 风格字体组合，解决"安卓默认字体丑"的问题 */
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
    sans-serif;
  font-size: 14px;
  line-height: 1.6;
  letter-spacing: 0.01em;
  color: #1a1a1a;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* 文字渲染优化 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

page,
view,
text,
image {
  box-sizing: border-box;
}

/* ========== 页面容器 ========== */
.page-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 448px;
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-color: #f8f8f8;
}

/* ========== Material Icons ========== */
.material-symbols-outlined {
  font-family: "Material Symbols Outlined";
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
}

.font-variation-FILL-1 {
  font-variation-settings:
    "FILL" 1,
    "wght" 400,
    "GRAD" 0,
    "opsz" 48;
}

/* ========== 滚动条隐藏 ========== */
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* ========== UniApp TabBar 隐藏 ========== */
uni-tabbar,
.uni-tabbar,
.uni-tabbar-bottom,
.uni-app--showtabbar uni-page-wrapper::after {
  display: none !important;
}

.uni-app--showtabbar uni-page-wrapper {
  height: 100% !important;
  padding-bottom: 0 !important;
}

/* ========== 高级感增强样式 ========== */

/* 全局通用的"高级感"卡片类 */
.glass-card {
  background: #ffffff;
  border-radius: 16px; /* 更大的圆角 */
  /* 关键：高级的弥散阴影，不是黑乎乎的一坨 */
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.8);
  margin: 10px;
  padding: 15px;
  /* 可选：如果你想要毛玻璃效果（性能消耗稍大） */
  /* backdrop-filter: blur(10px); */
}

/* 主按钮升级：渐变色 + 阴影 */
.btn-primary {
  /* 这是一个非常高级的"健康绿"渐变 */
  background: linear-gradient(135deg, #34C759 0%, #30B550 100%);
  color: white;
  border-radius: 50px; /* 胶囊形状更现代 */
  box-shadow: 0 4px 15px rgba(52, 199, 89, 0.4); /* 按钮发光效果 */
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(52, 199, 89, 0.5);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(52, 199, 89, 0.3);
}

/* 标题增强 */
.text-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

/* 输入框美化 */
input,
textarea {
  background: #f9f9f9;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 10px 15px;
  transition: all 0.3s ease;
  font-size: 15px;
  color: #1e293b;
}

input:focus,
textarea:focus {
  background: #fff;
  border-color: #34C759; /* 聚焦变色 */
  box-shadow: 0 0 0 3px rgba(52, 199, 89, 0.1);
  outline: none;
}

input::placeholder,
textarea::placeholder {
  color: #94a3b8;
}

/* 精致阴影系统 */

/* 精致阴影系统 */
.shadow-soft {
  box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.04),
              0 1px 4px -1px rgba(0, 0, 0, 0.02);
}

.shadow-card {
  box-shadow: 0 4px 16px -4px rgba(0, 0, 0, 0.06),
              0 2px 8px -2px rgba(0, 0, 0, 0.03);
}

.shadow-elevated {
  box-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.08),
              0 4px 12px -4px rgba(0, 0, 0, 0.04);
}

/* 内阴影（用于输入框等） */
.shadow-inner {
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.03);
}

/* 毛玻璃效果增强 */
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}

/* 平滑过渡 */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-colors {
  transition: background-color 0.2s ease,
              color 0.2s ease,
              border-color 0.2s ease;
}

.transition-transform {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 点击反馈 */
.active:active {
  transform: scale(0.97);
  opacity: 0.9;
}

/* 按钮点击 */
button:active,
.view-btn:active {
  transform: scale(0.96);
}

/* 优雅的渐变背景 */
.gradient-primary {
  background: linear-gradient(135deg, #34C759 0%, #30B550 100%);
}

.gradient-warm {
  background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
}

.gradient-cool {
  background: linear-gradient(135deg, #5AC8FA 0%, #007AFF 100%);
}

/* 文字渐变 */
.text-gradient {
  background: linear-gradient(135deg, #34C759 0%, #30B550 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 光晕效果 */
.glow-primary {
  box-shadow: 0 0 20px rgba(52, 199, 89, 0.3);
}

.glow-warm {
  box-shadow: 0 0 20px rgba(255, 149, 0, 0.3);
}

/* 脉冲动画 */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 20px rgba(52, 199, 89, 0.3);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 30px rgba(52, 199, 89, 0.5);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* 浮动动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* 加载闪烁 */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.shimmer {
  background: linear-gradient(
    90deg,
    rgba(200, 200, 200, 0.1) 0%,
    rgba(200, 200, 200, 0.3) 50%,
    rgba(200, 200, 200, 0.1) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* 边框高亮 */
.border-highlight {
  position: relative;
}

.border-highlight::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, #34C759, #5AC8FA);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.border-highlight:hover::after,
.border-highlight:focus-within::after {
  opacity: 1;
}

/* 安全区域适配 */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-left {
  padding-left: env(safe-area-inset-left);
}

.safe-area-right {
  padding-right: env(safe-area-inset-right);
}
</style>
