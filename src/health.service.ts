import { Injectable } from '@nestjs/common';
import { SerializedHealth } from './health.dto';

@Injectable()
export class HealthService {
  public getHealth(): SerializedHealth {
    return {
      status: 'ok',
      uptime: process.uptime(),
    };
  }
}
