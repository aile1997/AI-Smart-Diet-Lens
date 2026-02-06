# 企业级架构决策文档

> **版本**: 1.0.0
> **更新日期**: 2026-02-06
> **状态**: 待讨论

---

## 一、食材百科数据方案

### 1.1 问题分析

| 维度 | 挑战 |
|------|------|
| **数据量** | 中国常见食材 ~5000+ 种，含营养成分、图片、描述 |
| **图片存储** | 每张图片 ~100KB-500KB，5000 张 ≈ 500MB-2.5GB |
| **更新频率** | 低频更新（季节性食材、新品） |
| **查询模式** | 高频读、低频写，需要模糊搜索 |

### 1.2 数据来源方案

#### 方案 A: 第三方 API (推荐起步)

| API | 优势 | 劣势 | 成本 |
|-----|------|------|------|
| **FatSecret API** | 全球覆盖、免费额度高 | 中文数据有限 | 免费 5000 次/月 |
| **USDA FoodData Central** | 权威、免费、详细 | 全英文、无图片 | 免费 |
| **中国食物成分表** | 本土化、权威 | 需购买/爬取、无 API | 付费 |
| **Edamam API** | 图片丰富、AI 增强 | 付费 | $0.0015/请求 |

**推荐策略**:
```
Phase 1: USDA + FatSecret (免费启动)
         ↓ 翻译 + 本地化
Phase 2: 自建食材库 (积累用户贡献数据)
         ↓ AI 辅助校验
Phase 3: 商业授权 (中国食物成分表)
```

#### 方案 B: 自建爬取 + AI 增强

```
1. 爬取公开食材网站 (下厨房、美食杰、薄荷健康)
2. AI 提取/校验营养成分
3. 用户贡献 + 审核机制
```

⚠️ **法律风险**: 需确保数据来源合法，建议优先使用开放数据。

### 1.3 存储架构

```
┌─────────────────────────────────────────────────────────────┐
│                        数据存储分层                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │  PostgreSQL │     │    Redis    │     │  S3 / OSS   │   │
│  │  (核心数据) │     │   (缓存)    │     │  (图片CDN)  │   │
│  └─────────────┘     └─────────────┘     └─────────────┘   │
│        │                   │                   │            │
│        │                   │                   │            │
│  ┌─────┴─────┐      ┌─────┴─────┐      ┌─────┴─────┐      │
│  │ 食材基础  │      │ 热门食材  │      │ 食材图片  │      │
│  │ 营养成分  │      │ 搜索缓存  │      │ 食谱封面  │      │
│  │ 分类标签  │      │ 用户偏好  │      │ 用户上传  │      │
│  └───────────┘      └───────────┘      └───────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### PostgreSQL 表设计

```sql
-- 食材主表 (瘦表设计，只存核心字段)
CREATE TABLE foods (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  name_en     VARCHAR(100),        -- 英文名 (搜索用)
  pinyin      VARCHAR(100),        -- 拼音 (搜索用)
  category_id UUID REFERENCES food_categories(id),

  -- 每 100g 营养成分
  calories    DECIMAL(8,2),
  protein     DECIMAL(8,2),
  carbs       DECIMAL(8,2),
  fat         DECIMAL(8,2),
  fiber       DECIMAL(8,2),
  sodium      DECIMAL(8,2),

  -- 图片 (只存 key，不存完整 URL)
  image_key   VARCHAR(200),        -- S3 key: foods/apple.webp
  thumbnail_key VARCHAR(200),      -- 缩略图 key

  -- 元数据
  source      VARCHAR(50),         -- USDA | FATSECRET | USER | ADMIN
  verified    BOOLEAN DEFAULT false,
  view_count  INTEGER DEFAULT 0,

  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 分类表
CREATE TABLE food_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(50) NOT NULL,
  icon        VARCHAR(50),
  sort_order  INTEGER DEFAULT 0
);

