import {
  IsArray,
  IsBoolean,
  IsBooleanString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

export class MovieDto {
  @IsNumber()
  id: number;

  @IsArray()
  movieCode: string[];

  @IsString()
  title_en: string;

  @IsString()
  title_th: string;

  @IsNumber()
  rating_id: number;

  @IsString()
  rating: string;

  @IsString()
  duration: number;

  @IsString()
  release_date: string;

  @IsString()
  sneak_date: string;

  @IsString()
  synopsis_th: string;

  @IsString()
  synopsis_en: string;

  @IsString()
  director: string;

  @IsString()
  actor: string;

  @IsString()
  genre: string;

  @IsString()
  poster_ori: string;

  @IsString()
  poster_url: string;

  @IsString()
  trailer: string;

  @IsString()
  tr_ios: string;

  @IsString()
  tr_hd: string;

  @IsString()
  tr_sd: string;

  @IsString()
  tr_mp4: string;

  @IsString()
  date_update: string;

  @IsString()
  trailer_cms_id: string;

  @IsString()
  trailer_ivx_key: string;

  @IsBoolean()
  is_favorite: boolean;
}

export class MovieEdgeDto {
  @IsString()
  cursor?: string | null;

  @IsObject()
  @IsNotEmpty()
  node: MovieDto;
}

export class MoviesDto {
  @IsNotEmpty()
  @IsObject()
  pageInfo: PaginationDto;

  @IsNotEmpty()
  @IsArray()
  edges: MovieEdgeDto[];
}

export class MoviesFilterDto {
  @IsOptional()
  @IsBooleanString()
  favoriteOnly: boolean;
}
