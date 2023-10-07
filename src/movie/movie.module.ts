import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { ConfigsModule } from 'src/configs/configs.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [ConfigsModule, RedisModule],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
