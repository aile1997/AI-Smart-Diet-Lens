# AI Smart-Diet Lens API Architecture (Final v3.0 - UniApp Edition)

> **Version**: 3.0.0 (Production Ready)
> **Base URL**: `https://api.smart-diet-lens.com/v1`
> **Protocol**: HTTPS / JSON
> **Authentication**: `Authorization: Bearer <JWT_TOKEN>`
> **Client**: UniApp (iOS / Android)

---

## 📖 1. 核心架构原则 (Architecture Principles)

### 1.1 客户端聚合 (Client-Side Aggregation) - _UniApp 专属_

- **背景**: 后端无法直接访问 Apple HealthKit 或 Google Health Connect。
- **机制**: UniApp 前端作为"搬运工"，调用原生插件读取本地健康数据（步数、体脂、静息能量），打包后通过 `POST /user/health-sync` 推送给后端。
- **真理源**: 后端基于推送的数据重新计算 TDEE（每日总消耗），并以此更新用户的热量预算。

### 1.2 多态 UI 驱动 (Polymorphic UI)

- **机制**: 核心接口（如 Dashboard）不仅返回数据，还返回 `ui_strategy`。
- **目的**: 驱动前端根据用户策略（减脂/增肌/维持）自动切换主题色（蓝/红/绿）和图表组件（圆环/双柱/雷达图），无需前端写死逻辑。

### 1.3 视觉 AI 流水线 (Vision AI Pipeline)

- **机制**: 采用 **S3 Presigned URL** 模式。
- **流程**: 前端获取上传凭证 -> 前端直传 S3 -> 前端带 Key 请求 AI 分析。
- **价值**: 避免大文件阻塞应用服务器，提升响应速度。

---

## 🛠️ 2. 接口详解 (API Endpoints)

### Module A: 系统与引导 (System & Onboarding)

#### A.1 系统启动配置 (Bootstrap)

_App 冷启动时首个调用，用于版本控制和功能开关。_

- **GET** `/system/bootstrap`
- **Response**:
  ```json
  {
    "min_version_ios": "1.0.5",
    "min_version_android": "1.0.3",
    "maintenance_mode": false,
    "feature_flags": {
      "enable_ar_scan": true,
      "enable_barcode_scanner": true,
      "use_health_connect": true
    },
    "upload_config": { "provider": "S3", "bucket": "user-uploads-prod" }
  }
  ```

#### A.2 智能档案初始化 (Onboarding)

_完成档案创建，后端计算初始代谢公式 (Mifflin-St Jeor)。_

- **POST** `/user/onboarding`
- **Request**:
  ```json
  {
    "profile": { "gender": "MALE", "dob": "1995-05-20", "height_cm": 178 },
    "metrics": { "weight_kg": 75.5, "body_fat": 18.5, "activity_level": 1.375 },
    "goal": { "type": "MUSCLE_GAIN", "target_weight_kg": 80.0 }
  }
  ```
- **Response**:
  ```json
  {
    "user_id": "u_123456",
    "token": "eyJhbG...",
    "strategy_config": {
      "mode": "MUSCLE_GAIN",
      "daily_calories": 2700,
      "macros": { "protein": 180, "carbs": 300, "fat": 80 }
    }
  }
  ```

---

### Module B: 仪表盘 (Dashboard)

#### B.1 获取今日聚合视图 (Dashboard Summary)

_多态接口：根据策略返回不同的 UI 渲染指令。_

- **GET** `/dashboard/summary`
- **Query**: `date=2026-02-24`
- **Response**:

  ```json
  {
    "ui_strategy": "MUSCLE_GAIN",
    "date": "2026-02-24",

    "hero_component": {
      "type": "DUAL_BAR_CHART",
      "data": {
        "primary": { "label": "Protein", "current": 45, "target": 180, "unit": "g" },
        "secondary": { "label": "Calories", "current": 1200, "target": 2700, "unit": "kcal" }
      }
    },

    "widgets": {
      "steps": { "current": 5430, "target": 10000 },
      "water": { "current": 4, "target": 8 },
      "sleep": { "hours": 7.5, "quality": "GOOD" }
    },

    "smart_alert": {
      "type": "DIRTY_BULK_WARNING",
      "title": "体脂上升过快",
      "message": "检测到体重增加但主要是脂肪，建议减少 20g 碳水摄入。",
      "action": "ADJUST_PLAN"
    }
  }
  ```

---

### Module C: 饮食日记与 AI (Diary & AI)

#### C.1 [AI] 获取上传凭证

