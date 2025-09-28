import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsIn,
  IsOptional,
} from 'class-validator';
import { COUNTRY } from '../constants';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  line1: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  line2: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  city: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  state: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(10)
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(COUNTRY), {
    message:
      'Country must be one of the following values : ' +
      Object.values(COUNTRY).join(', '),
  })
  country: string;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}

export class QueryAddressDto {
  @IsOptional()
  @IsString()
  city?: string;
}
