import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtGuard, OptionalJwtGuard } from '../../common/guards/jwt.guard'
import { MailModule } from '../mail/mail.module'

@Global() // 设为全局模块
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      global: true, // JwtModule 也设为全局
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard, OptionalJwtGuard],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
