import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { ConsentDto } from './consent.dto';
import { ConsentId } from './types';
import { UserConsentChangedEvent } from './userConsentChangedEvent.entity';
import { UserConsentChangedEventCustomRepository } from './userConsentChangedEvent.repository';

@Injectable()
export class ConsentService {
  public constructor(
    private eventRepository: UserConsentChangedEventCustomRepository,
  ) {}

  private replayEvents(events: UserConsentChangedEvent[]): ConsentDto[] {
    return Object.entries(
      events.reduce(
        (acum: Record<ConsentId, boolean>, event: UserConsentChangedEvent) => {
          acum[event.consent_id] = event.enabled;
          return acum;
        },
        {} as Record<ConsentId, boolean>,
      ),
    ).reduce(
      (acum: ConsentDto[], [consentId, enabled]: [ConsentId, boolean]) => [
        ...acum,
        { id: consentId, enabled },
      ],
      [],
    );
  }

  public async getConsentsForUser(user: User): Promise<ConsentDto[]> {
    const events = await this.eventRepository.findEventsOrderedByCreation(user);
    return this.replayEvents(events);
  }

  public async createUserConsentChangedEvents(
    userId: string,
    consents: ConsentDto[],
  ): Promise<void> {
    await this.eventRepository.saveMany(
      consents.map((consent) => ({
        user_id: userId,
        consent_id: consent.id,
        enabled: consent.enabled,
      })),
    );
  }
}
