import { Module } from '@nestjs/common'
import { RecipeController } from './recipe.controller'
import { RecipeService } from './recipe.service'
import { PrismaModule } from '../../common/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [RecipeController],
  providers: [RecipeService],
  exports: [RecipeService],
})
export class RecipeModule {}
