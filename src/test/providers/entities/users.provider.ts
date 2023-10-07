import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../../users/entities/user.entity';
import { usersData } from '../../../test/mock/users.mock';
import { v4 as uuid } from 'uuid';

export const userEntityProvider = {
  provide: getRepositoryToken(UserEntity),
  useFactory: jest.fn(() => {
    const data = usersData;

    return {
      findOne: jest.fn((object) => {
        let foundUser;

        if (object.email) {
          foundUser = data.find((user) => user.email === object.email);
        } else if (object.id) {
          foundUser = data.find((user) => user.id === object.id);
        }

        if (!foundUser) {
          return undefined;
        }

        return Promise.resolve(foundUser);
      }),
      save: jest.fn((object) => {
        const foundUser = data.find((user) => user.email === object.email);

        if (foundUser) {
          return Promise.reject();
        }

        data.push(object);

        return Promise.resolve(object);
      }),
      create: jest.fn((object) => {
        const payload = {
          id: uuid(),
          email: object.email,
          password: object.password,
          created_at: new Date(),
          updated_at: new Date(),
        };

        return payload;
      }),
    };
  }),
};
