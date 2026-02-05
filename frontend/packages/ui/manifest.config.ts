import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest'

export default defineManifestConfig({
  name: 'AI Smart Diet Lens',
  appid: '__UNI__DIETLENS',
  description: '智能营养追踪与膳食规划应用',
  versionName: '0.1.0',
  versionCode: '100',
  transformPx: false,
  h5: {
    router: {
      mode: 'hash',
    },
    devServer: {
      port: 5173,
    },
  },
  'mp-weixin': {
    appid: '',
    setting: {
      urlCheck: false,
      es6: true,
      postcss: true,
      minified: true,
    },
  },
})
