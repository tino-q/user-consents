import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { HealthService } from './health.service';

describe('AppController', () => {
  let appController: AppController;
  let healthService: jest.Mocked<HealthService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: HealthService,
          useFactory: () => ({ getHealth: jest.fn() }),
        },
      ],
    }).compile();

    appController = app.get(AppController);
    healthService = app.get(HealthService);
  });

  describe('Health check', () => {
    it('calls healthService.getHealth and returns its result', async () => {
      const health = 'result';
      healthService.getHealth.mockReturnValueOnce(health as any);
      const result = await appController.getHealth();
      expect(result).toEqual(health);
    });

    it('bubbles healthService.getHealth exceptions', async () => {
      const error = 'error';
      healthService.getHealth.mockImplementationOnce(() => {
        throw error;
      });
      expect(() => appController.getHealth()).toThrow(error);
    });
  });
});
