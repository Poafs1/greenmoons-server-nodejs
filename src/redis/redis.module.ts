import { Module } from '@nestjs/common';
import { ConfigsModule } from 'src/configs/configs.module';
import { ConfigsService } from 'src/configs/configs.service';
import { RedisModule as RedisBaseModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { RedisService } from './redis.service';

@Module({
  imports: [
    RedisBaseModule.forRootAsync({
      imports: [ConfigsModule],
      inject: [ConfigsService],
      useFactory: (configsService: ConfigsService): RedisModuleOptions => {
        const { redis } = configsService;
        const { host, port, password } = redis;

        return {
          config: {
            host,
            port,
            password,
          },
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
