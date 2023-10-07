import { Controller, Get, Param, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { MovieDto, MoviesDto, MoviesFilterDto } from './dto/movie.dto';
import { PaginationInputDto } from 'src/utils/dto/pagination.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async movies(
    @Request() req,
    @Query() filter: MoviesFilterDto & PaginationInputDto,
  ): Promise<MoviesDto> {
    return this.movieService.movies(req.user, filter);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async movie(@Request() req, @Param('id') id: string): Promise<MovieDto> {
    return this.movieService.movie(req.user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/favorite')
  async movieFavoritePatch(@Request() req, @Param('id') id: string): Promise<boolean> {
    return this.movieService.movieFavoritePatch(req.user, id);
  }
}
