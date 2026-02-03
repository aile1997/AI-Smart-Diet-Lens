# AI Smart Diet Lens - AI 协作准则 (v2.0)

> **System Alert**: 本文件是 AI 协作的最高准则。Architect 与 Builder 必须严格遵守。

---

## 1. 语言与输出公约 (Language & Output Protocol)

- **核心原则**: 所有回复、说明、文档、注释 **必须使用简体中文**。
- **代码命名**: 严禁使用拼音或拼音缩写。必须使用英文语义化命名。
  - ✅ `getUserInfo`, `totalCalories`, `handleSubmit`
  - ❌ `huoquYonghu`, `kaluli`, `tijiao`
- **例外豁免**: 错误堆栈 (Stack Trace)、系统日志、标准库引用保留英文原样。

---

## 2. 角色矩阵 (Identity Matrix)

| 维度 | **Architect (架构师)** | **Builder (工匠)** |
|:-----|:-----------------------|:-------------------|
| **核心职责** | 架构设计、契约制定、文档管理 | 功能实现、TDD 循环、Bug 修复 |
| **文件权限** | **RW**: `.claude/` | **RW**: `src/` |
| **只读权限** | **RO**: `src/` (Code Review) | **RO**: `.claude/` (严禁篡改规范) |

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

### 技术栈
| 类别 | 技术 | 版本 |
|:-----|:-----|:-----|
| **前端框架** | Vue 3 (Composition API) | ^3.4.0 |
| **开发语言** | TypeScript | ~5.8.2 |
| **构建工具** | Vite | 6.2.0 |
| **路由管理** | Vue Router | ^4.3.0 |
| **状态管理** | Pinia | ^2.1.0 (待集成) |
| **样式方案** | Tailwind CSS | 3.x (CDN) |
| **AI 服务** | Google Gemini API | - |

---

## 4. 记忆体与上下文协议 (Memory Protocol)

为了防止"灾难性遗忘"，所有 Session 启动时必须按序加载：

1. **Tech Constraints**: 读取 `.claude/memory/tech_constraints.md`
2. **Architecture Overview**: 读取 `.claude/memory/architecture_overview.md`
3. **Coding Style**: 读取 `.claude/rules/coding-style.md`
4. **Active Task**: 确认当前正在执行的任务

---

## 5. 技术栈法则 (The Tech Stack Law)

所有生成的代码必须严格遵循以下选型，**禁止**引入未授权的库：

### 已授权依赖

```json
{
  "vue": "^3.4.0",
  "vue-router": "^4.3.0",
  "pinia": "^2.1.0",
  "pinia-plugin-persistedstate": "latest"
}
```

### 待集成依赖 (需 Architect 审批)

```json
{
  "vitest": "^1.0.0",
  "@vue/test-utils": "^2.4.0",
  "dayjs": "^1.11.0"
}
```

### 禁止引入

- jQuery 或其他 DOM 操作库
- Vuex (使用 Pinia 替代)
- axios (使用原生 fetch 封装)
- 未经审批的 UI 组件库

---

## 6. 分层架构 (Layered Architecture)

```
┌─────────────────────────────────────────┐
│           Pages (页面层)                 │
├─────────────────────────────────────────┤
│         Components (组件层)              │
├─────────────────────────────────────────┤
│        Composables (组合函数层)          │
├─────────────────────────────────────────┤
│          Stores (状态层)                 │
├─────────────────────────────────────────┤
│         Services (服务层)                │
├─────────────────────────────────────────┤
│          Types (类型层)                  │
└─────────────────────────────────────────┘
```

### 依赖规则

| 层级 | 可依赖 | 禁止依赖 |
|:-----|:-------|:---------|
| Pages | Components, Composables, Stores | Services (应通过 Composables) |
| Components | 其他 Components, Types | Stores, Services |
| Composables | Stores, Services, Types | Pages, Components |
| Stores | Services, Types | 其他所有层 |
| Services | Types | 其他所有层 |
| Types | 无 | 所有层 |

---

## 7. 指令路由与技能调度 (Skill Dispatcher)

### Architect 专属

| 指令 | 技能包 | 功能 |
|:-----|:-------|:-----|
| `/prd` | product-spec-builder | 启动需求审计，生成 PRD 文档 |
| `/ui` | ui-prompt-generator | 基于 PRD 生成 UI 设计规范 |
| `/plan` | task-decomposer | 将需求拆解为原子化任务 |

### Builder 专属

| 指令 | 技能包 | 功能 |
|:-----|:-------|:-----|
| `/dev` | dev-builder | 领取任务，执行 TDD 开发循环 |

---

## 8. TDD 开发循环 (TDD Loop)

Builder 必须严格按以下顺序执行：

### Phase 1: Red (写测试)

```
定位: src/__tests__/
操作: 根据任务编写单元测试
结果: 运行测试，预期失败
```

### Phase 2: Green (实现)

```
定位: src/composables/, src/stores/, src/services/
操作: 编写最小实现代码
结果: 运行测试，预期通过
```

### Phase 3: Refactor (重构)

```
操作: 在保持测试通过的前提下优化代码
检查: 命名规范、类型安全、代码风格
```

---

## 9. 防御性约束 (Defensive Constraints)

### 代码层面

- **TypeScript 严格模式**: 禁止 `any` 类型
- **显式类型**: 所有 `ref()`, `computed()` 必须声明类型
- **命名规范**: 禁止拼音，使用英文语义化命名

### 架构层面

- **组件大小**: 单个 Vue 文件不超过 300 行
- **依赖方向**: 严格遵循分层架构
- **API 调用**: 必须通过 Service 层，禁止组件内直接 fetch

### 错误处理

- 连续失败 3 次，必须停止并输出 `Ask for Review`
- 不确定的技术决策，必须先咨询 Architect

---

## 10. 当前开发阶段 (Current Phase)

### 已完成

- [x] 项目基础架构 (Vue 3 + Vite + TypeScript)
- [x] 路由配置 (Vue Router)
- [x] 11 个页面 UI 组件
- [x] 底部导航组件
- [x] Tailwind CSS 样式配置

### 进行中

- [ ] Pinia 状态管理集成
- [ ] TypeScript 类型定义完善
- [ ] 服务层搭建

### 待启动

- [ ] Gemini API 集成
- [ ] 单元测试配置
- [ ] 数据持久化

---

## 11. Builder 任务优先级 (Task Priorities)

| 优先级 | 任务 ID | 描述 |
|:-------|:--------|:-----|
| **P0** | T-001 | 安装配置 Pinia |
| **P0** | T-002 | 创建 types/ 目录和核心类型 |
| **P0** | T-003 | 创建 userStore |
| **P0** | T-004 | 创建 storageService |
| **P1** | T-005 | 重构 Home.vue 使用 Pinia |
| **P1** | T-006 | 创建 nutritionStore |
| **P1** | T-007 | 创建 diaryStore |
| **P1** | T-008 | 实现 useNutrition composable |

---

## 12. 文件路径速查 (Quick Reference)

| 文档 | 路径 |
|:-----|:-----|
| 架构总览 | `.claude/memory/architecture_overview.md` |
| 技术约束 | `.claude/memory/tech_constraints.md` |
| 编码风格 | `.claude/rules/coding-style.md` |
| 安全规范 | `.claude/rules/security.md` |
| 测试规范 | `.claude/rules/testing.md` |

---

**文档版本**: 2.0
**适用项目**: AI Smart Diet Lens
**最后更新**: 2026-02-03
**维护者**: Architect
