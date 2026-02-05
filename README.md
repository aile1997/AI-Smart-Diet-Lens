<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# AI Smart-Diet Lens

**吃得更聪明，而非更少 | Eat Smarter, Not Less**

[![UniApp](https://img.shields.io/badge/UniApp-3.0+-41B883?style=flat-square&logo=vue.js&logoColor=white)](https://uniapp.dcloud.net.cn/)
[![Vue 3](https://img.shields.io/badge/Vue-3.4-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![UnoCSS](https://img.shields.io/badge/UnoCSS-latest-333333?style=flat-square&logo=unocss&logoColor=white)](https://unocss.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Gemini API](https://img.shields.io/badge/Gemini_API-Powered-8E75B2?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)

[在线体验 Demo](https://ai.studio/apps/drive/1QzdIr3mHZ0nHL_nwAI4EfBR8uPqfYGEv) · [报告问题 Issues](https://github.com/aile1997/AI-Smart-Diet-Lens/issues) · [功能建议 Feature Request](https://github.com/aile1997/AI-Smart-Diet-Lens/issues)

</div>

---

## 简介 | Introduction

**AI Smart-Diet Lens** 是一款基于人工智能的智能营养追踪与膳食规划应用。通过先进的 AI 视觉识别技术，用户只需拍照即可快速获取食物的营养成分信息，实现智能化的饮食管理。

> AI Smart-Diet Lens is an AI-powered nutrition tracking and meal planning application. Using advanced AI visual recognition technology, users can quickly obtain nutritional information of food simply by taking photos, achieving intelligent dietary management.

### 目标平台 | Target Platforms

- 微信小程序 (WeChat Mini Program)
- H5 网页版 (H5 Web)
- 支付宝小程序 (Alipay Mini Program) - 未来
- 原生 App (Native App) - 未来

---

## 核心功能 | Key Features

### 🍎 AI 食物识别 | AI Food Recognition
- 📸 **智能拍照识别** - 一键拍照，AI 自动识别食物并分析营养成分
- 🎯 **高置信度分析** - 显示识别置信度百分比，确保准确性
- ⚖️ **份量调节** - 滑动调整食物份量，精确计算卡路里

### 📊 每日营养追踪 | Daily Nutrition Tracking
- 🔵 **热量环形图** - 直观显示每日剩余热量预算
- 📈 **宏观营养素追踪** - 实时监控蛋白质、碳水化合物、脂肪摄入
- 📝 **饮食日记** - 按餐次记录每日食物摄入，AI 智能分析

### 🧬 个性化定制 | Personalization
- 📋 **入职引导** - 收集身高、体重、年龄等数据
- 🔢 **BMR 计算** - 基于 Mifflin-St Jeor 公式计算基础代谢率
- 🎯 **目标设定** - 支持减脂模式和多种健身目标

### 📚 食材百科与食谱 | Food Wiki & Recipes
- 🥗 **食材百科** - 浏览食材详情，查看 AI 健康评分与营养价值
- 👨‍🍳 **详细食谱** - 步骤图文并茂的烹饪指南
- 🎙️ **AI 语音助手** - 烹饪过程中的智能语音指导
- 🌿 **季节推荐** - AI 根据时令推荐最佳食材

### 🛒 智能购物清单 | Smart Shopping List
- 📝 **自动生成** - 根据食谱自动生成购物清单
- 🏷️ **分类管理** - 按食材类型智能分类
- 💰 **价格估算** - 预估购物总花费

### 🏆 游戏化激励 | Gamification
- 🏅 **成就徽章** - 减脂先锋、营养达人、AI探索者等多种徽章
- 📈 **等级系统** - 用户等级从 1 级到 5 级逐步提升
- ⚡ **每日挑战** - 参与限时挑战，保持健康习惯

### 💪 全面健康监测 | Holistic Health Tracking
- 👟 **步数统计** - 每日步数目标追踪
- 💧 **饮水提醒** - 杯数记录，保持充足水分
- 😴 **睡眠质量** - 记录睡眠时长和质量
- 😊 **心情日志** - 每日心情状态记录

---

## 技术栈 | Tech Stack

### 前端技术栈 | Frontend Stack

| 类别 | 技术 | 版本 | 备注 |
|------|------|------|------|
| **跨端框架** | UniApp | 3.0+ | Vite 模式 |
| **前端框架** | Vue 3 | ^3.4.0 | Composition API |
| **开发语言** | TypeScript | ~5.8.0 | 严格模式 |
| **构建工具** | Vite | 6.x | uni-helper 插件生态 |
| **状态管理** | Pinia | ^2.1.0 | UniApp 持久化插件 |
| **样式方案** | UnoCSS | latest | 原子化 CSS |
| **UI 组件库** | Wot Design Uni | latest | 首选 |
| **测试框架** | Vitest | latest | Core 层测试 |
| **包管理器** | pnpm | 9.x | Workspaces 模式 |

### 后端技术栈 | Backend Stack

| 类别 | 技术 | 版本 | 备注 |
|------|------|------|------|
| **运行时** | Node.js | 20.x LTS | - |
| **框架** | NestJS | 11.x | - |
| **ORM** | Prisma | 5.x+ | PostgreSQL |
| **数据库** | PostgreSQL | 16+ | - |
| **缓存** | Redis | 7+ | - |
| **测试框架** | Jest | 30+ | - |

### AI 服务 | AI Services

| 服务 | 用途 |
|------|------|
| **Google Gemini API** | 食物图像识别、营养分析 |

---

## 项目结构 | Project Structure

本项目采用 **Monorepo** 架构，前端参考 [vitesse-uni-app](https://github.com/uni-helper/vitesse-uni-app) 模板。

```
AI-Smart-Diet-Lens/
├── 📁 frontend/                    # 前端 Monorepo
│   ├── 📁 packages/
│   │   ├── 📁 core/                # @diet-lens/core (业务逻辑层)
│   │   │   ├── 📁 src/
│   │   │   │   ├── composables/    # 组合式函数
│   │   │   │   ├── stores/         # Pinia Store
│   │   │   │   ├── api/            # API 接口封装
│   │   │   │   ├── adapters/       # 平台接口抽象
│   │   │   │   ├── types/          # TypeScript 类型
│   │   │   │   └── utils/          # 工具函数
│   │   │   └── 📁 tests/           # 单元测试
│   │   │
│   │   └── 📁 ui/                  # @diet-lens/ui (视图层)
│   │       ├── 📁 src/
│   │       │   ├── pages/          # 页面组件
│   │       │   ├── components/     # UI 组件
│   │       │   ├── layouts/        # 布局组件
│   │       │   └── static/         # 静态资源
│   │       ├── pages.config.ts     # 文件路由配置
│   │       └── manifest.config.ts  # UniApp 配置
│   │
│   └── pnpm-workspace.yaml
│
├── 📁 backend/                     # 后端服务 (NestJS)
│   ├── 📁 src/
│   │   ├── modules/                # 功能模块
│   │   ├── common/                 # 公共模块
│   │   └── prisma/                 # 数据库模型
│   └── package.json
│
└── 📁 .claude/                     # AI 协作系统
    ├── CLAUDE.md                   # AI 协作准则
    ├── 📁 memory/                  # 项目记忆
    ├── 📁 rules/                   # 开发规则
    └── 📁 skills/                  # AI 技能包
```

### 架构模式: "接口即围栏" | Architecture Pattern: "Interface as Fence"

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Monorepo                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │         packages/ui (视图层) @diet-lens/ui               │    │
│  │  - Vue 页面和组件                                        │    │
│  │  - UniApp 配置                                           │    │
│  │  - 平台适配器实现                                        │    │
│  │  ✅ 可以使用 uni.xxx API                                 │    │
│  │  ✅ 引用 @diet-lens/core                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                             ↑ 依赖                               │
│                             │                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │       packages/core (业务逻辑层) @diet-lens/core         │    │
│  │  - 100% 纯 TypeScript                                    │    │
│  │  - Composables、Stores、Types                            │    │
│  │  - 适配器接口定义                                        │    │
│  │  ❌ 严禁 uni.xxx, wx.xxx, window.xxx                     │    │
│  │  ❌ 严禁直接调用平台 API                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 快速开始 | Getting Started

### 环境要求 | Prerequisites

- [Node.js](https://nodejs.org/) v20.x LTS
- [pnpm](https://pnpm.io/) v9.x
- [PostgreSQL](https://www.postgresql.org/) v16+
- [Redis](https://redis.io/) v7+
- [Gemini API Key](https://ai.google.dev/)

### 安装步骤 | Installation

1. **克隆仓库 | Clone the repository**
   ```bash
   git clone https://github.com/aile1997/AI-Smart-Diet-Lens.git
   cd AI-Smart-Diet-Lens
   ```

2. **安装前端依赖 | Install frontend dependencies**
   ```bash
   cd frontend
   pnpm install
   ```

3. **安装后端依赖 | Install backend dependencies**
   ```bash
   cd backend
   pnpm install
   ```

4. **配置环境变量 | Configure environment variables**

   前端 `.env.local`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

   后端 `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/dietlens
   REDIS_URL=redis://localhost:6379
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **启动开发服务器 | Start development servers**

   前端 H5:
   ```bash
   pnpm --filter @diet-lens/ui dev:h5
   ```

   前端微信小程序:
   ```bash
   pnpm --filter @diet-lens/ui dev:mp-weixin
   ```

   后端:
   ```bash
   pnpm --filter backend start:dev
   ```

### 可用脚本 | Available Scripts

#### 前端脚本 | Frontend Scripts

| 命令 | 描述 |
|------|------|
| `pnpm --filter @diet-lens/ui dev:h5` | 启动 H5 开发服务器 |
| `pnpm --filter @diet-lens/ui dev:mp-weixin` | 启动微信小程序开发 |
| `pnpm --filter @diet-lens/core test` | 运行 Core 层单元测试 |
| `pnpm --filter @diet-lens/core test:watch` | 监听模式运行测试 |
| `pnpm --filter @diet-lens/ui build:h5` | 构建 H5 生产版本 |
| `pnpm --filter @diet-lens/ui build:mp-weixin` | 构建微信小程序 |

#### 后端脚本 | Backend Scripts

| 命令 | 描述 |
|------|------|
| `pnpm --filter backend start:dev` | 启动开发服务器 |
| `pnpm --filter backend test` | 运行单元测试 |
| `pnpm --filter backend prisma:studio` | 打开 Prisma Studio |
| `pnpm --filter backend prisma:migrate` | 运行数据库迁移 |

---

## 在线体验 | Live Demo

🔗 **AI Studio**: [https://ai.studio/apps/drive/1QzdIr3mHZ0nHL_nwAI4EfBR8uPqfYGEv](https://ai.studio/apps/drive/1QzdIr3mHZ0nHL_nwAI4EfBR8uPqfYGEv)

---

## 应用截图 | Screenshots

<div align="center">
<table>
<tr>
<td align="center"><strong>首页仪表盘</strong><br/>Home Dashboard</td>
<td align="center"><strong>AI 拍照识别</strong><br/>AI Food Scan</td>
<td align="center"><strong>营养分析</strong><br/>Nutrition Analysis</td>
</tr>
<tr>
<td align="center"><strong>饮食日记</strong><br/>Food Diary</td>
<td align="center"><strong>食材百科</strong><br/>Food Wiki</td>
<td align="center"><strong>成就系统</strong><br/>Achievements</td>
</tr>
</table>
</div>

---

## 开发规范 | Development Guidelines

本项目遵循 **AI 协作准则 (v3.0)** 开发协作准则：

### 角色分工 | Role Matrix

| 角色 | 职责 | 文件权限 |
|------|------|----------|
| **Architect (架构师)** | 架构设计、契约制定、记忆管理 | RW: `.claude/` |
| **Frontend Builder** | 前端 TDD 开发、UI 实现 | RW: `frontend/` |
| **Backend Builder** | 后端 API 开发、数据库设计 | RW: `backend/` |

### 开发原则 | Principles

1. **语言规范**: 所有注释和文档使用简体中文，代码命名使用英文语义化
2. **TDD 循环**: 先写测试 → 实现功能 → 重构优化
3. **接口围栏**: Core 层 100% 纯 TypeScript，平台 API 通过适配器注入
4. **前后端分离**: 前端和后端独立提交，严禁混合提交

详细规范请参阅 `.claude/CLAUDE.md`

---

## 路线图 | Roadmap

### 已完成 | Completed
- [x] 项目基础 UI 原型
- [x] 架构设计文档
- [x] AI 协作准则 v3.0

### 进行中 | In Progress
- [ ] 迁移到 UniApp + Monorepo 架构
- [ ] 初始化前端 Monorepo 结构 (参考 vitesse-uni-app)
- [ ] 初始化后端 NestJS 结构

### 待启动 | Planned
- [ ] Frontend: Core 层类型定义和 Store
- [ ] Frontend: 适配器接口和实现
- [ ] Backend: Prisma Schema 设计
- [ ] Backend: API 模块实现
- [ ] Gemini API 实际调用
- [ ] 数据持久化
- [ ] 单元测试覆盖
- [ ] 社区分享功能
- [ ] 多语言支持 (English)

---

## 贡献指南 | Contributing

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 按照 Git 提交规范提交更改:
   ```bash
   # 前端 Core 层
   git commit -m "feat(core): 实现 useNutrition 组合函数"

   # 前端 UI 层
   git commit -m "feat(ui): 添加食物识别页面"

   # 后端
   git commit -m "feat(backend): 实现用户认证 API"
   ```
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 许可证 | License

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 致谢 | Acknowledgments

- [Google Gemini API](https://ai.google.dev/) - AI 视觉识别能力
- [UniApp](https://uniapp.dcloud.net.cn/) - 跨端框架
- [vitesse-uni-app](https://github.com/uni-helper/vitesse-uni-app) - 前端模板参考
- [Vue.js](https://vuejs.org/) - 前端框架
- [Vite](https://vitejs.dev/) - 构建工具
- [UnoCSS](https://unocss.dev/) - 原子化 CSS
- [NestJS](https://nestjs.com/) - 后端框架
- [Prisma](https://www.prisma.io/) - ORM

---

<div align="center">

**Made with ❤️ by AI Smart-Diet Lens Team**

如果这个项目对你有帮助，请给一个 ⭐ Star！

</div>
