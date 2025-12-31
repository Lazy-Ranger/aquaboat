import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from "class-validator";
import { LoginUserRequest } from "../../../contracts";

export class LoginUserDto implements LoginUserRequest {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(30)
  password: string;
}
