import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FEDERATED_LEVEL } from './enums/federated_level.enum';
import { POLITICAL_POWER } from './enums/political_power.enum';
import { FEDERATIVE_UNIT } from './enums/federative_unit.enum';

@Entity()
export class FederatedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: FEDERATIVE_UNIT })
  name: FEDERATIVE_UNIT;

  @Column({ type: 'enum', enum: POLITICAL_POWER })
  political_power: POLITICAL_POWER;

  @Column({ type: 'enum', enum: FEDERATED_LEVEL })
  level: FEDERATED_LEVEL;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: string;
}
