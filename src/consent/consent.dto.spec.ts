import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { buildUser } from '../../src/test/factories/user.factory';
import { User } from '../../src/user/user.entity';
import { ConsentDto } from './consent.dto';
import { ConsentId } from './types';
import { CreateUserConsentChangedEventDto } from '../../src/user/user.dto';

describe('Consent.dto', () => {
  let dto: CreateUserConsentChangedEventDto;
  let user: User;

  beforeEach(async () => {
    user = buildUser();

    dto = plainToClass(CreateUserConsentChangedEventDto, {
      user: {
        id: user.id,
      },
      consents: [
        plainToClass(ConsentDto, {
          id: ConsentId.email_notifications,
          enabled: true,
        }),
      ],
    });
  });

  it('validates', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it.each([['notanuuid'], [null], [undefined], [1], [{}]])(
    'fails because user.id is not an uuid but %s instead',
    async (id: any) => {
      dto.user.id = id;
      const [error] = await validate(dto);

      expect((error?.children || [])[0].constraints?.isUuid).toEqual(
        'id must be a UUID',
      );
    },
  );

  it('fails because user.id is not present', async () => {
    dto.user = null as any;
    const [error] = await validate(dto);

    expect((error?.children || [])[0].property).toEqual('user');
    expect((error?.children || [])[0].constraints?.nestedValidation).toEqual(
      'nested property user must be either object or array',
    );
  });

  it('fails because consents is empty', async () => {
    dto.consents = [];
    const [error] = await validate(dto);

    expect(error?.constraints?.arrayNotEmpty).toEqual(
      'consents should not be empty',
    );
  });

  it('fails because consent does not belong to the consents enum', async () => {
    dto.consents = [
      plainToClass(ConsentDto, { id: 'not_a_consent' as any, enabled: true }),
    ];
    const [error] = await validate(dto);

    expect(
      ((error?.children || [])[0].children || [])[0].constraints?.isEnum,
    ).toEqual('id must be a valid enum value');
  });

  it('fails because consent enabled is not a boolean', async () => {
    dto.consents = [
      plainToClass(ConsentDto, {
        id: ConsentId.email_notifications,
        enabled: 'true',
      }),
    ];
    const [error] = await validate(dto);
    expect(
      ((error?.children || [])[0].children || [])[0].constraints?.isBoolean,
    ).toEqual('enabled must be a boolean value');
  });
});
