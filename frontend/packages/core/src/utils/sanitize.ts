/**
 * HTML 内容清理工具
 *
 * 防止 XSS 攻击，清理用户输入和后端返回的富文本内容
 */

/**
 * 允许的 HTML 标签白名单
 */
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u',
  'a', 'ul', 'ol', 'li', 'span', 'div'
]

/**
 * 允许的属性白名单
 */
const ALLOWED_ATTRS = ['href', 'class', 'style']

/**
 * 危险属性黑名单
 */
const DANGEROUS_ATTRS = [
  'onclick', 'onload', 'onerror', 'onmouseover',
  'javascript:', 'data:', 'vbscript:'
]

/**
 * 简单的 HTML 标签清理器
 * 移除不在白名单中的标签和所有事件处理属性
 *
 * @param html 原始 HTML 字符串
 * @returns 清理后的安全 HTML 字符串
 */
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string') {
    return ''
  }

  // 移除危险协议
  let sanitized = html.replace(
    /(javascript|vbscript|data):/gi,
    ''
  )

  // 移除事件处理属性 (onclick, onload, etc.)
  sanitized = sanitized.replace(
    /\s*on\w+\s*=\s*["'][^"']*["']/gi,
    ''
  )

  // 移除不在白名单中的标签
  sanitized = sanitized.replace(
    /<\/?(\w+)([^>]*)>/g,
    (match, tagName, attrs) => {
      const tag = tagName.toLowerCase()

      // 如果标签在白名单中，保留它
      if (ALLOWED_TAGS.includes(tag)) {
        // 清理属性
        const cleanAttrs = attrs.replace(
          /(\w+)=["']([^"']*)["']/g,
          (match, attr, value) => {
            // 如果属性在白名单中且不包含危险内容，保留它
            if (ALLOWED_ATTRS.includes(attr.toLowerCase()) &&
                !DANGEROUS_ATTRS.some(dangerous =>
                  value.toLowerCase().includes(dangerous)
                )) {
              return `${attr}="${value.replace(/["']/g, '')}"`
            }
            return ''
          }
        )
        return `<${tag}${cleanAttrs}>`
      }

      // 移除不在白名单中的标签
      return match.replace(/<\/?[^>]+>/g, '')
    }
  )

  return sanitized
}

/**
 * 将 Markdown 转换为安全的 HTML
 * 这是一个简单的实现，生产环境建议使用 marked + DOMPurify
 *
 * @param markdown Markdown 格式的文本
 * @returns 安全的 HTML 字符串
 */
export function markdownToSafeHTML(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return ''
  }

  // 简单的 Markdown 转换
  let html = markdown
    // 粗体
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // 换行
    .replace(/\n/g, '<br>')

  return sanitizeHTML(html)
}

/**
 * 转义 HTML 特殊字符
 * 用于纯文本显示，防止 HTML 注入
 *
 * @param text 原始文本
 * @returns 转义后的文本
 */
export function escapeHTML(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }

  return text.replace(/[&<>"']/g, char => htmlEntities[char])
}
