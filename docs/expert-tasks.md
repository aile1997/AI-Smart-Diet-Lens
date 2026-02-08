# 前端测试专家任务清单

> **创建时间**: 2026-02-06
> **当前状态**: 369/382 测试通过 (96.6%)
> **最后更新**: 2026-02-07

---

## 重要更新 ✅ (2026-02-07)

### 架构统一完成

**问题**: monorepo 中 Core 包无法正确读取 UI 层的环境变量，导致 baseURL 配置错误。

**解决方案**:
1. 修改 `initApi()` 接受 `baseURL` 参数（依赖注入）
2. UI 层的 `main.ts` 显式传入 `import.meta.env.VITE_API_BASE_URL`
3. 清理旧的 IHttp 适配器系统

**删除的文件**:
- ❌ `frontend/packages/ui/src/composables/useAuth.ts` (旧包装)
- ❌ `frontend/packages/ui/src/adapters/` (旧适配器)
- ❌ `frontend/packages/core/src/composables/useAuth.ts` (旧 IHttp 版本)

**保留的文件**:
- ✅ `frontend/packages/core/src/adapters/IHttp.ts` (接口定义，供未来扩展)

**新增测试**:
- ✅ `frontend/packages/core/tests/api/integration.spec.ts` (URL 拼接集成测试)

**当前架构**:
```
UI Layer (UniApp)
  └─ main.ts: initApi({ baseURL: import.meta.env.VITE_API_BASE_URL })
         ↓
Core Layer
  ├─ api/services/index.ts: initApi() 接受 baseURL 参数
  ├─ api/client.ts: ApiClient (统一 HTTP 入口)
  ├─ api/services/*: AuthService, DiaryService 等
  └─ stores/auth.ts: useAuthStore (Pinia)
```

---

---

## 测试修复成功模式 🎯

### Composable 测试标准模式

使用 `vi.hoisted()` + `vi.mock()` 解决模块导入问题：

```typescript
// 1. 使用 vi.hoisted 创建 mock 函数（必须在模块导入前执行）
const mockGetSummary = vi.hoisted(() => vi.fn())

// 2. Mock API 模块
vi.mock('../../src/api', () => ({
  getApi: vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  })),
  initApi: vi.fn(),
}))

// 3. Mock 具体的 Service 类
vi.mock('../../src/api/services/diary.service', () => ({
  DiaryService: class {
    constructor() {}
    getSummary = mockGetSummary
  },
}))

// 4. 导入被测试模块
import { useDiary } from '../../src/composables/useDiary'

describe('useDiary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })
  // ... 测试用例
})
```

### 已修复的 Composables

| 模块 | 测试数量 | 状态 |
|:-----|:---------|:-----|
| useDashboard | 10/10 | ✅ |
| useDiary | 21/21 | ✅ |
| useAnalysis | 19/19 | ✅ |
| **合计** | **50/50** | **100%** |

---

## 一、已完成修复 ✅

### 1. secure-storage.spec.ts ✅ (22/22 测试通过)

**问题**: `btoa()` 函数无法处理包含中文或 Unicode 字符的字符串

**解决方案**: 重写 `secure-storage.ts` 使用 `TextEncoder`/`TextDecoder` 实现 UTF-8 兼容的 Base64 编码

```typescript
function base64Encode(str: string): string {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  let binary = ''
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i])
  }
  return btoa(binary)
}

function base64Decode(base64: string): string {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  const decoder = new TextDecoder()
  return decoder.decode(bytes)
}
```

---

### 2. sanitize.spec.ts ✅ (30/30 测试通过)

**问题**: 原实现使用简单正则表达式，无法满足 XSS 防护要求

**解决方案**: 集成 `DOMPurify` 库，移除 JSDOM 依赖以兼容 UniApp 环境

```typescript
import DOMPurify from 'dompurify'

export function sanitizeHTML(html: string, customTags?: string[], customAttr?: string[]): string {
  if (!html || typeof html !== 'string') return ''
  const config = createSanitizeConfig(customTags, customAttr)
  const clean = DOMPurify.sanitize(html, config)
  return clean as unknown as string
}
```

**关键修复**:
- 移除 `JSDOM` import（UniApp 浏览器环境不支持）
- DOMPurify 自动检测全局 window 对象
- 使用 `as unknown as string` 处理 `TrustedHTML` 类型转换

---

### 3. Vitest 测试环境配置 ✅

**完成**: 创建 `tests/setup.ts` 提供全局 mock

