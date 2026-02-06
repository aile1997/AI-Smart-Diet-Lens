import { Module } from '@nestjs/common'
import { AIController, FoodController } from './food.controller'
import { FoodService } from './food.service'

@Module({
  controllers: [AIController, FoodController],
  providers: [FoodService],
  exports: [FoodService],
})
export class FoodModule {}
