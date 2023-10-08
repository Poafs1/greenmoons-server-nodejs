import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigsService } from '../configs/configs.service';
import axios from 'axios';
import { RedisService } from '../redis/redis.service';
import { MovieDto, MoviesDto, MoviesFilterDto } from './dto/movie.dto';
import { PaginationInputDto } from '../utils/dto/pagination.dto';
import { pageInfo } from '../utils/helpers/pagination.helper';
import { JwtDto } from '../auth/dto/jwt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieFavoriteEntity } from './entities/movieFavorite.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MovieService {
  private moviesPrefix = 'movies';

  constructor(
    private configsService: ConfigsService,
    private redisService: RedisService,
    @InjectRepository(MovieFavoriteEntity)
    private movieFavoriteEntity: Repository<MovieFavoriteEntity>,
  ) {}

  private mapMovie(movie: MovieDto): MovieDto {
    return {
      ...movie,
      is_favorite: movie.is_favorite || false,
    };
  }

  private mapMovies(movies: [MovieDto[], number], limit: number, offset: number): MoviesDto {
    const [items, total] = movies;

    const edges = items.map((item) => ({
      node: this.mapMovie(item),
    }));

    return {
      edges,
      pageInfo: pageInfo(offset, limit, total),
    };
  }

  async fetchMovies(): Promise<Map<number, MovieDto>> {
    const { movieApi } = this.configsService;

    let foundMovies = await this.redisService.get(this.moviesPrefix);

    if (!foundMovies) {
      const { data } = await axios.get(movieApi);

      const { movies } = data;

      const value = JSON.stringify(movies);

      await this.redisService.set(this.moviesPrefix, value, 60 * 60 * 24); // 1 day cache

      foundMovies = value;
    }

    const movies = JSON.parse(foundMovies);

    const map = new Map();

    movies.forEach((movie) => {
      map.set(movie.id, movie);
    });

    return map;
  }

  async movies(user: JwtDto, filter: MoviesFilterDto & PaginationInputDto): Promise<MoviesDto> {
    try {
      const { offset, limit, favoriteOnly } = filter;

      const offsetNumber = Number(offset);
      const limitNumber = Number(limit);

      const movies = await this.fetchMovies();

      const foundMovieFavorite = await this.movieFavoriteEntity.find({
        where: {
          user_id: user.sub,
          is_favorite: true,
        },
      });

      const favoriteMoviesId = foundMovieFavorite.map((movieFavorite) => movieFavorite.movie_id);

      let result = Array.from(movies.values());

      if (favoriteOnly) {
        const items = Array.from(movies.values()).filter((movie) =>
          favoriteMoviesId.includes(movie.id),
        );

        const addFavorite = items.map((item) => ({
          ...item,
          is_favorite: true,
        }));

        result = addFavorite;
      } else {
        foundMovieFavorite.forEach((movieFavorite) => {
          const foundMovie = movies.get(movieFavorite.movie_id);

          if (foundMovie) {
            foundMovie.is_favorite = movieFavorite.is_favorite;
          }
        });
      }

      const total = result.length;
      const items = result.slice(offsetNumber, offsetNumber + limitNumber);

      return this.mapMovies([items, total], limitNumber, offsetNumber);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async movie(user: JwtDto, id: string): Promise<MovieDto> {
    try {
      const movies = await this.fetchMovies();

      const foundMovie = movies.get(Number(id));

      if (!foundMovie) {
        throw new NotFoundException('Movie not found');
      }

      const foundMovieFavorite = await this.movieFavoriteEntity.findOne({
        where: {
          user_id: user.sub,
          movie_id: id,
        },
      });

      return this.mapMovie({
        ...foundMovie,
        is_favorite: foundMovieFavorite ? foundMovieFavorite.is_favorite : false,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async movieFavoritePatch(user: JwtDto, id: string): Promise<boolean> {
    try {
      const foundMovieFavorite = await this.movieFavoriteEntity.findOne({
        where: {
          user_id: user.sub,
          movie_id: id,
        },
      });

      if (!foundMovieFavorite) {
        await this.movieFavoriteEntity.save(
          this.movieFavoriteEntity.create({
            user_id: user.sub,
            movie_id: Number(id),
            is_favorite: true,
          }),
        );

        return true;
      }

      const isFavorite = !foundMovieFavorite.is_favorite;

      await this.movieFavoriteEntity.update(foundMovieFavorite.id, {
        is_favorite: isFavorite,
      });

      return isFavorite;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
