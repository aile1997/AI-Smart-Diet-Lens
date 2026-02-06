# AI Smart Diet Lens - 前端架构文档

> **项目**: AI Smart Diet Lens
> **技术栈**: UniApp + Vue 3 + TypeScript + UnoCSS
> **最后更新**: 2026-02-06
> **版本**: 3.0.0

---

## 目录

1. [项目概述](#项目概述)
2. [项目结构](#项目结构)
3. [页面清单](#页面清单)
4. [导航架构](#导航架构)
5. [组件库](#组件库)
6. [样式系统](#样式系统)
7. [后端 API 文档](#后端-api-文档)
8. [数据模型](#数据模型)
9. [状态管理](#状态管理)
10. [本地存储](#本地存储)
11. [开发指南](#开发指南)
12. [API 集成指南](#api-集成指南)
13. [待完善功能](#待完善功能)

---

## 项目概述

AI Smart Diet Lens 是一款智能营养追踪与膳食规划应用，通过 AI 拍照识别食物，帮助用户管理健康饮食。

### 核心功能

- **AI 食物识别**: 拍照自动识别食物并计算营养成分
- **每日营养追踪**: 记录每餐摄入，可视化展示热量和营养素
- **食材百科**: 浏览食材营养信息，获取 AI 健康推荐
- **社区动态**: 分享饮食，与好友互动
- **AI 营养师对话**: 通过对话获取个性化餐单建议
- **游戏化成就**: 解锁健康成就，激励持续使用

### 目标平台

- 微信小程序 (主要)
- H5 网页版
- 支付宝小程序 (规划中)
- App (规划中)

---

## 项目结构

```
frontend/packages/ui/src/
├── App.vue                      # 应用入口，全局样式
├── main.ts                      # 应用启动
├── components/
│   └── BottomNav.vue            # 自定义底部导航栏 (5个Tab + FAB)
├── pages/
│   ├── index/                   # Tab1: 首页仪表盘
│   ├── diary/                   # Tab2: 饮食日记
│   ├── scan/                    # Tab3: 拍照识别 (FAB)
│   ├── discover/                # Tab4: 发现 (百科 + 社区)
│   ├── profile/                 # Tab5: 个人中心
│   ├── wiki/                    # 食材百科 (已整合到 discover)
│   ├── messages/                # 消息中心
│   ├── settings/                # 设置页面
│   ├── analysis/                # 数据分析
│   ├── shopping-list/           # 购物清单
│   ├── food-result/             # 营养确认
│   ├── food-detail/             # 食材详情
│   ├── achievements/            # 成就系统
│   ├── cooking-assistant/       # AI烹饪助手
│   ├── recipe-detail/           # 食谱详情
│   ├── scan-fail/               # 识别失败
│   ├── splash/                  # 启动页
│   ├── ai-chat/                 # AI营养师对话
│   ├── favorites/               # 我的收藏
│   ├── my-posts/                # 我的发布
│   ├── my-reviews/              # 我的评价
│   └── onboarding/              # 引导流程
│       ├── index                # 欢迎页
│       ├── login                # 登录
│       ├── register             # 注册
│       ├── body-metrics         # 身体数据
│       └── goals                # 目标选择
├── pages.config.ts              # 页面配置 (自动生成 pages.json)
└── manifest.config.ts           # 应用配置 (自动生成 manifest.json)
```

---

## 页面清单

### Tab 页面 (5个)

| 页面 | 路径 | 功能 | 导航标识 |
|:-----|:-----|:-----|:---------|
| **首页** | `/pages/index/index` | 热量环形图、健康指标、AI助手入口 | `home` |
| **日记** | `/pages/diary/index` | 每日营养记录、周视图、餐食详情 | `menu_book` |
| **识别** | `/pages/scan/index` | 相机拍照、相册选择、AI识别 | `photo_camera` (FAB) |
| **发现** | `/pages/discover/index` | 百科搜索 + 社区动态 (双标签) | `explore` |
| **我的** | `/pages/profile/index` | 个人信息、成就、设置入口 | `person` |

### 功能页面

| 页面 | 路径 | 功能 | 导航来源 |
|:-----|:-----|:-----|:---------|
| **AI营养师对话** | `/pages/ai-chat/index` | 对话式获取个性化餐单 | 首页「对话定制」 |
| **消息中心** | `/pages/messages/index` | 系统通知 | 个人中心 |
| **设置** | `/pages/settings/index` | 个人信息、健康同步、通知设置 | 个人中心 |
| **数据分析** | `/pages/analysis/index` | 营养趋势、周/月切换、AI建议 | 日记页 |
| **营养确认** | `/pages/food-result/index` | 识别后确认营养、调整份量 | 拍照识别 |
| **食材详情** | `/pages/food-detail/index` | 单个食材的详细营养信息 | 发现/百科 |
| **成就系统** | `/pages/achievements/index` | 勋章展示、成就进度 | 个人中心 |
| **AI烹饪助手** | `/pages/cooking-assistant/index` | 智能食谱推荐、烹饪指导 | 首页「直接生成」 |
| **食谱详情** | `/pages/recipe-detail/index` | 食谱步骤、食材清单 | 烹饪助手 |
| **识别失败** | `/pages/scan-fail/index` | 重试、手动输入 | 拍照识别 |
| **我的收藏** | `/pages/favorites/index` | 收藏的食谱/食材 | 个人中心 |
| **我的发布** | `/pages/my-posts/index` | 用户发布的社区动态 | 个人中心 |

### 引导流程 (6个)

| 页面 | 路径 | 功能 |
|:-----|:-----|:-----|
| **启动页** | `/pages/splash/index` | Logo展示、初始化检查、自动跳转 |
| **欢迎页** | `/pages/onboarding/index` | 功能介绍、开始使用 |
| **登录** | `/pages/onboarding/login` | 手机号/邮箱登录 |
| **注册** | `/pages/onboarding/register` | 新用户注册 |
| **身体数据** | `/pages/onboarding/body-metrics` | 身高、体重、年龄、性别输入 |
| **目标选择** | `/pages/onboarding/goals` | 减脂/增肌/健康目标选择 |

---

## 导航架构

### 底部导航 (BottomNav)

```
┌─────────────────────────────────────────────────────────────┐
│  Tab1    Tab2    [FAB]    Tab4    Tab5                       │
│  首页    日记    相机     发现    我的                        │
└─────────────────────────────────────────────────────────────┘
```

**导航项配置**:
```typescript
const navItems: NavItem[] = [
  { path: "/pages/index/index", icon: "home", label: "首页" },
  { path: "/pages/diary/index", icon: "menu_book", label: "日记" },
  { path: "/pages/scan/index", icon: "photo_camera", label: "识别", isFab: true },
  { path: "/pages/discover/index", icon: "explore", label: "发现" },
  { path: "/pages/profile/index", icon: "person", label: "我的" },
];
```

---

## 组件库

### 核心组件

| 组件 | 路径 | 功能说明 |
|:-----|:-----|:---------|
| **BottomNav** | `/components/BottomNav.vue` | 自定义底部导航，5个Tab + FAB相机按钮 |

---

## 样式系统

### 设计规范

#### 颜色系统

```css
/* 主色调 Sage Green */
--primary: #649678;           /* 主色 */
--primary-light: #38e07b;     /* 亮色 (激活状态) */
--primary-dark: #4a755c;      /* 暗色 */

/* 中性色 */
--bg-base: #F5F7F8;           /* 页面背景 */
--bg-white: #FFFFFF;          /* 卡片背景 */
--text-primary: #1C1C1E;      /* 主标题 */
--text-secondary: #5a847b;    /* 次要文字 */
--border-color: #e5e7eb;     /* 边框 */
```

#### 图标系统

**Material Symbols Outlined** (Google Fonts)

```css
/* 基础样式 */
.material-symbols-outlined {
  font-family: "Material Symbols Outlined";
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
}

/* 填充效果 (激活状态) */
.filled {
  font-variation-settings:
    "FILL" 1,
    "wght" 400,
    "GRAD" 0,
    "opsz" 48;
}
```

---

## 后端 API 文档

### API 基础信息

- **Base URL**: `https://api.dietlens.com/api`
- **认证方式**: Bearer Token (JWT)
- **响应格式**: JSON

### 通用响应结构

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
```

### 认证模块 (`/api/auth`)

| 端点 | 方法 | 功能 | 请求参数 | 响应数据 |
|:-----|:-----|:-----|:---------|:---------|
| `/send-code` | POST | 发送验证码 | `phone: string` | `{ success: boolean }` |
| `/login` | POST | 登录/注册 | `phone: string, code: string` | `{ token: string, user: User }` |
| `/refresh` | POST | 刷新 Token | `refreshToken: string` | `{ token: string }` |

### 系统模块 (`/api/system`)

| 端点 | 方法 | 功能 | 响应数据 |
|:-----|:-----|:-----|:---------|
| `/config` | GET | 获取系统配置 | `SystemConfig` |

```typescript
interface SystemConfig {
  min_version_ios: string
  min_version_android: string
  latest_version_ios: string
  latest_version_android: string
  maintenance: boolean
  announcement?: string
}
```

### 用户与健康模块 (`/api/user`)

| 端点 | 方法 | 功能 | 请求参数 | 响应数据 |
|:-----|:-----|:-----|:---------|:---------|
| `/profile` | GET | 获取用户信息 | - | `UserProfile` |
| `/profile` | PATCH | 更新用户信息 | `UpdateProfileDto` | `UserProfile` |
| `/health-metrics` | GET | 获取健康指标 | - | `HealthMetrics` |
| `/health-metrics` | POST/PUT | 更新健康指标 | `HealthMetricsDto` | `HealthMetrics` |

```typescript
interface UserProfile {
  id: string
  phone: string
  nickname?: string
  avatar?: string
  bio?: string
  createdAt: string
}

interface HealthMetrics {
  weight?: number      // kg
  height?: number      // cm
  age?: number
  gender?: 'male' | 'female'
  goal?: GoalType
}

type GoalType = 'lose_weight' | 'gain_muscle' | 'healthy'
```

### 仪表盘模块 (`/api/dashboard`)

| 端点 | 方法 | 功能 | 响应数据 |
|:-----|:-----|:-----|:---------|
| `/` | GET | 获取仪表盘数据 | `DashboardData` |

```typescript
interface DashboardData {
  today: {
    calories: { consumed: number; target: number }
    protein: { consumed: number; target: number }
    carbs: { consumed: number; target: number }
    fat: { consumed: number; target: number }
  }
  weeklyCalories: Array<{ date: string; calories: number }>
  recentMeals: DiaryEntry[]
  streak: number
  nextBadge?: string
}
```

### AI 识别模块 (`/api/ai`)

| 端点 | 方法 | 功能 | 请求参数 | 响应数据 |
|:-----|:-----|:-----|:---------|:---------|
| `/analyze` | POST | 分析食物图片 | `image: File` | `FoodAnalysisResult` |

```typescript
interface FoodAnalysisResult {
  foods: Array<{
    name: string
    confidence: number
    nutrition: {
      calories: number
      protein: number
      carbs: number
      fat: number
    }
  }>
}
```

### AI 对话模块 (`/api/ai/chat`) ⭐ NEW

| 端点 | 方法 | 功能 | 请求参数 | 响应数据 |
|:-----|:-----|:-----|:---------|:---------|
| `/message` | POST | 发送对话消息 | `SendMessageDto` | `ChatResponse` |
| `/recipe` | POST | 根据对话生成食谱 | `GenerateRecipeDto` | `Recipe` |
| `/history` | GET | 获取对话历史 | - | `ChatMessage[]` |
| `/history` | DELETE | 清空对话历史 | - | `{ success: boolean }` |

```typescript
interface SendMessageDto {
  message: string
  context?: Array<{ role: string; content: string }>
}

interface ChatResponse {
  reply: string
  recipeCard?: {
    name: string
    image: string
    calories: number
    time: string
    difficulty: string
    description: string
  }
}

interface ChatMessage {
  id: string
  isUser: boolean
  content: string
  timestamp: string
}
```

**使用示例**:
```typescript
// 发送消息
const response = await fetch('/api/ai/chat/message', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ message: '我想做一道减脂餐' }),
})
const { data } = await response.json()
console.log(data.reply) // AI 回复内容
console.log(data.recipeCard) // 推荐的食谱卡片（如果有）
```

### 食物库模块 (`/api/food`)

| 端点 | 方法 | 功能 | 请求参数 | 响应数据 |
|:-----|:-----|:-----|:---------|:---------|
| `/search` | GET | 搜索食物 | `q: string` | `FoodItem[]` |
| `/:id` | GET | 获取食物详情 | - | `FoodDetail` |

### 饮食日记模块 (`/api/diary`)

| 端点 | 方法 | 功能 | 请求参数 | 响应数据 |
|:-----|:-----|:-----|:---------|:---------|
| `/` | GET | 获取日记记录 | `date?: string` | `DiaryEntry[]` |
| `/` | POST | 添加日记记录 | `CreateEntryDto` | `DiaryEntry` |
| `/:id` | PATCH | 更新记录 | `UpdateEntryDto` | `DiaryEntry` |
| `/:id` | DELETE | 删除记录 | - | `{ success: boolean }` |
| `/summary` | GET | 获取营养摘要 | `date?: string` | `NutritionSummary` |

```typescript
interface CreateEntryDto {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  foodId: string
  portion: number
}

interface NutritionSummary {
  date: string
  calories: { consumed: number; target: number }
  protein: { consumed: number; target: number }
  carbs: { consumed: number; target: number }
  fat: { consumed: number; target: number }
}
```

### 游戏化模块 (`/api/gamification`)

| 端点 | 方法 | 功能 | 响应数据 |
|:-----|:-----|:-----|:---------|
| `/achievements` | GET | 获取成就列表 | `Achievement[]` |
| `/progress` | GET | 获取用户进度 | `UserProgress` |

### 智能内容模块 (`/api/recipes`)

| 端点 | 方法 | 功能 | 请求参数 | 响应数据 |
|:-----|:-----|:-----|:---------|:---------|
| `/recommend` | POST | 获取智能推荐 | `RecommendDto` | `Recipe[]` |

### 社区模块 (`/api/community`) ⭐ NEW

| 端点 | 方法 | 功能 | 请求参数 | 响应数据 |
|:-----|:-----|:-----|:---------|:---------|
| `/posts` | GET | 获取帖子列表 | `page?: number, limit?: number` | `Post[]` |
| `/posts` | POST | 发布帖子 | `CreatePostDto` | `Post` |
| `/posts/:id` | GET | 获取帖子详情 | - | `Post` |
| `/posts/:id` | DELETE | 删除帖子 | - | `{ success: boolean }` |
| `/posts/:id/like` | POST | 点赞/取消点赞 | - | `{ liked: boolean, likesCount: number }` |
| `/posts/:id/comments` | POST | 添加评论 | `{ content: string }` | `Comment` |
| `/posts/my` | GET | 获取我的帖子 | - | `Post[]` |

```typescript
interface CreatePostDto {
  content: string
  images?: string[]
  tags?: string[]
}

interface Post {
  id: string
  content: string
  images: string[]
  tags: string[]
  likes: number
  isLiked: boolean
  createdAt: string
  user: {
    id: string
    nickname: string
    avatar?: string
  }
  comments?: Comment[]
}

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    nickname: string
    avatar?: string
  }
}
```

**使用示例**:
```typescript
// 获取帖子列表
const response = await fetch('/api/community/posts?page=1&limit=10', {
  headers: { 'Authorization': `Bearer ${token}` },
})
const { data } = await response.json()

// 发布帖子
const createResponse = await fetch('/api/community/posts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    content: '今天吃了健康的减脂餐！',
    images: ['https://example.com/image.jpg'],
    tags: ['减脂', '健康饮食'],
  }),
})
```

### 收藏模块 (`/api/favorites`) ⭐ NEW

| 端点 | 方法 | 功能 | 请求参数 | 响应数据 |
|:-----|:-----|:-----|:---------|:---------|
| `/` | GET | 获取收藏列表 | `type?: 'recipe' \| 'food'` | `Favorite[]` |
| `/` | POST | 添加收藏 | `CreateFavoriteDto` | `Favorite` |
| `/:id` | DELETE | 取消收藏 | - | `{ success: boolean }` |
| `/check/:itemId` | GET | 检查是否收藏 | `type?: 'recipe' \| 'food'` | `{ isFavorited: boolean }` |

```typescript
interface CreateFavoriteDto {
  itemId: string
  type: 'recipe' | 'food'
}

interface Favorite {
  id: string
  itemId: string
  type: 'recipe' | 'food'
  createdAt: string
}
```

**使用示例**:
```typescript
// 添加收藏
const response = await fetch('/api/favorites/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    itemId: 'recipe-123',
    type: 'recipe',
  }),
})

// 检查是否已收藏
const checkResponse = await fetch('/api/favorites/check/recipe-123?type=recipe', {
  headers: { 'Authorization': `Bearer ${token}` },
})
const { data } = await checkResponse.json()
console.log(data.isFavorited) // true 或 false
```

### 消息通知模块 (`/api/notifications`) ⭐ NEW

| 端点 | 方法 | 功能 | 请求参数 | 响应数据 |
|:-----|:-----|:-----|:---------|:---------|
| `/` | GET | 获取消息列表 | `type?: 'achievement' \| 'reminder' \| 'system'` | `Message[]` |
| `/unread-count` | GET | 获取未读数量 | - | `{ count: number }` |
| `/:id/read` | PATCH | 标记已读 | - | `{ success: boolean }` |
| `/read-all` | PATCH | 全部标记已读 | - | `{ success: boolean }` |
| `/:id` | DELETE | 删除消息 | - | `{ success: boolean }` |

```typescript
type MessageType = 'achievement' | 'reminder' | 'system'

interface Message {
  id: string
  type: MessageType
  title: string
  content: string
  isRead: boolean
  createdAt: string
}
```

**使用示例**:
```typescript
// 获取未读消息数量
const response = await fetch('/api/notifications/unread-count', {
  headers: { 'Authorization': `Bearer ${token}` },
})
const { data } = await response.json()
console.log(data.count) // 未读消息数量

// 标记消息已读
await fetch(`/api/notifications/${messageId}/read`, {
  method: 'PATCH',
  headers: { 'Authorization': `Bearer ${token}` },
})

// 获取成就类消息
const achievementsResponse = await fetch('/api/notifications/?type=achievement', {
  headers: { 'Authorization': `Bearer ${token}` },
})
```

### 文件上传模块 (`/api/upload`) ⭐ NEW

| 端点 | 方法 | 功能 | 请求参数 | 响应数据 |
|:-----|:-----|:-----|:---------|:---------|
| `/presign-url` | POST | 获取预签名 URL | `PresignUrlDto` | `{ url: string, key: string }` |
| `/confirm-upload` | POST | 确认上传完成 | `ConfirmUploadDto` | `{ url: string }` |

```typescript
interface PresignUrlDto {
  filename: string
  contentType: string
}

interface ConfirmUploadDto {
  key: string
}
```

**使用示例**:
```typescript
// 1. 获取预签名 URL
const presignResponse = await fetch('/api/upload/presign-url', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    filename: 'food-image.jpg',
    contentType: 'image/jpeg',
  }),
})
const { data: presignData } = await presignResponse.json()

