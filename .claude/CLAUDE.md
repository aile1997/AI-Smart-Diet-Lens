# AI Smart Diet Lens - AI 协作准则 (v3.0)

> **System Alert**: 本文件是 AI 协作的最高准则。Architect、Frontend Builder、Backend Builder 必须严格遵守。

---

## 1. 语言与输出公约 (Language & Output Protocol)

- **核心原则**: 所有回复、说明、文档、注释 **必须使用简体中文**。
- **代码命名**: 严禁使用拼音或拼音缩写。必须使用英文语义化命名。
  - ✅ `getUserInfo`, `totalCalories`, `handleSubmit`
  - ❌ `huoquYonghu`, `kaluli`, `tijiao`
- **例外豁免**: 错误堆栈 (Stack Trace)、系统日志、标准库引用保留英文原样。

---

## 2. 角色矩阵 (Identity Matrix)

| 维度 | **Architect (架构师)** | **Frontend Builder** | **Backend Builder** |
|:-----|:-----------------------|:---------------------|:--------------------|
| **核心职责** | 架构设计、契约制定、记忆管理 | 前端 TDD 开发、UI 实现 | 后端 API 开发、数据库设计 |
| **文件权限** | **RW**: `.claude/` | **RW**: `frontend/` | **RW**: `backend/` |
| **只读权限** | **RO**: `frontend/`, `backend/` | **RO**: `.claude/`, `backend/` | **RO**: `.claude/`, `frontend/` |
| **工具/指令** | `/prd`, `/ui`, `/plan` | `/dev` | `/dev` |

---

## 3. 项目概述 (Project Overview)

### 项目名称
**AI Smart Diet Lens** - 智能营养追踪与膳食规划应用

### 核心功能
- AI 食物拍照识别 (Gemini API)
- 每日营养追踪与热量管理
- 饮食日记与数据可视化
- 食材百科与食谱推荐
- 游戏化成就系统

### 目标平台
- 微信小程序
- H5 网页版
- 支付宝小程序 (未来)
- App (未来)

---

## 4. 技术栈法则 (The Tech Stack Law)

### 前端技术栈

| 类别 | 技术 | 版本 | 备注 |
|:-----|:-----|:-----|:-----|
| **跨端框架** | UniApp | 3.0+ | Vite 模式 |
| **前端框架** | Vue 3 | ^3.4.0 | Composition API |
| **开发语言** | TypeScript | ~5.8.0 | 严格模式 |
| **构建工具** | Vite | 6.x | uni-helper 插件生态 |
| **状态管理** | Pinia | ^2.1.0 | UniApp 持久化插件 |
| **样式方案** | UnoCSS | latest | 原子化 CSS |
| **UI 组件库** | Wot Design Uni | latest | 首选 |
| **测试框架** | Vitest | latest | Core 层测试 |
| **包管理器** | pnpm | 9.x | Workspaces 模式 |

### 后端技术栈

| 类别 | 技术 | 版本 | 备注 |
|:-----|:-----|:-----|:-----|
| **运行时** | Node.js | 20.x LTS | - |
| **框架** | NestJS | 11.x | - |
| **ORM** | Prisma | 5.x+ | PostgreSQL |
| **数据库** | PostgreSQL | 16+ | - |
| **缓存** | Redis | 7+ | - |
| **测试框架** | Jest | 30+ | - |

### 禁止引入

- ❌ jQuery 或其他 DOM 操作库
- ❌ Vuex (使用 Pinia 替代)
- ❌ axios (使用原生 fetch 封装)
- ❌ Tailwind CSS CDN (使用 UnoCSS 替代)
- ❌ 未经 Architect 审批的库

---

## 5. 架构模式: "接口即围栏" (Interface as Fence)

### Monorepo 结构

```
AI-Smart-Diet-Lens/
├── frontend/                    # 前端 Monorepo
│   ├── packages/
│   │   ├── core/                # @diet-lens/core (业务逻辑层)
│   │   │   ├── src/
│   │   │   │   ├── composables/ # 组合式函数
│   │   │   │   ├── stores/      # Pinia Store
│   │   │   │   ├── adapters/    # 平台接口抽象
│   │   │   │   ├── types/       # TypeScript 类型
│   │   │   │   └── utils/       # 工具函数
│   │   │   └── tests/           # 单元测试
│   │   │
│   │   └── ui/                  # @diet-lens/ui (视图层)
│   │       ├── src/
│   │       │   ├── pages/       # 页面组件
│   │       │   ├── components/  # UI 组件
│   │       │   └── layouts/     # 布局组件
│   │       └── ...config files
│   │
│   └── pnpm-workspace.yaml
│
├── backend/                     # 后端服务 (NestJS)
│   ├── src/modules/             # 功能模块
│   └── prisma/                  # 数据库模型
│
└── .claude/                     # AI 协作系统
```

### 围栏规则

| 层级 | 允许 | 禁止 |
|:-----|:-----|:-----|
| **packages/core** | 纯 TypeScript、适配器接口 | `uni.xxx`, `wx.xxx`, `window.xxx` |
| **packages/ui** | UniApp API、引用 Core 层 | 复杂业务逻辑 |
| **backend** | NestJS、Prisma、外部 API | 前端特定代码 |

---

## 6. 记忆体与上下文协议 (Memory Protocol)

为了防止"灾难性遗忘"，所有 Session 启动时必须按序加载：

1. **Tech Constraints**: 读取 `.claude/memory/tech_constraints.md`
2. **Architecture Overview**: 读取 `.claude/memory/architecture_overview.md`
3. **Coding Style**: 读取 `.claude/rules/coding-style.md`
4. **VS Code Guide**: 读取 `.claude/memory/vscode-workspace-guide.md`
5. **Active Ticket**: 确认当前正在执行的任务

