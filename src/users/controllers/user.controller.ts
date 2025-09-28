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
  Req,
} from '@nestjs/common';
import { UserService } from '../services/users.service';
import { CreateUserDTO, UpdateUserDTO } from '../dto';
import { PaginableDto } from '../dto/paginable.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/')
  create(@Body() createUserDto: CreateUserDTO) {
    return this.userService.create(createUserDto);
  }

  @Get('/search')
  getUsers(@Query() query: PaginableDto, @Req() req) {
    console.log(JSON.parse(query.filter));

    try  {
      JSON.parse(query.filter);
    } catch(err) {
      return {}
    }

    const data = this.userService.searchUsers(query);
    return data;
  }

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Put('/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