// 2. 直接上传到 S3
await fetch(presignData.url, {
  method: 'PUT',
  body: fileData,
  headers: { 'Content-Type': 'image/jpeg' },
})

// 3. 确认上传完成
const confirmResponse = await fetch('/api/upload/confirm-upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ key: presignData.key }),
})
const { data: confirmData } = await confirmResponse.json()
console.log(confirmData.url) // 最终可访问的图片 URL
```

---

## 数据模型

### 用户相关

```typescript
interface User {
  id: string
  phone: string
  nickname?: string
  avatar?: string
  bio?: string
  createdAt: string
}

interface HealthMetrics {
  userId: string
  weight?: number
  height?: number
  age?: number
  gender?: 'male' | 'female'
  goal?: GoalType
}
```

### 食物相关

```typescript
interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  category?: string
}

interface DiaryEntry {
  id: string
  userId: string
  date: Date
  mealType: MealType
  foodId: string
  portion: number
  food?: FoodItem
}

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'
type GoalType = 'lose_weight' | 'gain_muscle' | 'healthy'
```

### 社区相关

```typescript
interface CommunityPost {
  id: string
  userId: string
  content: string
  images: string[]
  tags: string[]
  likes: number
  createdAt: Date
  updatedAt: Date
  user?: User
  comments?: Comment[]
}