```typescript
// 全局 uni 对象 mock
const mockUni = {
  setStorageSync: vi.fn((key: string, value: string) => {
    mockStorage[key] = value
    return true
  }),
  getStorageSync: vi.fn((key: string) => mockStorage[key] || ''),
  // ... 其他 uni API
}

global.uni = mockUni as any
global.wx = mockUni as any
```

---

## 二、部分修复 ⚠️

### 4. logger.spec.ts (27/32 测试通过，5 个失败)

**已修复**: 模块副作用问题 - 添加测试环境检测

```typescript
// 防止测试环境自动初始化
if (AUTO_INIT && typeof window !== 'undefined') {
  if (typeof process === 'undefined' || process.env?.NODE_ENV !== 'test') {
    initLoggerFromEnv()
  }
}
```

**剩余问题**: 5 个测试失败由于模块绑定时机问题，需要重构为依赖注入模式

---

## 三、待修复任务

### 5. useAuth.spec.ts (9 tests skipped)

**问题**: Pinia Store mock 配置问题

**建议解决方案**: 使用 ES6 import + vi.mock() 替代 vi.doMock()

---

### 6. useDiary.spec.ts ✅ (21/21 测试通过)
### 7. useAnalysis.spec.ts ✅ (19/19 测试通过)
### 8. useDashboard.spec.ts ✅ (10/10 测试通过)

**已修复**: 使用 `vi.hoisted()` + `vi.mock()` 模式

**解决方案示例**:

```typescript
// 使用 ES6 import + vi.mock()
vi.mock('../../src/api', () => ({
  getApi: vi.fn(),
  DiaryService: class { ... }
}))

import { useDashboard } from '../../src/composables/useDashboard'
```

---

### 2. logger.spec.ts (33 tests skipped)

**问题**: 模块在导入时立即执行 `initLoggerFromEnv()`，导致测试 mock 失效

**现象**:

```typescript
// 测试中
mockLog = vi.spyOn(console, "log").mockImplementation(() => {});
initLogger("debug");
logger.debug("test");
// expected mockLog.toHaveBeenCalled() - 实际: Number of calls: 0
```

**根本原因**:

- `logger.ts` 文件末尾有 `initLoggerFromEnv()` 在模块加载时执行
- 这发生在测试的 `beforeEach` 设置 mock 之前
- 导致 logger 内部的 `currentLogLevel` 已经被设置

**建议解决方案**:

1. **重构 logger 模块**：移除模块加载时的副作用
   ```typescript
   // 移除末尾的 initLoggerFromEnv()
   // 改为按需初始化，或提供明确的测试入口
   ```
2. **使用 vi.mock() 工厂函数**
   ```typescript
   vi.mock('../../src/utils/logger', () => ({
     logger: { ... },
     initLogger: vi.fn(),
     // ...
   }))
   ```

**相关文件**:

- `frontend/packages/core/tests/utils/logger.spec.ts`
- `frontend/packages/core/src/utils/logger.ts`

---

### 3. sanitize.spec.ts (30 tests skipped)

**问题**: `sanitizeHTML()` 函数实现过于简单，无法满足安全要求

**现象**:

```typescript
// 输入: <div style="background: url('javascript:alert(1)')">内容</div>
// 期望: <div>内容</div> (移除 style 属性)
// 实际: <div style="background: url("alert(1)')">内容</div> (仍包含 style)
```

**根本原因**:

- 当前实现使用简单的正则表达式替换
- 无法正确处理嵌套标签、属性值中的特殊字符
- 没有移除 `<script>` 标签内的内容

**建议解决方案**:

1. **使用成熟的库**: 集成 `DOMPurify` 或 `sanitize-html`
   ```bash
   pnpm add dompurify
   pnpm add -D @types/dompurify
   ```
2. **或完整重写**: 实现正确的 HTML 解析和清理逻辑
   - 使用 HTML parser 而非正则表达式
   - 维护完整的标签和属性白名单
   - 处理 URL 协议、CSS 表达式、HTML 注释等

**相关文件**:

- `frontend/packages/core/tests/utils/sanitize.spec.ts`
- `frontend/packages/core/src/utils/sanitize.ts`

---

### 4. useAuth.spec.ts (9 tests skipped)

**问题**: Pinia Store mock 配置问题

**现象**:

```typescript
// 测试中
vi.doMock("../../src/api", () => ({
  AuthService: class {
    sendCode = mockSendCode;
  },
}));
// 但 useAuthStore 内部仍然使用真实的 AuthService
```

**根本原因**:

