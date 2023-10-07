import { RedisService } from '../../redis/redis.service';
import { refreshTokenData } from '../mock/refreshToken.mock';
import { usersData } from '../mock/users.mock';

export const redisServiceProvider = {
  provide: RedisService,
  useFactory: () => {
    const map = new Map([[`token:${usersData[0].id}`, refreshTokenData]]);

    return {
      get: jest.fn((key) => {
        return Promise.resolve(map.get(key));
      }),
      set: jest.fn((key, value) => {
        map.set(key, value);

        return Promise.resolve();
      }),
      del: jest.fn((key) => {
        map.delete(key);

        return Promise.resolve();
      }),
    };
  },
};
