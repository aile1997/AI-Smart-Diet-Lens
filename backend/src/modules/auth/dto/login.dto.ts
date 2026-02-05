import { IsString, IsNotEmpty, Length } from 'class-validator'

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  phone!: string

  @IsString()
  @IsNotEmpty()
  @Length(4, 6)
  code!: string
}