- `vi.doMock()` 在 `beforeEach` 中调用，但模块已经加载
- Pinia store 的 action 内部引用了真实的 API 模块
- `require()` 模式无法正确工作

**建议解决方案**:

1. **重写测试为直接测试 Store**

   ```typescript
   import { createPinia, setActivePinia } from "pinia";
   import { useAuthStore } from "@/stores/auth";

   // 在测试中 mock API 调用
   const mockSendCode = vi.fn();
   // 在 store action 中使用 mock
   ```

**相关文件**:

- `frontend/packages/core/tests/composables/useAuth.spec.ts`
- `frontend/packages/core/src/stores/auth.ts`

---

### 5. useUser.spec.ts (4 tests skipped)

**问题**: 与 useAuth 相同的 Pinia Store mock 问题

**建议解决方案**: 参考上面的 useAuth 解决方案

---

### 6. useDiary.spec.ts (21 tests skipped)

### 7. useAnalysis.spec.ts (23 tests skipped)

### 8. useDashboard.spec.ts (10 tests skipped)

**问题**: Composable 测试的 `require()` 模式不兼容

**现象**:

```typescript
vi.doMock('../../src/api', () => ({ ... }))
useDashboard = () => require('../../src/composables/useDashboard').useDashboard()
// Error: Cannot find module '../../src/composables/useDashboard'
```

**根本原因**:

- Vitest 的 `vi.doMock()` 不支持 CommonJS 的 `require()`
- 模块导入时序问题

**建议解决方案**:

1. **使用 ES6 import + vi.mock()**

   ```typescript
   // 在文件顶部
   vi.mock('../../src/api', () => ({
     getApi: vi.fn(),
     DiaryService: class { ... }
   }))

   import { useDashboard } from '../../src/composables/useDashboard'
   ```

2. **或使用 vi.hoisted()**

   ```typescript
   const mockGetSummary = vi.hoisted(() => vi.fn());

   vi.mock("../../src/api", () => ({
     DashboardService: class {
       getSummary = mockGetSummary;
     },
   }));
   ```

**相关文件**:

- `frontend/packages/core/tests/composables/useDiary.spec.ts`
- `frontend/packages/core/tests/composables/useAnalysis.spec.ts`
- `frontend/packages/core/tests/composables/useDashboard.spec.ts`

---

## 四、测试覆盖率目标

| 模块         | 当前覆盖 | 目标 | 状态                              |
| :----------- | :------- | :--- | :-------------------------------- |
| Utils        | ~95%     | 90%  | ✅ sanitize, secure-storage 已修复 |
| API Services | ~100%    | 80%  | ✅ 已完成所有服务测试              |
| Composables  | ~10%     | 80%  | ⚠️ 仅 useNutrition，其他需适配器 |
| Stores       | ~20%     | 80%  | ⚠️ 仅 nutrition store             |
| Components   | 0%       | 60%  | ⏳ 待配置 jsdom 环境              |

### 新增测试 (2026-02-07)

**API 服务测试** (新增 82 个测试):
- ✅ `format.spec.ts` - 16 tests
- ✅ `user.service.spec.ts` - 8 tests
- ✅ `diary.service.spec.ts` - 10 tests
- ✅ `upload.service.spec.ts` - 4 tests
- ✅ `gamification.service.spec.ts` - 3 tests
- ✅ `dashboard.service.spec.ts` - 4 tests
- ✅ `recipe.service.spec.ts` - 3 tests
- ✅ `favorites.service.spec.ts` - 9 tests
- ✅ `notifications.service.spec.ts` - 8 tests
- ✅ `chat.service.spec.ts` - 6 tests
- ✅ `community.service.spec.ts` - 11 tests
- ✅ `integration.spec.ts` - 5 tests (URL 拼接验证)

**修复完成**:
- ✅ `sanitize.spec.ts` - 30 tests (使用 DOMPurify 重写后全部通过)
- ✅ `dashboard.service.spec.ts` - 4 tests
- ✅ `recipe.service.spec.ts` - 3 tests
- ✅ `favorites.service.spec.ts` - 9 tests
- ✅ `notifications.service.spec.ts` - 8 tests
- ✅ `chat.service.spec.ts` - 6 tests
- ✅ `community.service.spec.ts` - 11 tests

---

## 四、环境配置建议

### vitest.config.ts 补充

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // 或 'node' with global mocks
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "tests/", "**/*.spec.ts", "**/*.d.ts"],
    },
  },
});
```

### tests/setup.ts

```typescript
import { vi } from "vitest";

