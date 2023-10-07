import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { ConfigsModule } from '../configs/configs.module';
import { RedisModule } from '../redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieFavoriteEntity } from './entities/movieFavorite.entity';

@Module({
  imports: [ConfigsModule, RedisModule, TypeOrmModule.forFeature([MovieFavoriteEntity])],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