interface Comment {
  id: string
  postId: string
  userId: string
  content: string
  createdAt: Date
  user?: User
}
```

### 收藏相关

```typescript
interface Favorite {
  id: string
  userId: string
  itemId: string
  type: 'recipe' | 'food'
  createdAt: Date
}
```

### 消息相关

```typescript
interface Message {
  id: string
  userId: string
  type: MessageType
  title: string
  content: string
  isRead: boolean
  createdAt: Date
}

type MessageType = 'achievement' | 'reminder' | 'system'
```

### AI 对话相关

```typescript
interface ChatMessage {
  id: string
  userId: string
  isUser: boolean
  content: string
  createdAt: Date
}
```

---

## API 集成指南

### HTTP 请求封装

创建统一的 API 请求层，处理认证、错误处理和响应格式。

```typescript
// packages/core/src/api/client.ts

interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number>
}

class ApiClient {
  private baseURL: string
  private tokenGetter: () => string | null

  constructor(baseURL: string, tokenGetter: () => string | null) {
    this.baseURL = baseURL
    this.tokenGetter = tokenGetter
  }

  private buildUrl(path: string, params?: Record<string, string | number>): string {
    const url = new URL(path, this.baseURL)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }
    return url.toString()
  }

  async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const token = this.tokenGetter()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const url = this.buildUrl(endpoint, options.params)

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '请求失败' }))
      throw new Error(error.message || '请求失败')
    }

    const result: ApiResponse<T> = await response.json()

    if (!result.success) {
      throw new Error(result.error || '请求失败')
    }

    return result.data as T
  }

  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async patch<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

