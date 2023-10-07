import { UsersService } from '../../users/users.service';
import { usersData } from '../mock/users.mock';

export const usersServiceProvider = {
  provide: UsersService,
  useFactory: () => {
    const data = usersData;

    return {
      findByEmail: jest.fn((email) => {
        const user = data.find((user) => user.email === email);

        if (!user) {
          return undefined;
        }

        return Promise.resolve(user);
      }),
      comparePassword: jest.fn((password, confirmPassword) => {
        if (password !== confirmPassword) {
          return false;
        }

        return true;
      }),
      validatePassword: jest.fn((password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

        return password.match(passwordRegex);
      }),
      create: jest.fn((user) => {
        return Promise.resolve(user);
      }),
    };
  },
};
