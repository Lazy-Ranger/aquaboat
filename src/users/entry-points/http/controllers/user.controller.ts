import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { UserService } from "../../../application/services";
import { CreateUserDto, SearchUsersDto, UpdateUserDto } from "../dtos";

@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get("search")
  getUsers(@Query() query: SearchUsersDto) {
    return this.userService.searchUsers(query);
  }

  @Get(":id")
  getUserById(@Param("id") id: string) {
    return this.userService.getUserById(id);
  }

  @Put(":id")
  updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(":id")
  deleteUser(@Param("id") id: string) {
    return this.userService.deleteUser(id);
  }
}
