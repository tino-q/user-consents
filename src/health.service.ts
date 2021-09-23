import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  public getHealth(): { status: string; uptime: number } {
    return {
      status: 'ok',
      uptime: process.uptime(),
    };
  }
}
