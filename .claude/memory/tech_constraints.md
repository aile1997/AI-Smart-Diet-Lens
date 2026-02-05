# 技术硬约束 (Tech Constraints) - UniApp + Vue 3 + Monorepo 架构协议

> **文档类型**: 技术约束
> **维护者**: Architect
> **更新日期**: 2026-02-03
> **状态**: ✅ 当前有效

---

## 一、核心技术栈 (Core Stack)

### 前端技术栈

| 类别 | 技术 | 版本 | 备注 |
|:-----|:-----|:-----|:-----|
| **跨端框架** | UniApp | 3.0+ | Vite 模式 |
| **前端框架** | Vue 3 | ^3.4.0 | Composition API |
| **开发语言** | TypeScript | ~5.8.0 | 严格模式 |
| **构建工具** | Vite | 6.x | uni-helper 插件生态 |
| **状态管理** | Pinia | ^2.1.0 | UniApp 持久化插件 |
| **样式方案** | UnoCSS | latest | 原子化 CSS |
| **UI 组件库** | Wot Design Uni | latest | 首选 / uView Plus 备选 |
| **包管理器** | pnpm | 9.x | Workspaces 模式 |

### 后端技术栈

| 类别 | 技术 | 版本 | 备注 |
|:-----|:-----|:-----|:-----|
| **运行时** | Node.js | 20.x LTS | - |
| **框架** | NestJS | 11.x | - |
| **ORM** | Prisma | 5.x+ | PostgreSQL |
| **数据库** | PostgreSQL | 16+ | - |
| **缓存** | Redis | 7+ | - |
| **测试** | Jest | 30+ | - |

### AI 服务

| 服务 | 用途 |
|:-----|:-----|
| **Google Gemini API** | 食物图像识别、营养分析 |

---

## 二、架构模式: "接口即围栏" (Interface as Fence)

### Monorepo 目录结构

```
AI-Smart-Diet-Lens/
├── frontend/                    # 前端 Monorepo
│   ├── packages/
│   │   ├── core/                # 📦 @diet-lens/core (业务逻辑层)
│   │   │   ├── src/
│   │   │   │   ├── composables/ # 组合式函数
│   │   │   │   ├── stores/      # Pinia Store
│   │   │   │   ├── api/         # API 接口封装
│   │   │   │   ├── adapters/    # 平台接口抽象
│   │   │   │   ├── types/       # TypeScript 类型
│   │   │   │   └── utils/       # 工具函数
│   │   │   └── tests/           # 单元测试
│   │   │
│   │   └── ui/                  # 📦 @diet-lens/ui (视图层)
│   │       ├── src/
│   │       │   ├── pages/       # 页面组件
│   │       │   ├── components/  # UI 组件
│   │       │   ├── layouts/     # 布局组件
│   │       │   └── static/      # 静态资源
│   │       ├── pages.config.ts  # 文件路由配置
│   │       └── manifest.config.ts
│   │
│   ├── pnpm-workspace.yaml
│   └── package.json
│
├── backend/                     # 后端服务
│   ├── src/
│   │   ├── modules/             # 功能模块
│   │   ├── common/              # 公共模块
│   │   └── prisma/              # 数据库模型
│   └── package.json
│
└── .claude/                     # AI 协作系统
```

### 层级依赖规则

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Monorepo                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │         packages/ui (视图层) @diet-lens/ui               │    │
│  │  - Vue 页面和组件                                        │    │
│  │  - UniApp 配置                                           │    │
│  │  - 平台适配器实现                                        │    │
│  │  ✅ 可以使用 uni.xxx API                                 │    │
│  │  ✅ 引用 @diet-lens/core                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                             ↑ 依赖                               │
│                             │                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │       packages/core (业务逻辑层) @diet-lens/core         │    │
│  │  - 100% 纯 TypeScript                                    │    │
│  │  - Composables、Stores、Types                            │    │
│  │  - 适配器接口定义                                        │    │
│  │  ❌ 严禁 uni.xxx, wx.xxx, window.xxx                     │    │
│  │  ❌ 严禁直接调用平台 API                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 三、围栏规则 (The Fence Rule)

### Core 层禁止区 (Forbidden in packages/core)

