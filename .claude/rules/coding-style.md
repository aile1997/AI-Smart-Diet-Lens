# 编码风格规范 (Coding Style & Patterns)

> **适用项目**: AI Smart Diet Lens
> **技术栈**: Vue 3 + TypeScript + Vite + Tailwind CSS

---

## 一、命名规范 (Naming Conventions)

### 1. 文件命名

| 类型 | 规则 | 示例 |
|:-----|:-----|:-----|
| Vue 组件 | PascalCase | `FoodCard.vue`, `BottomNav.vue` |
| Composables | camelCase + use 前缀 | `useNutrition.ts`, `useDiary.ts` |
| Stores | camelCase | `user.ts`, `nutrition.ts` |
| Services | camelCase | `gemini.ts`, `storage.ts` |
| Types | camelCase | `food.ts`, `user.ts` |
| Utils | camelCase | `format.ts`, `calculate.ts` |

### 2. 代码命名

- **变量/函数**: camelCase (`getUserData`, `totalCalories`)
- **常量**: UPPER_SNAKE_CASE (`MAX_CALORIES`, `API_BASE_URL`)
- **类型/接口**: PascalCase (`User`, `FoodItem`)
- **枚举**: PascalCase (`MealType`, `GoalType`)

### 3. 禁止事项

```typescript
// ❌ 禁止拼音命名
const yonghu = ref()        // 应为 user
const huoquShuju = () => {} // 应为 fetchData

// ❌ 禁止无意义缩写
const usr = ref()           // 应为 user
const cal = computed()      // 应为 calories
```

---

## 二、注释规范 (Comment Guidelines)

### 1. 语言要求

- **所有注释必须使用简体中文**
- 注释解释 "为什么 (Why)"，而非 "是什么 (What)"

### 2. 示例

```typescript
// ✅ 正确: 解释原因
// 使用 Math.round 避免浮点数精度问题导致的显示异常
const displayCalories = Math.round(calories * portion / 100)

// ❌ 错误: 描述代码做了什么
// 计算卡路里
const displayCalories = Math.round(calories * portion / 100)
```

### 3. 文档注释 (JSDoc)

```typescript
/**
 * 计算用户的基础代谢率 (BMR)
 * 使用 Mifflin-St Jeor 公式
 *
 * @param weight - 体重 (kg)
 * @param height - 身高 (cm)
 * @param age - 年龄 (岁)
 * @param gender - 性别
 * @returns 基础代谢率 (kcal/day)
 */
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female'
): number {
  // 公式详见: https://en.wikipedia.org/wiki/Basal_metabolic_rate
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5
  }
  return 10 * weight + 6.25 * height - 5 * age - 161
}
```

---

## 三、Vue 组件规范 (Vue Component Patterns)

### 1. 使用 Composition API + `<script setup>`

```vue
<script setup lang="ts">
// 1. 导入
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { FoodItem } from '@/types/food'

// 2. Props & Emits (类型化)
const props = defineProps<{
  item: FoodItem
  editable?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', item: FoodItem): void
  (e: 'delete', id: string): void
}>()

// 3. 响应式状态
const loading = ref(false)
const portion = ref(100)

// 4. 计算属性
const displayCalories = computed(() => {
  return Math.round(props.item.calories * portion.value / 100)
})

// 5. 方法
const handleSelect = () => {
  emit('select', props.item)
}

// 6. 生命周期
onMounted(() => {
  // 初始化
})
</script>

<template>
  <div class="food-card">
    <!-- 模板内容 -->
  </div>
</template>

<style scoped>
/* 仅在必要时使用 */
</style>
```

### 2. 组件职责单一

- 每个组件只做一件事
- 页面组件 (Pages) 负责布局和数据获取
- UI 组件 (Components) 负责展示和交互

---

## 四、TypeScript 规范 (TypeScript Patterns)

### 1. 显式类型定义

```typescript
// ✅ 正确
const user = ref<User | null>(null)
const items = ref<FoodItem[]>([])
const loading = ref<boolean>(false)

// ❌ 错误: 隐式类型
const user = ref()
const items = ref([])
```

### 2. 类型定义位置

```typescript
// types/food.ts - 集中定义
export interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

// 组件中使用
import type { FoodItem } from '@/types/food'
```

### 3. 禁止 `any`

```typescript
// ❌ 禁止
function process(data: any) {}

// ✅ 正确
function process(data: unknown) {
  if (isFoodItem(data)) {
    // 类型守卫后使用
  }
}
```

---

## 五、样式规范 (Styling Guidelines)

### 1. Tailwind CSS 优先

```vue
<template>
  <!-- ✅ 正确: 使用 Tailwind -->
  <div class="flex items-center gap-4 p-4 bg-white rounded-xl shadow-card">
    <span class="text-sage-600 font-semibold text-lg">{{ title }}</span>
  </div>

  <!-- ❌ 错误: 内联样式 -->
  <div style="display: flex; padding: 16px;">
    <span style="color: green;">{{ title }}</span>
  </div>
</template>
```

### 2. 响应式设计

```vue
<template>
  <!-- 移动优先，必要时添加大屏断点 -->
  <div class="text-sm md:text-base lg:text-lg">
    内容
  </div>
</template>
```

### 3. 主题颜色

使用项目定义的 sage 色系：

```
sage-50, sage-100, sage-200, sage-400, sage-500, sage-600, sage-900
```

---

## 六、错误处理 (Error Handling)

### 1. 使用类型化异常

```typescript
// ✅ 正确: 明确的错误处理
try {
  const result = await geminiService.recognizeFood(imageData)
  return result
} catch (error) {
  if (error instanceof ApiError) {
    // 处理 API 错误
    console.error('API 调用失败:', error.message)
  } else if (error instanceof NetworkError) {
    // 处理网络错误
    console.error('网络连接失败')
  }
  throw error
}

// ❌ 错误: 空的 catch 块
try {
  await someOperation()
} catch (e) {
  // 什么都不做
}
```

### 2. 用户友好提示

```typescript
// 面向用户的错误消息使用中文
const errorMessages = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  API_ERROR: '服务暂时不可用，请稍后重试',
  INVALID_IMAGE: '无法识别图片，请重新拍摄'
}
```

---

## 七、性能规范 (Performance Guidelines)

### 1. 懒加载路由

```typescript
// router/index.ts
{
  path: '/diary',
  component: () => import('@/pages/Diary.vue')
}
```

### 2. 计算属性代替方法

```typescript
// ✅ 正确: 使用计算属性 (有缓存)
const totalCalories = computed(() => {
  return entries.value.reduce((sum, e) => sum + e.calories, 0)
})

// ❌ 错误: 模板中调用方法 (每次渲染都执行)
const getTotalCalories = () => {
  return entries.value.reduce((sum, e) => sum + e.calories, 0)
}
```

### 3. 避免不必要的响应式

```typescript
// 对于不需要响应式的大数据，使用 shallowRef
const largeData = shallowRef<LargeDataType>(data)
```

---

## 八、导入顺序 (Import Order)

```typescript
// 1. Vue 核心
import { ref, computed, onMounted } from 'vue'

// 2. Vue 生态 (Router, Pinia)
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 3. 第三方库
import dayjs from 'dayjs'

// 4. 项目内部模块
import { geminiService } from '@/services/gemini'
import { formatCalories } from '@/utils/format'

// 5. 类型导入 (使用 type 关键字)
import type { FoodItem } from '@/types/food'
import type { User } from '@/types/user'

// 6. 组件
import FoodCard from '@/components/food/FoodCard.vue'
```

---

**文档维护者**: Architect
**最后更新**: 2026-02-03