// API 服务实例
export const api = new ApiClient(
  'https://api.dietlens.com/api',
  () => uni.getStorageSync('token') || null
)
```

### 服务层示例

为每个模块创建对应的服务类。

```typescript
// packages/core/src/api/services/chat.service.ts

export class ChatService {
  /**
   * 发送对话消息
   */
  async sendMessage(message: string, context?: Array<{ role: string; content: string }>) {
    return api.post<ChatResponse>('/ai/chat/message', { message, context })
  }

  /**
   * 获取对话历史
   */
  async getHistory() {
    return api.get<ChatMessage[]>('/ai/chat/history')
  }

  /**
   * 清空对话历史
   */
  async clearHistory() {
    return api.delete<{ success: boolean }>('/ai/chat/history')
  }
}

export const chatService = new ChatService()
```

```typescript
// packages/core/src/api/services/community.service.ts

export class CommunityService {
  /**
   * 获取帖子列表
   */
  async getPosts(page = 1, limit = 10) {
    return api.get<Post[]>('/community/posts', { params: { page, limit } })
  }

  /**
   * 发布帖子
   */
  async createPost(content: string, images?: string[], tags?: string[]) {
    return api.post<Post>('/community/posts', { content, images, tags })
  }

  /**
   * 点赞/取消点赞
   */
  async toggleLike(postId: string) {
    return api.post<{ liked: boolean; likesCount: number }>(`/community/posts/${postId}/like`)
  }