```typescript
// ❌ 以下代码在 packages/core/src/ 中绝对禁止

// 1. UniApp API
uni.request()
uni.getStorage()
uni.navigateTo()

// 2. 微信小程序 API
wx.login()
wx.getUserInfo()

// 3. 浏览器 API
window.location
navigator.geolocation
document.querySelector()

// 4. 任何平台特定 API
my.xxx  // 支付宝
swan.xxx  // 百度
tt.xxx  // 字节跳动
```

### 正确实践: 适配器模式

```typescript
// ✅ packages/core/src/adapters/IHttp.ts - 定义接口
export interface IHttp {
  request<T>(config: HttpConfig): Promise<HttpResponse<T>>
}

// ✅ packages/core/src/composables/useAuth.ts - 使用接口
export function useAuth(http: IHttp) {
  const login = async (phone: string, code: string) => {
    return await http.request({
      url: '/api/auth/login',
      method: 'POST',
      data: { phone, code }
    })
  }
  return { login }
}

// ✅ packages/ui/src/utils/adapters.ts - 实现接口
export const httpAdapter: IHttp = {
  request: async (config) => {
    const [error, res] = await uni.request({
      url: config.url,
      method: config.method,
      data: config.data
    })
    if (error) throw error
    return res
  }
}
```

---

## 四、前端配置规范 (参考 vitesse-uni-app)

### Vite 插件配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import Uni from '@dcloudio/vite-plugin-uni'
import UniHelperManifest from '@uni-helper/vite-plugin-uni-manifest'
import UniHelperPages from '@uni-helper/vite-plugin-uni-pages'
import UniHelperLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniHelperComponents from '@uni-helper/vite-plugin-uni-components'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [
    UniHelperManifest(),
    UniHelperPages({
      dts: 'src/uni-pages.d.ts',
    }),
    UniHelperLayouts(),
    UniHelperComponents({
      dts: 'src/components.d.ts',
    }),
    Uni(),
    AutoImport({
      imports: ['vue', '@vueuse/core', 'uni-app'],
      dirs: ['src/composables', 'src/stores', 'src/utils'],
      dts: 'src/auto-imports.d.ts',
    }),
    UnoCSS(),
  ],
})
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
```

### 自动导入配置

| 来源 | 自动导入内容 |
|:-----|:------------|
| `vue` | ref, computed, watch, onMounted... |
| `@vueuse/core` | useStorage, useDark... |
| `uni-app` | onLoad, onShow, onReady... |
| `src/composables/` | 自定义组合函数 |
| `src/stores/` | Pinia Store |

---

## 五、命名规范 (Naming Conventions)

### 文件命名

| 类型 | 规则 | 示例 |
|:-----|:-----|:-----|
| **Vue 组件** | PascalCase | `FoodCard.vue`, `BottomNav.vue` |
| **页面组件** | kebab-case 目录 | `pages/food-result/index.vue` |
| **Composables** | camelCase + use | `useNutrition.ts`, `useDiary.ts` |
| **Stores** | camelCase | `user.ts`, `nutrition.ts` |
| **Adapters** | PascalCase + I 前缀 | `IHttp.ts`, `IStorage.ts` |

### 代码命名

```typescript
// ✅ 正确
const userStore = useUserStore()
const totalCalories = computed(() => ...)
function calculateBMR(weight: number): number

// ❌ 禁止拼音
const yonghu = ref()        // 应为 user
const huoquShuju = () => {} // 应为 fetchData
```

---

## 六、开发脚本 (Scripts)

### 前端脚本

```bash
# 开发
pnpm --filter @diet-lens/ui dev:h5       # H5 开发
pnpm --filter @diet-lens/ui dev:mp-weixin # 微信小程序
pnpm --filter @diet-lens/core test       # Core 层测试
pnpm --filter @diet-lens/core test:watch # 监听模式

# 构建
pnpm --filter @diet-lens/ui build:h5
pnpm --filter @diet-lens/ui build:mp-weixin

# 类型检查
pnpm --filter @diet-lens/core type-check
```

### 后端脚本

```bash
# 开发
pnpm --filter backend start:dev

# 测试
pnpm --filter backend test

