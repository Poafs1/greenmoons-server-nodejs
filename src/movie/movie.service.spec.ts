import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { configsServiceProvider } from '../test/providers/configs.provider';
import { redisServiceProvider } from '../test/providers/redis.provider';
import { mockExternalMovieApi } from '../test/mock/externalApi.mock';
import { movieFavoriteEntityProvider } from '../test/providers/entities/movieFavorite.provider';
import { usersData } from '../test/mock/users.mock';
import { moviesData } from '../test/mock/movies.mock';
import { MoviesFilterDto } from './dto/movie.dto';
import { PaginationInputDto } from 'src/utils/dto/pagination.dto';

describe('MovieService', () => {
  let service: MovieService;

  let movies;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        configsServiceProvider,
        redisServiceProvider,
        movieFavoriteEntityProvider,
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);

    movies = mockExternalMovieApi;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchMovies', () => {
    it('should return hash map of movies', async () => {
      const result = await service.fetchMovies();

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBeGreaterThan(0);
      expect(result.get(1)).toEqual(movies[0]);
    });
  });

  describe('movieFavoritePatch', () => {
    it('should toggle favorite movie for user', async () => {
      const user = {
        sub: usersData[0].id,
        email: usersData[0].email,
      };

      const movieId = moviesData[3].id;

      const result = await service.movieFavoritePatch(user, String(movieId));

      expect(result).toBe(true);

      const result2 = await service.movieFavoritePatch(user, String(movieId));

      expect(result2).toBe(false);
    });
  });

  describe('movies', () => {
    it('should return movies with pagination', async () => {
      const user = {
        sub: usersData[0].id,
        email: usersData[0].email,
      };

      const filter: MoviesFilterDto & PaginationInputDto = {
        limit: 3,
        offset: 0,
        favoriteOnly: false,
      };

      const result = await service.movies(user, filter);

      expect(result).toEqual({
        edges: expect.any(Array),
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
        },
      });

      expect(result.edges.length).toBe(filter.limit);
    });

    it('should return favorite movies only', async () => {
      const user = {
        sub: usersData[0].id,
        email: usersData[0].email,
      };

      const filter: MoviesFilterDto & PaginationInputDto = {
        limit: 3,
        offset: 0,
        favoriteOnly: true,
      };

      const result = await service.movies(user, filter);

      result.edges.forEach(({ node }) => {
        expect(node.is_favorite).toBe(true);
      });
    });
  });

  describe('movie', () => {
    it('should return movie by id', async () => {
      const user = {
        sub: usersData[0].id,
        email: usersData[0].email,
      };

      const movieId = moviesData[0].id;

      const result = await service.movie(user, String(movieId));

      expect(result).toMatchObject(moviesData[0]);
    });

    it('should return movie by id with favorite flag', async () => {
      const user = {
        sub: usersData[0].id,
        email: usersData[0].email,
      };

      const movieId = moviesData[0].id;

      const result = await service.movie(user, String(movieId));

      expect(result.is_favorite).toBe(true);
    });

    it('should throw error if movie not found', async () => {
      try {
        const user = {
          sub: usersData[0].id,
          email: usersData[0].email,
        };

        const movieId = 999999;

        await service.movie(user, String(movieId));
      } catch ({ response }) {
        expect(response.status).toBe(404);
        expect(response.message).toBe('Movie not found');
      }
    });
  });
});
