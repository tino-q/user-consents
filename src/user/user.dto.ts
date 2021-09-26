import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsUUID } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'test@email.com' })
  @IsEmail()
  email: string;
}

export class UserIdParams {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SerializedUserDto {
  @ApiProperty({ example: 'test@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsUUID()
  id: string;
}
