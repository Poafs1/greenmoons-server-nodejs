import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IJwtConfig } from './interfaces/jwt.config.interface';
import { IPGConfig } from './interfaces/pg.config.interface';
import { IServerConfig } from './interfaces/serverConfig.interface';
import { IRedisConfig } from './interfaces/redis.config.interface';

@Injectable()
export class ConfigsService {
  constructor(private readonly config: ConfigService) {}

  get nodeEnv(): string {
    return this.config.get<string>('NODE_ENV') || 'development';
  }

  get cookieDomain(): string {
    return this.config.get<string>('COOKIE_DOMAIN') || 'localhost';
  }

  get clientUrl(): string {
    return this.config.get<string>('CLIENT_URL') || 'http://localhost:3000';
  }

  get serverUrl(): string {
    return this.config.get<string>('SERVER_URL') || 'http://localhost:8000';
  }

  get server(): IServerConfig {
    return {
      host: this.config.get<string>('HOST_SERVICE') || 'localhost',
      port: this.config.get<number>('PORT_SERVICE') || 8000,
    };
  }

  get pg(): IPGConfig {
    return {
      host: this.config.get<string>('PG_HOST') || 'localhost',
      port: parseInt(this.config.get<string>('PG_PORT')) || 5432,
      username: this.config.get<string>('PG_USERNAME') || 'postgres',
      password: this.config.get<string>('PG_PASSWORD') || 'postgres',
      database: this.config.get<string>('PG_DATABASE') || 'postgres',
    };
  }

  get jwt(): IJwtConfig {
    return {
      accessTokenLifeTime: this.config.get<string>('JWT_ACCESS_TOKEN_LIFETIME') || '1h',
      refreshTokenLifeTime: this.config.get<string>('JWT_REFRESH_TOKEN_LIFETIME') || '90d',
      secret: this.config.get<string>('JWT_SECRET') || 'secret',
    };
  }

  get redis(): IRedisConfig {
    return {
      host: this.config.get<string>('REDIS_HOST') || 'localhost',
      port: this.config.get<number>('REDIS_PORT') || 6379,
      password: this.config.get<string>('REDIS_PASSWORD') || '',
      loginTimeout: this.config.get<number>('REDIS_LOGIN_TIMEOUT') || 10800,
      redisTlsConnectionEnabled: this.config.get<boolean>('REDIS_TLS_CONNECTION_ENABLED') || false,
    };
  }

  get movieApi(): string {
    return this.config.get<string>('MOVIE_API');
  }
}
