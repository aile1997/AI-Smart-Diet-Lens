import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { randomBytes } from 'crypto'

declare global {
  namespace Express {
    interface Request {
      id: string
    }
  }
}

/**
 * 请求 ID 中间件
 * 为每个请求生成唯一 ID，便于日志追踪和调试
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestIdMiddleware.name)

  use(req: Request, res: Response, next: NextFunction) {
    // 生成请求 ID (使用 Node.js 内置 crypto，无需额外依赖)
    const id = randomBytes(4).toString('hex')
    req.id = id

    // 将请求 ID 添加到响应头
    res.setHeader('X-Request-ID', id)

    // 记录请求信息
    const startTime = Date.now()

    // 监听响应完成事件
    res.on('finish', () => {
      const duration = Date.now() - startTime
      this.logger.log(
        `[${id}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`,
      )
    })

    next()
  }
}
