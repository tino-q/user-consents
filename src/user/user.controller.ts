import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateUserDto,
  SerializedUserDto,
  SerializedUserWithConsentsDto,
  UserIdParams,
} from './user.dto';
import { UserService } from './user.service';
import { NotFoundInterceptor } from '../interceptors/notFound';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './user.entity';
import { ConsentService } from '../../src/consent/consent.service';

@ApiTags('Users')
@Controller('users')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly consentService: ConsentService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: "Find an user by it's id" })
  @ApiOkResponse({
    description: 'The serialized user',
    type: SerializedUserWithConsentsDto,
  })
  @UseInterceptors(NotFoundInterceptor)
  public async getOne(
    @Param() params: UserIdParams,
  ): Promise<SerializedUserWithConsentsDto | null> {
    const user: User | null = await this.userService.findOneById(params.id);

    if (!user) {
      return null;
    }

    const consents = await this.consentService.getConsentsForUser(user);

    return {
      id: user.id,
      email: user.email,
      consents,
    };
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
