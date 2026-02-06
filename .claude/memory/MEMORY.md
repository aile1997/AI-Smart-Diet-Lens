# AI Smart Diet Lens - 项目记忆

> **项目**: AI Smart Diet Lens
> **技术栈**: UniApp + Vue 3 + TypeScript | NestJS + Prisma + PostgreSQL
> **最后更新**: 2026-02-06

---

## 项目状态

### 后端 (backend/)

- **框架**: NestJS 11.x
- **API 版本**: 2.2.0
- **已实现模块**: 15 个
- **单元测试**: 29 个测试全部通过 ✅

### 前端 (frontend/)

- **框架**: UniApp 3.0 + Vue 3 + TypeScript
- **架构文档版本**: 3.0.0
- **状态**: UI 原型已完成，等待后端集成

---

## 已实现的后端模块

### 核心模块 (A-F)

| 模块 | 路径 | 功能 |
|:-----|:-----|:-----|
| **System** | `/api/system` | 系统配置、版本检查 |
| **Dashboard** | `/api/dashboard` | 仪表盘数据 |
| **Auth** | `/api/auth` | 验证码登录、JWT 认证 |
| **User** | `/api/user` | 用户信息、健康指标 |
| **Food** | `/api/food` | 食物库搜索 |
| **Diary** | `/api/diary` | 饮食日记记录 |

### 扩展模块 (G-K)

| 模块 | 路径 | 功能 |
|:-----|:-----|:-----|
| **Gamification** | `/api/gamification` | 成就系统、用户进度 |
| **Recipe** | `/api/recipes` | 智能食谱推荐 |
| **Upload** | `/api/upload` | S3 预签名 URL 上传 |
| **Mail** | 内部 | SMTP 邮件服务 |
| **AI** | `/api/ai` | Gemini AI 识别 (TODO) |

### 新增模块 (v3.0.0)

| 模块 | 路径 | 功能 |
|:-----|:-----|:-----|
| **Chat** | `/api/ai/chat` | AI 营养师对话 |
| **Community** | `/api/community` | 社区帖子、点赞、评论 |
| **Favorites** | `/api/favorites` | 收藏管理 |
| **Notifications** | `/api/notifications` | 系统消息通知 |

---

## 数据库 Schema (Prisma)

### 核心模型

```prisma
// 用户相关
User           - 用户基本信息
HealthMetrics  - 健康指标 (身高、体重、目标)

// 食物相关
Food           - 食物库
DiaryEntry     - 饮食记录

// 游戏化
Achievement    - 成就定义
UserAchievement - 用户成就进度

// 社区相关
CommunityPost  - 社区帖子
Comment        - 帖子评论

// 收藏相关
Favorite       - 用户收藏

// 消息相关
ChatMessage    - AI 对话历史
Message        - 系统消息通知
```

---

## 关键技术决策

### 1. TypeScript 严格模式

- 所有 DTO 属性必须使用 definite assignment assertion (`!`)
- 禁止 `any` 类型
- 所有 `ref()` 和 `computed()` 必须声明类型

### 2. API 响应格式

```typescript
// 统一响应包装
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 所有接口使用 ApiResponse.ok() 包装
return ApiResponse.ok(data)
```

### 3. JWT 认证

- Bearer Token 认证
- 使用 `@UseGuards(JwtGuard)` 保护路由
- `@CurrentUser()` 装饰器获取当前用户

### 4. 文件上传

- 使用 S3 预签名 URL
- 三步流程：获取预签名 URL → 直接上传到 S3 → 确认上传

---

## 开发规范

### 命名规范

| 类型 | 规则 | 示例 |
|:-----|:-----|:-----|
| 文件 (模块) | kebab-case | `chat.module.ts` |
| 类 | PascalCase | `ChatService` |
| 方法/变量 | camelCase | `sendMessage` |
| 接口 | PascalCase | `ChatResponse` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL` |

### 禁止事项

- ❌ 拼音命名 (`yonghu` → `user`)
- ❌ 无意义缩写 (`usr` → `user`)
- ❌ 前后端混合提交 (分模块提交)
- ❌ 空的 catch 块

---

## 测试状态

### 单元测试

- **测试文件**: 4 个
- **测试数量**: 29 个
- **状态**: ✅ 全部通过

### E2E 测试

- **测试文件**: `test/app.e2e-spec.ts`
- **测试覆盖**:
  - 应用初始化
  - 认证流程
  - Dashboard API
  - Diary API
  - Food API
  - Swagger 文档
- **关键修复**: Swagger 模块必须在 E2E 测试中显式初始化

---

## 常见问题

### 1. Swagger 404 错误

**问题**: E2E 测试中 Swagger 路由返回 404

**解决**: 在 `beforeAll()` 中初始化 Swagger
```typescript
const config = new DocumentBuilder()...
const document = SwaggerModule.createDocument(app, config)
SwaggerModule.setup('api-docs', app, document)
```

### 2. TypeScript 属性初始化错误

**问题**: `Property has no initializer and is not definitely assigned`

**解决**: 使用 definite assignment assertion
```typescript
// Before
message: string

// After
message!: string
```

### 3. API 响应格式不匹配

**问题**: 测试期望直接响应，实际得到 `ApiResponse` 包装

**解决**: 更新测试期望
```typescript
// Before
expect(response.body).toHaveProperty('min_version_ios')

// After
expect(response.body).toHaveProperty('success', true)
expect(response.body.data).toHaveProperty('min_version_ios')
```

---

## 环境变量

### 必需配置

```env
# 数据库
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=...
JWT_EXPIRES_IN=7d

# S3
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=...
S3_REGION=...

# SMTP
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...

# Gemini
GEMINI_API_KEY=...

# CORS
CORS_ORIGIN=*
```

---

## 下一步工作

### 后端待完成

1. **AI 识别模块**: 集成 Gemini API 实现真正的食物识别
2. **购物清单模块**: 用户明确暂缓
3. **评价模块**: 用户明确暂缓

### 前端待完成

1. **状态管理**: 实现 Pinia stores
2. **API 集成**: 使用文档中的服务层代码对接后端
3. **请求封装**: 实现 ApiClient 类
4. **错误处理**: 统一错误提示
5. **加载状态**: 全局 Loading 组件

---

## Git 提交历史

最近的重要提交：

```
f99e06c docs(backend): 更新前端架构文档到 v3.0.0
[之前的提交包含新增的 4 个模块]
```

---

**维护者**: Architect
**最后更新**: 2026-02-06