-- 全文搜索索引
CREATE INDEX idx_foods_search ON foods
  USING GIN(to_tsvector('simple', name || ' ' || COALESCE(name_en, '') || ' ' || COALESCE(pinyin, '')));
```

#### 图片存储策略

```yaml
存储位置: AWS S3 / 阿里云 OSS / 腾讯云 COS

目录结构:
  /foods/                    # 食材图片
    /{category}/             # 按分类
      {food_id}.webp         # 原图 (WebP 格式，压缩率高)
      {food_id}_thumb.webp   # 缩略图 (200x200)
  /recipes/                  # 食谱图片
  /user-uploads/             # 用户上传 (AI 识别)

CDN 配置:
  - 边缘节点缓存: 7 天
  - 图片处理: 按需裁剪、WebP 转换
  - 防盗链: Referer 白名单
```

#### 图片优化策略

| 优化点 | 方案 | 效果 |
|--------|------|------|
| **格式** | 统一使用 WebP | 体积减少 30-50% |
| **尺寸** | 按设备裁剪 (1x/2x/3x) | 减少传输 |
| **懒加载** | 滚动到视口才加载 | 首屏加速 |
| **缩略图** | 列表页用 200x200 缩略图 | 流量节省 80% |
| **CDN** | 全球边缘节点 | 加载时间 <100ms |
| **预加载** | 热门食材预缓存 | 秒开体验 |

### 1.4 数据量估算

```
初始数据集: 5,000 种食材
  - 结构化数据: ~5MB (PostgreSQL)
  - 原图 (500KB/张): ~2.5GB
  - 缩略图 (20KB/张): ~100MB

总存储: ~2.6GB (首次部署)
CDN 月流量: ~50GB (假设 10万 DAU，每人看 5 张)
CDN 成本: ~$5/月 (阿里云 OSS)
```

---

## 二、AI 生成内容策略

### 2.1 问题分析

| 场景 | Token 消耗 | 成本敏感度 |
|------|-----------|-----------|
| **食物识别** | 输入: 图片 ~1000 tokens | 高 (每次拍照都调用) |
| **食谱推荐** | 输出: ~500 tokens | 中 (用户主动请求) |
| **AI 对话** | 输入+输出: ~2000 tokens | 低 (高级功能) |

### 2.2 成本控制策略

#### 策略 1: 图片不走 AI，只传文字

```
❌ 错误做法: 让 AI 生成食谱图片描述 → 再调用 DALL-E 生成图片
   成本: Gemini + DALL-E ≈ $0.05/次

✅ 正确做法:
   1. 食谱图片 → 使用预设图片库 (按食物类别匹配)
   2. 食材图片 → 使用 Unsplash API (免费) 或预采集
   3. 用户上传 → 只做识别，不生成
```

#### 策略 2: 分层调用

```typescript
// 识别策略分层
async function recognizeFood(image: Buffer): Promise<FoodResult> {
  // Layer 1: 本地模型 (免费，准确率 70%)
  const localResult = await localMLModel.predict(image)
  if (localResult.confidence > 0.9) {
    return localResult // 高置信度，不调用 API
  }

  // Layer 2: 缓存命中 (Redis)
  const imageHash = hashImage(image)
  const cached = await redis.get(`food:${imageHash}`)
  if (cached) {
    return JSON.parse(cached)
  }

  // Layer 3: Gemini API (付费)
  const geminiResult = await geminiAPI.analyze(image)
  await redis.set(`food:${imageHash}`, JSON.stringify(geminiResult), 'EX', 86400)
  return geminiResult
}
```

#### 策略 3: 预生成 + 缓存

```yaml
食谱推荐:
  - 预生成 500+ 基础食谱 (一次性成本)
  - 存入数据库，按标签索引
  - 用户请求时从库中匹配，不实时生成

AI 对话:
  - 常见问题 → 预设回答 (FAQ)
  - 复杂问题 → 实时调用 (限制次数)