  /**
   * 添加评论
   */
  async addComment(postId: string, content: string) {
    return api.post<Comment>(`/community/posts/${postId}/comments`, { content })
  }

  /**
   * 删除帖子
   */
  async deletePost(postId: string) {
    return api.delete<{ success: boolean }>(`/community/posts/${postId}`)
  }

  /**
   * 获取我的帖子
   */
  async getMyPosts() {
    return api.get<Post[]>('/community/posts/my')
  }
}

export const communityService = new CommunityService()
```

```typescript
// packages/core/src/api/services/favorites.service.ts

export class FavoritesService {
  /**
   * 获取收藏列表
   */
  async getFavorites(type?: 'recipe' | 'food') {
    return api.get<Favorite[]>('/favorites/', type ? { params: { type } } : undefined)
  }

  /**
   * 添加收藏
   */
  async addFavorite(itemId: string, type: 'recipe' | 'food') {
    return api.post<Favorite>('/favorites/', { itemId, type })
  }

  /**
   * 取消收藏
   */
  async removeFavorite(id: string) {
    return api.delete<{ success: boolean }>(`/favorites/${id}`)
  }

  /**
   * 检查是否已收藏
   */
  async checkFavorited(itemId: string, type?: 'recipe' | 'food') {
    return api.get<{ isFavorited: boolean }>(
      `/favorites/check/${itemId}`,
      type ? { params: { type } } : undefined
    )
  }
}

