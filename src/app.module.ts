import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { environmentSchema } from './env.schema';
import { DatabaseModule } from './db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: environmentSchema,
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
