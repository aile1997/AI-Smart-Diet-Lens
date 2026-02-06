import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator'

export class SendCodeDto {
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty()
  email!: string
}

export class EmailLoginDto {
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty()
  email!: string

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: '验证码为 6 位数字' })
  code!: string
}

export class WechatLoginDto {
  @IsString()
  @IsNotEmpty()
  code!: string

  @IsString()
  openid?: string
}
