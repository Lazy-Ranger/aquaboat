import { PartialType } from "@nestjs/mapped-types";
import { IUserUpdateParams } from "../../../contracts";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto
  extends PartialType(CreateUserDto)
  implements IUserUpdateParams {}
