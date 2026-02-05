import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common'
import { DiaryService } from './diary.service'

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  async create(@Body() body: Record<string, unknown>) {
    return this.diaryService.create(body)
  }

  @Get('summary')
  async getDailySummary(@Query('date') date: string) {
    return this.diaryService.getDailySummary(date)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.diaryService.remove(id)
  }
}
