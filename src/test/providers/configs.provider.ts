import { ConfigsService } from '../../configs/configs.service';

export const configsData = {
  jwt: {
    refreshTokenLifeTime: '90d',
  },
  movieApi: 'movie-api',
};

export const configsServiceProvider = {
  provide: ConfigsService,
  useValue: configsData,
};