- **GET** `/upload/presigned`
- **Query**: `ext=jpg`
- **Response**: `{ "upload_url": "https://s3...", "file_key": "temp/scan_01.jpg" }`

#### C.2 [AI] 提交识别分析

- **POST** `/ai/analyze`
- **Request**:
  ```json
  {
    "image_key": "temp/scan_01.jpg",
    "ar_context": {
      "container": "BOWL_6INCH",
      "distance_cm": 35
    }
  }
  ```
- **Response**: 返回识别结果（包含 AI 估算的重量 g 和卡路里）。

#### C.3 [Search] 文本模糊搜索 (兜底)

- **GET** `/food/search`
- **Query**: `q=香蕉&page=1`
- **Response**: `{ "results": [{ "id": "f_1", "name": "香蕉 (中)", "cal": 105, "unit": "根" }] }`

#### C.4 [Scan] 条形码查询 (兜底)

- **GET** `/food/barcode/{code}`
- **Response**: 直接返回该包装食品的营养表。

#### C.5 提交/保存记录

- **POST** `/diary/entry`
- **Request**:
  ```json
  {
    "meal_type": "LUNCH",
    "items": [
      { "food_name": "煎三文鱼", "portion_g": 150, "calories": 310, "macros": {...} }
    ],
    "image_key": "temp/scan_01.jpg"
  }
  ```

#### C.6 修正记录 (CRUD)

- **PATCH** `/diary/entry/{id}`
- **Request**: `{ "portion_g": 100 }`

#### C.7 删除记录 (CRUD)

- **DELETE** `/diary/entry/{id}`

#### C.8 获取日记列表

- **GET** `/diary`
- **Query**: `date=2026-02-24`

---

### Module D: 用户与健康 (User & Health) - _UniApp 核心_

#### D.1 批量同步健康数据 (Sync)

_前端调用原生插件读取数据后，调用此接口。_

- **POST** `/user/health-sync`
- **Request**:
  ```json
  {
    "platform": "ios",
    "device_model": "iPhone 15 Pro",
    "metrics": [
      {
        "type": "STEPS",
        "value": 5430,
        "recorded_at": "2026-02-24T23:59:00Z"
      },
      {
        "type": "BODY_FAT",
        "value": 18.5,
        "source": "YOLANDA_SCALE"
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "status": "synced",
    "tdee_updated": true,
    "new_daily_budget": 2450
  }
  ```

#### D.2 切换核心策略 (Switch Strategy)

- **POST** `/user/strategy/switch`
- **Request**: `{ "new_strategy": "FAT_LOSS", "target_weight": 70.0 }`
- **Response**: 返回更新后的 UI 主题色和营养素配额。

#### D.3 更新身体指标 (手动)

- **PATCH** `/user/profile/metrics`
- **Request**: `{ "weight": 76.0 }`

---

### Module E: 游戏化 (Gamification)

#### E.1 获取成就墙

- **GET** `/gamification/achievements`
- **Response**:
  ```json
  {
    "streak_days": 12,
    "level": 5,
    "badges": [
      { "id": "b_protein", "unlocked": true, "icon": "url...", "name": "蛋白质之王" },
      { "id": "b_early", "unlocked": false, "progress": "3/5" }
    ]
  }
  ```

---

### Module F: 智能内容 (Content)

#### F.1 基于缺口的推荐

- **GET** `/recipes/recommend`
- **Logic**: 后端计算 `Goal - Current_Intake`，检索最适合填补缺口的食谱。
- **Response**:
  ```json
  {
    "reason_text": "你今天还缺 30g 蛋白质，晚餐建议吃这些：",
    "recipes": [{ "id": "r_101", "title": "黑椒鸡胸肉", "tags": ["高蛋白", "快手"], "image": "cdn_url..." }]
  }
  ```

---

### Module G: AI 营养师对话 (AI Chat) ⭐ NEW

#### G.1 发送对话消息

_通过对话获取个性化餐单建议，支持上下文记忆。_

- **POST** `/ai/chat/message`
- **Request**:
  ```json
  {
    "message": "我想做一道减脂餐，需要高蛋白低热量",
    "context": [
      { "role": "user", "content": "我今天想吃减脂餐" },
      { "role": "assistant", "content": "好的，我推荐鸡胸肉..." }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "reply": "根据您的减脂目标，我为您推荐这道低热量高蛋白的食谱...",
    "recipe_card": {
      "name": "香煎鸡胸肉配西兰花",
      "image": "https://cdn.example.com/recipe/101.jpg",
      "calories": 350,
      "time": "25分钟",
      "difficulty": "简单",
      "description": "高蛋白低脂肪，适合减脂期食用。"
    }
  }
  ```

