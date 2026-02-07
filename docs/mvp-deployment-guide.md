# MVP 部署与优化指南

> **版本**: 1.0.0
> **更新日期**: 2026-02-06
> **目标**: 高性价比 MVP，中国+国际快速访问

---

## 一、核心目标

| 指标 | 目标值 | 优先级 |
|------|--------|--------|
| **月成本** | < $100 | P0 |
| **中国访问延迟** | < 500ms | P0 |
| **国际访问延迟** | < 300ms | P1 |
| **首屏加载** | < 2s (4G) | P0 |
| **可用性** | > 99.5% | P1 |

---

## 二、云服务选型 (性价比优先)

### 2.1 推荐方案：Cloudflare 全家桶 + 国内云补充

```
┌─────────────────────────────────────────────────────────────────┐
│                        全球架构                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│   │   用户请求   │───▶│ Cloudflare   │───▶│   源站服务   │     │
│   │  (全球/中国) │    │   CDN/WAF    │    │              │     │
│   └──────────────┘    └──────────────┘    └──────────────┘     │
│                              │                    │             │
│                              ▼                    ▼             │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│   │ Cloudflare   │    │ Cloudflare   │    │   Railway    │     │
│   │    Pages     │    │      R2      │    │   (后端)     │     │
│   │   (前端)     │    │   (存储)     │    │              │     │
│   └──────────────┘    └──────────────┘    └──────────────┘     │
│                                                  │              │
│                                                  ▼              │
│                                           ┌──────────────┐     │
│                                           │   Supabase   │     │
│                                           │ (PostgreSQL) │     │
│                                           └──────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 服务选型对比

#### 前端托管

| 服务 | 免费额度 | 中国访问 | 推荐度 |
|------|----------|----------|--------|
| **Cloudflare Pages** | 无限带宽、500次构建/月 | ⭐⭐⭐⭐ (有中国节点) | ✅ 推荐 |
| Vercel | 100GB/月带宽 | ⭐⭐ (需梯子部分地区) | 备选 |
| Netlify | 100GB/月带宽 | ⭐⭐ | 备选 |

**选择理由**: Cloudflare Pages 在中国有合作节点，访问速度优于 Vercel/Netlify。

#### 后端服务

| 服务 | 免费额度 | 特点 | 推荐度 |
|------|----------|------|--------|
| **Railway** | $5/月额度 | 简单部署、自动扩容 | ✅ 推荐 |
| Render | 750小时/月 | 冷启动慢 | 备选 |
| Fly.io | $5/月额度 | 全球边缘部署 | 备选 |
| 阿里云 ECS | ¥99/年学生机 | 中国访问最快 | 中国优先时选 |

**选择理由**: Railway 部署简单，支持 Docker，冷启动快，性价比高。

#### 数据库

| 服务 | 免费额度 | 特点 | 推荐度 |
|------|----------|------|--------|
| **Supabase** | 500MB 存储、2GB 带宽 | PostgreSQL + 实时订阅 | ✅ 推荐 |
| PlanetScale | 5GB 存储 | MySQL 兼容、分支 | 备选 |
| Neon | 3GB 存储 | PostgreSQL、冷启动 | 备选 |

**选择理由**: Supabase 免费额度足够 MVP，且提供 Auth、Storage 等附加功能。

#### 对象存储 (图片/文件)

| 服务 | 免费额度 | 特点 | 推荐度 |
|------|----------|------|--------|
| **Cloudflare R2** | 10GB 存储、无出口费 | 兼容 S3 API | ✅ 推荐 |
| AWS S3 | 5GB/12个月 | 出口费贵 | 不推荐 |
| 阿里云 OSS | 按量付费 | 中国访问快 | 中国优先时选 |

**选择理由**: R2 无出口流量费，配合 Cloudflare CDN 全球加速。

#### 缓存

| 服务 | 免费额度 | 特点 | 推荐度 |
|------|----------|------|--------|
| **Upstash Redis** | 10K 命令/天 | Serverless Redis | ✅ 推荐 |
| Redis Cloud | 30MB | 传统托管 | 备选 |

### 2.3 成本估算 (MVP 阶段)

```
月度成本估算 (1万 MAU):

