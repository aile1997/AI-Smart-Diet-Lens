/**
 * UniApp 导航工具函数
 *
 * 提供安全的导航方法，处理边界情况
 */

/**
 * 安全返回上一页
 *
 * 如果没有导航历史，则跳转到指定页面（默认为首页）
 *
 * @param fallbackUrl - 无历史记录时的回退 URL，默认为首页
 */
export function safeNavigateBack(fallbackUrl = '/pages/index/index'): void {
  const pages = getCurrentPages()

  if (pages.length > 1) {
    // 有导航历史，正常返回
    uni.navigateBack()
  } else {
    // 没有导航历史，跳转到回退页面
    uni.redirectTo({
      url: fallbackUrl,
      fail: () => {
        // 如果 redirectTo 也失败，尝试 switchTab
        uni.switchTab({
          url: fallbackUrl,
        })
      },
    })
  }
}

/**
 * 安全返回并传递数据
 *
 * @param data - 要传递给上一页的数据
 * @param fallbackUrl - 无历史记录时的回退 URL
 */
export function safeNavigateBackWithData(data: Record<string, unknown>, fallbackUrl = '/pages/index/index'): void {
  const pages = getCurrentPages()

  if (pages.length > 1) {
    // 有导航历史，获取上一页实例并传递数据
    const prevPage = pages[pages.length - 2] as any
    if (prevPage && prevPage.$page) {
      // 将数据附加到上一页
      prevPage.$page.options = { ...prevPage.$page.options, ...data }
    }
    uni.navigateBack()
  } else {
    // 没有导航历史，跳转到回退页面
    uni.redirectTo({
      url: fallbackUrl,
      fail: () => {
        uni.switchTab({
          url: fallbackUrl,
        })
      },
    })
  }
}

/**
 * 安全跳转到指定页面
 *
 * 自动处理 tab 页面和普通页面的跳转
 *
 * @param url - 目标页面 URL
 * @param isTab - 是否为 tab 页面
 */
export function safeNavigateTo(url: string, isTab = false): void {
  const navigateFn = isTab ? uni.switchTab : uni.navigateTo

  navigateFn({
    url,
    fail: (err) => {
      console.error('导航失败:', err)
      // 尝试使用 reLaunch 作为最后的手段
      uni.reLaunch({
        url,
      })
    },
  })
}
