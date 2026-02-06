import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './common/global-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

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
    .addTag('food', '食物库')
    .addTag('diary', '饮食日记')
    .addTag('gamification', '游戏化')
    .addTag('recipes', '智能内容')
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
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  // 全局前缀
  app.setGlobalPrefix('api')

  const port = process.env.PORT ?? 3000
  await app.listen(port)
  console.log(`🚀 服务已启动: http://localhost:${port}/api`)
  console.log(`📚 API 文档: http://localhost:${port}/api/docs`)
}

bootstrap()
