import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse } from '@nestjs/swagger'
import { SystemService } from './system.service'
import { ApiResponse } from '../../common/api-response'
import { BootstrapConfig } from './system.service'

/**
 * 系统控制器
 */
@ApiTags('system')
@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  /**
   * GET /api/system/bootstrap
   * 系统启动配置
   */
  @Get('bootstrap')
  @ApiOperation({ summary: '获取系统启动配置', description: 'App 冷启动时首个调用，用于版本控制和功能开关' })
  @SwaggerApiResponse({ status: 200, description: '成功返回启动配置', type: ApiResponse })
  getBootstrap(): ApiResponse<BootstrapConfig> {
    const config = this.systemService.getBootstrapConfig()
    return ApiResponse.ok(config)
  }
}