#### G.2 获取对话历史

- **GET** `/ai/chat/history`
- **Response**:
  ```json
  {
    "messages": [
      { "id": "m_1", "is_user": true, "content": "我想做减脂餐", "timestamp": "2026-02-06T10:00:00Z" },
      { "id": "m_2", "is_user": false, "content": "好的，我推荐...", "timestamp": "2026-02-06T10:00:01Z" }
    ]
  }
  ```

#### G.3 清空对话历史

- **DELETE** `/ai/chat/history`
- **Response**: `{ "success": true }`

---

### Module H: 社区 (Community) ⭐ NEW

#### H.1 获取帖子列表

- **GET** `/community/posts`
- **Query**: `page=1&limit=20&tag=减脂`
- **Response**:
  ```json
  {
    "posts": [
      {
        "id": "p_123",
        "content": "今天做了一道减脂餐，分享给大家！",
        "images": ["https://cdn.example.com/post/123.jpg"],
        "tags": ["减脂", "健康饮食"],
        "likes": 42,
        "is_liked": true,
        "created_at": "2026-02-06T10:00:00Z",
        "user": {
          "id": "u_456",
          "nickname": "健身小王",
          "avatar": "https://cdn.example.com/avatar/456.jpg"
        }
      }
    ],
    "total": 128,
    "page": 1,
    "limit": 20
  }
  ```

#### H.2 发布帖子

- **POST** `/community/posts`
- **Request**:
  ```json
  {
    "content": "今天做了一道减脂餐，分享给大家！",
    "images": ["https://cdn.example.com/upload/xyz.jpg"],
    "tags": ["减脂", "健康饮食"]
  }
  ```
- **Response**: 返回创建的帖子对象。

#### H.3 点赞/取消点赞

- **POST** `/community/posts/{id}/like`
- **Response**:
  ```json
  {
    "liked": true,
    "likes_count": 43
  }
  ```

#### H.4 添加评论

- **POST** `/community/posts/{id}/comments`
- **Request**:
  ```json
  {
    "content": "看起来很棒，我也想试试！"
  }
  ```
- **Response**:
  ```json
  {
    "id": "c_789",
    "content": "看起来很棒，我也想试试！",
    "created_at": "2026-02-06T11:00:00Z",
    "user": {
      "id": "u_789",
      "nickname": "美食家",
      "avatar": "https://cdn.example.com/avatar/789.jpg"
    }
  }
  ```

#### H.5 删除帖子

- **DELETE** `/community/posts/{id}`
- **Response**: `{ "success": true }`

#### H.6 获取我的帖子

- **GET** `/community/posts/my`
- **Response**: 返回当前用户发布的帖子列表。

---

### Module I: 收藏 (Favorites) ⭐ NEW

#### I.1 获取收藏列表

- **GET** `/favorites/`
- **Query**: `type=recipe`
- **Response**:
  ```json
  {
    "favorites": [
      {
        "id": "f_123",
        "item_id": "recipe_101",
        "type": "recipe",
        "item": {
          "name": "香煎鸡胸肉配西兰花",
          "image": "https://cdn.example.com/recipe/101.jpg",
          "calories": 350
        },
        "created_at": "2026-02-06T10:00:00Z"
      }
    ]
  }
  ```

#### I.2 添加收藏

- **POST** `/favorites/`
- **Request**:
  ```json
  {
    "item_id": "recipe_101",
    "type": "recipe"
  }
  ```
- **Response**: 返回创建的收藏对象。

#### I.3 取消收藏

- **DELETE** `/favorites/{id}`
- **Response**: `{ "success": true }`

#### I.4 检查是否已收藏

- **GET** `/favorites/check/{item_id}`
- **Query**: `type=recipe`
- **Response**:
  ```json
  {
    "is_favorited": true
  }
  ```

---

### Module J: 消息通知 (Notifications) ⭐ NEW

#### J.1 获取消息列表

- **GET** `/notifications/`
- **Query**: `type=achievement`
- **Response**:
  ```json
  {
    "messages": [
      {
        "id": "n_123",
        "type": "achievement",
        "title": "🎉 成就解锁",
        "content": "恭喜您解锁了「连续打卡 7 天」成就！",
        "is_read": false,
        "created_at": "2026-02-06T10:00:00Z"
      },
      {
        "id": "n_124",
        "type": "reminder",
        "title": "📋 温馨提醒",
        "content": "您今天还没有记录早餐哦！",
        "is_read": true,
        "created_at": "2026-02-06T08:00:00Z"
      }
    ]
  }
  ```

