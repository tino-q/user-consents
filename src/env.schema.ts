import * as Joi from 'joi';

export const environmentSchema: Joi.ObjectSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
  TYPEORM_HOST: Joi.string().required(),
  TYPEORM_PORT: Joi.number().required(),
  TYPEORM_USERNAME: Joi.string().required(),
  TYPEORM_PASSWORD: Joi.string().required(),
  TYPEORM_DATABASE: Joi.string().required(),
  TYPEORM_CONNECTION: Joi.string().required(),
  TYPEORM_MIGRATIONS: Joi.string().required(),
});
