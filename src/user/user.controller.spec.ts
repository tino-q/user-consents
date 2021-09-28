import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { buildUser } from '../test/factories/user.factory';
import { ConsentService } from '../../src/consent/consent.service';

describe('UserController', () => {
  const TEST_ERROR = 'TEST_ERROR';

  let userController: UserController;
  let userServiceMock: jest.Mocked<UserService>;
  let consentService: jest.Mocked<ConsentService>;
  let user: User;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useFactory: () => ({
            create: jest.fn(),
            findOneById: jest.fn(),
            delete: jest.fn(),
          }),
        },
        {
          provide: ConsentService,
          useFactory: () => ({
            getConsentsForUser: jest.fn(),
          }),
        },
      ],
    }).compile();
    userController = testingModule.get<UserController>(UserController);
    userServiceMock = testingModule.get(UserService);
    consentService = testingModule.get(ConsentService);
    user = buildUser('test@test.com');
  });

  describe('creation of user', () => {
    it('calls userService.create and returns its response', async () => {
      userServiceMock.create.mockResolvedValueOnce(user);

      const result = await userController.create(user);
      expect(result).toBe(user);

      expect(userServiceMock.create).toHaveBeenCalledTimes(1);
      expect(userServiceMock.create).toHaveBeenCalledWith(user);
    });

    it('bubbles up userService.create exceptions', async () => {
      userServiceMock.create.mockRejectedValueOnce(TEST_ERROR);

      await expect(() => userController.create(user)).rejects.toEqual(
        TEST_ERROR,
      );

      expect(userServiceMock.create).toHaveBeenCalledTimes(1);
      expect(userServiceMock.create).toHaveBeenCalledWith(user);
    });
  });

  describe('finding of an user', () => {
    it('calls userService.findOneById and returns its response', async () => {
      consentService.getConsentsForUser.mockResolvedValueOnce([]);
      userServiceMock.findOneById.mockResolvedValueOnce(user);

      const result = await userController.getOne(user);
      expect(result).toEqual({
        email: user.email,
        id: user.id,
        consents: [],
      });

      expect(userServiceMock.findOneById).toHaveBeenCalledTimes(1);
      expect(userServiceMock.findOneById).toHaveBeenCalledWith(user.id);

      expect(consentService.getConsentsForUser).toHaveBeenCalledTimes(1);
      expect(consentService.getConsentsForUser).toHaveBeenCalledWith(user);
    });

    it('bubbles up userService.findOneById exceptions', async () => {
      userServiceMock.findOneById.mockRejectedValueOnce(TEST_ERROR);

      await expect(() => userController.getOne(user)).rejects.toEqual(
        TEST_ERROR,
      );

      expect(userServiceMock.findOneById).toHaveBeenCalledTimes(1);
      expect(userServiceMock.findOneById).toHaveBeenCalledWith(user.id);

      expect(consentService.getConsentsForUser).toHaveBeenCalledTimes(0);
    });

    it('bubbles up userService.findOneById exceptions', async () => {
      userServiceMock.findOneById.mockResolvedValueOnce(user);
      consentService.getConsentsForUser.mockRejectedValueOnce(TEST_ERROR);

      await expect(() => userController.getOne(user)).rejects.toEqual(
        TEST_ERROR,
      );

      expect(userServiceMock.findOneById).toHaveBeenCalledTimes(1);
      expect(userServiceMock.findOneById).toHaveBeenCalledWith(user.id);

      expect(consentService.getConsentsForUser).toHaveBeenCalledTimes(1);
      expect(consentService.getConsentsForUser).toHaveBeenCalledWith(user);
    });
  });

  describe('deleting of an user', () => {
    it('calls userService.delete and returns its response', async () => {
      userServiceMock.delete.mockResolvedValueOnce();

      const result = await userController.delete(user);
      expect(result).toBeUndefined();

      expect(userServiceMock.delete).toHaveBeenCalledTimes(1);
      expect(userServiceMock.delete).toHaveBeenCalledWith(user.id);
    });

    it('bubbles up userService.delete exceptions', async () => {
      userServiceMock.delete.mockRejectedValueOnce(TEST_ERROR);

      await expect(() => userController.delete(user)).rejects.toEqual(
        TEST_ERROR,
      );

      expect(userServiceMock.delete).toHaveBeenCalledTimes(1);
      expect(userServiceMock.delete).toHaveBeenCalledWith(user.id);
    });
  });
});
