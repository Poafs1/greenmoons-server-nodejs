import { Injectable } from '@nestjs/common';
import { JwtService as JwtBaseService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private jwtBaseService: JwtBaseService) {}

  async sign(payload: any, options?: any): Promise<string> {
    return this.jwtBaseService.sign(payload, options);
  }

  async verify(token: string, options?: any): Promise<any> {
    return this.jwtBaseService.verify(token, options);
  }
}
