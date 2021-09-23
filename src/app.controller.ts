import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller()
export class AppController {
  constructor(private readonly appService: HealthService) {}

  @Get('/health')
  getHealth(): { status: string; uptime: number } {
    return this.appService.getHealth();
  }
}
