import { IsEmail, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;
}

export class UserIdParams {
  @IsUUID()
  id: string;
}
