import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class HealthCheckResponseDto {
  @IsNumberString()
  @IsNotEmpty()
  status: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
