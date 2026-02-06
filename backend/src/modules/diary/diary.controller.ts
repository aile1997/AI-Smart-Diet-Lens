import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { DiaryService } from './diary.service'
import { CreateDiaryEntryDto, UpdateDiaryEntryDto } from './dto/diary.dto'
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { ApiResponse } from '../../common/api-response'
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'

/**
 * 饮食日记控制器
 */
@ApiTags('diary')
@ApiBearerAuth('JWT-auth')
@Controller('diary')
@UseGuards(JwtGuard)
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  /**
   * POST /api/diary/entry
   * 创建日记条目
   */
  @Post('entry')
  @ApiOperation({ summary: '创建饮食记录', description: '添加一条饮食日记条目' })
  @SwaggerApiResponse({ status: 201, description: '成功创建日记条目' })
  async createEntry(
    @CurrentUser() user: UserPayload,
    @Body() dto: CreateDiaryEntryDto,
  ) {
    const entry = await this.diaryService.create(user.sub, dto)
    return ApiResponse.ok(entry)
  }

  /**
   * GET /api/diary
   * 获取日记列表
   */
  @Get()
  @ApiOperation({ summary: '获取日记列表', description: '获取指定日期的所有饮食记录' })
  @ApiQuery({ name: 'date', required: true, description: '日期 (YYYY-MM-DD)', example: '2026-02-05' })
  @SwaggerApiResponse({ status: 200, description: '成功返回日记列表' })
  async getList(
    @CurrentUser() user: UserPayload,
    @Query('date') date: string,
  ) {
    const entries = await this.diaryService.getDailyList(user.sub, date)
    return ApiResponse.ok(entries)
  }

  /**
   * GET /api/diary/summary
   * 获取每日汇总
   */
  @Get('summary')
  @ApiOperation({ summary: '获取每日营养汇总', description: '计算指定日期的总营养摄入' })
  @ApiQuery({ name: 'date', required: true, description: '日期 (YYYY-MM-DD)', example: '2026-02-05' })
  @SwaggerApiResponse({ status: 200, description: '成功返回营养汇总' })
  async getSummary(
    @CurrentUser() user: UserPayload,
    @Query('date') date: string,
  ) {
    const summary = await this.diaryService.getDailySummary(user.sub, date)
    return ApiResponse.ok(summary)
  }

  /**
   * PATCH /api/diary/entry/:id
   * 更新日记条目
   */
  @Patch('entry/:id')
  @ApiOperation({ summary: '更新饮食记录', description: '修改已有的饮食日记条目' })
  @SwaggerApiResponse({ status: 200, description: '成功更新日记条目' })
  async updateEntry(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateDiaryEntryDto,
  ) {
    const entry = await this.diaryService.update(id, dto, user.sub)
    return ApiResponse.ok(entry)
  }

  /**
   * DELETE /api/diary/entry/:id
   * 删除日记条目
   */
  @Delete('entry/:id')
  @ApiOperation({ summary: '删除饮食记录', description: '删除指定的饮食日记条目' })
  @SwaggerApiResponse({ status: 200, description: '成功删除日记条目' })
  async removeEntry(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    const result = await this.diaryService.remove(id, user.sub)
    return ApiResponse.ok(result)
  }
}
