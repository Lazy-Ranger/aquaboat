import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsPhoneNumber,
  IsEnum,
  ValidateNested,
  IsObject,
  IsOptional,
  IsIn,
} from 'class-validator';
import { GENDER, COUNTRY, USER_STATUS } from '../constants';
import { Type } from 'class-transformer';
import { CreateAddressDto } from './address.dto';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Object.keys(GENDER))
  gender: string;

  @IsString()
  picture: string;

  @IsString()
  @IsEnum(Object.keys(USER_STATUS))
  @IsOptional()
  status: string;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  @IsObject()
  address: CreateAddressDto;
}