前端托管:     $0   (Cloudflare Pages 免费)
后端服务:     $5   (Railway 免费额度)
数据库:       $0   (Supabase 免费额度)
对象存储:     $0   (R2 10GB 免费)
Redis 缓存:   $0   (Upstash 免费额度)
域名:         $1   (可选，使用 .dev/.app)
AI API:       $30  (Gemini API 优化后)
────────────────────────────
总计:         ~$36/月
```

---

## 三、中国访问优化策略

### 3.1 Cloudflare 中国网络

Cloudflare 与中国电信、联通、移动有合作，在中国有 17+ 数据中心：

```yaml
优势:
  - 无需 ICP 备案 (使用 Cloudflare 域名)
  - 自动选择最近节点
  - DDoS 防护

局限:
  - 部分地区/运营商可能不稳定
  - 高峰期可能降速

优化策略:
  1. 启用 Cloudflare Polish (图片压缩)
  2. 启用 Cloudflare Mirage (智能图片加载)
  3. 设置页面规则缓存静态资源
  4. 使用 Cloudflare Workers 做边缘计算
```

### 3.2 备用方案：国内云加速

如果 Cloudflare 在中国访问不稳定，可添加国内云：

```
┌───────────────────────────────────────────────────────┐
│                   混合部署方案                         │
├───────────────────────────────────────────────────────┤
│                                                       │
│   中国用户 ──▶ 阿里云 CDN ──▶ 阿里云 OSS (静态资源)   │
│                     │                                 │
│                     ▼                                 │
│               Railway 后端 (API)                      │
│                                                       │
│   海外用户 ──▶ Cloudflare CDN ──▶ R2 (静态资源)      │
│                     │                                 │
│                     ▼                                 │
│               Railway 后端 (API)                      │
│                                                       │
└───────────────────────────────────────────────────────┘

额外成本: ¥50-100/月 (阿里云 CDN + OSS)
```

### 3.3 DNS 智能解析

使用 Cloudflare 或 DNSPod 的智能解析：

```yaml
# DNS 配置示例
diet-lens.app:
  - 中国电信: 指向阿里云 CDN
  - 中国联通: 指向阿里云 CDN
  - 中国移动: 指向阿里云 CDN
  - 默认: 指向 Cloudflare

api.diet-lens.app:
  - 全球统一: 指向 Railway (通过 Cloudflare 代理)
```

---

## 四、前端性能优化

### 4.1 构建优化

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'pinia'],
          'ui': ['wot-design-uni'],
          'utils': ['dayjs', 'lodash-es'],
        },
      },
    },
    // 压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 资源内联阈值
    assetsInlineLimit: 4096,
  },
})
```

### 4.2 图片优化策略

```typescript
// 图片加载组件
<template>
  <image
    :src="optimizedSrc"
    :lazy-load="true"
    mode="aspectFill"
    @error="handleError"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string
  width?: number
}>()

// 使用 Cloudflare Image Resizing
const optimizedSrc = computed(() => {
  if (!props.src) return '/images/placeholder.webp'

  // R2 图片 URL 添加变换参数
  const width = props.width || 400
  return `${props.src}?width=${width}&format=webp&quality=80`
})
</script>
```

### 4.3 首屏加载优化

```yaml
策略清单:
  1. 路由懒加载 (已实现)
  2. 组件按需导入 (wot-design-uni 已配置)
  3. 骨架屏 (关键页面添加)
  4. 预加载关键资源 (manifest.json 配置)
  5. Service Worker 缓存 (PWA)

manifest.json 预加载配置:
  "preloadRule": {
    "pages/home/index": {
      "network": "all",
      "packages": ["pages/diary", "pages/camera"]
    }
  }
```

### 4.4 离线能力 (PWA)

```typescript
// sw.ts - Service Worker
const CACHE_NAME = 'diet-lens-v1'
const STATIC_ASSETS = [
  '/',
  '/pages/home/index',
  '/images/logo.webp',
  '/fonts/icon.woff2',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
})

self.addEventListener('fetch', (event) => {
  // 缓存优先策略 (静态资源)
  if (event.request.url.includes('/static/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request)
      })
    )
  }
})
```

---

## 五、后端性能优化

### 5.1 Railway 部署配置

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q --spider http://localhost:3000/health || exit 1

EXPOSE 3000
CMD ["node", "dist/main.js"]
```

```yaml
# railway.toml
[build]
  builder = "dockerfile"