// 全局 uni mock
vi.stubGlobal("uni", {
  getStorageSync: vi.fn(),
  setStorageSync: vi.fn(),
  removeStorageSync: vi.fn(),
  request: vi.fn(),
  uploadFile: vi.fn(),
  downloadFile: vi.fn(),
  showToast: vi.fn(),
  hideToast: vi.fn(),
  navigateTo: vi.fn(),
  redirectTo: vi.fn(),
  switchTab: vi.fn(),
  navigateBack: vi.fn(),
});
```

---

## 五、优先级（最终更新）

| 优先级 | 任务                         | 状态     |
|:-----|:---------------------------|:-------|
| **P0** | 配置 Vitest 测试环境 (jsdom)   | ✅ 完成   |
| **P0** | 修复 secure-storage UTF-8 编码 | ✅ 完成   |
| **P0** | 重写 sanitize 使用 DOMPurify   | ✅ 完成   |
| **P1** | 修复 useAnalysis 测试         | ✅ 完成 (19/19) |
| **P1** | 重写 Composables 测试          | ✅ 完成 (50/50) |
| **P2** | 修复 logger 模块测试           | ⚠️ 部分 (19/24) |
| **P2** | 实现 Pinia Store 测试          | ⚠️ 部分 (7/13) |

---

## 2026-02-07 更新记录

### 完成工作

1. **useAnalysis.spec.ts** ✅
   - 修复 `weekOverWeekChange` 计算问题
   - 使用 `mockImplementation` 精确控制 mock 返回值
   - 结果：19/19 测试通过

2. **useAuth.spec.ts** ⚠️
   - 重写测试使用 `vi.hoisted()` + `vi.mock()` 模式
   - Mock AuthService、tokenStorage、logger、throttle
   - 结果：4/9 测试通过，5 个失败需要进一步调试

3. **useUser.spec.ts** ⚠️
   - 重写测试匹配实际 store API
   - Mock UserService 和 auth store
   - 结果：4/7 测试通过，3 个失败需要进一步调试

### 当前测试状态

- **总通过率**: 96.6% (369/382)
- **失败测试**: 13 个
  - logger.spec.ts: 5 个（console mock 问题）
  - useAuth.spec.ts: 5 个（store 行为问题）
  - useUser.spec.ts: 3 个（API 调用问题）

### 剩余工作

1. **logger.spec.ts** - 需要解决 `globalThis.console` mock 问题
2. **useAuth.spec.ts** - 需要调试 store action 行为
3. **useUser.spec.ts** - 需要修复 API 调用 mock

---

## 六、技术决策记录

### DOMPurify UniApp 兼容性

**问题**: JSDOM 在 UniApp 浏览器环境中无法导入

```
Error: The requested module does not provide an export named 'JSDOM'
```

**解决方案**:
- 移除 JSDOM import
- DOMPurify 自动检测并使用浏览器全局 window 对象
- 在 Node.js 测试环境中，Vitest 自动提供 jsdom 全局 window

---

### UTF-8 Base64 编码

**问题**: `btoa()` 无法处理中文等 Unicode 字符

**解决方案**:
```typescript
// 使用 TextEncoder 将字符串转换为 UTF-8 字节数组
// 然后再进行 Base64 编码
const encoder = new TextEncoder()
const data = encoder.encode(str)
// ... 转换为 binary 并调用 btoa()
```

---

### API 架构统一

**问题**: monorepo 中存在三套并行的 API 请求系统，导致 URL 拼接混乱

**解决方案**: 统一使用 ApiClient，移除旧的 IHttp 适配器系统

```typescript
// 修复前: Core 层尝试读取环境变量（失败）
baseURL: import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000/api'

// 修复后: 依赖注入，由调用方传入
export function initApi(
  tokenGetter: () => string | null,
  options?: { baseURL?: string; ... }
): ApiClient {
  apiInstance = new ApiClient({
    baseURL: options?.baseURL || import.meta.env?.VITE_API_BASE_URL || '...',
    ...
  })
}

// UI 层显式传入环境变量
initApi(
  () => uni.getStorageSync('token'),
  { baseURL: import.meta.env.VITE_API_BASE_URL }
)
```

**删除的文件**:
- `frontend/packages/ui/src/composables/useAuth.ts` (旧包装)
- `frontend/packages/ui/src/adapters/` (旧适配器)
- `frontend/packages/core/src/composables/useAuth.ts` (旧 IHttp 版本)

**测试新增**:
- `tests/api/integration.spec.ts` - URL 拼接集成测试 (5 tests)

---

**文档维护**: Claude Code **最后更新**: 2026-02-07
