import { Test, TestingModule } from '@nestjs/testing';
import { buildUser } from '../test/factories/user.factory';
import { UserConsentChangedEventCustomRepository } from './userConsentChangedEvent.repository';
import { User } from 'src/user/user.entity';
import { ConsentService } from './consent.service';
import { ConsentId } from './types';
import { buildUserConsentChangedEvent } from '../../src/test/factories/userConsentChangedEvent.factory';

describe('ConsentService', () => {
  const TEST_ERROR = 'TEST_ERROR';

  let consentService: ConsentService;
  let eventsRepository: jest.Mocked<UserConsentChangedEventCustomRepository>;
  let user: User;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        ConsentService,
        {
          provide: UserConsentChangedEventCustomRepository,
          useFactory: () => ({
            findEventsOrderedByCreation: jest.fn(),
            saveMany: jest.fn(),
          }),
        },
      ],
    }).compile();
    eventsRepository = testingModule.get(
      UserConsentChangedEventCustomRepository,
    );
    consentService = testingModule.get(ConsentService);
    user = buildUser();
  });

  describe('createUserConsentChangedEvents', () => {
    it('calls the repository accordingly', async () => {
      const testConsent = { id: ConsentId.email_notifications, enabled: true };

      const response = await consentService.createUserConsentChangedEvents(
        user.id,
        [testConsent],
      );

      expect(response).toBeUndefined();

      expect(eventsRepository.saveMany).toHaveBeenCalledTimes(1);
      expect(eventsRepository.saveMany).toHaveBeenCalledWith([
        {
          user_id: user.id,
          consent_id: testConsent.id,
          enabled: testConsent.enabled,
        },
      ]);
    });

    it('exceptions on repository.saveMany bubble up', async () => {
      eventsRepository.saveMany.mockRejectedValueOnce(TEST_ERROR);
      const testConsent = { id: ConsentId.email_notifications, enabled: true };

      await expect(() =>
        consentService.createUserConsentChangedEvents(user.id, [testConsent]),
      ).rejects.toEqual(TEST_ERROR);

      expect(eventsRepository.saveMany).toHaveBeenCalledTimes(1);
      expect(eventsRepository.saveMany).toHaveBeenCalledWith([
        {
          user_id: user.id,
          consent_id: testConsent.id,
          enabled: testConsent.enabled,
        },
      ]);
    });
  });

  describe('getConsentsForUser', () => {
    it('calls the repository accordingly and replays the events', async () => {
      const events = [
        buildUserConsentChangedEvent(user, ConsentId.email_notifications, true),
        buildUserConsentChangedEvent(user, ConsentId.sms_notifications, true),
      ];
      eventsRepository.findEventsOrderedByCreation.mockResolvedValueOnce(
        events,
      );

      const result = await consentService.getConsentsForUser(user);

      expect(
        eventsRepository.findEventsOrderedByCreation,
      ).toHaveBeenCalledTimes(1);
      expect(eventsRepository.findEventsOrderedByCreation).toHaveBeenCalledWith(
        user,
      );

      expect(
        result.find((i) => i.id === ConsentId.sms_notifications)?.enabled,
      ).toBeTruthy();
      expect(
        result.find((i) => i.id === ConsentId.email_notifications)?.enabled,
      ).toBeTruthy();
    });

    it('old events are overwritten', async () => {
      const events = [
        buildUserConsentChangedEvent(user, ConsentId.email_notifications, true),
        buildUserConsentChangedEvent(user, ConsentId.sms_notifications, true),
        buildUserConsentChangedEvent(
          user,
          ConsentId.email_notifications,
          false,
        ),
        buildUserConsentChangedEvent(user, ConsentId.sms_notifications, false),
      ];
      eventsRepository.findEventsOrderedByCreation.mockResolvedValueOnce(
        events,
      );

      const result = await consentService.getConsentsForUser(user);

      expect(
        eventsRepository.findEventsOrderedByCreation,
      ).toHaveBeenCalledTimes(1);
      expect(eventsRepository.findEventsOrderedByCreation).toHaveBeenCalledWith(
        user,
      );

      expect(
        result.find((i) => i.id === ConsentId.sms_notifications)?.enabled,
      ).toBe(false);
      expect(
        result.find((i) => i.id === ConsentId.email_notifications)?.enabled,
      ).toBe(false);
    });

    it('exceptions on repository.findEventsOrderedByCreation bubble up', async () => {
      eventsRepository.findEventsOrderedByCreation.mockRejectedValueOnce(
        TEST_ERROR,
      );

      await expect(() =>
        consentService.getConsentsForUser(user),
      ).rejects.toEqual(TEST_ERROR);

      expect(
        eventsRepository.findEventsOrderedByCreation,
      ).toHaveBeenCalledTimes(1);
      expect(eventsRepository.findEventsOrderedByCreation).toHaveBeenCalledWith(
        user,
      );
    });
  });
});
