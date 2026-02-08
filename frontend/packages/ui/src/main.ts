/**
 * 应用入口
 *
 * 初始化 API 客户端、Pinia 状态管理
 */

import { createSSRApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "uno.css";

// 导入 API 初始化函数
import { initApi, uniRequestAsFetch } from "@diet-lens/core";

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();

  app.use(pinia);

  // 调试：检查环境
  console.log("[Init] typeof uni:", typeof uni);
  console.log("[Init] typeof uni.request:", typeof uni?.request);
  console.log("[Init] Environment:", import.meta.env.MODE);

  // 初始化 API 客户端
  // Token 从 uni.getStorageSync 获取
  // 使用 uniRequestAsFetch 包装器以兼容 UniApp 环境
  const baseURL = import.meta.env?.VITE_API_BASE_URL || "https://api.aichangzhang.com:8443/api";
  console.log("[API Init] baseURL:", baseURL);

  // H5 环境使用原生 fetch，UniApp 小程序环境使用 uni.request
  // 检测 H5 环境：有 window 对象且有 fetch 方法
  const isH5 = typeof window !== "undefined" && typeof window.fetch !== "undefined";

  // 使用箭头函数包装，确保 fetch 在 window 上下文中执行
  const safeFetch = isH5 ? (url: string, options: RequestInit) => window.fetch(url, options) : uniRequestAsFetch;

  console.log("[API Init] isH5:", isH5);
  console.log("[API Init] using fetchProvider:", isH5 ? "window.fetch (arrow fn)" : "uni.request");

  // 初始化 API（401 回调稍后在 App.vue 中设置）
  initApi(
    () => {
      try {
        return uni.getStorageSync("token") || null;
      } catch {
        return null;
      }
    },
    {
      baseURL,
      fetchProvider: safeFetch,
      // 注意：onUnauthorized 回调在 App.vue 的 onLaunch 中通过 setOnUnauthorizedCallback 设置
      // 这样可以在 pinia 初始化后使用 auth store 的 handleUnauthorized 方法
    },
  );

  return {
    app,
  };
}
