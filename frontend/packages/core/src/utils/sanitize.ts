/**
 * HTML 内容清理工具
 *
 * 防止 XSS 攻击，清理用户输入和后端返回的富文本内容
 * 使用 DOMPurify 进行安全的 HTML 清理
 */

import DOMPurify from 'dompurify'

/**
 * AI 聊天富文本内容的安全配置
 * 允许基本的格式化标签，但移除所有危险内容
 */
const AI_CHAT_CONFIG = {
  // 允许的标签白名单
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u',
    'a', 'ul', 'ol', 'li', 'span', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'img'             // 图片标签
  ],

  // 允许的属性白名单
  ALLOWED_ATTR: [
    'href',           // 链接
    'src',            // 图片源
    'alt',            // 替代文本
    'title',          // 提示文本
    'class'           // 样式类（仅用于基本样式）
  ]
}

/**
 * 创建 DOMPurify 配置
 *
 * @param customTags 自定义允许的标签
 * @param customAttr 自定义允许的属性
 * @returns DOMPurify 配置对象
 */
function createSanitizeConfig(
  customTags?: string[],
  customAttr?: string[]
): DOMPurify.Config {
  return {
    // 允许的标签
    ALLOWED_TAGS: customTags || AI_CHAT_CONFIG.ALLOWED_TAGS,

    // 允许的属性
    ALLOWED_ATTR: customAttr || AI_CHAT_CONFIG.ALLOWED_ATTR,

    // 允许的 URI 协议（仅允许安全协议）
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,

    // 禁止所有 HTML 注释
    ALLOW_COMMENTS: false,

    // 禁止未知协议
    ALLOW_UNKNOWN_PROTOCOLS: false,

    // 移除所有 iframe、script 等危险标签
    // (通过不在 ALLOWED_TAGS 中实现)

    // 针对特定标签的额外处理
    ADD_ATTR: [],

    // 移除特定标签的特定属性
    FORBID_ATTR: [
      'style',          // 移除内联样式（可包含 javascript:）
      'onclick',
      'onload',
      'onerror',
      'onmouseover',
      'onmouseout',
      'onfocus',
      'onblur',
      'onchange',
      'onsubmit'
    ],

    // 完全禁止包含特定内容的标签
    FORBID_TAGS: [
      'script',
      'style',
      'iframe',
      'object',
      'embed',
      'form',
      'input',
      'button',
      'link',
      'meta',
      'title'
    ],

    // 自定义处理函数 - 额外检查 href 属性
    SAFE_FOR_JQUERY: true,  // 兼容 jQuery
    SAFE_FOR_TEMPLATES: true, // 兼容模板引擎

    // 使用自定义标签处理
    WHOLE_DOCUMENT: false,

    // 返回 DOM 而不是字符串
    RETURN_DOM: false,

    // 返回 DOM 片段
    RETURN_DOM_FRAGMENT: false,

    // 不保留文档类型
    RETURN_DOM_IMPORT: false,

    // 移除空标签
    REMOVE_EMPTY_TAGS: false
  }
}

/**
 * 清理 HTML 内容，移除潜在的 XSS 攻击代码
 *
 * @param html 原始 HTML 字符串
 * @param customTags 自定义允许的标签（可选）
 * @param customAttr 自定义允许的属性（可选）
 * @returns 清理后的安全 HTML 字符串
 */
export function sanitizeHTML(
  html: string,
  customTags?: string[],
  customAttr?: string[]
): string {
  // 输入验证
  if (!html || typeof html !== 'string') {
    return ''
  }

  // 如果是空字符串，直接返回
  if (html.trim() === '') {
    return html
  }

  // 创建配置
  const config = createSanitizeConfig(customTags, customAttr)

  // 使用 DOMPDOMPurify 清理 HTML
  // 在 UniApp/浏览器环境中，DOMPurify 会自动使用全局 window
  const clean = DOMPurify.sanitize(html, config)

  return clean as unknown as string
}

/**
 * 清理 AI 聊天返回的富文本内容
 * 专门用于 AI 营养师对话场景
 *
 * @param aiResponse AI 返回的富文本内容
 * @returns 清理后的安全 HTML
 */
export function sanitizeAIResponse(aiResponse: string): string {
  if (!aiResponse || typeof aiResponse !== 'string') {
    return ''
  }

  // AI 聊天场景的特定配置
  const aiConfig = createSanitizeConfig(
    // 允许基本的格式化标签
    ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'a', 'ul', 'ol', 'li', 'span', 'img'],
    // 仅允许 href、src、alt 和 title 属性
    ['href', 'src', 'alt', 'title']
  )

  return DOMPurify.sanitize(aiResponse, aiConfig) as string
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

  // 清理生成的 HTML
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

/**
 * 检查字符串是否包含潜在的 XSS 攻击代码
 *
 * @param input 待检查的字符串
 * @returns 如果包含危险内容返回 true
 */
export function containsXSS(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false
  }

  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,  // 事件处理器如 onclick=
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /data:text\/html/i,
    /vbscript:/i
  ]

  return dangerousPatterns.some(pattern => pattern.test(input))
}

/**
 * 默认导出 - 主清理函数
 */
export default sanitizeHTML
