# 技术硬约束 (Tech Constraints) - Vue 3 + TypeScript 架构协议

> **文档类型**: 技术约束
> **维护者**: Architect
> **更新日期**: 2026-02-03
> **状态**: ✅ 当前有效

---

## 一、核心技术栈 (Core Stack)

| 类别 | 技术 | 版本 | 备注 |
|:-----|:-----|:-----|:-----|
| **前端框架** | Vue 3 | ^3.4.0 | Composition API |
| **开发语言** | TypeScript | ~5.8.2 | 严格模式 |
| **构建工具** | Vite | 6.2.0 | - |
| **路由** | Vue Router | ^4.3.0 | Hash 模式 |
| **状态管理** | Pinia | ^2.1.0 | 待集成 |
| **样式** | Tailwind CSS | 3.x | CDN 方式 |
| **AI 服务** | Google Gemini API | - | 食物识别 |

---

## 二、架构模式: "分层解耦" (Layered Decoupling)

项目采用清晰的分层架构：

### 层级定义

```
┌─────────────────────────────────────────┐
│           Pages (页面层)                 │  ← 用户交互入口
├─────────────────────────────────────────┤
│         Components (组件层)              │  ← 可复用 UI 组件
├─────────────────────────────────────────┤
│        Composables (组合函数层)          │  ← 业务逻辑封装
├─────────────────────────────────────────┤
│          Stores (状态层)                 │  ← 全局状态管理
├─────────────────────────────────────────┤
│         Services (服务层)                │  ← API/外部服务
├─────────────────────────────────────────┤
│          Types (类型层)                  │  ← TypeScript 类型
└─────────────────────────────────────────┘
```

### 各层职责

| 层级 | 职责 | 允许的依赖 |
|:-----|:-----|:----------|
| **Pages** | 页面组件、路由视图 | Components, Composables, Stores |
| **Components** | 可复用 UI 组件 | 其他 Components, Types |
| **Composables** | 业务逻辑、副作用处理 | Stores, Services, Types |
| **Stores** | 全局状态管理 | Services, Types |
| **Services** | API 调用、外部服务 | Types |
| **Types** | 类型定义 | 无依赖 |

---

## 三、关键约束与规则

### 1. TypeScript 强制规则

```typescript
// ✅ 正确: 显式类型定义
const user = ref<User | null>(null)
const calories = computed((): number => totalCalories.value)

// ❌ 错误: 隐式 any
const data = ref()  // 禁止
function process(item) {}  // 禁止
```

### 2. 组件设计规则

```vue
<!-- ✅ 正确: 使用 <script setup lang="ts"> -->
<script setup lang="ts">
import { ref } from 'vue'
import type { FoodItem } from '@/types/food'

const props = defineProps<{
  item: FoodItem
}>()
</script>

<!-- ❌ 错误: 使用 Options API -->
<script>
export default {
  data() { return {} }  // 禁止
}
</script>
```

### 3. 状态管理规则

```typescript
// ✅ 正确: 通过 Store 管理全局状态
const userStore = useUserStore()
userStore.setUser(userData)

// ❌ 错误: 组件间直接共享状态
provide('user', user)  // 仅限特定场景使用
```

### 4. API 调用规则

```typescript
// ✅ 正确: 通过 Service 层调用 API
import { geminiService } from '@/services/gemini'
const result = await geminiService.recognizeFood(imageData)

// ❌ 错误: 组件内直接调用 API
fetch('/api/food')  // 禁止在组件内直接调用
```

---

## 四、命名规范 (Naming Conventions)

### 文件命名

| 类型 | 规则 | 示例 |
|:-----|:-----|:-----|
| **Vue 组件** | PascalCase | `FoodCard.vue`, `BottomNav.vue` |
| **Composables** | camelCase + use 前缀 | `useNutrition.ts`, `useDiary.ts` |
| **Stores** | camelCase + .ts | `user.ts`, `nutrition.ts` |
| **Services** | camelCase + .ts | `gemini.ts`, `storage.ts` |
| **Types** | camelCase + .ts | `food.ts`, `user.ts` |
| **Utils** | camelCase + .ts | `format.ts`, `calculate.ts` |

### 代码命名

