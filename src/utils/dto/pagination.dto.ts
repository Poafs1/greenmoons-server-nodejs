import { IsBoolean, IsNotEmpty, IsNumberString } from 'class-validator';

export class PaginationInputDto {
  @IsNumberString()
  offset: number;

  @IsNumberString()
  limit: number;
}

export class PaginationDto {
  @IsNotEmpty()
  @IsBoolean()
  hasNextPage: boolean;

  @IsNotEmpty()
  @IsBoolean()
  hasPreviousPage: boolean;

  // For support cursor pagination
  // startCursor: string;
  // endCursor: string;
}
