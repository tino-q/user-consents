import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthService } from './health.service';
import { ConfigModule } from '@nestjs/config';
import { environmentSchema } from './env.schema';
import { DatabaseModule } from './db.module';
import { UserModule } from './user/user.module';
import { ConsentModule } from './consent/consent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: environmentSchema,
    }),
    DatabaseModule,
    UserModule,
    ConsentModule,
  ],
  controllers: [AppController],
  providers: [HealthService],
})
export class AppModule {}
