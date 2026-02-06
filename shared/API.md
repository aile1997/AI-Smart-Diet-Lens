# AI Smart Diet Lens API 文档

> 版本: 2.2.0
> 基础 URL: `http://localhost:3000/api`
> Swagger 文档: `http://localhost:3000/api-docs`

---

## 认证方式

除了登录接口外，所有接口都需要 JWT Bearer Token 认证。

```
Authorization: Bearer <your_jwt_token>
```

---

## API 模块

### 1. 系统模块 (system)

#### 1.1 获取系统启动配置

```
GET /api/system/bootstrap
```

**描述**: App 冷启动时首个调用，用于版本控制和功能开关

**认证**: 无需认证

**响应**:
```typescript
{
  success: true,
  data: {
    min_version_ios: string,        // iOS 最低版本
    min_version_android: string,    // Android 最低版本
    maintenance_mode: boolean,      // 维护模式开关
    feature_flags: {
      enable_ar_scan: boolean,      // AR 扫描功能开关
      enable_barcode_scanner: boolean, // 条形码扫描开关
      use_health_connect: boolean   // Health Connect 集成开关
    },
    upload_config: {
      provider: string,             // 上传提供商 (S3)
      bucket: string                // 存储桶名称
    }
  },
  timestamp: number
}
```

---

### 2. 认证模块 (auth)

#### 2.1 发送邮箱验证码

```
POST /api/auth/send-code
```

**描述**: 向用户邮箱发送 6 位数字验证码（完全免费）

**认证**: 无需认证

**请求体**:
```typescript
{
  email: string   // 邮箱地址
}
```

**响应**:
```typescript
{
  success: true,
  message: "验证码已发送"
}
```

#### 2.2 邮箱验证码登录

```
POST /api/auth/login/email
```

**描述**: 使用邮箱和验证码登录（首次使用自动注册）

**认证**: 无需认证

**请求体**:
```typescript
{
  email: string,   // 邮箱地址
  code: string     // 6 位验证码
}
```

**响应**:
```typescript
{
  success: true,
  data: {
    token: string,         // JWT Token
    user: {
      id: string,
      email: string,
      nickname?: string,
      avatar?: string,
      emailVerified: true
    }
  }
}
```

#### 2.3 微信授权登录

```
POST /api/auth/login/wechat
```

**描述**: 使用微信授权码登录（预留接口）

**认证**: 无需认证

**请求体**:
```typescript
{
  code: string,     // 微信授权码
  openid?: string   // 微信 OpenID（可选）
}
```

**响应**: 与邮箱登录相同

---

### 3. 用户模块 (user)

#### 3.1 用户入职引导

```
POST /api/user/onboarding
```

**描述**: 首次登录时提交用户基本信息、目标和健康数据

**认证**: 需要认证

**请求体**:
```typescript
{
  profile: {
    gender: 'MALE' | 'FEMALE' | 'OTHER',
    dob: string,           // 出生日期 YYYY-MM-DD
    height_cm: number      // 身高 (cm)
  },
  metrics: {
    weight_kg: number,     // 体重 (kg)
    body_fat?: number,     // 体脂率 (%) 可选
    activity_level: 1.2 | 1.375 | 1.55 | 1.725 | 1.9  // 活动系数
  },
  goal: {
    type: 'FAT_LOSS' | 'MAINTAIN' | 'MUSCLE_GAIN',
    target_weight_kg?: number  // 目标体重 (kg)
  }
}
```

**响应**:
```typescript
{
  success: true,
  data: {
    dailyCalorieTarget: number,  // 每日热量目标 (kcal)
    proteinTarget: number,       // 蛋白质目标 (g)
    carbsTarget: number,         // 碳水目标 (g)
    fatTarget: number,           // 脂肪目标 (g)
    goal: string                 // 策略类型
  },
  timestamp: number
}
```

#### 3.2 获取用户资料

```
GET /api/user/:id
```

**认证**: 无需认证 (公开资料)

#### 3.3 更新用户资料

```
PUT /api/user/:id/profile
```

**认证**: 无需认证

#### 3.4 同步健康数据

```
POST /api/user/health-sync
```

**描述**: 批量同步来自 Health Connect / HealthKit 的健康数据

**认证**: 需要认证

