import { JwtService } from '../../jwt/jwt.service';
import { usersData } from '../mock/users.mock';

export const jwtServiceProvider = {
  provide: JwtService,
  useValue: {
    sign: jest.fn(() => {
      return Promise.resolve('token');
    }),
    verify: jest.fn(() => {
      return Promise.resolve({
        sub: usersData[0].id,
        email: usersData[0].email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 10,
      });
    }),
  },
};
