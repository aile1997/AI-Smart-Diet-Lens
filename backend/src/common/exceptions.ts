/**
 * 业务异常基类
 */
export class BusinessException extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
  ) {
    super(message)
    this.name = 'BusinessException'
  }
}

/**
 * 预定义业务异常
 */
export class Exceptions {
  static readonly INVALID_PARAMS = new BusinessException('INVALID_PARAMS', '请求参数无效', 400)

  static readonly UNAUTHORIZED = new BusinessException('UNAUTHORIZED', '未授权访问', 401)

  static readonly NOT_FOUND = new BusinessException('NOT_FOUND', '资源不存在', 404)

  static readonly FOOD_NOT_FOUND = new BusinessException('FOOD_NOT_FOUND', '食物未找到', 404)

  static readonly INVALID_AR_CONTEXT = new BusinessException('INVALID_AR_CONTEXT', 'AR 参数缺失，请选择参照容器', 400)

  static readonly DIRTY_BULK_WARN = new BusinessException('DIRTY_BULK_WARN', '增肌期体脂上升过快', 409)

  static readonly RATE_LIMIT_AI = new BusinessException('RATE_LIMIT_AI', '操作太快，请稍后重试', 429)

  static readonly INTERNAL_ERROR = new BusinessException('INTERNAL_ERROR', '服务器内部错误', 500)
}
