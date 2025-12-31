import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Put,
  Query,
  UseGuards
} from "@nestjs/common";
import { JwtAuthGuard } from "../../../../auth/application/services";
import {
  RetrieveUserUseCase,
  SearchUsersUseCase,
  UpdateUserUseCase
} from "../../../application/use-cases";
import { IUserRetrieveParams, RetrieveUserBy } from "../../../contracts";
import { UserNotFoundError, UserUpdateFailedError } from "../../../errors";
import { SearchUsersDto, UpdateUserDto } from "../dtos";

@Controller("/users")
export class UserController {
  constructor(
    private readonly retrieveUserUC: RetrieveUserUseCase,
    private readonly searchUsersUC: SearchUsersUseCase,
    private readonly updateUserUC: UpdateUserUseCase
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get("search")
  async getUsers(@Query() query: SearchUsersDto) {
    return await this.searchUsersUC.execute(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getUserById(@Param("id") id: string) {
    const userRetrieveParams: IUserRetrieveParams = {
      by: RetrieveUserBy.ID,
      value: id
    };

    try {
      return await this.retrieveUserUC.execute(userRetrieveParams);
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        throw new NotFoundException(err);
      }
    }
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    try {
      return await this.updateUserUC.execute(id, updateUserDto);
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        throw new NotFoundException(err);
      } else if (err instanceof UserUpdateFailedError) {
        throw new InternalServerErrorException(err);
      }
    }
  }
}
