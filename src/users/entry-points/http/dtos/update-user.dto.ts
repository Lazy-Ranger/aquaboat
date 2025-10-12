import { PartialType } from "@nestjs/mapped-types";
import { IUserUpdateParams } from "src/users/contracts";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto
  extends PartialType(CreateUserDto)
  implements IUserUpdateParams {}