**消息类型**:
- `achievement`: 成就解锁通知
- `reminder`: 提醒通知
- `system`: 系统通知

#### J.2 获取未读数量

- **GET** `/notifications/unread-count`
- **Response**:
  ```json
  {
    "count": 5
  }
  ```

#### J.3 标记消息已读

- **PATCH** `/notifications/{id}/read`
- **Response**: `{ "success": true }`

#### J.4 全部标记已读

- **PATCH** `/notifications/read-all`
- **Response**: `{ "success": true }`

#### J.5 删除消息

- **DELETE** `/notifications/{id}`
- **Response**: `{ "success": true }`

---

## 3. 错误码字典 (Error Codes)

| HTTP | Code                 | Description    | UI Action              |
| :--- | :------------------- | :------------- | :--------------------- |
| 400  | `INVALID_AR_CONTEXT` | AR 参数缺失    | 提示"请选择参照容器"   |
| 400  | `INVALID_CONTENT`    | 内容为空或过长 | 提示"请输入内容"       |
| 403  | `PERMISSION_DENIED`  | 无权操作       | 提示"无权操作此资源"   |
| 404  | `FOOD_NOT_FOUND`     | AI/搜索无结果  | 引导"手动录入"         |
| 404  | `POST_NOT_FOUND`     | 帖子不存在     | 提示"帖子已被删除"     |
| 409  | `DIRTY_BULK_WARN`    | 增肌期体脂飙升 | 弹窗警告               |
| 409  | `ALREADY_FAVORITED`  | 已收藏         | 提示"已收藏过此内容"   |
| 429  | `RATE_LIMIT_AI`      | 刷接口         | 提示"操作太快，请稍后" |
| 500  | `INTERNAL_ERROR`     | 服务端异常     | 显示通用错误页         |

---

## 4. 数据库模型参考 (Schema)

### 核心模型

- **Users**: 基础信息、当前策略、连续打卡天数
- **Strategies**: 静态配置表，存储不同策略下的 TDEE 系数和 Macros 比例
- **DailyLogs**: 核心流水表，存储每餐数据、图片 URL、AR 上下文
- **HealthMetrics**: 存储从 UniApp 同步过来的原始健康数据（用于生成趋势图）
- **Recipes**: 食谱库，包含 Embeddings（向量数据）用于语义搜索

### 新增模型 (v3.0)

- **ChatMessages**: AI 对话消息历史
  - `id`, `user_id`, `is_user`, `content`, `created_at`

- **CommunityPosts**: 社区帖子
  - `id`, `user_id`, `content`, `images[]`, `tags[]`, `likes`, `created_at`, `updated_at`

- **Comments**: 帖子评论
  - `id`, `post_id`, `user_id`, `content`, `created_at`

- **Favorites**: 用户收藏
  - `id`, `user_id`, `item_id`, `type`, `created_at`
  - 唯一约束: `(user_id, item_id, type)`

- **Messages**: 系统消息通知
  - `id`, `user_id`, `type`, `title`, `content`, `is_read`, `created_at`
  - 类型: `achievement`, `reminder`, `system`

---

## 5. UniApp 开发特别说明

1. **插件集成**:
   - **iOS**: 请集成 `HealthKit` 相关原生插件，申请 `NSHealthShareUsageDescription` 权限。
   - **Android**: 优先集成 `Health Connect`，兜底使用计步传感器 API。

2. **图片缓存**: 所有 API 返回的图片 URL 均已CDN化，请使用 UniApp 的 `<image>` 组件缓存机制，避免重复下载。

3. **离线处理**: 建议在本地 Storage 缓存 `/dashboard/summary` 的结果。无网络时优先展示缓存数据，并顶部提示"离线模式"。

4. **轮询建议**:
   - 未读消息数量: 每 30 秒轮询一次
   - 社区帖子列表: 下拉刷新 + 上拉加载更多

---

## 6. 前端集成文档

详细的 TypeScript 接口定义和集成代码示例，请参考：
- **[`.claude/memory/frontend-architecture.md`](../.claude/memory/frontend-architecture.md)**

---

## 7. Swagger 文档

开发环境可访问实时 API 文档：
- **URL**: `http://localhost:3000/api-docs`
- 自动生成，包含所有接口的请求/响应示例

---

**文档版本**: 3.0.0
**最后更新**: 2026-02-06
**维护者**: Backend Team
