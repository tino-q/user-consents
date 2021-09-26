import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@Controller()
export class AppController {
  constructor(private readonly appService: HealthService) {}

  @ApiTags('System')
  @Get('/health')
  getHealth(): { status: string; uptime: number } {
    return this.appService.getHealth();
  }
}
