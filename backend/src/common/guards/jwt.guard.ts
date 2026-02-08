import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

/**
 * JWT 认证守卫
 */
@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromHeader(request)

    console.log('[JwtGuard] 开始验证')
    console.log('[JwtGuard] Token 存在?', !!token)
    console.log('[JwtGuard] Token 长度:', token?.length)

    if (!token) {
      console.error('[JwtGuard] 未提供认证令牌')
      throw new UnauthorizedException('未提供认证令牌')
    }

    try {
      console.log('[JwtGuard] 验证 Token...')
      const payload = await this.jwtService.verifyAsync(token)
      console.log('[JwtGuard] 验证成功')
      console.log('[JwtGuard] payload.sub:', payload.sub)
      console.log('[JwtGuard] payload.email:', payload.email)

      request['user'] = payload
      console.log('[JwtGuard] user 已设置到 request')

      return true
    } catch (error) {
      console.error('[JwtGuard] Token 验证失败:', error)
      throw new UnauthorizedException('认证令牌无效或已过期')
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}

/**
 * 可选的 JWT 守卫（用于某些公开但可选认证的接口）
 */
@Injectable()
export class OptionalJwtGuard extends JwtGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context)
      return true
    } catch {
      return true // 不抛出异常，允许未认证访问
    }
  }
}
