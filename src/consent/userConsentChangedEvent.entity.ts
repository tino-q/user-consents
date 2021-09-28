import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ConsentId } from './types';

@Entity('UserConsentChangedEvent')
export class UserConsentChangedEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'boolean' })
  enabled: boolean;

  @Column({})
  consent_id: ConsentId;

  @Column({ type: 'timestamp' })
  created_at: Date;
}
