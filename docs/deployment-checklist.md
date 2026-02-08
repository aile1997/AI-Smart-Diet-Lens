# 线上部署配置清单

> **项目**: AI Smart Diet Lens
> **更新时间**: 2026-02-08

---

## 一、后端环境变量配置

### 必需配置 (生产环境必须修改)

```env
# ==================== 数据库 ====================
# 生产环境数据库连接字符串
DATABASE_URL=postgresql://username:password@your-production-host:5432/dietlens

# ==================== Redis ====================
# 生产环境 Redis 连接
REDIS_URL=redis://your-redis-host:6379

# ==================== JWT 认证 ====================
# ⚠️ 必须修改为强密码（至少 32 位随机字符串）
JWT_SECRET=your-production-jwt-secret-at-least-32-characters-long
JWT_EXPIRES_IN=7d

# ==================== 腾讯云 COS (图片存储) ====================
# ⚠️ 必须使用生产环境的密钥
TENCENT_SECRET_ID=your-secret-id
TENCENT_SECRET_KEY=your-secret-key
TENCENT_BUCKET=your-bucket-name
TENCENT_REGION=ap-beijing

# ==================== AI 服务 ====================
# 阿里云 Qwen-VL (食物识别) - 必需
DASHSCOPE_API_KEY=sk-0aeb8a2a59464ec1b61eaeedd3fefbe7

# DeepSeek (AI 营养师对话) - 必需
DEEPSEEK_API_KEY=sk-nrknjcengkbktniuxzetlleyoazyhezvrfilmgykmfpfcjni
DEEPSEEK_BASE_URL=https://api.siliconflow.cn/v1

# ==================== 应用配置 ====================
PORT=3000
NODE_ENV=production

# ⚠️ 生产环境 CORS 域名（逗号分隔）
CORS_ORIGIN=https://your-domain.com,https://www.your-domain.com
```

### 可选配置

```env
# ==================== SMTP 邮件服务 ====================
# 用于发送验证码和通知（可选）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="AI Smart Diet Lens <noreply@yourdomain.com>"

# ==================== 微信小程序 ====================
# 如果部署微信小程序，必需配置
WECHAT_APP_ID=wx762719df4ff4d5b4
WECHAT_APP_SECRET=00c07dc750e57e1d836a2a4ab86cd1e0
```

---

## 二、前端环境变量配置

### 生产环境构建变量

创建 `.env.production` 文件：

```env
# 后端 API 地址
VITE_API_BASE_URL=https://your-domain.com/api
```

### 构建命令

```bash
# H5 网页版
pnpm run build:h5

# 微信小程序
pnpm run build:mp-weixin

# 支付宝小程序
pnpm run build:mp-alipay
```

---

## 三、服务器要求

### 后端服务器

| 配置项 | 最低要求 | 推荐配置 |
|:-------|:---------|:---------|
| **CPU** | 2 核 | 4 核+ |
| **内存** | 2 GB | 4 GB+ |
| **操作系统** | Ubuntu 20.04+ | Ubuntu 22.04 LTS |
| **Node.js** | 18.x LTS | 20.x LTS |
| **数据库** | PostgreSQL 14+ | PostgreSQL 16+ |
| **缓存** | Redis 6+ | Redis 7+ |

### 前端托管

- **H5 版本**: 可托管到任何静态网站服务（Nginx、CDN、Vercel 等）
- **小程序**: 需要微信开发者账号

---

## 四、第三方服务注册清单

### 1. 数据库 (必需)
- [ ] **PostgreSQL**
  - 推荐: Supabase (免费)、Neon (免费)、自建
  - 需要: 数据库连接字符串

### 2. Redis 缓存 (必需)
- [ ] **Redis**
  - 推荐: Redis Cloud (免费)、Upstash (免费)、自建
  - 需要: Redis 连接 URL

### 3. 对象存储 (必需)
- [ ] **腾讯云 COS**
  - 需要: SecretId、SecretKey、Bucket、Region
  - 申请地址: https://cloud.tencent.com/product/cos

### 4. AI 服务 (必需)
- [ ] **阿里云 DashScope (Qwen-VL)**
  - 需要: API Key
  - 申请地址: https://dashscope.aliyun.com
  - 用途: 食物图片识别

