<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# AI Smart-Diet Lens

**吃得更聪明，而非更少 | Eat Smarter, Not Less**

[![Vue 3](https://img.shields.io/badge/Vue-3.4-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vue Router](https://img.shields.io/badge/Vue_Router-4.3-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://router.vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Gemini_API-Powered-8E75B2?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)

[在线体验 Demo](https://ai.studio/apps/drive/1QzdIr3mHZ0nHL_nwAI4EfBR8uPqfYGEv) · [报告问题 Issues](https://github.com/aile1997/AI-Smart-Diet-Lens/issues) · [功能建议 Feature Request](https://github.com/aile1997/AI-Smart-Diet-Lens/issues)

</div>

---

## 简介 | Introduction

**AI Smart-Diet Lens** 是一款基于人工智能的智能营养追踪与膳食规划应用。通过先进的 AI 视觉识别技术，用户只需拍照即可快速获取食物的营养成分信息，实现智能化的饮食管理。

> AI Smart-Diet Lens is an AI-powered nutrition tracking and meal planning application. Using advanced AI visual recognition technology, users can quickly obtain nutritional information of food simply by taking photos, achieving intelligent dietary management.

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

| 类别 | 技术 | 版本 |
|------|------|------|
| **前端框架** | Vue 3 (Composition API) | ^3.4.0 |
| **开发语言** | TypeScript | ~5.8.2 |
| **构建工具** | Vite | 6.2.0 |
| **路由管理** | Vue Router | ^4.3.0 |
| **样式方案** | Tailwind CSS | 3.x (CDN) |
| **AI 服务** | Google Gemini API | - |
| **图标库** | Google Material Symbols | - |
| **字体** | Manrope + Noto Sans SC | - |

---

## 项目结构 | Project Structure

```
AI-Smart-Diet-Lens/
├── 📁 src/                          # 源代码目录
│   ├── 📁 components/               # 公共组件
│   │   └── BottomNav.vue            # 底部导航栏组件
│   ├── 📁 pages/                    # 页面组件
│   │   ├── Splash.vue               # 启动页
│   │   ├── Onboarding.vue           # 用户引导页
│   │   ├── Home.vue                 # 首页仪表盘
│   │   ├── Scan.vue                 # AI 拍照识别页
│   │   ├── FoodResult.vue           # 食物营养详情页
│   │   ├── Diary.vue                # 饮食日记页
│   │   ├── Wiki.vue                 # 食材百科页
│   │   ├── RecipeDetail.vue         # 食谱详情页
│   │   ├── ShoppingList.vue         # 购物清单页
│   │   ├── Profile.vue              # 个人中心页
│   │   └── Achievements.vue         # 成就系统页
│   ├── 📁 router/                   # 路由配置
│   │   └── index.ts                 # Vue Router 配置
│   ├── App.vue                      # 根组件
│   ├── main.ts                      # 应用入口
│   └── vite-env.d.ts                # Vite 类型声明
├── 📁 .claude/                      # AI 协作配置
│   ├── CLAUDE.md                    # AI 协作准则
│   ├── 📁 memory/                   # 项目记忆
│   ├── 📁 rules/                    # 开发规则
│   └── 📁 skills/                   # AI 技能包
├── index.html                       # HTML 入口
├── package.json                     # 项目依赖
├── vite.config.ts                   # Vite 配置
├── tsconfig.json                    # TypeScript 配置
└── README.md                        # 项目文档
```

---

## 快速开始 | Getting Started

### 环境要求 | Prerequisites

- [Node.js](https://nodejs.org/) (推荐 v18+)
- pnpm / npm / yarn 包管理器
- [Gemini API Key](https://ai.google.dev/)

### 安装步骤 | Installation

1. **克隆仓库 | Clone the repository**
   ```bash
   git clone https://github.com/aile1997/AI-Smart-Diet-Lens.git
   cd AI-Smart-Diet-Lens
   git checkout vue3
   ```

2. **安装依赖 | Install dependencies**
   ```bash
   pnpm install
   # 或 npm install
   ```

3. **配置环境变量 | Configure environment variables**

   创建 `.env.local` 文件并添加你的 Gemini API Key：
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **启动开发服务器 | Start development server**
   ```bash
   pnpm dev
   # 或 npm run dev
   ```

5. **访问应用 | Access the app**

   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 可用脚本 | Available Scripts

| 命令 | 描述 |
|------|------|
| `pnpm dev` | 启动开发服务器 (端口 3000) |
| `pnpm build` | 类型检查并构建生产版本 |
| `pnpm preview` | 本地预览生产构建 |

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

本项目遵循 **Hyper-Velocity DX Constitution** 开发协作准则：

### 角色分工 | Role Matrix

| 角色 | 职责 | 权限 |
|------|------|------|
| **Architect (架构师)** | 意图解析、契约制定、记忆管理 | RW: `.claude/` |
| **Builder (工匠)** | TDD 循环、功能实现、环境修复 | RW: `src/` |

### 开发原则 | Principles

1. **语言规范**: 所有注释和文档使用简体中文，代码命名使用英文语义化
2. **TDD 循环**: 先写测试 → 实现功能 → 重构优化
3. **接口围栏**: 业务逻辑与视图分离，平台 API 通过适配器注入

详细规范请参阅 `.claude/CLAUDE.md`

---

## 路线图 | Roadmap

- [x] AI 食物识别核心功能 (UI)
- [x] 每日营养追踪 (UI)
- [x] 个性化 BMR 计算 (UI)
- [x] 食材百科与食谱 (UI)
- [x] 游戏化成就系统 (UI)
- [ ] Pinia 状态管理集成
- [ ] Gemini API 实际调用
- [ ] 后端服务集成
- [ ] 数据持久化
- [ ] 单元测试覆盖
- [ ] 社区分享功能
- [ ] 多语言支持 (English)

---

## 贡献指南 | Contributing

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 许可证 | License

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 致谢 | Acknowledgments

- [Google Gemini API](https://ai.google.dev/) - AI 视觉识别能力
- [Vue.js](https://vuejs.org/) - 前端框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Vue Router](https://router.vuejs.org/) - 路由管理

---

<div align="center">

**Made with ❤️ by AI Smart-Diet Lens Team**

如果这个项目对你有帮助，请给一个 ⭐ Star！

</div>
