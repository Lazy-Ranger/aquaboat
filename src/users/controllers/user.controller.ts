import { Controller, Body, Post } from '@nestjs/common';
import { User } from '../interfaces/user.interface';
import { UserService } from '../services/users.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/create')
  create(@Body() user: User) {
    return this.userService.create(user);
  }
}
