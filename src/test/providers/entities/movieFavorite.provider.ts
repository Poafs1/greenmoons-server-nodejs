import { getRepositoryToken } from '@nestjs/typeorm';
import { MovieFavoriteEntity } from '../../../movie/entities/movieFavorite.entity';
import { usersData } from '../../../test/mock/users.mock';
import { moviesData } from '../../../test/mock/movies.mock';

export const movieFavoriteEntityProvider = {
  provide: getRepositoryToken(MovieFavoriteEntity),
  useFactory: jest.fn(() => {
    let incrementId = 2;
    const data = [
      {
        id: 1,
        user_id: usersData[0].id,
        movie_id: moviesData[0].id,
        is_favorite: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        user_id: usersData[0].id,
        movie_id: moviesData[1].id,
        is_favorite: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    return {
      find: jest.fn(({ where }) => {
        const { user_id } = where;

        const found = data.filter((item) => {
          return item.user_id === user_id;
        });

        return Promise.resolve(found);
      }),
      findOne: jest.fn(({ where }) => {
        const payload = {
          user_id: where.user_id,
          movie_id: where.movie_id,
        };

        const found = data.find((item) => {
          return item.user_id === payload.user_id && item.movie_id === Number(payload.movie_id);
        });

        if (!found) {
          return undefined;
        }

        return Promise.resolve(found);
      }),
      save: jest.fn((object) => {
        data.push(object);

        return Promise.resolve(object);
      }),
      create: jest.fn((object) => {
        const payload = {
          id: incrementId,
          user_id: object.user_id,
          movie_id: object.movie_id,
          is_favorite: object.is_favorite,
          created_at: new Date(),
          updated_at: new Date(),
        };

        incrementId += 1;

        return payload;
      }),
      update: jest.fn((id, { is_favorite }) => {
        const found = data.find((item) => {
          return item.id === id;
        });

        if (!found) {
          return Promise.reject();
        }

        const foundIndex = data.findIndex((item) => {
          return item.id === id;
        });

        found.is_favorite = is_favorite;

        data[foundIndex] = found;

        return Promise.resolve();
      }),
    };
  }),
};
