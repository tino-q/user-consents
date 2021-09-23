import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { buildUser } from '../../test/factories/user.factory';

describe('UserController', () => {
  const TEST_ERROR = 'TEST_ERROR';

  let userController: UserController;
  let userServiceMock: jest.Mocked<UserService>;
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
      ],
    }).compile();
    userController = testingModule.get<UserController>(UserController);
    userServiceMock = testingModule.get(UserService);
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
      userServiceMock.findOneById.mockResolvedValueOnce(user);

      const result = await userController.getOne(user);
      expect(result).toBe(user);

      expect(userServiceMock.findOneById).toHaveBeenCalledTimes(1);
      expect(userServiceMock.findOneById).toHaveBeenCalledWith(user.id);
    });

    it('bubbles up userService.findOneById exceptions', async () => {
      userServiceMock.findOneById.mockRejectedValueOnce(TEST_ERROR);

      await expect(() => userController.getOne(user)).rejects.toEqual(
        TEST_ERROR,
      );

      expect(userServiceMock.findOneById).toHaveBeenCalledTimes(1);
      expect(userServiceMock.findOneById).toHaveBeenCalledWith(user.id);
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
