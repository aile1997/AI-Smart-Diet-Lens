import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SystemModule } from './modules/system/system.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { FoodModule } from './modules/food/food.module'
import { DiaryModule } from './modules/diary/diary.module'
import { GamificationModule } from './modules/gamification/gamification.module'
import { RecipeModule } from './modules/recipe/recipe.module'
import { UploadModule } from './modules/upload/upload.module'
import { ChatModule } from './modules/chat/chat.module'
import { CommunityModule } from './modules/community/community.module'
import { FavoritesModule } from './modules/favorites/favorites.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
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
    SystemModule,
    DashboardModule,
    AuthModule,
    UserModule,
    FoodModule,
    DiaryModule,
    GamificationModule,
    RecipeModule,
    UploadModule,
    ChatModule,
    CommunityModule,
    FavoritesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
