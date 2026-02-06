import { Controller, Get, Patch, Delete, Param, Query, UseGuards } from '@nestjs/common'
import { NotificationsService, MessageType } from './notifications.service'
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { ApiResponse } from '../../common/api-response'
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'

/**
 * 消息通知控制器
 */
@ApiTags('notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
@UseGuards(JwtGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * GET /api/notifications
   * 获取消息列表
   */
  @Get()
  @ApiOperation({
    summary: '获取消息列表',
    description: '获取用户的系统通知消息'
  })
  @ApiQuery({ name: 'type', required: false, description: '消息类型', enum: ['achievement', 'reminder', 'system'] })
  @SwaggerApiResponse({ status: 200, description: '成功返回消息列表' })
  async getMessages(
    @CurrentUser() user: UserPayload,
    @Query('type') type?: MessageType,
  ) {
    const messages = await this.notificationsService.getMessages(user.sub, type)
    return ApiResponse.ok(messages)
  }

  /**
   * GET /api/notifications/unread-count
   * 获取未读消息数量
   */
  @Get('unread-count')
  @ApiOperation({
    summary: '获取未读消息数量',
    description: '获取当前用户的未读消息数量'
  })
  @SwaggerApiResponse({ status: 200, description: '成功返回未读数量' })
  async getUnreadCount(@CurrentUser() user: UserPayload) {
    const count = await this.notificationsService.getUnreadCount(user.sub)
    return ApiResponse.ok({ count })
  }

  /**
   * PATCH /api/notifications/:id/read
   * 标记消息已读
   */
  @Patch(':id/read')
  @ApiOperation({
    summary: '标记消息已读',
    description: '将指定消息标记为已读状态'
  })
  @SwaggerApiResponse({ status: 200, description: '成功标记已读' })
  async markAsRead(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    const result = await this.notificationsService.markAsRead(id, user.sub)
    return ApiResponse.ok(result)
  }

  /**
   * PATCH /api/notifications/read-all
   * 标记所有消息已读
   */
  @Patch('read-all')
  @ApiOperation({
    summary: '标记所有消息已读',
    description: '将当前用户的所有未读消息标记为已读'
  })
  @SwaggerApiResponse({ status: 200, description: '成功标记所有消息已读' })
  async markAllAsRead(@CurrentUser() user: UserPayload) {
    const result = await this.notificationsService.markAllAsRead(user.sub)
    return ApiResponse.ok(result)
  }

  /**
   * DELETE /api/notifications/:id
   * 删除消息
   */
  @Delete(':id')
  @ApiOperation({
    summary: '删除消息',
    description: '删除指定的系统消息'
  })
  @SwaggerApiResponse({ status: 200, description: '成功删除消息' })
  async deleteMessage(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    const result = await this.notificationsService.deleteMessage(id, user.sub)
    return ApiResponse.ok(result)
  }
}
