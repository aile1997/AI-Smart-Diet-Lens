import Uni from '@uni-helper/plugin-uni'
import UniHelperComponents from '@uni-helper/vite-plugin-uni-components'
import UniHelperLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniHelperManifest from '@uni-helper/vite-plugin-uni-manifest'
import UniHelperPages from '@uni-helper/vite-plugin-uni-pages'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import UniPolyfill from 'vite-plugin-uni-polyfill'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src',
  plugins: [
    // https://uni-helper.js.org/vite-plugin-uni-manifest
    UniHelperManifest(),
    // https://uni-helper.js.org/vite-plugin-uni-pages
    UniHelperPages({
      dts: 'src/uni-pages.d.ts',
    }),
    // https://uni-helper.js.org/vite-plugin-uni-layouts
    UniHelperLayouts(),
    // https://uni-helper.js.org/vite-plugin-uni-components
    UniHelperComponents({
      dts: 'src/components.d.ts',
      directoryAsNamespace: true,
    }),
    // https://uni-helper.js.org/plugin-uni
    Uni(),
    UniPolyfill(),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'uni-app', 'pinia'],
      dirs: ['src/composables', 'src/stores', 'src/utils'],
      dts: 'src/auto-imports.d.ts',
      vueTemplate: true,
    }),
    // https://github.com/antfu/unocss
    UnoCSS(),
  ],
})
