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
} from 'class-validator';
import { USER_GENDER, USER_COUNTRY, USER_STATUS } from '../../constants';
import { Type } from 'class-transformer';

export class AddressDto {
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
  @IsEnum(Object.keys(USER_COUNTRY))
  country: string;
}

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
  @IsEnum(Object.keys(USER_GENDER))
  gender: string;

  @IsString()
  picture: string;

  @IsString()
  @IsEnum(Object.keys(USER_STATUS))
  @IsOptional()
  status: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsObject()
  address: AddressDto;
}
