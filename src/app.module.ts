import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigsModule } from './configs/configs.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { SqlModule } from './sql/sql.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from './jwt/jwt.module';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [
    ConfigsModule,
    HealthCheckModule,
    SqlModule,
    RedisModule,
    AuthModule,
    UsersModule,
    JwtModule,
    MovieModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
