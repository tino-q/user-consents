import { ConsentId } from '../../consent/types';
import { UserConsentChangedEvent } from '../../consent/userConsentChangedEvent.entity';
import { v4 as uuid } from 'uuid';
import { User } from '../../user/user.entity';

export const buildUserConsentChangedEvent = (
  user: User,
  consentId: ConsentId,
  enabled: boolean,
) => {
  const event = new UserConsentChangedEvent();
  event.id = uuid();
  event.user_id = user.id;
  event.consent_id = consentId;
  event.enabled = enabled;
  event.created_at = new Date();
  return event;
};
