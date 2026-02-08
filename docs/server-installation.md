# 服务器环境安装清单

> **本地版本参考**
> - Node.js: v24.12.0 (最低要求: >=20.0.0)
> - pnpm: 9.15.0
> - Prisma: ^6.5.0

---

## 一、宝塔面板安装环境

### 1. 安装 Node.js

在宝塔面板中安装：

```
宝塔面板 → 软件商店 → 运行环境 → Node.js 版本管理器

安装版本: Node.js 20.x LTS（推荐 20.18.0）
```

**命令行安装（备选）**:
```bash
# 使用 NVM 安装 Node.js 20
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

### 2. 安装 PostgreSQL

```
宝塔面板 → 软件商店 → 数据库 → PostgreSQL

安装版本: PostgreSQL 16.x
```

**创建数据库**:
- 数据库名: `smart_diet_db`
- 用户名: `smart_diet_user`
- 密码: `YourStrongPassword123`
- 访问权限: 本地服务器

**连接字符串**:
```
postgresql://smart_diet_user:YourStrongPassword123@127.0.0.1:5432/smart_diet_db
```

### 3. 安装 Redis

```
宝塔面板 → 软件商店 → 运行环境 → Redis

安装版本: Redis 7.x
```

**启动 Redis**:
```bash
# 检查 Redis 状态
systemctl status redis

# 启动 Redis
systemctl start redis
```

---

## 二、安装 pnpm 和项目依赖

### 1. 安装 pnpm

```bash
# 全局安装 pnpm
npm install -g pnpm

# 验证安装
pnpm --version
# 应显示: 9.15.0 或更高版本
```

### 2. 上传项目文件

```bash
# 方法一：使用 Git 克隆（推荐）
cd /www/wwwroot
git clone https://github.com/aile1997/AI-Smart-Diet-Lens.git smart-diet-backend

# 方法二：手动上传
# 将本地项目压缩上传后解压到 /www/wwwroot/smart-diet-backend
```

### 3. 安装项目依赖

```bash
cd /www/wwwroot/smart-diet-backend/backend

# 安装依赖
pnpm install

# 验证 Prisma Client 生成
npx prisma --version
# 应显示: 6.5.0 或更高版本
```

---

## 三、配置环境变量

### 创建 .env 文件

```bash
cd /www/wwwroot/smart-diet-backend/backend

cat > .env << 'EOF'
# ==================== 数据库 ====================
DATABASE_URL=postgresql://smart_diet_user:YourStrongPassword123@127.0.0.1:5432/smart_diet_db

# ==================== Redis ====================
REDIS_URL=redis://127.0.0.1:6379

# ==================== JWT 认证 ====================
# ⚠️ 使用 openssl rand -hex 32 生成新密钥
JWT_SECRET=your-production-jwt-secret-at-least-32-characters-long
JWT_EXPIRES_IN=7d

# ==================== 腾讯云 COS ====================
TENCENT_SECRET_ID=your-secret-id
TENCENT_SECRET_KEY=your-secret-key
TENCENT_BUCKET=your-bucket-name
TENCENT_REGION=ap-beijing

# ==================== AI 服务 ====================
# 阿里云 Qwen-VL (食物识别)
DASHSCOPE_API_KEY=sk-0aeb8a2a59464ec1b61eaeedd3fefbe7

# DeepSeek (AI 营养师对话)
DEEPSEEK_API_KEY=sk-nrknjcengkbktniuxzetlleyoazyhezvrfilmgykmfpfcjni
DEEPSEEK_BASE_URL=https://api.siliconflow.cn/v1

# ==================== 应用配置 ====================
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com

# ==================== SMTP (可选) ====================
# SMTP_HOST=
# SMTP_PORT=587
# SMTP_USER=
# SMTP_PASS=
EOF
```

---

## 四、数据库迁移

### 1. 生成 Prisma Client

```bash
cd /www/wwwroot/smart-diet-backend/backend
npx prisma generate
```

### 2. 执行数据库迁移

```bash
# 部署迁移（生产环境）
npx prisma migrate deploy
```

**预期输出**:
```
✔ Generated Prisma Client
🚀 Your database is now in sync with your Prisma schema.
```

### 3. 填充测试数据（可选）

```bash
npx prisma db seed
```

---

## 五、构建和启动服务

### 1. 构建项目

```bash
pnpm run build
```

**预期输出**:
```
✓ Built successfully
```

### 2. 测试启动

```bash
# 测试启动
pnpm run start:prod
```

**预期输出**:
```
🚀 服务已启动: http://localhost:3000/api
📱 局域网访问: http://your-server-ip:3000/api
📚 API 文档: http://localhost:3000/api-docs
```

### 3. 使用 PM2 守护进程

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start dist/main.js --name diet-lens-backend

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

**PM2 配置文件** (ecosystem.config.cjs):
```javascript
module.exports = {
  apps: [{
    name: 'diet-lens-backend',
    script: 'dist/main.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/diet-lens-error.log',
    out_file: '/var/log/pm2/diet-lens-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
}
```

---

## 六、防火墙配置

### 宝塔面板放行端口

```
宝塔面板 → 安全 → 添加端口规则

端口: 3000
协议: TCP
说明: AI Smart Diet Lens API
```

### 系统防火墙（如果启用）

```bash
# 放行 3000 端口
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --reload
```

---

## 七、验证部署

### 1. 健康检查

```bash
curl http://localhost:3000/api/system/bootstrap
```

**预期响应**:
```json
{
  "success": true,
  "data": {
    "min_version_ios": "1.0.0",
    "min_version_android": "1.0.0",
    "maintenance_mode": false,
    "feature_flags": {
      "enable_ar_scan": true,
      "enable_barcode_scanner": true,
      "use_health_connect": true
    }
  }
}
```

### 2. 外网访问测试

```bash
curl http://your-server-ip:3000/api/system/bootstrap
```

### 3. Swagger API 文档

浏览器访问: `http://your-server-ip:3000/api-docs`

---

## 八、常用维护命令

```bash
# 查看 PM2 状态
pm2 status

# 查看日志
pm2 logs diet-lens-backend

# 重启服务
pm2 restart diet-lens-backend

# 停止服务
pm2 stop diet-lens-backend

# 更新代码后重新部署
git pull
pnpm install
pnpm run build
pm2 restart diet-lens-backend

# 数据库迁移（更新后）
npx prisma migrate deploy
```

---

## 九、问题排查

### 问题 1: Node.js 版本不兼容

```bash
# 检查版本
node -v

# 低于 v20.0.0 需要升级
# 使用宝塔重新安装 Node.js 20.x LTS
```

### 问题 2: PostgreSQL 连接失败

```bash
# 检查 PostgreSQL 状态
systemctl status postgresql

# 检查端口监听
netstat -an | grep 5432

# 测试连接
psql -U smart_diet_user -d smart_diet_db -h 127.0.0.1
```

### 问题 3: Prisma 迁移失败

```bash
# 查看迁移状态
npx prisma migrate status

# 重新生成 Client
npx prisma generate

# 强制重置（开发环境，慎用！）
npx prisma migrate reset
```

### 问题 4: 端口被占用

```bash
# 查看端口占用
netstat -an | grep 3000
lsof -i:3000

# 杀死占用进程
kill -9 $(lsof -t -i:3000)
```

---

**维护者**: Architect
**最后更新**: 2026-02-08
