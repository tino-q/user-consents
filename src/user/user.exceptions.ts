import { HttpException } from '@nestjs/common';

export class EmailAlreadyRegisteredException extends HttpException {
  public constructor() {
    super('Email already registered', 422);
  }
}
