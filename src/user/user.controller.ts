import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto, SerializedUserDto, UserIdParams } from './user.dto';
import { UserService } from './user.service';
import { NotFoundInterceptor } from '../interceptors/notFound';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Consents')
@Controller('users')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: "Find an user by it's id" })
  @ApiOkResponse({
    description: 'The serialized user',
    type: SerializedUserDto,
  })
  @UseInterceptors(NotFoundInterceptor)
  public getOne(@Param() params: UserIdParams) {
    return this.userService.findOneById(params.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create an user with an email' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: SerializedUserDto,
  })
  public create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SerializedUserDto> {
    return this.userService.create(createUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete an user by it's id" })
  @ApiOkResponse({
    description: 'User deleted',
  })
  public delete(@Param() params: UserIdParams) {
    return this.userService.delete(params.id);
  }
}
