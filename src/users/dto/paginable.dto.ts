import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

import { USER_STATUS, USER_GENDER, USER_COUNTRY } from '../../constants';

export class PaginableDto {
  @IsNumberString()
  @IsNotEmpty()
  page: number;

  @IsNumberString()
  @IsNotEmpty()
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
  @IsEnum(Object.keys(USER_GENDER), {
    message:
      'Gender must be one of the following values : ' +
      Object.keys(USER_GENDER).join(', '),
  })
  gender?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  @IsEnum(Object.keys(USER_COUNTRY), {
    message:
      'Country must be one of the following values : ' +
      Object.keys(USER_COUNTRY).join(', '),
  })
  country?: string;

  @IsOptional()
  @Type(() => Date)
  createdAt?: string;
}
