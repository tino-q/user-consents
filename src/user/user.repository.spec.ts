import { Test, TestingModule } from '@nestjs/testing';
import { User } from './user.entity';
import { buildUser } from '../test/factories/user.factory';
import { UserCustomRepository } from './user.repository';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('UserRepository', () => {
  const TEST_ERROR = 'TEST_ERROR';

  let userCustomRepository: jest.Mocked<UserCustomRepository>;
  let userRepository: jest.Mocked<Repository<User>>;
  let user: User;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [UserCustomRepository],
    }).compile();
    userCustomRepository = testingModule.get(UserCustomRepository);
    userRepository = testingModule.get(UserCustomRepository);
    userRepository.findOne = jest.fn();
    userRepository.save = jest.fn();
    user = buildUser('test@test.com');
  });

  describe('finding of user', () => {
    it('calls respository.findOne and returns its response', async () => {
      userRepository.findOne.mockResolvedValueOnce(user);
      const result = await userCustomRepository.findOneById(user.id);
      expect(result).toBe(user);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(user.id);
    });

    it('bubbles up respository.findOne exceptions', async () => {
      userRepository.findOne.mockRejectedValueOnce(TEST_ERROR);
      await expect(() =>
        userCustomRepository.findOneById(user.id),
      ).rejects.toEqual(TEST_ERROR);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(user.id);
    });
  });

  describe('creation of user', () => {
    it('calls respository.save and returns its response', async () => {
      userRepository.save.mockResolvedValueOnce(user);
      const result = await userCustomRepository.createUser(user);
      expect(result).toBe(user);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });

    it('bubbles up respository.save exceptions', async () => {
      userRepository.save.mockRejectedValueOnce(TEST_ERROR);
      await expect(() => userCustomRepository.createUser(user)).rejects.toEqual(
        TEST_ERROR,
      );
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });

    it('throws BadRquestException if constraint thrown is User_email_key', async () => {
      userRepository.save.mockRejectedValueOnce({
        constraint: 'User_email_key',
      });
      await expect(() => userCustomRepository.createUser(user)).rejects.toEqual(
        new BadRequestException(400, 'Email already registered'),
      );
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });
  });
});