| 类型 | 规则 | 示例 |
|:-----|:-----|:-----|
| **变量/函数** | camelCase | `getUserData`, `totalCalories` |
| **常量** | UPPER_SNAKE_CASE | `MAX_CALORIES`, `API_BASE_URL` |
| **类型/接口** | PascalCase | `User`, `FoodItem`, `DailyDiary` |
| **枚举** | PascalCase | `MealType`, `AchievementStatus` |

### 禁止事项

```typescript
// ❌ 禁止拼音命名
const yonghu = ref()        // 应为 user
const huoquShuju = () => {} // 应为 fetchData

// ❌ 禁止无意义缩写
const usr = ref()           // 应为 user
const cal = computed()      // 应为 calories
```

---

## 五、路径别名 (Path Aliases)

```typescript
// vite.config.ts 已配置
{
  resolve: {
    alias: {
      '@': '/src'
    }
  }
}

// ✅ 正确: 使用路径别名
import { useUserStore } from '@/stores/user'
import type { FoodItem } from '@/types/food'

// ❌ 错误: 使用相对路径
import { useUserStore } from '../../../stores/user'
```

---

## 六、样式规范 (Styling Guidelines)

### Tailwind CSS 优先

```vue
<!-- ✅ 正确: 使用 Tailwind 类 -->
<div class="flex items-center gap-4 p-4 bg-white rounded-xl shadow-card">
  <span class="text-sage-600 font-semibold">标题</span>
</div>

<!-- ❌ 错误: 使用内联样式 -->
<div style="display: flex; padding: 16px;">
  <span style="color: green;">标题</span>
</div>
```

### 自定义样式

```vue
<!-- 仅在必要时使用 scoped 样式 -->
<style scoped>
.custom-animation {
  /* Tailwind 无法实现的动画 */
}
</style>
```

---

## 七、禁止事项清单 (Forbidden List)

### 代码层面

| 禁止项 | 原因 | 替代方案 |
|:-------|:-----|:--------|
| Options API | 不统一 | Composition API + `<script setup>` |
| `any` 类型 | 类型不安全 | 显式类型定义 |
| 拼音命名 | 可读性差 | 英文语义化命名 |
| 直接 fetch | 难以测试 | 通过 Service 层封装 |
| `console.log` 生产环境 | 性能/安全 | 条件编译或移除 |
| 魔法数字 | 可维护性 | 常量定义 |

### 架构层面

| 禁止项 | 原因 | 替代方案 |
|:-------|:-----|:--------|
| 组件内直接调用 API | 难以测试 | Service 层 |
| Props 深层嵌套 | 复杂度高 | Store 或 provide/inject |
| 循环依赖 | 架构混乱 | 重新设计模块边界 |
| 页面组件过大 (>300行) | 可维护性 | 拆分为子组件 |

---

## 八、开发操作准则 (Development Guidelines)

### 1. 新功能开发流程

```
1. 定义类型 (types/)
   ↓
2. 创建 Store (stores/) [如需要全局状态]
   ↓
3. 创建 Service (services/) [如需要 API 调用]
   ↓
4. 创建 Composable (composables/)
   ↓
5. 创建/修改组件 (components/ 或 pages/)
   ↓
6. 编写测试 [待集成]
```

### 2. 代码审查检查项

- [ ] TypeScript 类型完整
- [ ] 无 `any` 类型
- [ ] 命名符合规范
- [ ] 无拼音或无意义缩写
- [ ] 使用路径别名 `@/`
- [ ] 组件单一职责
- [ ] 无硬编码数值
- [ ] 注释使用简体中文

### 3. Git 提交规范

```
feat: 新功能
fix: 修复 bug
refactor: 重构
docs: 文档更新
style: 代码格式
test: 测试相关
chore: 构建/工具
```

---

## 九、环境变量 (Environment Variables)

```env
# .env.local (不提交到 Git)
GEMINI_API_KEY=your_api_key_here

# 在代码中使用
const apiKey = import.meta.env.GEMINI_API_KEY
```

---

## 十、待办事项 (TODOs)

- [ ] 集成 Pinia 状态管理
- [ ] 配置 Vitest 单元测试
- [ ] 集成 ESLint + Prettier
- [ ] 配置 Husky pre-commit hooks
- [ ] 添加 Tailwind CSS 本地安装 (替代 CDN)

---

**文档维护者**: Architect
**最后更新**: 2026-02-03
**下次审查**: 2026-03-03
