import { Type } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Gender } from "../../../contracts";
import { CreateAddressDto } from "./address.dto";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

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
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsUrl()
  picture?: string;

  @Type(() => CreateAddressDto)
  @ValidateNested()
  @IsObject()
  address: CreateAddressDto;
}
