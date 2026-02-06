import { createParamDecorator, ExecutionContext } from '@nestjs/common'

/**
 * 当前用户装饰器
 *
 * 使用方法：
 * - @CurrentUser() user: UserPayload
 * - @CurrentUser('id') userId: string
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request['user']

    return data ? user?.[data] : user
  },
)

/**
 * JWT Payload 类型
 */
export interface UserPayload {
  sub: string
  phone: string
  iat?: number
  exp?: number
}
