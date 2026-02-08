import { IsString, IsNotEmpty, IsEmail, Length, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SendCodeDto {
  @ApiProperty({ example: 'user@example.com', description: '用户邮箱地址' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty()
  email!: string
}

export class EmailLoginDto {
  @ApiProperty({ example: 'user@example.com', description: '用户邮箱地址' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty()
  email!: string

  @ApiProperty({ example: '123456', description: '6 位验证码' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: '验证码为 6 位数字' })
  code!: string
}

export class PasswordRegisterDto {
  @ApiProperty({ example: 'user@example.com', description: '用户邮箱地址' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty()
  email!: string

  @ApiProperty({ example: 'abc123456', description: '密码 (至少 8 位)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: '密码至少 8 位' })
  password!: string

  @ApiProperty({ example: '123456', description: '6 位验证码' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: '验证码为 6 位数字' })
  code!: string
}

export class PasswordLoginDto {
  @ApiProperty({ example: 'user@example.com', description: '用户邮箱地址' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty()
  email!: string

  @ApiProperty({ example: 'abc123456', description: '密码' })
  @IsString()
  @IsNotEmpty()
  password!: string
}

export class SimpleLoginDto {
  @ApiProperty({ example: 'user@example.com', description: '用户邮箱地址' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty()
  email!: string
}

export class WechatLoginDto {
  @ApiProperty({ example: 'wx_auth_code', description: '微信授权码' })
  @IsString()
  @IsNotEmpty()
  code!: string

  @ApiProperty({ example: 'wx_openid', description: '微信 OpenID', required: false })
  @IsString()
  openid?: string
}
