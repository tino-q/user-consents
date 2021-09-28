import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/user/user.entity';

import { buildUser } from '../test/factories/user.factory';
import { ConsentController } from './consent.controller';
import { ConsentService } from './consent.service';
import { BadRequestException } from '@nestjs/common';
import { ConsentId } from './types';
import { ConsentDto } from './consent.dto';
import { CreateUserConsentChangedEventDto } from '../../src/user/user.dto';
import { UserService } from '../../src/user/user.service';

describe('ConsentController', () => {
  const TEST_ERROR = 'TEST_ERROR';

  let consentController: ConsentController;
  let consentService: jest.Mocked<ConsentService>;
  let userService: jest.Mocked<UserService>;
  let user: User;
  let testDto: CreateUserConsentChangedEventDto;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [ConsentController],
      providers: [
        {
          provide: ConsentService,
          useFactory: () => ({
            createUserConsentChangedEvents: jest.fn(),
          }),
        },
        {
          provide: UserService,
          useFactory: () => ({
            findOneById: jest.fn(),
          }),
        },
      ],
    }).compile();
    consentController = testingModule.get<ConsentController>(ConsentController);
    consentService = testingModule.get(ConsentService);
    userService = testingModule.get(UserService);
    user = buildUser();

    testDto = {
      user: {
        id: user.id,
      },
      consents: [],
    };
  });

  describe('Create an event', () => {
    it('Calls consentService.createUserConsentChangedEvents accordingly', async () => {
      userService.findOneById.mockResolvedValueOnce(user);
      const result = await consentController.createUserConsentChangedEvent(
        testDto,
      );
      expect(result).toBeUndefined();

      expect(userService.findOneById).toHaveBeenCalledTimes(1);
      expect(userService.findOneById).toHaveBeenCalledWith(testDto.user.id);

      expect(
        consentService.createUserConsentChangedEvents,
      ).toHaveBeenCalledTimes(1);
      expect(
        consentService.createUserConsentChangedEvents,
      ).toHaveBeenCalledWith(testDto.user.id, testDto.consents);
    });

    it('Bubbles up exceptions on consentService.createUserConsentChangedEvents', async () => {
      userService.findOneById.mockResolvedValueOnce(user);
      consentService.createUserConsentChangedEvents.mockRejectedValueOnce(
        TEST_ERROR,
      );
      await expect(
        consentController.createUserConsentChangedEvent(testDto),
      ).rejects.toEqual(TEST_ERROR);

      expect(
        consentService.createUserConsentChangedEvents,
      ).toHaveBeenCalledTimes(1);
      expect(
        consentService.createUserConsentChangedEvents,
      ).toHaveBeenCalledWith(testDto.user.id, testDto.consents);
    });

    it.each([
      [
        { id: ConsentId.email_notifications, enabled: true },
        { id: ConsentId.email_notifications, enabled: false },
      ],
      [
        { id: ConsentId.sms_notifications, enabled: true },
        { id: ConsentId.sms_notifications, enabled: false },
      ],
      [
        { id: ConsentId.email_notifications, enabled: true },
        { id: ConsentId.sms_notifications, enabled: false },
        { id: ConsentId.email_notifications, enabled: false },
      ],
    ])(
      'Fails if any consent id is repeated in the consents array',
      async (...consents: ConsentDto[]) => {
        testDto.consents = consents;

        await expect(() =>
          consentController.createUserConsentChangedEvent(testDto),
        ).rejects.toEqual(
          new BadRequestException('Consents array must contain unique entries'),
        );

        expect(
          consentService.createUserConsentChangedEvents,
        ).toHaveBeenCalledTimes(0);
      },
    );
  });
});
