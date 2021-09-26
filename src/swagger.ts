import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { getFromContainer, MetadataStorage } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

export const initialize = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle("User's consents")
    .setDescription('User consent administration API')
    .setVersion('1.0')
    .addTag('Consents')
    .addTag('System')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const metadatas = (getFromContainer(MetadataStorage) as any)
    .validationMetadatas;
  const schemas = validationMetadatasToSchemas(metadatas);
  (document as any).definitions = schemas;
  SwaggerModule.setup('api', app, document);
};
