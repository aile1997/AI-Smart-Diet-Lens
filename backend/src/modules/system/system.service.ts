import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

/**
 * 系统启动配置响应
 */
export interface BootstrapConfig {
  min_version_ios: string
  min_version_android: string
  maintenance_mode: boolean
  feature_flags: {
    enable_ar_scan: boolean
    enable_barcode_scanner: boolean
    use_health_connect: boolean
  }
  upload_config: {
    provider: string
    bucket: string
  }
}

/**
 * 系统服务
 */
@Injectable()
export class SystemService {
  constructor(private readonly config: ConfigService) {}

  /**
   * 获取系统启动配置
   */
  getBootstrapConfig(): BootstrapConfig {
    return {
      min_version_ios: '1.0.0',
      min_version_android: '1.0.0',
      maintenance_mode: false,
      feature_flags: {
        enable_ar_scan: true,
        enable_barcode_scanner: true,
        use_health_connect: true,
      },
      upload_config: {
        provider: 'S3',
        bucket: this.config.get<string>('S3_BUCKET', 'diet-lens-uploads'),
      },
    }
  }
}
