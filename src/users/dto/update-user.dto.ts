import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsEnum,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { GENDER } from '../constants';
import { Type } from 'class-transformer';
import { UpdateAddressDto } from './address.dto';

export class UpdateUserDTO {
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
  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Object.keys(GENDER))
  gender: string;

  @IsString()
  picture: string;

  @ValidateNested()
  @Type(() => UpdateAddressDto)
  @IsObject()
  address: UpdateAddressDto;
}
