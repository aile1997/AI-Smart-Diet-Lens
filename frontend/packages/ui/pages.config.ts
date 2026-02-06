import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'AI Smart Diet Lens',
    navigationBarBackgroundColor: '#ffffff',
    backgroundColor: '#f8f8f8',
  },
  // 必须保留 tabBar 配置，否则 uni.switchTab 会报错
  // 我们通过样式将其隐藏，从而使用自定义的 BottomNav 组件
  tabBar: {
    color: '#999999',
    selectedColor: '#38e07b',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/scan/index',
        text: '拍照'
      },
      {
        pagePath: 'pages/diary/index',
        text: '日记'
      },
      {
        pagePath: 'pages/wiki/index',
        text: '百科'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