export const favoritesService = new FavoritesService()
```

```typescript
// packages/core/src/api/services/notifications.service.ts

export class NotificationsService {
  /**
   * 获取消息列表
   */
  async getMessages(type?: MessageType) {
    return api.get<Message[]>('/notifications/', type ? { params: { type } } : undefined)
  }

  /**
   * 获取未读数量
   */
  async getUnreadCount() {
    return api.get<{ count: number }>('/notifications/unread-count')
  }

  /**
   * 标记消息已读
   */
  async markAsRead(messageId: string) {
    return api.patch<{ success: boolean }>(`/notifications/${messageId}/read`)
  }

  /**
   * 全部标记已读
   */
  async markAllAsRead() {
    return api.patch<{ success: boolean }>('/notifications/read-all')
  }

  /**
   * 删除消息
   */
  async deleteMessage(messageId: string) {
    return api.delete<{ success: boolean }>(`/notifications/${messageId}`)
  }
}

export const notificationsService = new NotificationsService()
```

```typescript
// packages/core/src/api/services/upload.service.ts

export class UploadService {
  /**
   * 上传图片
   */
  async uploadImage(file: File, filename: string): Promise<string> {
    // 1. 获取预签名 URL
    const presignData = await api.post<{ url: string; key: string }>('/upload/presign-url', {
      filename,
      contentType: file.type,
    })

    // 2. 直接上传到 S3
    await fetch(presignData.url, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    })

