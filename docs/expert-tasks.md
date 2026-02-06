# 前端测试专家任务清单

> **创建时间**: 2026-02-06 **当前状态**: 149/296 测试通过 (50.3%)

---

## 一、已跳过的测试（需专家解决）

### 1. secure-storage.spec.ts (22 tests skipped)

**问题**: UniApp 全局对象 (`uni`) 在 Node.js 测试环境中无法完全模拟

**现象**:

```
SecureStorage setItem error: DOMException [InvalidCharacterError]: Invalid character
  at btoa (node:buffer:1302:11)
```

**根本原因**:

- `btoa()` 函数无法处理包含中文或 Unicode 字符的字符串
- `uni.setStorageSync` mock 不完整

**建议解决方案**:

1. 配置 Vitest 使用 `jsdom` 环境
2. 或重写 `secure-storage.ts` 使用纯 Node.js 兼容的加密方式
3. 或在测试中使用 `vi.stubGlobal('uni', ...)` 完整模拟 uni 对象

**相关文件**:

- `frontend/packages/core/tests/utils/secure-storage.spec.ts`
- `frontend/packages/core/src/utils/secure-storage.ts`

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

## 二、源代码问题

### sanitize.ts 语法错误（已修复）

**问题**: 第61-71行缺少回调函数声明

**原代码**:

```typescript
const cleanAttrs = attrs.replace(
  /(\w+)=["']([^"']*)["']/g,
    if (ALLOWED_ATTRS.includes(attr.toLowerCase()) && ...) {
      return `${attr}="${value}"`
    }
    return ''
)
```

**已修复**:

```typescript
const cleanAttrs = attrs.replace(
  /(\w+)=["']([^"']*)["']/g,
  (match, attr, value) => {
    if (ALLOWED_ATTRS.includes(attr.toLowerCase()) && ...) {
      return `${attr}="${value}"`
    }
    return ''
  }
)
```

---

## 三、测试覆盖率目标

| 模块         | 当前覆盖 | 目标 | 状态                       |
| :----------- | :------- | :--- | :------------------------- |
| Utils        | ~80%     | 90%  | ⚠️ sanitize, logger 待修复 |
| API Services | ~70%     | 80%  | ✅ 基本完成                |
| Composables  | ~0%      | 80%  | ❌ 需要重写                |
| Stores       | ~0%      | 80%  | ❌ 需要重写                |
| Components   | 0%       | 60%  | ⏳ 待配置 jsdom 环境       |

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

## 五、优先级

| 优先级 | 任务                         | 预计工时 |
| :----- | :--------------------------- | :------- |
| **P0** | 配置 jsdom 测试环境          | 2h       |
| **P0** | 修复 logger 模块副作用       | 1h       |
| **P1** | 重写 sanitize 使用 DOMPurify | 3h       |
| **P1** | 重写 Composables 测试        | 4h       |
| **P2** | 实现 Pinia Store 测试        | 3h       |
| **P2** | 修复 secure-storage 测试     | 2h       |

---

**文档维护**: Claude Code **最后更新**: 2026-02-06
