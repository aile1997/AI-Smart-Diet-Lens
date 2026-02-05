/**
 * 格式化工具函数
 */

/**
 * 格式化热量显示
 *
 * @param calories - 热量值 (kcal)
 * @returns 格式化后的字符串
 */
export function formatCalories(calories: number): string {
  if (calories >= 1000) {
    return `${(calories / 1000).toFixed(1)}k`
  }
  return `${Math.round(calories)}`
}

/**
 * 格式化日期为 YYYY-MM-DD
 *
 * @param date - Date 对象或时间戳
 * @returns YYYY-MM-DD 格式的字符串
 */
export function formatDate(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 格式化百分比
 *
 * @param value - 当前值
 * @param total - 总值
 * @returns 0-100 之间的百分比
 */
export function formatPercentage(value: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(100, Math.round((value / total) * 100))
}
