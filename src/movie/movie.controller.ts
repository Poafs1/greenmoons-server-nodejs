import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { MovieDto, MoviesDto } from './dto/movie.dto';
import { PaginationInputDto } from 'src/utils/dto/pagination.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async movies(@Query() paginationInputDto: PaginationInputDto): Promise<MoviesDto> {
    return this.movieService.movies(paginationInputDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async movie(@Param('id') id: string): Promise<MovieDto> {
    return this.movieService.movie(id);
  }
}
