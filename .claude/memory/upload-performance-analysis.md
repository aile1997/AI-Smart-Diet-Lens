# 文件上传性能分析与优化方案

> **文档目的**: 分析后端直接上传的性能影响，提供优化建议
> **创建时间**: 2026-02-08
> **状态**: 当前实现适用于 MVP 阶段

---

## 一、当前实现分析

### 1.1 上传流程

```
前端 → Base64 编码 → JSON POST → 后端 → 腾讯云 COS
         (+33%)                    (使用 SDK)
```

### 1.2 性能特征

| 指标 | 数值 | 说明 |
|:-----|:-----|:-----|
| **单张图片大小** | 350KB - 2MB | 手机拍摄的食物照片 |
| **Base64 编码后** | 470KB - 2.7MB | 增加约 33% |
| **后端内存占用** | 350KB - 2MB | Buffer 大小（编码前） |
| **JSON 请求体** | 470KB - 2.7MB | 包含 Base64 字符串 |

### 1.3 现有保护机制

```typescript
// 1. 文件大小限制
MAX_FILE_SIZE = 10MB

// 2. 速率限制
@Throttle({ short: { limit: 10, ttl: 60000 } })  // 10次/分钟

// 3. 请求体大小限制（Express）
app.use(express.json({ limit: '10mb' }))
```

---

## 二、性能影响评估

### 2.1 单用户场景

```
单次上传内存占用: ~2MB（包含请求解析 + Buffer）
单次上传时间: ~500ms - 2s（取决于网络和图片大小）
```

**结论**: 单用户场景下性能完全可接受 ✅

### 2.2 并发场景

| 并发用户数 | 内存占用 | 网络带宽 | 评估 |
|:----------|:---------|:---------|:-----|
| 10 | ~20MB | ~5MB/s | 可接受 ✅ |
| 50 | ~100MB | ~25MB/s | 可接受 ✅ |
| 100 | ~200MB | ~50MB/s | 需监控 ⚠️ |
| 500+ | ~1GB+ | ~250MB/s | 需优化 ❌ |

### 2.3 瓶颈分析

1. **内存**: Base64 编码增加 33%，Node.js V8 垃圾回收会处理
2. **带宽**: JSON 传输比二进制多 33%，但对小图片影响有限
3. **CPU**: Base64 编码/解码消耗，但现代 CPU 处理很快

---

## 三、优化方案

### 3.1 短期优化（保持现有方案）

#### A. 调整速率限制

```typescript
// 根据业务需求调整
@Throttle({ short: { limit: 5, ttl: 60000 } })  // 降低到 5次/分钟
```

#### B. 添加图片压缩

```typescript
// 前端压缩后再上传
import { compressImage } from '@/utils/image'

const compressed = await compressImage(file, {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.85
})
```

#### C. 分级存储

```typescript
// 小图片 Base64，大图片使用 multipart
if (fileSize < 500KB) {
  // 使用 Base64
} else {
  // 使用 multipart/form-data
}
```

### 3.2 长期优化（multipart/form-data）

#### 优势

- 无 Base64 开销，减少 33% 数据量
- 支持流式上传，内存占用更小
- 支持进度回调，用户体验更好

#### 实现示例

**前端**:
```typescript
const formData = new FormData()
formData.append('file', file, 'food.jpg')

await fetch('/api/upload/multipart', {
  method: 'POST',
  body: formData,
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

**后端**:
```typescript
@Post('multipart')
@UseInterceptors(FileInterceptor('file'))
async uploadMultipart(@UploadedFile() file: Express.Multer.File) {
  // file.buffer 直接上传到 COS，无需 Base64 转换
  return this.uploadService.uploadFileToCOS(file.buffer, fileKey)
}
```

#### 需要的改动

1. 安装 `@nestjs/platform-express` 和 `multer`
2. 创建新的 `/api/upload/multipart` 端点
3. 前端添加条件判断，优先使用 multipart

---

## 四、建议

### 4.1 MVP 阶段（当前）

✅ **保持现有 Base64 方案**
- 理由: 实现简单，性能可接受
- 适用: 用户量 < 1000，日活 < 100

### 4.2 增长阶段

⚠️ **实施短期优化**
- 添加图片压缩
- 调整速率限制
- 监控内存和带宽使用

### 4.3 规模化阶段

❌ **切换到 multipart 方案**
- 理由: 降低服务器成本
- 适用: 日活 > 1000

---

## 五、监控指标

建议添加以下监控：

```typescript
// 上传服务监控
{
  uploadCount: number,        // 上传次数
  avgUploadSize: number,      // 平均文件大小
  avgUploadTime: number,      // 平均上传时间
  errorRate: number,          // 错误率
  memoryUsage: number,        // 内存占用
  bandwidthUsage: number      // 带宽使用
}
```

---

## 六、总结

| 方案 | 实现复杂度 | 性能 | 推荐阶段 |
|:-----|:----------|:-----|:---------|
| Base64 (当前) | 低 | 中 | MVP ✅ |
| Base64 + 压缩 | 中 | 中+ | 增长期 ⚠️ |
| multipart | 高 | 高 | 规模化 ❌ |

**当前结论**: 现有实现适用于 MVP 阶段，无需立即优化。建议：
1. 上线后监控实际使用情况
2. 根据数据决定是否需要优化
3. 保留预签名 URL 方案代码，便于日后切换

---

**维护者**: Architect
**最后更新**: 2026-02-08
