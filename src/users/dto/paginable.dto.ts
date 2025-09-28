import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsObject,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

import { USER_STATUS, GENDER, COUNTRY } from '../constants';
import { QueryAddressDto } from './address.dto';

export class PaginableDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  limit: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @IsEnum(Object.keys(USER_STATUS), {
    message:
      'Status must be one of the following values : ' +
      Object.keys(USER_STATUS).join(', '),
  })
  status?: string;

  @IsString()
  @IsOptional()
  @IsEnum(Object.keys(GENDER), {
    message:
      'Gender must be one of the following values : ' +
      Object.keys(GENDER).join(', '),
  })
  gender?: string;

  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @IsString()
  filter: string;
}
