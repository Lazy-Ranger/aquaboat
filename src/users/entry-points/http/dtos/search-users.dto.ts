import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { IUserSearchParams } from "../../../contracts";

export class SearchUsersDto implements IUserSearchParams {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit = 100;

  @IsOptional()
  @IsString()
  filter?: string;
}
