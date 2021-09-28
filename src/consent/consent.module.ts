import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsentService } from './consent.service';
import { ConsentController } from './consent.controller';
import { UserConsentChangedEventCustomRepository } from '../../src/consent/userConsentChangedEvent.repository';
import { UserModule } from '../../src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserConsentChangedEventCustomRepository]),
    forwardRef(() => UserModule),
  ],
  controllers: [ConsentController],
  providers: [ConsentService],
  exports: [ConsentService],
})
export class ConsentModule {}
