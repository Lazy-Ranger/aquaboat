import {
  Controller,
  Body,
  Post,
  ValidationPipe,
  Param,
  Get,
  Put,
  Query,
  Delete,
} from '@nestjs/common';
import { User } from '../interfaces/user.interface';
import { UserService } from '../services/users.service';
import { CreateUserDTO, UpdateUserDTO } from '../dto';
import { PaginableDto } from '../dto/paginable.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/create')
  create(@Body(ValidationPipe) createUserDto: CreateUserDTO, user: User) {
    return this.userService.create(createUserDto);
  }

  @Get('/search')
  getUsers(@Query(ValidationPipe) query: PaginableDto) {
    const data = this.userService.searchUsers(query);
    return data;
  }

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Put('/:id')
  updateUser(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDTO,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
