import { NotFoundException } from '@nestjs/common';
import { User } from '../../src/user/user.entity';
import { Repository, EntityRepository } from 'typeorm';
import { UserConsentChangedEvent } from './userConsentChangedEvent.entity';

@EntityRepository(UserConsentChangedEvent)
export class UserConsentChangedEventCustomRepository extends Repository<UserConsentChangedEvent> {
  public findEventsOrderedByCreation(
    user: User,
  ): Promise<UserConsentChangedEvent[]> {
    return this.createQueryBuilder('Event')
      .where({ user_id: user.id })
      .orderBy('created_at', 'ASC')
      .getMany();
  }

  public async saveMany(
    events: Omit<UserConsentChangedEvent, 'created_at' | 'id'>[],
  ): Promise<void | never> {
    try {
      await this.save(events);
    } catch (error) {
      if (error?.constraint === 'UserConsentChangedEvent_user_id_fkey') {
        throw new NotFoundException(User);
      }
      throw error;
    }
  }
}
