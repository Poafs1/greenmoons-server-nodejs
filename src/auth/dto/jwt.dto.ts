import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class JwtDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  sub: string;
}
