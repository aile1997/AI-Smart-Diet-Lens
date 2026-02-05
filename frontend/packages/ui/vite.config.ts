import { defineConfig } from 'vite'
import Uni from '@dcloudio/vite-plugin-uni'
import UniHelperManifest from '@uni-helper/vite-plugin-uni-manifest'
import UniHelperPages from '@uni-helper/vite-plugin-uni-pages'
import UniHelperLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniHelperComponents from '@uni-helper/vite-plugin-uni-components'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // uni-helper 插件 (必须在 Uni() 之前)
    UniHelperManifest(),
    UniHelperPages({
      dts: 'src/uni-pages.d.ts',
    }),
    UniHelperLayouts(),
    UniHelperComponents({
      dts: 'src/components.d.ts',
      directoryAsNamespace: true,
    }),

    // UniApp Vite 插件
    Uni(),

    // 自动导入
    AutoImport({
      imports: [
        'vue',
        'uni-app',
        'pinia',
      ],
      dirs: [
        'src/composables',
        'src/utils',
      ],
      dts: 'src/auto-imports.d.ts',
      vueTemplate: true,
    }),

    // UnoCSS 原子化 CSS
    UnoCSS(),
  ],
})