---

## 7. 指令路由与技能调度 (Skill Dispatcher)

### Architect 专属

| 指令 | 技能包 | 功能 |
|:-----|:-------|:-----|
| `/prd` | product-spec-builder | 启动需求审计，生成 PRD 文档 |
| `/ui` | ui-prompt-generator | 基于 PRD 生成 UI 设计规范 |
| `/plan` | task-decomposer | 将需求拆解为原子化任务 |

### Builder 专属 (Frontend & Backend)

| 指令 | 技能包 | 功能 |
|:-----|:-------|:-----|
| `/dev` | dev-builder | 领取任务，执行 TDD 开发循环 |

---

## 8. TDD 开发循环 (TDD Loop)

### Frontend Builder 流程

```
Phase 1: Red (编写测试)
├── 定位: frontend/packages/core/tests/
├── 操作: 编写单元测试
├── 禁止: 测试中严禁 uni.xxx，必须 Mock
└── 结果: pnpm --filter @diet-lens/core test 必须失败

Phase 2: Green (最小实现)
├── 定位: frontend/packages/core/src/
├── 操作: 实现 TypeScript 逻辑
├── 隔离: 平台功能通过 adapters 接口
└── 结果: 运行测试变绿

Phase 3: UI Bind (视图消费)
├── 定位: frontend/packages/ui/src/pages/
├── 操作: 在 .vue 中使用 @diet-lens/core
└── 合规: 检查是否有未隔离的业务逻辑
```

### Backend Builder 流程

```
Phase 1: Red (编写测试)
├── 定位: backend/test/
├── 操作: 编写单元/集成测试
└── 结果: pnpm --filter backend test 必须失败

Phase 2: Green (实现)
├── 定位: backend/src/modules/
├── 操作: 实现 Controller + Service
└── 结果: 运行测试变绿

Phase 3: Refactor (重构)
├── 操作: 优化代码结构
└── 检查: 类型安全、错误处理
```

---

## 9. 防御性约束 (Defensive Constraints)

### 代码层面

- **TypeScript 严格模式**: 禁止 `any` 类型
- **显式类型**: 所有 `ref()`, `computed()` 必须声明类型
- **命名规范**: 禁止拼音，使用英文语义化命名
- **Core 层围栏**: 严禁平台 API，必须通过 Adapter

### 架构层面

- **组件大小**: 单个 Vue 文件不超过 300 行
- **依赖方向**: UI → Core → Types (严禁反向)
- **API 调用**: 必须通过 Adapter 接口

### 错误处理

- 连续失败 3 次，必须停止并输出 `Ask for Review`
- 不确定的技术决策，必须先咨询 Architect

---

## 10. Git 提交规范 (Commit Convention)

### Scope 规范

| Scope | 说明 | 负责人 |
|:------|:-----|:-------|
| `ui` | 前端 UI 层 | Frontend Builder |
| `core` | 前端 Core 层 | Frontend Builder |
| `backend` | 后端服务 | Backend Builder |
| `infra` | 基础设施 | Architect |

### 提交规则

```bash
# ❌ 错误: 前后端混合提交
git add .
git commit -m "实现登录功能"

# ✅ 正确: 分开提交
git add frontend/packages/core/
git commit -m "feat(core): 实现 useAuth 组合函数"

git add frontend/packages/ui/
git commit -m "feat(ui): 添加登录页面"

git add backend/
git commit -m "feat(backend): 实现用户认证 API"
```

---

## 11. 当前开发阶段 (Current Phase)

### 已完成

- [x] 项目基础 UI 原型 (React 版本)
- [x] 架构设计文档

### 进行中

- [ ] 迁移到 UniApp + Monorepo 架构 (参考 vitesse-uni-app)
- [ ] 初始化前端 Monorepo 结构
- [ ] 初始化后端 NestJS 结构

### 待启动

- [ ] Frontend: Core 层类型定义和 Store
- [ ] Frontend: 适配器接口和实现
- [ ] Backend: Prisma Schema 设计
- [ ] Backend: API 模块实现

---

## 12. Builder 任务优先级 (Task Priorities)

### Frontend Builder

| 优先级 | 任务 ID | 描述 |
|:-------|:--------|:-----|
| **P0** | FE-001 | 初始化 Monorepo 结构 (vitesse-uni-app) |
| **P0** | FE-002 | 创建 types/ 核心类型定义 |
| **P0** | FE-003 | 创建适配器接口 (IHttp, IStorage, ICamera) |
| **P0** | FE-004 | 实现 userStore |
| **P1** | FE-005 | 实现 useAuth composable + 测试 |

### Backend Builder

| 优先级 | 任务 ID | 描述 |
|:-------|:--------|:-----|
| **P0** | BE-001 | 初始化 NestJS 项目结构 |
| **P0** | BE-002 | 配置 Prisma + PostgreSQL |
| **P0** | BE-003 | 设计用户 Schema + 迁移 |
| **P1** | BE-004 | 实现 Auth 模块 (登录/注册) |
| **P1** | BE-005 | 设计食物/营养 Schema |

---

## 13. 文件路径速查 (Quick Reference)

| 文档 | 路径 |
|:-----|:-----|
| 架构总览 | `.claude/memory/architecture_overview.md` |
| 技术约束 | `.claude/memory/tech_constraints.md` |
| VS Code 指南 | `.claude/memory/vscode-workspace-guide.md` |
| 编码风格 | `.claude/rules/coding-style.md` |
| 安全规范 | `.claude/rules/security.md` |
| 测试规范 | `.claude/rules/testing.md` |

---

**文档版本**: 3.0
**适用项目**: AI Smart Diet Lens
**最后更新**: 2026-02-03
**维护者**: Architect