[deploy]
  healthcheckPath = "/health"
  healthcheckTimeout = 10
  restartPolicyType = "on_failure"
  restartPolicyMaxRetries = 3
```

### 5.2 数据库连接池

```typescript
// prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      // 连接池配置
      log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
```

```env
# .env - Supabase 连接池配置
DATABASE_URL="postgresql://user:pass@db.xxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=10"
```

### 5.3 API 响应缓存

```typescript
// 使用 Upstash Redis
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
})

// 缓存装饰器
export function Cacheable(ttl: number = 300) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`

      // 尝试从缓存读取
      const cached = await redis.get(cacheKey)
      if (cached) {
        return cached
      }

      // 执行原方法
      const result = await originalMethod.apply(this, args)

      // 写入缓存
      await redis.setex(cacheKey, ttl, JSON.stringify(result))

      return result
    }

    return descriptor
  }
}

// 使用示例
@Cacheable(600) // 缓存 10 分钟
async getFoodById(id: string): Promise<Food> {
  return this.prisma.food.findUnique({ where: { id } })
}
```

---

## 六、AI API 成本控制

### 6.1 分层调用策略

```typescript
// services/food-recognition.service.ts
export class FoodRecognitionService {
  // Layer 1: 本地哈希匹配 (免费)
  private readonly imageHashCache = new Map<string, FoodResult>()

  // Layer 2: Redis 缓存 (免费额度)
  constructor(
    private readonly redis: Redis,
    private readonly gemini: GeminiService,
  ) {}

  async recognize(imageBuffer: Buffer): Promise<FoodResult> {
    // Step 1: 计算图片哈希
    const imageHash = this.computeHash(imageBuffer)

    // Step 2: 本地内存缓存
    if (this.imageHashCache.has(imageHash)) {
      return this.imageHashCache.get(imageHash)!
    }

    // Step 3: Redis 缓存
    const cached = await this.redis.get(`food:${imageHash}`)
    if (cached) {
      const result = JSON.parse(cached) as FoodResult
      this.imageHashCache.set(imageHash, result)
      return result
    }

    // Step 4: Gemini API (付费)
    const result = await this.gemini.recognizeFood(imageBuffer)

    // 缓存结果
    await this.redis.setex(`food:${imageHash}`, 86400 * 7, JSON.stringify(result))
    this.imageHashCache.set(imageHash, result)

    return result
  }

  private computeHash(buffer: Buffer): string {
    // 使用 perceptual hash 而非 MD5，相似图片可命中缓存
    return phash(buffer)
  }
}
```

### 6.2 请求限流

```typescript
// 用户级别限流
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly redis: Redis) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const userId = request.user?.id || request.ip

    const key = `rate:ai:${userId}`
    const count = await this.redis.incr(key)

    if (count === 1) {
      await this.redis.expire(key, 86400) // 每天重置
    }

    // 免费用户每天 10 次，付费用户无限制
    const limit = request.user?.isPremium ? Infinity : 10

    if (count > limit) {
      throw new TooManyRequestsException('今日 AI 识别次数已用完')
    }

    return true
  }
}
```

### 6.3 Gemini API 配置

```typescript
// services/gemini.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

@Injectable()
export class GeminiService {
  private readonly model: GenerativeModel

  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

    // 使用 Flash 模型 (便宜 10x)
    this.model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        maxOutputTokens: 256, // 限制输出长度
        temperature: 0.1,    // 低温度，更确定性
      },
    })
  }

  async recognizeFood(imageBuffer: Buffer): Promise<FoodResult> {
    const prompt = `识别图片中的食物，返回 JSON 格式：
{
  "name": "食物名称",
  "confidence": 0.95,
  "calories_per_100g": 250,
  "protein": 10,
  "carbs": 30,
  "fat": 8
}
只返回 JSON，不要其他文字。`

    const result = await this.model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBuffer.toString('base64'),
        },
      },
    ])

    return JSON.parse(result.response.text())
  }
}
```

---

## 七、食材数据初始化

### 7.1 预置数据策略

```yaml
MVP 阶段数据来源:
  1. USDA FoodData Central (免费、权威)
     - 下载: https://fdc.nal.usda.gov/download-datasets.html
     - 格式: JSON/CSV
     - 数量: ~300,000 条 (筛选常见 5000 条)

  2. 中国食物成分表 (开源版)
     - 来源: 薄荷健康开放 API / 手工整理
     - 数量: ~2000 条中国常见食材

  3. 图片来源
     - Unsplash API (免费、高质量)
     - Pexels API (免费)
     - 自行拍摄/AI 生成 (后期)
```