**请求体**:
```typescript
{
  platform: 'ios' | 'android',
  device_model?: string,
  metrics: {
    type: 'STEPS' | 'BODY_FAT' | 'WEIGHT' | 'SLEEP' | 'ACTIVE_CALORIES',
    value: number,
    unit: string,
    recorded_at?: string  // ISO 8601
  }[]
}
```

**响应**:
```typescript
{
  success: true,
  data: {
    synced: number,  // 同步成功数量
    skipped: number  // 跳过数量
  },
  timestamp: number
}
```

#### 3.5 切换核心策略

```
POST /api/user/strategy/switch
```

**描述**: 在 FAT_LOSS / MAINTAIN / MUSCLE_GAIN 之间切换

**认证**: 需要认证

**请求体**:
```typescript
{
  goal: 'FAT_LOSS' | 'MAINTAIN' | 'MUSCLE_GAIN'
}
```

#### 3.6 更新身体指标

```
PATCH /api/user/profile/metrics
```

**认证**: 需要认证

**请求体**:
```typescript
{
  weight_kg?: number,
  body_fat?: number
}
```

---

### 4. 仪表盘模块 (dashboard)

#### 4.1 获取仪表盘摘要

```
GET /api/dashboard/summary?date=2026-02-05
```

**描述**: 返回今日营养数据、策略模式和智能提醒

**认证**: 需要认证

**查询参数**:
- `date`: 日期 (YYYY-MM-DD)，默认今日

**响应**:
```typescript
{
  success: true,
  data: {
    ui_strategy: 'FAT_LOSS' | 'MUSCLE_GAIN' | 'MAINTAIN',
    date: string,
    hero_component: {
      type: 'CALORIE_RING' | 'DUAL_BAR_CHART' | 'PROGRESS_RING',
      data: {
        primary: { label: string, current: number, target: number, unit: string },
        secondary: { label: string, current: number, target: number, unit: string }
      }
    },
    widgets: {
      steps: { current: number, target: number },
      water: { current: number, target: number },
      sleep: { hours: number, quality: 'GOOD' | 'FAIR' | 'POOR' }
    },
    smart_alert?: {
      type: string,
      title: string,
      message: string,
      action: string
    }
  },
  timestamp: number
}
```

**UI 策略说明**:
- **FAT_LOSS**: 主组件使用 CALORIE_RING，优先显示热量
- **MUSCLE_GAIN**: 主组件使用 DUAL_BAR_CHART，优先显示蛋白质

---

### 5. AI 识别模块 (ai)

#### 5.1 AI 食物识别

```
POST /api/ai/analyze
```

**描述**: 基于 Gemini API 进行食物拍照识别

**认证**: 需要认证

**请求体**:
```typescript
{
  image_base64: string,  // Base64 编码的图片数据
  image_url?: string     // 或使用图片 URL
}
```

**响应**:
```typescript
{
  success: true,
  data: {
    food_name: string,
    confidence: number,      // 置信度 0-1
    serving_size: string,
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
    fiber?: number,
    sugar?: number
  },
  timestamp: number
}
```

---

### 6. 食物库模块 (food)

#### 6.1 搜索食物

```
GET /api/food/search?q=chicken&page=1&limit=20
```

**描述**: 通过食物名称模糊搜索

**认证**: 无需认证

**查询参数**:
- `q`: 搜索关键词 (必填)
- `page`: 页码，默认 1
- `limit`: 每页数量，默认 20

**响应**:
```typescript
{
  success: true,
  data: {
    items: {
      id: string,
      name: string,
      brand?: string,
      calories_per_100g: number,
      protein_per_100g: number,
      carbs_per_100g: number,
      fat_per_100g: number
    }[],
    total: number,
    page: number,
    pageSize: number,
    totalPages: number
  },
  timestamp: number
}
```

#### 6.2 条形码查询

```
GET /api/food/barcode/:code
```

**描述**: 通过 EAN 条形码查找食物

**认证**: 无需认证

---

### 7. 饮食日记模块 (diary)

#### 7.1 创建饮食记录

```
POST /api/diary/entry
```

**认证**: 需要认证

**请求体**:
```typescript
{
  food_id?: string,         // 来自食物库的 ID (可选)
  meal_type: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK',
  portion: number,          // 份量 (g)
  date: string,             // YYYY-MM-DD
  note?: string,
  // 如果 food_id 为空，需提供手动输入的营养数据
  calories?: number,
  protein?: number,
  carbs?: number,
  fat?: number,
  food_name?: string        // 自定义食物名称
}
```

#### 7.2 获取日记列表

