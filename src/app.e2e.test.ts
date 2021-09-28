import * as request from 'supertest';
import { v4 as uuid } from 'uuid';
import { INestApplication } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';
import { UserConsentChangedEvent } from './consent/userConsentChangedEvent.entity';
import { getTestApp } from './test/helpers';
import { User } from './user/user.entity';
import { ConsentId } from './consent/types';

describe('User Controller e2e', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let eventRepository: Repository<UserConsentChangedEvent>;

  beforeEach(async () => {
    app = await getTestApp();
    userRepository = getRepository(User);
    eventRepository = getRepository(UserConsentChangedEvent);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('Integration test', async () => {
    // Create user
    const email = `${uuid()}@test.com`;
    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        email,
      });

    expect(createUserResponse.body.email).toBe(email);
    expect(createUserResponse.body.id).toBeDefined();

    // fetch created user
    const getUserResponse = await request(app.getHttpServer())
      .get('/users/' + createUserResponse.body.id)
      .send();

    expect(getUserResponse.body).toEqual({
      consents: [],
      email: email,
      id: createUserResponse.body.id,
    });

    // set sms and email consents
    const emailConsent = { id: ConsentId.email_notifications, enabled: true };
    const smsConsent = { id: ConsentId.sms_notifications, enabled: false };
    const postEventResponse = await request(app.getHttpServer())
      .post('/events')
      .send({
        user: {
          id: createUserResponse.body.id,
        },
        consents: [smsConsent, emailConsent],
      });

    expect(postEventResponse.status).toEqual(201);

    // fetch user again
    const secondGetUserResponse = await request(app.getHttpServer())
      .get('/users/' + createUserResponse.body.id)
      .send();

    expect(secondGetUserResponse.body).toEqual({
      consents: [
        {
          id: 'sms_notifications',
          enabled: false,
        },
        {
          id: 'email_notifications',
          enabled: true,
        },
      ],
      email: email,
      id: createUserResponse.body.id,
    });

    // deny the email consent
    const deniedEmailConsent = {
      id: ConsentId.email_notifications,
      enabled: false,
    };
    const secondPostEventResponse = await request(app.getHttpServer())
      .post('/events')
      .send({
        user: {
          id: createUserResponse.body.id,
        },
        consents: [deniedEmailConsent],
      });

    expect(secondPostEventResponse.status).toEqual(201);

    // fetch the user again
    const thirdGetUserResponse = await request(app.getHttpServer())
      .get('/users/' + createUserResponse.body.id)
      .send();

    expect(thirdGetUserResponse.body).toEqual({
      consents: [
        {
          id: 'sms_notifications',
          enabled: false,
        },
        {
          id: 'email_notifications',
          enabled: false,
        },
      ],
      email: email,
      id: createUserResponse.body.id,
    });

    // delete the user
    const deleteResponse = await request(app.getHttpServer())
      .delete('/users/' + createUserResponse.body.id)
      .send();

    expect(deleteResponse.status).toBe(200);

    // assert database
    const events = await eventRepository.find({
      user_id: getUserResponse.body.id,
    });

    expect(events.length).toEqual(3);
    expect(
      events.filter((e) => e.consent_id === ConsentId.email_notifications)
        .length,
    ).toEqual(2);
    expect(
      events.filter((e) => e.consent_id === ConsentId.sms_notifications).length,
    ).toEqual(1);

    const inexistentUser = await userRepository.findOne({ email });
    expect(inexistentUser).toBeUndefined();
  });
});
