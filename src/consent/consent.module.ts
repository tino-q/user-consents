import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsentService } from './consent.service';
import { ConsentController } from './consent.controller';
import { UserConsentChangedEventCustomRepository } from '../../src/consent/userConsentChangedEvent.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserConsentChangedEventCustomRepository]),
  ],
  controllers: [ConsentController],
  providers: [ConsentService],
  exports: [ConsentService],
})
export class ConsentModule {}
