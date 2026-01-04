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
  ValidateNested
} from "class-validator";
import { IRegisterUserRequest } from "src/auth/contracts";
import { Gender } from "../../../../user/contracts";
import { CreateAddressDto } from "./address.dto";

export class RegisterUserDto implements IRegisterUserRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName!: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone!: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender!: Gender;

  @IsOptional()
  @IsUrl()
  picture?: string;

  @Type(() => CreateAddressDto)
  @ValidateNested()
  @IsObject()
  address: CreateAddressDto;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(30)
  password: string;
}
