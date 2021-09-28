import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserCustomRepository } from './user.repository';
import { User } from './user.entity';
import { v4 as uuid } from 'uuid';
import { buildUser } from '../../src/test/factories/user.factory';
import { getTestApp } from '../../src/test/helpers';

describe('User Controller e2e', () => {
  let app: INestApplication;
  let userRepository: UserCustomRepository;
  let email: string;

  beforeEach(async () => {
    app = await getTestApp();
    userRepository = app.get<UserCustomRepository>(UserCustomRepository);
    await app.init();

    email = `${uuid()}@test.com`;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Create user', () => {
    it('creates an user', async () => {
      const response = await request(app.getHttpServer()).post('/users').send({
        email,
      });

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          email,
        }),
      );
      expect(response.statusCode).toEqual(201);

      const user: User | null = await userRepository.findOneById(
        response.body.id,
      );
      expect(user).toBeDefined();
      expect(user?.email).toEqual(email);
      expect(user?.id).toEqual(response.body.id);
    });

    it.each([[undefined], [null], ['notanemail']])(
      'fails when email is %s',
      async () => {
        const response = await request(app.getHttpServer())
          .post('/users')
          .send({});

        expect(response.body).toEqual(
          expect.objectContaining({
            error: 'Bad Request',
            message: expect.arrayContaining(['email must be an email']),
            statusCode: 400,
          }),
        );
        expect(response.statusCode).toEqual(400);
      },
    );
  });

  describe('Get a user', () => {
    it('returns the existing user', async () => {
      const user: User = await userRepository.save(buildUser(email));

      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .send();

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          email,
        }),
      );

      expect(response.statusCode).toEqual(200);
      expect(response.body.id).toEqual(user.id);
      expect(response.body.email).toEqual(email);
    });

    it('returns not found if the user does not exist', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${uuid()}`)
        .send();

      expect(response.body).toEqual({
        message: 'Not Found',
        statusCode: 404,
      });
      expect(response.statusCode).toEqual(404);
    });

    it('returns bad request if the id is not uuid', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/notanuuid`)
        .send();

      expect(response.body).toEqual({
        error: 'Bad Request',
        message: ['id must be a UUID'],
        statusCode: 400,
      });
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('Deleting an user', () => {
    it('Deletes the user and is removed from the database', async () => {
      const user: User = await userRepository.save(buildUser(email));

      const response = await request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .send();

      expect(response.body).toEqual({});

      expect(response.statusCode).toEqual(200);

      expect(await userRepository.findOneById(user.id)).toBeFalsy();
    });

    it('returns bad request if the id is not uuid', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/notanuuid`)
        .send();

      expect(response.body).toEqual({
        error: 'Bad Request',
        message: ['id must be a UUID'],
        statusCode: 400,
      });
      expect(response.statusCode).toEqual(400);
    });
  });
});
