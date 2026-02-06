import { Test, TestingModule } from '@nestjs/testing'
import { SystemService } from './system.service'
import { ConfigService } from '@nestjs/config'

describe('SystemService', () => {
  let service: SystemService
  let configService: ConfigService

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'S3_BUCKET') return 'diet-lens-uploads'
      return undefined
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SystemService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile()

    service = module.get<SystemService>(SystemService)
    configService = module.get<ConfigService>(ConfigService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getBootstrapConfig', () => {
    it('should return bootstrap config with all required fields', () => {
      const result = service.getBootstrapConfig()

      expect(result).toHaveProperty('min_version_ios')
      expect(result).toHaveProperty('min_version_android')
      expect(result).toHaveProperty('maintenance_mode')
      expect(result).toHaveProperty('feature_flags')
      expect(result).toHaveProperty('upload_config')
    })

    it('should return correct feature flags', () => {
      const result = service.getBootstrapConfig()

      expect(result.feature_flags).toEqual({
        enable_ar_scan: true,
        enable_barcode_scanner: true,
        use_health_connect: true,
      })
    })

    it('should return S3 upload config from environment', () => {
      const result = service.getBootstrapConfig()

      expect(result.upload_config).toEqual({
        provider: 'S3',
        bucket: 'diet-lens-uploads',
      })

      expect(configService.get).toHaveBeenCalledWith('S3_BUCKET', 'diet-lens-uploads')
    })

    it('should return maintenance mode as false by default', () => {
      const result = service.getBootstrapConfig()
      expect(result.maintenance_mode).toBe(false)
    })
  })
})
