import { defineUniPages } from "@uni-helper/vite-plugin-uni-pages";

export default defineUniPages({
  globalStyle: {
    navigationBarTextStyle: "black",
    navigationBarTitleText: "AI Smart Diet Lens",
    navigationBarBackgroundColor: "#ffffff",
    backgroundColor: "#f8f8f8",
  },
  // 显式注册所有页面，确保 Uniapp 路由系统能识别
  pages: [
    {
      path: "pages/index/index",
      style: { navigationBarTitleText: "", navigationStyle: "custom" },
    },
    {
      path: "pages/diary/index",
      style: { navigationBarTitleText: "", navigationStyle: "custom" },
    },
    {
      path: "pages/scan/index",
      style: { navigationBarTitleText: "", navigationStyle: "custom" },
    },
    {
      path: "pages/wiki/index",
      style: { navigationBarTitleText: "", navigationStyle: "custom" },
    },
    {
      path: "pages/profile/index",
      style: { navigationBarTitleText: "个人中心", navigationStyle: "custom" },
    },
    {
      path: "pages/food-detail/index",
      style: { navigationStyle: "custom" },
    },
    {
      path: "pages/food-result/index",
      style: { navigationStyle: "custom" },
    },
    {
      path: "pages/cooking-assistant/index",
      style: { navigationStyle: "custom" },
    },
    {
      path: "pages/achievements/index",
      style: { navigationStyle: "custom" },
    },
    {
      path: "pages/messages/index",
      style: { navigationStyle: "custom" },
    },
    {
      path: "pages/onboarding/index",
      style: { navigationStyle: "custom" },
    },
    {
      path: "pages/onboarding/login",
      style: { navigationStyle: "custom" },
    },
    {
      path: "pages/onboarding/register",
      style: { navigationStyle: "custom" },
    },
    {
      path: "pages/onboarding/body-metrics",
      style: { navigationStyle: "custom" },
    },
    {
      path: "pages/recipe-detail/index",
      style: { navigationBarTitleText: "食谱详情", navigationStyle: "custom" },
    },
    {
      path: "pages/scan-fail/index",
      style: { navigationBarTitleText: "识别失败", navigationStyle: "custom" },
    },
    {
      path: "pages/shopping-list/index",
      style: { navigationBarTitleText: "购物清单" },
    },
    {
      path: "pages/splash/index",
      style: { navigationStyle: "custom" },
    },
  ],
  tabBar: {
    color: "#999999",
    selectedColor: "#38e07b",
    backgroundColor: "#ffffff",
    borderStyle: "white",
    list: [
      { pagePath: "pages/index/index", text: "首页" },
      { pagePath: "pages/scan/index", text: "拍照" },
      { pagePath: "pages/diary/index", text: "日记" },
      { pagePath: "pages/wiki/index", text: "百科" },
      { pagePath: "pages/profile/index", text: "我的" },
    ],
  },
});
