import { Controller, Post, Body } from '@nestjs/common'
import { FoodService } from './food.service'

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post('recognize')
  async recognize(@Body() body: { image: string }) {
    return this.foodService.recognizeFood(body.image)
  }
}