    // 3. 确认上传完成
    const confirmData = await api.post<{ url: string }>('/upload/confirm-upload', {
      key: presignData.key,
    })

    return confirmData.url
  }
}

export const uploadService = new UploadService()
```

### 在页面中使用

```typescript
// pages/ai-chat/index.vue
<script setup lang="ts">
import { ref } from 'vue'
import { chatService } from '@diet-lens/core'

const messages = ref<ChatMessage[]>([])
const loading = ref(false)

const sendMessage = async (content: string) => {
  loading.value = true
  try {
    const response = await chatService.sendMessage(content)
    // 处理响应
    console.log(response.reply)
    if (response.recipeCard) {
      // 显示食谱卡片
    }
  } catch (error) {
    console.error('发送消息失败:', error)
  } finally {
    loading.value = false
  }
}
</script>
```

---

## 开发指南

### 导航跳转

```typescript
// Tab 页面切换 (使用 switchTab)
uni.switchTab({
  url: '/pages/index/index'
})

// 普通页面跳转 (使用 navigateTo)
uni.navigateTo({
  url: '/pages/ai-chat/index'
})

// 返回上一页
uni.navigateBack({
  delta: 1
})
```

---

## 待完善功能

### 需要后端支持

1. **用户认证**: 登录/注册/Token刷新
2. **AI 对话**: 营养师对话 API (已完成基础接口)
3. **AI 识别**: Gemini API 集成
4. **数据存储**: 营养记录、历史数据
5. **社区功能**: 发布、点赞、评论 (已完成)
6. **消息推送**: 系统通知 (已完成)
7. **购物集成**: 盒马、美团 API (暂未实现)
8. **健康数据**: Apple HealthKit 同步

### 需要前端优化

1. **状态管理**: 实现 Pinia stores
2. **请求封装**: 统一 API 调用和错误处理
3. **加载状态**: 全局 Loading 组件
4. **图片上传**: 压缩、Base64 转换
5. **离线支持**: 本地缓存策略
6. **性能优化**: 图片懒加载、列表虚拟化
7. **测试**: 单元测试、E2E 测试

---

## 版本历史

| 版本 | 日期 | 说明 |
|:-----|:-----|:-----|
| 1.0.0 | 2026-02-06 | 初始版本，完成18个UI页面 |
| 2.0.0 | 2026-02-06 | 更新发现页为双模式架构，新增收藏/发布/评价页面 |
| 2.1.0 | 2026-02-06 | 简化发现页架构（移除冗余子标签），新增AI营养师对话页面 |
| 3.0.0 | 2026-02-06 | 新增后端 API 文档：AI对话、社区、收藏、消息通知、文件上传模块 |

---

**文档维护者**: Architect
**最后更新**: 2026-02-06
