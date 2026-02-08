/**
 * useAuth Composable 单元测试
 *
 * 测试认证状态管理
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";

// 使用 vi.hoisted 创建 mock 函数
const mockSendCode = vi.hoisted(() => vi.fn());
const mockLoginWithCode = vi.hoisted(() => vi.fn());
const mockLogout = vi.hoisted(() => vi.fn());
const mockGetToken = vi.hoisted(() => vi.fn(() => null));
const mockSetToken = vi.hoisted(() => vi.fn());
const mockRemoveToken = vi.hoisted(() => vi.fn());

// Mock API 模块
vi.mock("../../src/api", () => ({
  getApi: vi.fn(() => ({
    post: vi.fn(),
    get: vi.fn(),
  })),
  initApi: vi.fn(),
  // 导出所有服务（需要从 services 重新导出）
  AuthService: class {
    constructor() {}
    sendCode = mockSendCode;
    loginWithEmail = mockLoginWithCode;
    loginWithWechat = vi.fn();
    logout = mockLogout;
  },
}));

// Mock services/auth.service（会自动被上面的 mock 覆盖）
// 不需要单独 mock

// Mock secure-storage
vi.mock("../../src/utils/secure-storage", () => ({
  tokenStorage: {
    getToken: mockGetToken,
    setToken: mockSetToken,
    removeToken: mockRemoveToken,
  },
}));

// Mock logger
vi.mock("../../src/utils/logger", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    security: vi.fn(),
  },
  initLogger: vi.fn(),
}));

// Mock throttle
vi.mock("../../src/utils/throttle", () => ({
  createRateLimiter: vi.fn(() => {
    let count = 0;
    return () => {
      count++;
      return count <= 5;
    };
  }),
}));

import { useAuthStore } from "../../src/stores/auth";

describe("useAuth", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    // 重置所有 mocks
    vi.clearAllMocks();

    // 设置默认返回值
    mockSendCode.mockResolvedValue({ success: true });
    mockLoginWithCode.mockResolvedValue({
      token: "test-token",
      user: { id: "1", email: "test@example.com" },
    });
  });

  describe("初始状态", () => {
    it("应有正确的初始状态", () => {
      const authStore = useAuthStore();

      expect(authStore.token).toBeNull();
      expect(authStore.loading).toBe(false);
      expect(authStore.errorCode).toBeNull();
      expect(authStore.canSendCode).toBe(true);
      expect(authStore.codeCooldown).toBe(0);
      expect(authStore.isLoggedIn).toBe(false);
    });
  });

  describe("isLoggedIn 计算属性", () => {
    it("未设置 token 时应返回 false", () => {
      const authStore = useAuthStore();
      expect(authStore.isLoggedIn).toBe(false);
    });

    it("设置 token 后应返回 true", () => {
      const authStore = useAuthStore();
      authStore.token = "test-token";

      expect(authStore.isLoggedIn).toBe(true);
    });
  });

  describe("initAuth", () => {
    it("应从 storage 恢复 token", async () => {
      mockGetToken.mockReturnValue("saved-token");

      const authStore = useAuthStore();
      await authStore.initAuth();

      expect(authStore.token).toBe("saved-token");
      expect(authStore.isLoggedIn).toBe(true);
    });

    it("没有保存的 token 时应保持未登录状态", async () => {
      mockGetToken.mockReturnValue(null);

      const authStore = useAuthStore();
      await authStore.initAuth();

      expect(authStore.token).toBeNull();
      expect(authStore.isLoggedIn).toBe(false);
    });
  });

  describe("sendCode", () => {
    it("应成功发送验证码", async () => {
      const authStore = useAuthStore();

      const result = await authStore.sendCode("test@example.com");

      expect(result.success).toBe(true);
      expect(mockSendCode).toHaveBeenCalledWith("test@example.com");
    });

    it("应处理发送失败", async () => {
      mockSendCode.mockRejectedValue(new Error("INVALID_EMAIL"));

      const authStore = useAuthStore();
      const result = await authStore.sendCode("invalid-email");

      expect(result.success).toBe(false);
      expect(result.error).toBe("INVALID_EMAIL");
    });

    it("应在冷却时间结束后允许发送", async () => {
      const authStore = useAuthStore();

      // 冷却时间已结束
      authStore.canSendCode = true;
      authStore.codeCooldown = 0;

      const result = await authStore.sendCode("test@example.com");

      expect(result.success).toBe(true);
      expect(mockSendCode).toHaveBeenCalled();
    });
  });

  describe("loginWithEmail", () => {
    it("应成功登录并保存 token", async () => {
      const authStore = useAuthStore();

      const result = await authStore.loginWithEmail("test@example.com", "123456");

      expect(result.success).toBe(true);
      expect(authStore.token).toBe("test-token");
      expect(mockSetToken).toHaveBeenCalledWith("test-token");
      expect(mockLoginWithCode).toHaveBeenCalledWith("test@example.com", "123456");
    });

    it("应处理登录失败", async () => {
      mockLoginWithCode.mockRejectedValue(new Error("INVALID_CODE"));

      const authStore = useAuthStore();
      const result = await authStore.loginWithEmail("test@example.com", "000000");

      expect(result.success).toBe(false);
      expect(result.error).toBe("INVALID_CODE");
      expect(authStore.token).toBeNull();
    });
  });

  describe("logout", () => {
    it("应清除所有状态", () => {
      const authStore = useAuthStore();

      authStore.token = "test-token";
      authStore.errorCode = "some-error";

      authStore.logout();

      expect(authStore.token).toBeNull();
      expect(authStore.errorCode).toBeNull();
      expect(mockRemoveToken).toHaveBeenCalled();
    });
  });
});
