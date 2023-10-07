import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis('default') readonly client: Redis) {}

  async set(key: string, value: string, seconds?: number) {
    try {
      if (seconds) {
        await this.client.set(key, value, 'EX', seconds);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async del(key: string) {
    return this.client.del(key);
  }
}
