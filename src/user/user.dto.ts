import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsUUID, ValidateNested } from 'class-validator';
import { ConsentsDto } from '../../src/consent/consent.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'test@email.com' })
  @IsEmail()
  email: string;
}

export class UserIdParams {
  @ApiProperty({ example: '9551823d-403a-48c5-871b-3201be7ec07c' })
  @IsUUID()
  id: string;
}

export class UserDto {
  @ApiProperty({ type: UserIdParams })
  @ValidateNested()
  @Type(() => UserIdParams)
  user: UserIdParams;
}

export class SerializedUserDto extends IntersectionType(
  CreateUserDto,
  UserIdParams,
) {}

export class SerializedUserWithConsentsDto extends IntersectionType(
  SerializedUserDto,
  ConsentsDto,
) {}

export class CreateUserConsentChangedEventDto extends IntersectionType(
  UserDto,
  ConsentsDto,
) {}