# 数据库
pnpm --filter backend prisma:studio
pnpm --filter backend prisma:migrate
```

---

## 七、TDD 强制循环 (TDD Cycle)

### Frontend Builder 流程

```
Phase 1: Red (编写测试)
├── 定位: packages/core/tests/
├── 操作: 编写单元测试
├── 禁止: 测试中严禁 uni.xxx，必须 Mock
└── 结果: 运行测试必须失败

Phase 2: Green (最小实现)
├── 定位: packages/core/src/
├── 操作: 实现 TypeScript 逻辑
├── 隔离: 平台功能通过 adapters 接口
└── 结果: 运行测试变绿

Phase 3: UI Bind (视图消费)
├── 定位: packages/ui/src/pages/
├── 操作: 在 .vue 中使用 @diet-lens/core
└── 合规: 检查是否有未隔离的业务逻辑
```

### Backend Builder 流程

```
Phase 1: Red (编写测试)
├── 定位: backend/test/
├── 操作: 编写单元/集成测试
└── 结果: 运行测试必须失败

Phase 2: Green (实现)
├── 定位: backend/src/modules/
├── 操作: 实现 Controller + Service
└── 结果: 运行测试变绿

Phase 3: Refactor (重构)
├── 操作: 优化代码结构
└── 检查: 类型安全、错误处理
```

---

## 八、样式规范 (UnoCSS)

### 使用 UnoCSS 原子类

```vue
<!-- ✅ 正确: 使用 UnoCSS -->
<view class="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md">
  <text class="text-green-600 font-semibold">标题</text>
</view>

<!-- ❌ 错误: 内联样式 -->
<view style="display: flex; padding: 16px;">
  <text style="color: green;">标题</text>
</view>
```

### UnoCSS 配置

```typescript
// uno.config.ts
import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  theme: {
    colors: {
      sage: {
        50: '#f6f7f6',
        100: '#e3e5e3',
        500: '#38e07b',
        600: '#2cb863',
      },
    },
  },
})
```

---

## 九、Git 提交规范 (Commit Convention)

### Scope 规范

| Scope | 说明 | 示例 |
|:------|:-----|:-----|
| `ui` | 前端 UI 层 | `feat(ui): 添加食物识别页面` |
| `core` | 前端 Core 层 | `feat(core): 实现营养计算逻辑` |
| `backend` | 后端服务 | `feat(backend): 添加用户认证 API` |
| `auth` | 认证模块 | `fix(auth): 修复 Token 刷新` |
| `infra` | 基础设施 | `chore(infra): 更新 CI 配置` |

### 提交示例

```bash
# 前后端分开提交

# 前端 Core
git add frontend/packages/core/
git commit -m "feat(core): 实现 useNutrition 组合函数

- 添加 BMR 计算
- 添加每日营养汇总
- 添加单元测试

Related to #12"

# 前端 UI
git add frontend/packages/ui/
git commit -m "feat(ui): 完成首页仪表盘 UI

- 添加热量环形图
- 添加营养素进度条
- 集成 @diet-lens/core"

# 后端
git add backend/
git commit -m "feat(backend): 实现食物识别 API

- POST /api/food/recognize
- 集成 Gemini API
- 添加错误处理"
```

---

## 十、禁止事项清单 (Forbidden List)

### 代码层面

| 禁止项 | 原因 | 替代方案 |
|:-------|:-----|:--------|
| Options API | 不统一 | Composition API + `<script setup>` |
| `any` 类型 | 类型不安全 | 显式类型定义 |
| 拼音命名 | 可读性差 | 英文语义化命名 |
| Core 层平台 API | 破坏围栏 | 通过 Adapter 接口 |
| `console.log` 生产 | 性能/安全 | 条件编译 |

### 架构层面

| 禁止项 | 原因 | 替代方案 |
|:-------|:-----|:--------|
| UI 层业务逻辑 | 难以测试 | 移至 Core 层 |
| Core 层平台依赖 | 无法跨端 | 适配器模式 |
| 前后端混合提交 | 难以追溯 | 分开提交 |
| 跳过测试 | 质量风险 | TDD 循环 |

---

**文档维护者**: Architect
**最后更新**: 2026-02-03
**下次审查**: 2026-03-03
