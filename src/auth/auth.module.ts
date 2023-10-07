import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { ConfigsModule } from '../configs/configs.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RedisModule } from '../redis/redis.module';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [ConfigsModule, UsersModule, PassportModule, RedisModule, JwtModule],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