- [ ] **DeepSeek / SiliconFlow**
  - 需要: API Key
  - 申请地址: https://platform.siliconflow.cn
  - 用途: AI 营养师对话

### 5. 邮件服务 (可选)
- [ ] **SMTP 服务**
  - 推荐: Gmail (免费)、SendGrid (免费额度)、阿里云邮件推送
  - 用途: 发送验证码和通知

### 6. 微信小程序 (可选)
- [ ] **微信开放平台**
  - 需要: AppID、AppSecret
  - 申请地址: https://open.weixin.qq.com
  - 用途: 微信登录

---

## 五、部署步骤清单

### 后端部署

- [ ] 1. 安装 Node.js 20.x LTS
- [ ] 2. 安装 PostgreSQL 16+ 并创建数据库
- [ ] 3. 安装 Redis 7+
- [ ] 4. 克隆代码: `git clone https://github.com/your-repo/AI-Smart-Diet-Lens.git`
- [ ] 5. 安装依赖: `cd backend && pnpm install`
- [ ] 6. 复制 `.env.example` 为 `.env` 并配置生产环境变量
- [ ] 7. 运行数据库迁移: `pnpm prisma migrate deploy`
- [ ] 8. 填充测试数据（可选）: `pnpm prisma db seed`
- [ ] 9. 构建项目: `pnpm run build`
- [ ] 10. 启动服务: `pnpm run start:prod` 或使用 PM2

**PM2 配置示例**:
```javascript
// ecosystem.config.cjs
module.exports = {
  apps: [{
    name: 'diet-lens-backend',
    script: 'dist/main.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

### 前端部署 (H5)

- [ ] 1. 配置 `.env.production` 文件
- [ ] 2. 构建 H5 版本: `cd frontend/packages/ui && pnpm run build:h5`
- [ ] 3. 将 `dist/build/h5` 目录部署到静态服务器
- [ ] 4. 配置 Nginx 反向代理（可选）

**Nginx 配置示例**:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/diet-lens;

    # 前端静态文件
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 微信小程序部署

- [ ] 1. 配置服务器域名白名单（微信小程序后台）
- [ ] 2. 构建: `cd frontend/packages/ui && pnpm run build:mp-weixin`
- [ ] 3. 使用微信开发者工具打开 `dist/build/mp-weixin`
- [ ] 4. 上传代码到微信后台
- [ ] 5. 提交审核

**需要配置的域名**:
- request 合法域名: `https://your-domain.com`
- uploadFile 合法域名: `https://your-domain.com`
- downloadFile 合法域名: `https://*.myqcloud.com` (腾讯云 COS)

---

## 六、安全检查清单

### 必须修改的默认值

- [ ] `JWT_SECRET` - 改为至少 32 位随机字符串
- [ ] `DATABASE_URL` - 使用强密码
- [ ] `REDIS_URL` - 如果有密码
- [ ] `TENCENT_SECRET_ID/KEY` - 使用生产环境密钥
- [ ] `DASHSCOPE_API_KEY` - 使用正式 API Key
- [ ] `DEEPSEEK_API_KEY` - 使用正式 API Key

### 生产环境安全措施

- [ ] 启用 HTTPS (SSL 证书)
- [ ] 配置防火墙，只开放必要端口 (80, 443, 22)
- [ ] 定期备份数据库
- [ ] 配置日志监控
- [ ] 设置 API 速率限制
- [ ] 敏感环境变量使用密钥管理服务（如 AWS Secrets Manager）

---

## 七、环境变量快速生成

### JWT Secret 生成

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32
```

### 数据库密码生成

```bash
# 生成强密码
openssl rand -base64 24
```

---

## 八、部署后验证

- [ ] 后端健康检查: `curl https://your-domain.com/api/system/bootstrap`
- [ ] 前端页面访问: `https://your-domain.com`
- [ ] 用户注册/登录流程
- [ ] 图片上传功能
- [ ] AI 食物识别功能
- [ ] 数据持久化检查

---

**维护者**: Architect
**最后更新**: 2026-02-08
