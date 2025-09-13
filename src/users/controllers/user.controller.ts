import {
  Controller,
  Body,
  Post,
  ValidationPipe,
  Param,
  Get,
  Put,
} from '@nestjs/common';
import { User } from '../interfaces/user.interface';
import { UserService } from '../services/users.service';
import { CreateUserDTO, UpdateUserDTO } from '../dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/create')
  create(@Body(ValidationPipe) createUserDto: CreateUserDTO, user: User) {
    return this.userService.create(createUserDto);
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
}