### 7.2 数据导入脚本

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import usdaFoods from './data/usda-foods.json'
import chineseFoods from './data/chinese-foods.json'

const prisma = new PrismaClient()

async function main() {
  console.log('开始导入食材数据...')

  // 导入分类
  const categories = [
    { name: '蔬菜', icon: '🥬' },
    { name: '水果', icon: '🍎' },
    { name: '肉类', icon: '🥩' },
    { name: '海鲜', icon: '🦐' },
    { name: '谷物', icon: '🍚' },
    { name: '豆类', icon: '🫘' },
    { name: '乳制品', icon: '🥛' },
    { name: '零食', icon: '🍪' },
  ]

  for (const cat of categories) {
    await prisma.foodCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    })
  }

  // 导入食材
  const allFoods = [...usdaFoods, ...chineseFoods]

  for (const food of allFoods) {
    await prisma.food.upsert({
      where: { name: food.name },
      update: food,
      create: {
        name: food.name,
        nameEn: food.name_en,
        category: food.category,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        fiber: food.fiber,
        imageUrl: food.image_url,
      },
    })
  }

  console.log(`导入完成: ${allFoods.length} 条食材数据`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

### 7.3 图片批量下载

```typescript
// scripts/download-food-images.ts
import { createClient } from 'pexels'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'

const pexels = createClient(process.env.PEXELS_API_KEY)
const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

async function downloadAndUpload(foodName: string, foodId: string) {
  // 搜索图片
  const result = await pexels.photos.search({
    query: `${foodName} food`,
    per_page: 1,
  })

  if (result.photos.length === 0) return null

  const photo = result.photos[0]
  const response = await fetch(photo.src.medium)
  const buffer = await response.arrayBuffer()

  // 压缩为 WebP
  const webpBuffer = await sharp(Buffer.from(buffer))
    .resize(800, 800, { fit: 'inside' })
    .webp({ quality: 80 })
    .toBuffer()

  // 生成缩略图
  const thumbBuffer = await sharp(Buffer.from(buffer))
    .resize(200, 200, { fit: 'cover' })
    .webp({ quality: 70 })
    .toBuffer()

  // 上传到 R2
  await s3.send(new PutObjectCommand({
    Bucket: 'diet-lens',
    Key: `foods/${foodId}.webp`,
    Body: webpBuffer,
    ContentType: 'image/webp',
  }))

  await s3.send(new PutObjectCommand({
    Bucket: 'diet-lens',
    Key: `foods/${foodId}_thumb.webp`,
    Body: thumbBuffer,
    ContentType: 'image/webp',
  }))

  return `foods/${foodId}.webp`
}
```

---

## 八、UI/UX 专业度提升

### 8.1 设计规范

```yaml
色彩系统:
  Primary: #7C9A7B (Sage Green - 健康、自然)
  Secondary: #F5E6D3 (Cream - 温暖、食物)
  Accent: #E8A87C (Coral - 活力)
  Neutral: #2D3748, #4A5568, #718096, #E2E8F0
  Success: #48BB78
  Warning: #ECC94B
  Error: #F56565

字体:
  - 中文: "PingFang SC", "Noto Sans SC", sans-serif
  - 英文: "Inter", "SF Pro", sans-serif
  - 数字: "DIN Alternate", "Roboto Mono", monospace

间距:
  - Base: 4px
  - 常用: 8, 12, 16, 24, 32, 48px

圆角:
  - Small: 4px (按钮、标签)
  - Medium: 8px (卡片)
  - Large: 16px (弹窗)
  - Full: 9999px (圆形)

阴影:
  - Card: 0 2px 8px rgba(0,0,0,0.08)
  - Modal: 0 4px 24px rgba(0,0,0,0.12)
  - Floating: 0 8px 32px rgba(0,0,0,0.16)
```

### 8.2 加载状态

```vue
<!-- components/LoadingState.vue -->
<template>
  <view class="loading-container">
    <!-- 骨架屏 -->
    <view v-if="type === 'skeleton'" class="skeleton-wrapper">
      <view class="skeleton-avatar" />
      <view class="skeleton-lines">
        <view class="skeleton-line w-3/4" />
        <view class="skeleton-line w-1/2" />
      </view>
    </view>

    <!-- 加载动画 -->
    <view v-else-if="type === 'spinner'" class="spinner-wrapper">
      <view class="spinner" />
      <text class="loading-text">{{ text }}</text>
    </view>

    <!-- 进度条 -->
    <view v-else-if="type === 'progress'" class="progress-wrapper">
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: `${progress}%` }" />
      </view>
      <text class="progress-text">{{ progress }}%</text>
    </view>
  </view>
</template>
```

### 8.3 空状态设计

```vue
<!-- components/EmptyState.vue -->
<template>
  <view class="empty-state">
    <image :src="illustration" class="empty-illustration" />
    <text class="empty-title">{{ title }}</text>
    <text class="empty-description">{{ description }}</text>
    <wd-button v-if="actionText" type="primary" @click="$emit('action')">
      {{ actionText }}
    </wd-button>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  illustration: string
  title: string
  description: string
  actionText?: string
}>()

defineEmits<{
  (e: 'action'): void
}>()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-illustration {
  width: 200px;
  height: 200px;
  margin-bottom: 24px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 8px;
}

.empty-description {
  font-size: 14px;
  color: #718096;
  margin-bottom: 24px;
}
</style>
```

### 8.4 错误处理 UI

```vue
<!-- components/ErrorBoundary.vue -->
<template>
  <view v-if="error" class="error-state">
    <image src="/images/error.svg" class="error-illustration" />
    <text class="error-title">出了点问题</text>
    <text class="error-message">{{ error.message }}</text>
    <view class="error-actions">
      <wd-button type="primary" @click="retry">重试</wd-button>
      <wd-button @click="report">反馈问题</wd-button>
    </view>
  </view>
  <slot v-else />
</template>
```

---

## 九、监控与告警

### 9.1 前端监控 (Sentry)

```typescript
// main.ts
import * as Sentry from '@sentry/vue'

Sentry.init({
  app,
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% 采样
  replaysOnErrorSampleRate: 1.0,
})
```

### 9.2 后端监控 (Railway 内置)

Railway 提供内置监控：
- CPU/Memory 使用率
- 请求延迟
- 错误率

### 9.3 Uptime 监控 (免费)

推荐使用 UptimeRobot (免费 50 个监控点)：

```yaml
监控配置:
  - 名称: Diet Lens API Health
    URL: https://api.diet-lens.app/health
    间隔: 5 分钟
    告警: Telegram/Email

  - 名称: Diet Lens Frontend
    URL: https://diet-lens.app
    间隔: 5 分钟
    告警: Telegram/Email
```

---

## 十、部署检查清单

### 10.1 上线前检查

```yaml
安全检查:
  [ ] 环境变量已配置且不在代码中
  [ ] API 密钥已设置访问限制
  [ ] CORS 已正确配置
  [ ] Rate Limiting 已启用
  [ ] HTTPS 已强制

性能检查:
  [ ] 生产构建已优化 (minify, tree-shake)
  [ ] 图片已压缩为 WebP
  [ ] CDN 缓存已配置
  [ ] Gzip/Brotli 压缩已启用
  [ ] 数据库索引已创建

功能检查:
  [ ] 登录/注册流程正常
  [ ] AI 识别功能正常
  [ ] 数据同步正常
  [ ] 错误提示友好

监控检查:
  [ ] Sentry 已集成
  [ ] Uptime 监控已配置
  [ ] 日志收集已启用
```

### 10.2 灰度发布

```yaml
阶段 1 (内测):
  - 邀请 10-50 用户
  - 收集反馈
  - 修复关键 Bug

阶段 2 (公测):
  - 开放注册
  - 限流 1000 用户/天
  - 监控稳定性

阶段 3 (正式发布):
  - 全量开放
  - 增加服务器资源
  - 启动营销推广
```

---

## 十一、成本控制里程碑

```
MVP 阶段 (0-1000 用户):
  月成本: $30-50
  服务: 全免费额度

增长阶段 (1000-10000 用户):
  月成本: $100-200
  升级: Railway Pro ($20), Supabase Pro ($25)

规模阶段 (10000+ 用户):
  月成本: $500+
  升级: 专用数据库, 多区域部署
```

---

**文档状态**: 可执行
**下一步**: 按照此指南配置各项服务，开始部署