```

### 2.3 Token 成本估算

```
假设 MAU 10万:
  - 食物识别: 10万 × 3次/天 × 30天 × $0.001 = $9,000/月 ❌ 太贵!

优化后:
  - 本地模型过滤 70%: 30万次 × $0 = $0
  - 缓存命中 20%: 6万次 × $0 = $0
  - API 调用 10%: 3万次 × $0.001 = $30/月 ✅

食谱推荐:
  - 预生成 500 食谱: 500 × $0.01 = $5 (一次性)
  - 用户请求匹配: $0
```

### 2.4 图片生成方案

| 场景 | 方案 | 成本 |
|------|------|------|
| **食材图片** | Unsplash API (免费) + 预采集 | $0 |
| **食谱封面** | 预设模板 + 食材组合图 | $0 |
| **用户菜品** | 用户自己拍照上传 | $0 |
| **AI 生成图** | 不使用 (成本太高) | - |

---

## 三、其他企业级问题清单

### 3.1 性能优化

| 问题 | 解决方案 |
|------|----------|
| **冷启动慢** | 预热缓存、连接池 |
| **数据库慢查询** | 索引优化、读写分离 |
| **API 响应慢** | GraphQL/BFF、字段裁剪 |
| **大文件上传** | 分片上传、断点续传 |

### 3.2 安全合规

| 问题 | 解决方案 |
|------|----------|
| **用户隐私** | 数据加密、最小化收集 |
| **GDPR/个保法** | 用户数据导出、删除接口 |
| **图片版权** | 使用 CC0 协议图片 |
| **API 滥用** | Rate Limiting、Token 鉴权 |

### 3.3 高可用

| 问题 | 解决方案 |
|------|----------|
| **单点故障** | 多可用区部署 |
| **流量突增** | 自动扩容、CDN 分流 |
| **数据丢失** | 每日备份、跨区复制 |
| **服务降级** | 熔断器、Fallback |

### 3.4 可观测性

```
日志: ELK Stack (Elasticsearch + Logstash + Kibana)
指标: Prometheus + Grafana
追踪: Jaeger / OpenTelemetry
告警: PagerDuty / 钉钉机器人
```

---

## 四、推荐实施路线

### Phase 1: MVP (1-2 个月)

```
✅ 使用 USDA + FatSecret API 作为食材数据源
✅ 食材图片使用 Unsplash 免费 API
✅ AI 识别使用 Gemini API (添加缓存层)
✅ 食谱使用预生成数据 (500+ 条)
✅ 单机部署 (AWS Lightsail / 阿里云 ECS)
```

**预估成本**: $50-100/月

### Phase 2: 增长期 (3-6 个月)

```
⬜ 自建食材数据库 (迁移 + 用户贡献)
⬜ 本地 ML 模型过滤简单识别
⬜ Redis 缓存层
⬜ CDN 加速
⬜ 读写分离
```

**预估成本**: $200-500/月

### Phase 3: 规模化 (6+ 个月)

```
⬜ 微服务拆分
⬜ Kubernetes 部署
⬜ 自训练识别模型
⬜ 多租户支持 (SaaS)
⬜ 国际化
```

**预估成本**: $1000+/月

---

## 五、待决策事项

| # | 问题 | 选项 | 建议 |
|---|------|------|------|
| 1 | 食材数据源 | USDA / FatSecret / 自建 | Phase1 用 API，Phase2 自建 |
| 2 | 图片存储 | S3 / OSS / 七牛 | 阿里云 OSS (国内访问快) |
| 3 | AI 供应商 | Gemini / GPT-4V / 自训练 | Gemini (性价比高) |
| 4 | 部署方式 | 单机 / K8s / Serverless | Phase1 单机，Phase2 K8s |
| 5 | 用户认证 | 邮箱 / 手机 / 微信 | 微信优先 (国内) |

---

**下一步**: 请确认上述方案，我将开始实施 Phase 1 的具体代码改造。
