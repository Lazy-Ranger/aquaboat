import { PartialType } from "@nestjs/mapped-types";
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from "class-validator";
import {
  COUNTRY,
  ICreateAddressRequest,
  IUpdateAddressRequest
} from "../../../../user/contracts";

export class CreateAddressDto implements ICreateAddressRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  line1!: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  line2?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  city!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  state!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(10)
  postalCode!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(COUNTRY)
  country!: string;
}

export class UpdateAddressDto
  extends PartialType(CreateAddressDto)
  implements IUpdateAddressRequest {}
