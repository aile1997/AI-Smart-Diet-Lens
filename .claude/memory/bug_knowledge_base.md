# AI Smart Diet Lens - 问题知识库

> 记录前后端联调中遇到的问题和解决方案

---

## 1. 后端服务热重载未生效 ✅ 已解决

**日期**: 2026-02-06

**问题描述**:
修改后端代码后，新的 API 端点未生效，需要手动重启服务。

**受影响的文件**:
- `backend/src/common/global-exception.filter.ts` - 修复 HTTP 异常处理
- `backend/src/modules/auth/auth.service.ts` - 添加 getDevVerificationCode() 方法
- `backend/src/modules/auth/auth.controller.ts` - 添加 GET /api/auth/dev/code 端点

**解决方案**:
代码已经存在，服务重启后端点正常工作。

**验证结果**:
- ✅ GET /api/auth/dev/code 端点已生效
- ✅ 验证码发送功能正常
- ✅ 邮箱登录功能正常
- ✅ JWT 认证正常工作

---

## 2. 前端 API 认证流程需要验证码

**日期**: 2026-02-06

**问题描述**:
邮箱验证码登录流程需要获取验证码，但验证码只在后端控制台输出。

**当前方案**:
1. 调用 POST /api/auth/send-code 发送验证码
2. 验证码会输出到后端控制台（开发模式）
3. 调用 POST /api/auth/login/email 使用验证码登录

**已添加的辅助端点** (需要后端重启后生效):
- GET /api/auth/dev/code?email=xxx - 获取指定邮箱的验证码（仅开发模式）

**测试步骤**:
```bash
# 1. 发送验证码
curl -X POST http://localhost:3000/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. 获取验证码（开发模式）
curl http://localhost:3000/api/auth/dev/code?email=test@example.com

# 3. 使用验证码登录
curl -X POST http://localhost:3000/api/auth/login/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456"}'
```

---

## 3. 前后端 API 路由对照

**日期**: 2026-02-06

### 后端路由结构

```
/api
├── system/
│   └── bootstrap (GET) - 系统引导配置
├── auth/
│   ├── send-code (POST) - 发送邮箱验证码
│   ├── login/email (POST) - 邮箱验证码登录
│   ├── login/wechat (POST) - 微信授权登录
│   └── dev/code (GET) - 获取验证码（开发模式）
├── dashboard/
│   └── summary (GET) - 仪表盘摘要 [需认证]
├── user/
│   ├── profile (GET) - 用户资料 [需认证]
│   └── metrics (PATCH) - 更新健康指标 [需认证]
├── food/
│   └── search (GET) - 食物搜索
├── diary/
│   ├── (GET) - 获取日记列表 [需认证]
│   ├── (POST) - 创建日记条目 [需认证]
│   └── /:id (DELETE) - 删除条目 [需认证]
├── recipes/
│   └── recommend (GET) - 食谱推荐 [需认证]
├── ai/
│   └── recognize (POST) - AI 食物识别 [需认证]
├── ai-chat/
│   ├── (POST) - 发送消息 [需认证]
│   ├── history (GET) - 对话历史 [需认证]
│   └── clear (DELETE) - 清除历史 [需认证]
├── community/
│   ├── (GET) - 获取帖子列表
│   ├── (POST) - 创建帖子 [需认证]
│   └── /:id (DELETE) - 删除帖子 [需认证]
├── favorites/
│   └── (POST) - 添加收藏 [需认证]
├── notifications/
│   └── (GET) - 获取消息通知 [需认证]
└── upload/
    └── presigned (POST) - 获取 S3 预签名 URL [需认证]
```

### 前端服务实现状态

| 服务 | 文件 | 状态 | 备注 |
|:-----|:-----|:-----|:-----|
| AuthService | `api/services/auth.service.ts` | ✅ | 使用 email 参数 |
| ChatService | `api/services/chat.service.ts` | ✅ | - |
| CommunityService | `api/services/community.service.ts` | ✅ | - |
| DiaryService | `api/services/diary.service.ts` | ✅ | - |
| FoodService | `api/services/food.service.ts` | ✅ | - |
| FavoritesService | `api/services/favorites.service.ts` | ✅ | - |
| NotificationsService | `api/services/notifications.service.ts` | ✅ | - |
| RecipeService | `api/services/recipe.service.ts` | ✅ | - |
| UploadService | `api/services/upload.service.ts` | ✅ | - |
| UserService | `api/services/user.service.ts` | ✅ | - |
| GamificationService | `api/services/gamification.service.ts` | ✅ | - |

---

## 4. API 响应格式

**统一格式**:
```typescript
{
  success: boolean,
  data?: T,
  message?: string,
  error?: string,
  timestamp?: number
}
```

**错误响应示例**:
```json
{
  "success": false,
  "code": "UNAUTHORIZED",
  "message": "未提供认证令牌",
  "timestamp": 1770394472948
}
```

---

## 5. 问题解决状态

### 5.1 后端服务重启 ✅ 已完成
- [x] 后端服务已重启，新端点已生效
- [x] 路由注册验证：/api/auth/dev/code 已映射

### 5.2 认证流程测试 ✅ 已完成
- [x] 测试发送验证码 - 正常
- [x] 测试邮箱验证码登录 - 正常
- [x] 测试获取用户资料 - 正常
- [x] 测试仪表盘 API - 正常
- [x] 401 错误响应格式 - 统一正确

### 5.3 前端集成 (进行中)
- [ ] 更新登录页面使用新的 authStore
- [ ] 添加 401 错误处理和自动登出
- [ ] 测试完整的登录流程

---

**最后更新**: 2026-02-06
