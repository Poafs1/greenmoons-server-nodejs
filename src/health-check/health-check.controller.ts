import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HealthCheckResponseDto } from './dto/health-check.dto';

@Controller('health-check')
export class HealthCheckController {
  @Get('/')
  @HttpCode(HttpStatus.OK)
  healthCheck(): HealthCheckResponseDto {
    return {
      status: HttpStatus.OK,
      message: 'success',
    };
  }
}
