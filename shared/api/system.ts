import { ApiResponse } from './common'

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
 * GET /api/system/bootstrap
 */
export interface GetBootstrapConfigResponse extends ApiResponse {
  data: BootstrapConfig
}
