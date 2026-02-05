import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../../common/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(phone: string, code: string) {
    // TODO: 验证短信验证码
    // 当前为骨架实现，Backend Builder 需要完善验证逻辑

    let user = await this.prisma.user.findUnique({
      where: { phone },
    })

    if (!user) {
      // 自动注册
      user = await this.prisma.user.create({
        data: { phone },
      })
    }

    const token = this.jwtService.sign({ sub: user.id, phone: user.phone })

    return {
      token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
      },
    }
  }
}
