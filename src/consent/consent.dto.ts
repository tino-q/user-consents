import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { ConsentId } from './types';

export class ConsentDto {
  @ApiProperty({ enum: ConsentId, example: ConsentId.email_notifications })
  @IsEnum(ConsentId)
  id: ConsentId;

  @ApiProperty()
  @IsBoolean()
  enabled: boolean;
}

export class ConsentsDto {
  @ApiProperty({ type: [ConsentDto] })
  @ValidateNested()
  @IsArray()
  @Type(() => ConsentDto)
  @ArrayNotEmpty()
  consents: ConsentDto[];
}
