import { v4 as uuid } from 'uuid';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto, UserDto, UserIdParams } from './user.dto';

describe('User.dto', () => {
  describe('CreateUserDto', () => {
    it('succeeds', async () => {
      const errors = await validate(
        plainToClass(CreateUserDto, { email: 'test@test.com' }),
      );
      expect(errors.length).toBe(0);
    });

    it.each([['notanemail'], [''], [null], [undefined]])(
      "fails because '%s' is not an email",
      async (email: string) => {
        const [error] = await validate(plainToClass(CreateUserDto, { email }));
        expect(error.constraints?.isEmail).toBe('email must be an email');
      },
    );
  });

  describe('UserIdParams', () => {
    it('succeeds', async () => {
      const errors = await validate(plainToClass(UserIdParams, { id: uuid() }));
      expect(errors.length).toBe(0);
    });

    it.each([['notanemail'], [''], [null], [undefined]])(
      "fails because '%s' is not an email",
      async (id: string) => {
        const [error] = await validate(plainToClass(UserIdParams, { id }));
        expect(error.constraints?.isUuid).toBe('id must be a UUID');
      },
    );
  });

  describe('UserDto', () => {
    it('succeeds', async () => {
      const errors = await validate(
        plainToClass(UserDto, { user: { id: uuid() } }),
      );
      expect(errors.length).toBe(0);
    });

    it.each([[''], [null]])(
      "fails because '%s' is not an user",
      async (user: any) => {
        const [error] = await validate(plainToClass(UserDto, { user }));
        expect(error.property).toEqual('user');
      },
    );
  });
});
