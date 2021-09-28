import { BadRequestException } from '@nestjs/common';

export class EmailAlreadyRegisteredException extends BadRequestException {
  public constructor() {
    super('Email already registered');
  }
}
