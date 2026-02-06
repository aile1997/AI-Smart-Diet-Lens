import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

/**
 * 邮件服务
 * 使用 nodemailer 发送验证邮件
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private readonly frontendUrl: string
  private readonly transporter: nodemailer.Transporter | null

  constructor(private readonly config: ConfigService) {
    this.frontendUrl = this.config.get('FRONTEND_URL') || 'http://localhost:5173'

    // 初始化 SMTP 传输器
    const smtpHost = this.config.get<string>('SMTP_HOST')
    const smtpPort = this.config.get<number>('SMTP_PORT')
    const smtpUser = this.config.get<string>('SMTP_USER')
    const smtpPass = this.config.get<string>('SMTP_PASS')

    // 只有配置了 SMTP 才初始化传输器
    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // 465 使用 SSL, 587 使用 STARTTLS
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })
      this.logger.log('SMTP 邮件服务已配置')
    } else {
      this.transporter = null
      this.logger.warn('SMTP 未配置，将使用控制台输出验证码')
    }
  }

  /**
   * 发送验证码邮件
   * @param email 收件人邮箱
   * @param code 6位验证码
   */
  async sendVerificationCode(email: string, code: string): Promise<void> {
    const subject = 'AI Smart Diet Lens - 登录验证码'
    const html = this.getVerificationTemplate(code)

    if (this.transporter) {
      // 使用真实 SMTP 发送
      try {
        const from = this.config.get<string>('SMTP_FROM') || 'AI Smart Diet Lens <noreply@example.com>'

        await this.transporter.sendMail({
          from,
          to: email,
          subject,
          html,
        })

        this.logger.log(`验证码邮件已发送: ${email}`)
      } catch (error) {
        this.logger.error('邮件发送失败', error)
        // 降级到控制台输出
        this.logToConsole(email, code)
      }
    } else {
      // 开发模式：控制台输出
      this.logToConsole(email, code)
    }
  }

  /**
   * 发送验证链接邮件 (备用方案)
   */
  async sendVerificationLink(email: string, token: string): Promise<void> {
    const verifyUrl = `${this.frontendUrl}/auth/verify?token=${token}`
    const subject = 'AI Smart Diet Lens - 邮箱验证'
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
            .button { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>欢迎使用 AI Smart Diet Lens</h2>
            <p>请点击下面的按钮验证您的邮箱：</p>
            <p><a href="${verifyUrl}" class="button">验证邮箱</a></p>
            <p>如果按钮无法点击，请复制以下链接到浏览器：</p>
            <p style="word-break: break-all; color: #4CAF50;">${verifyUrl}</p>
            <p>链接有效期为 10 分钟。</p>
          </div>
        </body>
      </html>
    `

    if (this.transporter) {
      try {
        const from = this.config.get<string>('SMTP_FROM') || 'AI Smart Diet Lens <noreply@example.com>'

        await this.transporter.sendMail({
          from,
          to: email,
          subject,
          html,
        })

        this.logger.log(`验证链接邮件已发送: ${email}`)
      } catch (error) {
        this.logger.error('邮件发送失败', error)
      }
    }
  }

  /**
   * 控制台输出（开发模式）
   */
  private logToConsole(email: string, code: string): void {
    console.log('========================================')
    console.log('📧 验证码邮件 (开发模式)')
    console.log('========================================')
    console.log(`收件人: ${email}`)
    console.log(`验证码: ${code}`)
    console.log(`有效期: 10 分钟`)
    console.log('========================================')
  }

  /**
   * 生成验证码邮件模板
   */
  private getVerificationTemplate(code: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
            .code { font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 4px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px; }
            .footer { font-size: 12px; color: #999; margin-top: 30px; }
            .footer a { color: #999; }
            .logo { font-size: 24px; font-weight: bold; color: #4CAF50; text-align: center; padding: 20px 0; }
            .logo span { color: #333; }
            .info { font-size: 14px; color: #666; margin: 20px 0; }
            .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .warning p { margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">AI Smart Diet <span>Lens</span></div>

            <h2>您的登录验证码</h2>

            <div class="code">${code}</div>

            <p class="info">
              验证码有效期为 <strong>10 分钟</strong>，请尽快完成验证。
            </p>

            <div class="warning">
              <p><strong>安全提示：</strong></p>
              <ul>
                <li>请勿将验证码透露给他人</li>
                <li>我们不会主动索要您的验证码</li>
                <li>如果非本人操作，请忽略此邮件</li>
              </ul>
            </div>

            <p class="info">
              如果您没有注册 AI Smart Diet Lens 账户，请忽略此邮件。
            </p>

            <div class="footer">
              <p>此邮件由系统自动发送，请勿直接回复。</p>
              <p>&copy; 2026 AI Smart Diet Lens. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}
