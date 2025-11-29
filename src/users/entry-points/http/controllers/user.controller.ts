import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
// import { UserService } from "../../../application/services";
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  RetrieveUserUseCase,
  UpdateUserUseCase,
} from "../../../application/use-cases";
import {
  UserAlreadyExistsError,
  UserNotFoundError,
  UserUpdateFailedError,
} from "../../../errors";
import { CreateUserDto, SearchUsersDto, UpdateUserDto } from "../dtos";

@Controller("/users")
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly retrieveUserUseCase: RetrieveUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.createUserUseCase.create(createUserDto);
    } catch (err) {
      if (err instanceof UserAlreadyExistsError) {
        throw new ConflictException(err);
      }
    }
  }

  @Get("search")
  async getUsers(@Query() query: SearchUsersDto) {
    return await this.retrieveUserUseCase.searchUsers(query);
  }

  @Get(":id")
  async getUserById(@Param("id") id: string) {
    try {
      return await this.retrieveUserUseCase.getUserById(id);
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        throw new NotFoundException(err);
      }
    }
  }

  @Put(":id")
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.updateUserUseCase.updateUser(id, updateUserDto);
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        throw new NotFoundException(err);
      } else if (err instanceof UserUpdateFailedError) {
        throw new InternalServerErrorException(err);
      }
    }
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: string) {
    try {
      return await this.deleteUserUseCase.deleteUser(id);
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        throw new NotFoundException(err);
      }
    }
  }
}
