import { TestingModule, Test } from '@nestjs/testing';
import { buildUser } from '../../src/test/factories/user.factory';
import { User } from '../../src/user/user.entity';
import { Repository } from 'typeorm';
import { UserConsentChangedEvent } from './userConsentChangedEvent.entity';
import { UserConsentChangedEventCustomRepository } from './userConsentChangedEvent.repository';
import { buildUserConsentChangedEvent } from '../../src/test/factories/userConsentChangedEvent.factory';
import { ConsentId } from './types';
import { NotFoundException } from '@nestjs/common';

describe('UserConsentChangedEventCustomRepository', () => {
  const TEST_ERROR = 'TEST_ERROR';

  let eventCustomRepository: jest.Mocked<UserConsentChangedEventCustomRepository>;
  let eventRepository: jest.Mocked<Repository<UserConsentChangedEvent>>;
  let user: User;

  let getManyMock: jest.Mock;
  let orderByMock: jest.Mock;
  let whereMock: jest.Mock;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [UserConsentChangedEventCustomRepository],
    }).compile();
    eventCustomRepository = testingModule.get(
      UserConsentChangedEventCustomRepository,
    );
    eventRepository = testingModule.get(
      UserConsentChangedEventCustomRepository,
    );

    getManyMock = jest.fn();
    orderByMock = jest.fn().mockReturnValue({
      getMany: getManyMock,
    });
    whereMock = jest.fn().mockReturnValue({
      orderBy: orderByMock,
    });
    eventRepository.createQueryBuilder = jest.fn().mockReturnValue({
      where: whereMock,
    });
    eventRepository.save = jest.fn();

    user = buildUser();
  });

  describe('findEventsOrderedByCreation', () => {
    const assertQueryMocks = () => {
      expect(eventRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(eventRepository.createQueryBuilder).toHaveBeenCalledWith('Event');
      expect(whereMock).toHaveBeenCalledTimes(1);
      expect(whereMock).toHaveBeenCalledWith({ user_id: user.id });
      expect(orderByMock).toHaveBeenCalledTimes(1);
      expect(orderByMock).toHaveBeenCalledWith('created_at', 'ASC');
      expect(getManyMock).toHaveBeenCalledTimes(1);
      expect(getManyMock).toHaveBeenCalledWith();
    };

    it('calls respository.findOne and returns its response', async () => {
      const response: UserConsentChangedEvent[] = [];
      getManyMock.mockResolvedValueOnce(response);
      const result = await eventCustomRepository.findEventsOrderedByCreation(
        user,
      );
      expect(result).toBe(response);
      assertQueryMocks();
    });

    it('exceptions on getMany bubble up', async () => {
      getManyMock.mockRejectedValueOnce(TEST_ERROR);

      await expect(() =>
        eventCustomRepository.findEventsOrderedByCreation(user),
      ).rejects.toEqual(TEST_ERROR);

      expect(getManyMock).toHaveBeenCalledTimes(1);
      expect(getManyMock).toHaveBeenCalledWith();
      assertQueryMocks();
    });
  });

  describe('saveMany', () => {
    it('calls respository.findOne and returns its response', async () => {
      const response: UserConsentChangedEvent[] = [
        buildUserConsentChangedEvent(user, ConsentId.email_notifications, true),
      ];
      const result = await eventCustomRepository.saveMany(response);
      expect(result).toBeUndefined();

      expect(eventRepository.save).toHaveBeenCalledTimes(1);
      expect(eventRepository.save).toHaveBeenCalledWith(response);
    });

    it('exceptions on getMany bubble up', async () => {
      eventRepository.save.mockRejectedValueOnce(TEST_ERROR);
      const response: UserConsentChangedEvent[] = [];
      await expect(() =>
        eventCustomRepository.saveMany(response),
      ).rejects.toEqual(TEST_ERROR);

      expect(eventRepository.save).toHaveBeenCalledTimes(1);
      expect(eventRepository.save).toHaveBeenCalledWith(response);
    });

    it('throws BadRquestException if constraint thrown is User_email_key', async () => {
      const response: UserConsentChangedEvent[] = [];
      eventRepository.save.mockRejectedValueOnce({
        constraint: 'UserConsentChangedEvent_user_id_fkey',
      });
      await expect(() =>
        eventCustomRepository.saveMany(response),
      ).rejects.toEqual(new NotFoundException(User));
      expect(eventRepository.save).toHaveBeenCalledTimes(1);
      expect(eventRepository.save).toHaveBeenCalledWith(response);
    });
  });
});
