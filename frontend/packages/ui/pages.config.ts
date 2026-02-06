import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'AI Smart Diet Lens',
    navigationBarBackgroundColor: '#ffffff',
    backgroundColor: '#f8f8f8',
  },
  // 彻底移除原生 tabBar 配置，改用自定义 BottomNav 组件
  // 这样可以解决图标加载问题，并实现 food-detail 页面那种一致的 UI 体验
})
