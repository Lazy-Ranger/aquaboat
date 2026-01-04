import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from "class-validator";
import { ILoginUserRequest } from "../../../contracts";

export class LoginUserDto implements ILoginUserRequest {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(30)
  password!: string;
}
