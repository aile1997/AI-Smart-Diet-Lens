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

    // 添加日志，调试 userId 传递
    console.log('[CurrentUser] 被调用')
    console.log('[CurrentUser] request.user 存在?', !!user)
    console.log('[CurrentUser] user.sub:', user?.sub)
    console.log('[CurrentUser] user.email:', user?.email)
    console.log('[CurrentUser] 请求数据:', data ? `提取字段: ${data}, 值: ${user?.[data]}` : '返回完整 user 对象')

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
