import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpInputDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmationPassword: string;
}
