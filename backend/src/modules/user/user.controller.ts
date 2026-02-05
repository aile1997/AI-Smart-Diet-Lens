import { Controller, Get, Put, Body, Param } from '@nestjs/common'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return this.userService.findById(id)
  }

  @Put(':id/profile')
  async updateProfile(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.userService.updateProfile(id, body)
  }
}
