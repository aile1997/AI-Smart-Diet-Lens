# 服务部署更新流程

> **适用环境**: 生产服务器 (CentOS/Ubuntu + 宝塔面板)
> **更新对象**: 后端 NestJS 服务

---

## 一、登录服务器

```bash
# SSH 登录服务器
ssh root@your-server-ip

# 或使用宝塔面板终端
```

---

## 二、备份当前版本（可选但推荐）

```bash
# 进入项目目录
cd /root/AI-Smart-Diet-Lens

# 创建备份
tar -czf ../backup_$(date +%Y%m%d_%H%M%S).tar.gz .

# 查看备份列表
ls -lh ..//
```

---

## 三、拉取最新代码

```bash
# 确保在项目目录
cd /root/AI-Smart-Diet-Lens

# 查看当前分支
git branch

# 拉取最新代码
git pull origin main

# 如果有冲突，先备份本地修改
# git stash
# git pull
# git stash pop
```

---

## 四、安装依赖（如有更新）

```bash
# 进入后端目录
cd /root/AI-Smart-Diet-Lens/backend

# 安装新依赖（如果有 package.json 变更）
pnpm install

# 或者使用 npm
# npm install
```

---

## 五、运行数据库迁移（如有 Schema 变更）

```bash
# 在后端目录执行
cd /root/AI-Smart-Diet-Lens/backend

# 生成 Prisma 迁移
npx prisma migrate dev

# 或者直接应用数据库更新
npx prisma db push
```

---

## 六、重启后端服务

```bash
# 方法一：使用 PM2 重启（推荐）
pm2 restart diet-lens-backend

# 方法二：先停止再启动
# pm2 stop diet-lens-backend
# pm2 start /root/AI-Smart-Diet-Lens/backend/dist/main.js --name diet-lens-backend

# 方法三：重载（零停机）
# pm2 reload diet-lens-backend
```

---

## 七、验证服务状态

```bash
# 1. 查看 PM2 进程状态
pm2 status

# 预期输出：
# ┌────┬─────────────────────┬─────────────┬─────────┐
# │ id │ name                │ status      │ cpu     │
# ├────┼─────────────────────┼─────────────┼─────────┤
# │ 0  │ diet-lens-backend   │ online      │ 0%      │
# └────┴─────────────────────┴─────────────┴─────────┘

# 2. 查看实时日志
pm2 logs diet-lens-backend --lines 50

# 3. 查看错误日志
pm2 logs diet-lens-backend --err

# 4. 测试 API 健康检查
curl https://api.aichangzhang.com:8443/api/system/bootstrap

# 预期输出：JSON 格式的系统配置
```

---

## 八、前端部署（如需更新）

```bash
# 本地电脑操作
cd frontend/packages/ui

# 1. 构建生产版本
pnpm run build:h5

# 2. 压缩构建产物
cd dist/build/h5
tar -czf h5_$(date +%Y%m%d).tar.gz .

# 3. 上传到服务器
scp h5_*.tar.gz root@your-server-ip:/tmp/

# --- 服务器操作 ---
# 4. 在服务器上解压
cd /www/wwwroot/m.aichangzhang.com
tar -xzf /tmp/h5_*.tar.gz

# 5. 设置权限
chown -R www:www /www/wwwroot/m.aichangzhang.com
chmod -R 755 /www/wwwroot/m.aichangzhang.com
```

---

## 九、验证完整流程

| 检查项 | 命令/操作 | 预期结果 |
|:-------|:---------|:---------|
| 后端服务运行 | `pm2 status` | diet-lens-backend ✅ online |
| API 健康检查 | `curl https://api.aichangzhang.com:8443/api/system/bootstrap` | 返回 JSON |
| AI 对话测试 | 发送测试消息 | 正常回复 |
| 数据库连接 | 查看日志无错误 | 无 Prisma 错误 |

---

## 十、故障排查

### 1. 服务启动失败

```bash
# 查看详细错误
pm2 logs diet-lens-backend --err --lines 100

# 常见问题：
# - 端口被占用：检查 PORT 配置
# - 数据库连接失败：检查 DATABASE_URL
# - 环境变量缺失：检查 .env 文件
```

### 2. Git 拉取失败

```bash
# 强制覆盖本地版本
git fetch --all
git reset --hard origin/main
git pull
```

### 3. 依赖安装失败

```bash
# 清理缓存后重装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 4. 回滚到上一版本

```bash
# PM2 回滚（如果配置了版本管理）
pm2 revert diet-lens-backend

# 或手动恢复备份
cd /root/
tar -xzf backup_YYYYMMDD_HHMMSS.tar.gz -C /root/AI-Smart-Diet-Lens
pm2 restart diet-lens-backend
```

---

## 十一、自动化部署脚本

创建 `/root/deploy.sh`：

```bash
#!/bin/bash
set -e

echo "========================================="
echo "  开始部署 AI Smart Diet Lens 后端"
echo "========================================="

# 备份
echo "[1/5] 备份当前版本..."
cd /root/AI-Smart-Diet-Lens
tar -czf ../backup_$(date +%Y%m%d_%H%M%S).tar.gz . --exclude=node_modules

# 拉取代码
echo "[2/5] 拉取最新代码..."
git pull origin main

# 安装依赖
echo "[3/5] 安装依赖..."
cd backend
pnpm install

# 重启服务
echo "[4/5] 重启服务..."
pm2 restart diet-lens-backend

# 等待服务启动
sleep 5

# 健康检查
echo "[5/5] 健康检查..."
curl -f https://api.aichangzhang.com:8443/api/system/bootstrap || exit 1

echo "========================================="
echo "  部署完成！"
echo "========================================="
pm2 status
```

使用方式：

```bash
# 添加执行权限
chmod +x /root/deploy.sh

# 执行部署
/root/deploy.sh
```

---

**文档版本**: 1.0
**最后更新**: 2026-02-09
