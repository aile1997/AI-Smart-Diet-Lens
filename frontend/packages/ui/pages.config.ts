import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'AI Smart Diet Lens',
    navigationBarBackgroundColor: '#ffffff',
    backgroundColor: '#f8f8f8',
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#38e07b',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'static/tab/home.png',
        selectedIconPath: 'static/tab/home-active.png',
      },
      {
        pagePath: 'pages/scan/index',
        text: '拍照',
        iconPath: 'static/tab/scan.png',
        selectedIconPath: 'static/tab/scan-active.png',
      },
      {
        pagePath: 'pages/diary/index',
        text: '日记',
        iconPath: 'static/tab/diary.png',
        selectedIconPath: 'static/tab/diary-active.png',
      },
      {
        pagePath: 'pages/wiki/index',
        text: '百科',
        iconPath: 'static/tab/wiki.png',
        selectedIconPath: 'static/tab/wiki-active.png',
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'static/tab/profile.png',
        selectedIconPath: 'static/tab/profile-active.png',
      },
    ],
  },
})
