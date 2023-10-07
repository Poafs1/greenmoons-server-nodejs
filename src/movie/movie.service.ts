import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigsService } from 'src/configs/configs.service';
import axios from 'axios';
import { RedisService } from 'src/redis/redis.service';
import { MovieDto, MoviesDto } from './dto/movie.dto';
import { PaginationInputDto } from 'src/utils/dto/pagination.dto';
import { pageInfo } from 'src/utils/helpers/pagination.helper';

@Injectable()
export class MovieService {
  private moviesPrefix = 'movies';

  constructor(private configsService: ConfigsService, private redisService: RedisService) {}

  private mapMovie(movie: MovieDto): MovieDto {
    return movie;
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

  async fetchMovies(): Promise<MovieDto[]> {
    const { movieApi } = this.configsService;

    let foundMovies = await this.redisService.get(this.moviesPrefix);

    if (!foundMovies) {
      const { data } = await axios.get(movieApi);

      const { movies } = data;

      await this.redisService.set(this.moviesPrefix, JSON.stringify(movies), 60 * 60 * 24); // 1 day cache

      foundMovies = data;
    }

    const movies = JSON.parse(foundMovies);

    return movies;
  }

  async movies(paginationInputDto: PaginationInputDto): Promise<MoviesDto> {
    try {
      const { offset, limit } = paginationInputDto;

      const movies = await this.fetchMovies();

      const offsetNumber = Number(offset);
      const limitNumber = Number(limit);

      const total = movies.length;
      const items = movies.slice(offsetNumber, offsetNumber + limitNumber);

      return this.mapMovies([items, total], limitNumber, offsetNumber);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async movie(id: string): Promise<MovieDto> {
    try {
      const movies = await this.fetchMovies();

      const foundMovie = movies.find((movie) => movie.id === Number(id));

      if (!foundMovie) {
        throw new NotFoundException('Movie not found');
      }

      return this.mapMovie(foundMovie);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
