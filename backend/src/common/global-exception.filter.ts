import { Catch, ArgumentsHost, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import { Response } from 'express'
import { BusinessException } from './exceptions'
import { ApiResponse } from './api-response'

/**
 * 全局异常过滤器
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    // 处理业务异常
    if (exception instanceof BusinessException) {
      this.logger.warn(`[${exception.code}] ${request.url} - ${exception.message}`)
      return response.status(exception.statusCode).json(
        new ApiResponse({
          success: false,
          code: exception.code,
          message: exception.message,
        }),
      )
    }

    // 处理 HTTP 异常
    if (exception instanceof Error) {
      this.logger.error(`${request.url} - ${exception.message}`, exception.stack)
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        new ApiResponse({
          success: false,
          code: 'INTERNAL_ERROR',
          message: '服务器内部错误',
        }),
      )
    }

    // 未知异常
    this.logger.error(`Unknown exception: ${exception}`)
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      new ApiResponse({
        success: false,
        code: 'INTERNAL_ERROR',
        message: '未知错误',
      }),
    )
  }
}
