import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let healthService: HealthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [HealthService],
    }).compile();

    healthService = app.get(HealthService);
  });

  describe('Health check', () => {
    it('return status ok and a postive integer for uptime', async () => {
      const health: { status: string; uptime: number } =
        healthService.getHealth();
      expect(health.status).toEqual('ok');
      expect(health.uptime).toEqual(expect.any(Number));
      expect(health.uptime).toBeGreaterThan(0);
    });
  });
});
