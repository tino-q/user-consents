import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthService, SerializedHealth } from './health.service';

@Controller()
export class AppController {
  constructor(private readonly appService: HealthService) {}

  @ApiTags('System')
  @ApiOperation({
    summary: 'Check the health of the service by requesting the uptime',
  })
  @Get('/health')
  @ApiOkResponse({
    type: SerializedHealth,
  })
  getHealth(): { status: string; uptime: number } {
    return this.appService.getHealth();
  }
}
