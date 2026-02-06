# AI Smart Diet Lens - 共享类型定义

> 前后端共用的 TypeScript 接口类型定义

## 导出内容

- API 请求/响应类型
- 通用数据模型类型
- 枚举类型

## 使用方式

### 后端使用

```typescript
import { BootstrapConfig, LoginResponse, OnboardingDto } from '@diet-lens/types'
```

### 前端使用

```typescript
import { BootstrapConfig, LoginResponse, OnboardingDto } from '@diet-lens/types'
```

## 发布说明

修改类型后需要重新构建：
```bash
pnpm --filter @diet-lens/types build
```
