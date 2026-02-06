# AI Smart Diet Lens - 问题知识库

> 记录前后端联调中遇到的问题和解决方案

---

## 后端问题

### 1. CORS 配置问题 ✅ 已修复

**日期**: 2026-02-06

**问题描述**:
当 `credentials: true` 与 `origin: '*'` 组合使用时，浏览器会报 CORS 错误：
```
The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*'
```

**原因**:
当需要支持携带凭证的请求时，`origin` 必须是具体的域名，不能使用通配符。

**解决方案**:
将 `origin` 改为函数，动态检查请求来源：
- 开发环境允许所有 `localhost` 和 `127.0.0.1` 端口
- 生产环境通过 `CORS_ORIGIN` 环境变量配置允许的域名列表
- 明确配置 `allowedHeaders` 和 `methods`

**验证**:
```bash
curl -I -X OPTIONS http://localhost:3000/api/auth/send-code \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST"
# 返回: Access-Control-Allow-Origin: http://localhost:5173
#       Access-Control-Allow-Credentials: true
```

---

### 2. 开发模式验证码获取端点

**端点**: `GET /api/auth/dev/code?email=xxx`

**用途**: 开发环境下获取邮箱对应的验证码，方便测试

**响应**:
```json
{
  "success": true,
  "data": {
    "email": "test@example.com",
    "code": "123456",
    "expiresAt": "2026-02-06T16:39:39.397Z"
  }
}
```

---

## 前端问题

### 无

---

**最后更新**: 2026-02-06
