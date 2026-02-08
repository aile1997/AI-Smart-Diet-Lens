import Uni from "@uni-helper/plugin-uni";
import UniHelperComponents from "@uni-helper/vite-plugin-uni-components";
import UniHelperLayouts from "@uni-helper/vite-plugin-uni-layouts";
import UniHelperManifest from "@uni-helper/vite-plugin-uni-manifest";
import UniHelperPages from "@uni-helper/vite-plugin-uni-pages";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vite";
import UniPolyfill from "vite-plugin-uni-polyfill";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  root: "src",
  publicDir: "static", // 静态资源目录（相对于 root，即 src/static）
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@diet-lens/core": resolve(__dirname, "../core/src/index.ts"),
    },
  },
  // 添加静态资源服务配置
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp'],
  optimizeDeps: {
    exclude: ["@diet-lens/core"], // 如果频繁修改 core，可以尝试先排除预构建
  },
  server: {
    host: '0.0.0.0', // 监听所有网络接口，支持手机访问
    port: 5173,
    strictPort: false,
    open: false, // 开发时可以手动打开浏览器
    fs: {
      strict: false, // 允许访问父目录的静态资源
    },
    // API 代理配置（解决 H5 跨域问题）
    proxy: {
      '/api': {
        target: 'http://192.168.10.29:3000',
        changeOrigin: true,
        rewrite: (path) => path, // 保持路径不变
      }
    }
  },
  plugins: [
    // https://uni-helper.js.org/vite-plugin-uni-manifest
    UniHelperManifest(),
    // https://uni-helper.js.org/vite-plugin-uni-pages
    UniHelperPages({
      dts: "src/uni-pages.d.ts",
    }),
    // https://uni-helper.js.org/vite-plugin-uni-layouts
    UniHelperLayouts(),
    // https://uni-helper.js.org/vite-plugin-uni-components
    UniHelperComponents({
      dts: "src/components.d.ts",
      directoryAsNamespace: true,
    }),
    // https://uni-helper.js.org/plugin-uni
    Uni(),
    UniPolyfill(),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ["vue", "uni-app", "pinia"],
      dirs: ["src/composables", "src/stores", "src/utils"],
      dts: "src/auto-imports.d.ts",
      vueTemplate: true,
    }),
    // https://github.com/antfu/unocss
    UnoCSS(),
  ],
});
