import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { FoodModule } from './modules/food/food.module'
import { DiaryModule } from './modules/diary/diary.module'
import { PrismaModule } from './common/prisma.module'

@Module({
  imports: [
    // 环境变量配置
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 数据库
    PrismaModule,

    // 功能模块
    AuthModule,
    UserModule,
    FoodModule,
    DiaryModule,
  ],
})
export class AppModule {}