```
GET /api/diary?date=2026-02-05
```

**认证**: 需要认证

**响应**:
```typescript
{
  success: true,
  data: {
    items: {
      id: string,
      meal_type: string,
      portion: number,
      calories: number,
      protein: number,
      carbs: number,
      fat: number,
      food?: {
        id: string,
        name: string
      }
    }[]
  },
  timestamp: number
}
```

#### 7.3 获取每日营养汇总

```
GET /api/diary/summary?date=2026-02-05
```

**认证**: 需要认证

**响应**:
```typescript
{
  success: true,
  data: {
    date: string,
    total_calories: number,
    total_protein: number,
    total_carbs: number,
    total_fat: number,
    entry_count: number
  },
  timestamp: number
}
```

#### 7.4 更新饮食记录

```
PATCH /api/diary/entry/:id
```

**认证**: 需要认证

#### 7.5 删除饮食记录

```
DELETE /api/diary/entry/:id
```

**认证**: 需要认证

---

### 8. 游戏化模块 (gamification)

#### 8.1 获取成就墙

```
GET /api/gamification/achievements
```

**描述**: 返回用户所有成就徽章和解锁进度

**认证**: 需要认证

**响应**:
```typescript
{
  success: true,
  data: {
    streak_days: number,     // 连续打卡天数
    level: number,           // 用户等级
    badges: {
      id: string,
      name: string,
      description: string,
      category: string,
      icon: string,
      target: number,
      unlocked: boolean,
      progress?: number,
      unlockedAt?: string
    }[]
  },
  timestamp: number
}
```

---

### 9. 智能内容模块 (recipes)

#### 9.1 推荐食谱

```
GET /api/recipes/recommend?date=2026-02-05
```

**描述**: 基于当日营养缺口智能推荐健康食谱

**认证**: 需要认证

**查询参数**:
- `date`: 日期 (YYYY-MM-DD)，默认今日

**响应**:
```typescript
{
  success: true,
  data: {
    reason_text: string,     // 推荐理由
    recipes: {
      id: string,
      title: string,
      tags: string[],
      image?: string,
      calories: number,
      protein: number,
      carbs: number,
      fat: number
    }[]
  },
  timestamp: number
}
```

---

## 通用响应格式

所有接口返回格式遵循以下结构：

```typescript
{
  success: boolean,      // 操作是否成功
  code?: string,        // 业务错误码
  message?: string,     // 提示信息
  data?: T,            // 实际数据
  timestamp: number     // 时间戳
}
```

## 错误码

| 错误码 | 说明 |
|:-------|:-----|
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 枚举类型说明

### Gender (性别)
- `MALE`: 男
- `FEMALE`: 女
- `OTHER`: 其他

### GoalType (目标类型)
- `FAT_LOSS`: 减脂
- `MAINTAIN`: 维持
- `MUSCLE_GAIN`: 增肌

### ActivityLevel (活动系数)
- `1.2`: 久坐 (几乎不运动)
- `1.375`: 轻度活动 (每周 1-3 天)
- `1.55`: 中度活动 (每周 3-5 天)
- `1.725`: 高度活动 (每周 6-7 天)
- `1.9`: 极度活动 (体力劳动/双倍训练)

### MealType (餐次)
- `BREAKFAST`: 早餐
- `LUNCH`: 午餐
- `DINNER`: 晚餐
- `SNACK`: 加餐

### HealthMetricType (健康指标类型)
- `STEPS`: 步数
- `BODY_FAT`: 体脂率
- `WEIGHT`: 体重
- `SLEEP`: 睡眠
- `ACTIVE_CALORIES`: 活动热量

---

## 前端集成指南

### 1. 安装依赖

```bash
# 后端类型已导出至 shared 目录
# 前端可以直接使用共享类型
```

### 2. 导入类型

```typescript
import type {
  ApiResponse,
  DashboardSummary,
  OnboardingRequest,
  // ... 其他类型
} from '@diet-lens/shared-api'
```

### 3. API 调用示例

```typescript
// 获取仪表盘摘要
async function getDashboardSummary(date: string) {
  const response = await fetch(
    `http://localhost:3000/api/dashboard/summary?date=${date}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )

  const result: ApiResponse<DashboardSummary> = await response.json()

  if (result.success && result.data) {
    return result.data
  }

  throw new Error(result.message || '请求失败')
}
```

---

**更新时间**: 2026-02-05
**维护者**: Backend Team
