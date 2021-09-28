import { INestApplication } from '@nestjs/common';
import { User } from '../../src/user/user.entity';
import * as request from 'supertest';
import { v4 as uuid } from 'uuid';
import { getTestApp } from '../../src/test/helpers';
import { ConsentId } from './types';
import { getRepository, Repository } from 'typeorm';
import { UserConsentChangedEvent } from './userConsentChangedEvent.entity';

describe('User Controller e2e', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let eventRepository: Repository<UserConsentChangedEvent>;
  let email: string;

  beforeEach(async () => {
    app = await getTestApp();
    userRepository = getRepository(User);
    eventRepository = getRepository(UserConsentChangedEvent);
    await app.init();
    email = `${uuid()}@test.com`;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Create event', () => {
    it('fails with 404 when user does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post('/events')
        .send({
          user: {
            id: uuid(),
          },
          consents: [{ id: ConsentId.email_notifications, enabled: true }],
        });

      expect(response.statusCode).toEqual(404);
      expect(response.body).toEqual({ error: 'Not Found', statusCode: 404 });
    });

    it('creates many event if user exists', async () => {
      const user: User = await userRepository.save({
        email,
      });
      const consents = [
        { id: ConsentId.email_notifications, enabled: true },
        { id: ConsentId.sms_notifications, enabled: false },
      ];

      const response = await request(app.getHttpServer())
        .post('/events')
        .send({
          user: {
            id: user.id,
          },
          consents,
        });

      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({});

      const dbEvents = await eventRepository
        .createQueryBuilder('Event')
        .where({ user_id: user.id })
        .getMany();

      expect(dbEvents.length).toBe(consents.length);

      expect(dbEvents[0].consent_id).toEqual(consents[0].id);
      expect(dbEvents[0].enabled).toEqual(consents[0].enabled);

      expect(dbEvents[1].consent_id).toEqual(consents[1].id);
      expect(dbEvents[1].enabled).toEqual(consents[1].enabled);
    });
  });
});
