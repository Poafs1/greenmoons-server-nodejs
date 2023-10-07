import { ConfigsService } from '../../configs/configs.service';

export const configsServiceProvider = {
  provide: ConfigsService,
  useValue: {
    jwt: {
      refreshTokenLifeTime: '90d',
    },
  },
};
