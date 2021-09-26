import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class SerializedHealth {
  @ApiProperty()
  status: 'ok';

  @ApiProperty()
  uptime: number;
}

@Injectable()
export class HealthService {
  public getHealth(): SerializedHealth {
    return {
      status: 'ok',
      uptime: process.uptime(),
    };
  }
}
