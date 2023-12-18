import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { FEDERATED_LEVEL } from './enums/federated_level.enum';
import { POLITICAL_POWER } from './enums/political_power.enum';
import { FEDERATIVE_UNIT } from './enums/federative_unit.enum';
import { PoliticalBody } from 'src/political-body/entities/political-body.entity';

@Unique(['name', 'political_power', 'level'])
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

  @OneToMany(
    () => PoliticalBody,
    (politicalBody) => politicalBody.federatedEntity,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  politicalBodies: PoliticalBody[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: string;

  @DeleteDateColumn({
    type: 'time with time zone',
    nullable: true,
    select: false,
  })
  deletedAt?: Date;
}
