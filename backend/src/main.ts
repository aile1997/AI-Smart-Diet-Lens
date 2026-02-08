import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './common/global-exception.filter'
import { RequestIdMiddleware } from './common/middleware/request-id.middleware'
import { Request, Response, NextFunction } from 'express'
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 增加 JSON 请求体大小限制（支持 Base64 图片上传）
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ limit: '10mb', extended: true }))

  // 全局日志中间件 - 记录所有请求
  app.use((req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${req.method} ${req.url}`)
    console.log(`[${timestamp}] Headers:`, JSON.stringify(req.headers, null, 2))
    next()
  })

  // 请求 ID 中间件 (必须在其他中间件之前)
  const requestIdMiddleware = new RequestIdMiddleware()
  app.use((req: Request, res: Response, next: NextFunction) => requestIdMiddleware.use(req, res, next))

  // Swagger API 文档配置
  const config = new DocumentBuilder()
    .setTitle('AI Smart Diet Lens API')
    .setDescription('智能营养追踪与膳食规划应用 API 文档')
    .setVersion('2.2.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: '请输入 JWT Token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('system', '系统与引导')
    .addTag('user', '用户与健康')
    .addTag('dashboard', '仪表盘')
    .addTag('auth', '认证')
    .addTag('ai', 'AI 识别')
    .addTag('ai-chat', 'AI 对话')
    .addTag('food', '食物库')
    .addTag('diary', '饮食日记')
    .addTag('gamification', '游戏化')
    .addTag('recipes', '智能内容')
    .addTag('community', '社区')
    .addTag('favorites', '收藏')
    .addTag('notifications', '消息通知')
    .addTag('upload', '文件上传')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document)

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  // 全局异常过滤器
  app.useGlobalFilters(new GlobalExceptionFilter())

  // CORS 配置
  // 开发环境允许多个前端端口，生产环境应配置具体域名
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : [
        'http://localhost:5173', // Vite 默认端口
        'http://localhost:3001', // 备用前端端口
        'http://localhost:8080', // 静态服务器端口
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:8080',
        'http://192.168.10.29:5173', // 局域网访问（开发）
        'http://192.168.10.29:8080', // 局域网访问（打包测试）
      ]

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) => {
      // 允许没有 origin 的请求（如移动应用、Postman）
      if (!origin) return callback(null, true)

      // 开发环境允许所有 localhost 和局域网 IP
      if (
        allowedOrigins.includes('*') ||
        origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1') ||
        origin.startsWith('http://192.168.') // 允许所有局域网 IP
      ) {
        return callback(null, true)
      }

      // 检查是否在允许列表中
      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS: 来源 ${origin} 不被允许`), false)
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  })

  // 全局前缀
  app.setGlobalPrefix('api')

  const port = process.env.PORT ?? 3000
  // 监听所有网络接口，允许局域网访问
  await app.listen(port, '0.0.0.0')
  console.log(`🚀 服务已启动: http://localhost:${port}/api`)
  console.log(`📱 局域网访问: http://192.168.10.29:${port}/api`)
  console.log(`📚 API 文档: http://localhost:${port}/api-docs`)
}

bootstrap()
