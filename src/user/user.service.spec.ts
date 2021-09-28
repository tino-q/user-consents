import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { buildUser } from '../test/factories/user.factory';
import { UserCustomRepository } from './user.repository';
import { DeleteResult } from 'typeorm';

describe('UserService', () => {
  const TEST_ERROR = 'TEST_ERROR';

  let userService: UserService;
  let userRepository: jest.Mocked<UserCustomRepository>;
  let user: User;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserCustomRepository,
          useFactory: () => ({
            createUser: jest.fn(),
            findOneById: jest.fn(),
            delete: jest.fn(),
          }),
        },
      ],
    }).compile();
    userRepository = testingModule.get(UserCustomRepository);
    userService = testingModule.get(UserService);
    user = buildUser('test@test.com');
  });

  describe('creation of user', () => {
    it('calls userRepository.createUser and returns its response', async () => {
      userRepository.createUser.mockResolvedValueOnce(user);

      const result = await userService.create(user);
      expect(result).toBe(user);

      expect(userRepository.createUser).toHaveBeenCalledTimes(1);
      expect(userRepository.createUser).toHaveBeenCalledWith(user);
    });

    it('bubbles up userRepository.create exceptions', async () => {
      userRepository.createUser.mockRejectedValueOnce(TEST_ERROR);

      await expect(() => userService.create(user)).rejects.toEqual(TEST_ERROR);

      expect(userRepository.createUser).toHaveBeenCalledTimes(1);
      expect(userRepository.createUser).toHaveBeenCalledWith(user);
    });
  });

  describe('finding of an user', () => {
    it('calls userRepository.findOneById and returns its response', async () => {
      userRepository.findOneById.mockResolvedValueOnce(user);

      const result = await userService.findOneById(user.id);
      expect(result).toBe(user);

      expect(userRepository.findOneById).toHaveBeenCalledTimes(1);
      expect(userRepository.findOneById).toHaveBeenCalledWith(user.id);
    });

    it('bubbles up userRepository.findOne exceptions', async () => {
      userRepository.findOneById.mockRejectedValueOnce(TEST_ERROR);

      await expect(() => userService.findOneById(user.id)).rejects.toEqual(
        TEST_ERROR,
      );

      expect(userRepository.findOneById).toHaveBeenCalledTimes(1);
      expect(userRepository.findOneById).toHaveBeenCalledWith(user.id);
    });
  });

  describe('deleting of an user', () => {
    it('calls userService.delete and returns its response', async () => {
      userRepository.delete.mockResolvedValueOnce({} as DeleteResult);

      const result = await userService.delete(user.id);
      expect(result).toBeUndefined();

      expect(userRepository.delete).toHaveBeenCalledTimes(1);
      expect(userRepository.delete).toHaveBeenCalledWith(user.id);
    });

    it('bubbles up userService.delete exceptions', async () => {
      userRepository.delete.mockRejectedValueOnce(TEST_ERROR);

      await expect(() => userService.delete(user.id)).rejects.toEqual(
        TEST_ERROR,
      );

      expect(userRepository.delete).toHaveBeenCalledTimes(1);
      expect(userRepository.delete).toHaveBeenCalledWith(user.id);
    });
  });
});
