import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto, UserIdParams } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { NotFoundInterceptor } from '../interceptors/notFound';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseInterceptors(NotFoundInterceptor)
  public getOne(@Param() params: UserIdParams) {
    return this.userService.findOneById(params.id);
  }

  @Post()
  public create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Delete(':id')
  public delete(@Param() params: UserIdParams) {
    return this.userService.delete(params.id);
  }
}
