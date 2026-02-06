import { Catch, ArgumentsHost, ExceptionFilter, HttpStatus, Logger, HttpException } from '@nestjs/common'
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

    // 处理 HTTP 异常 (包括 UnauthorizedException 等)
    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      const message = typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || exception.message

      this.logger.warn(`${request.url} - ${status} ${message}`)

      // 将 HTTP 异常转换为统一格式
      const code = status === 401 ? 'UNAUTHORIZED' :
                   status === 403 ? 'FORBIDDEN' :
                   status === 404 ? 'NOT_FOUND' :
                   status === 429 ? 'RATE_LIMIT' :
                   'HTTP_ERROR'

      return response.status(status).json(
        new ApiResponse({
          success: false,
          code,
          message: Array.isArray(message) ? message[0] : message,
        }),
      )
    }

    // 处理普通 Error
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
