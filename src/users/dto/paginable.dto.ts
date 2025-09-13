import { IsNotEmpty, IsNumberString } from 'class-validator';

export class PaginableDto {
  @IsNumberString()
  @IsNotEmpty()
  page: number;


  @IsNumberString()
  @IsNotEmpty()
  limit: number;
}