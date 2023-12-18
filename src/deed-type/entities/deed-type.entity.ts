import { DeedSubtype } from 'src/deed-subtype/entities/deed-subtype.entity';
import { Deed } from 'src/deed/entities/deed.entity';
import { PoliticalBody } from 'src/political-body/entities/political-body.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { DEED_TYPE } from './enums/deed_type.enum';

@Unique(['name'])
@Entity()
export class DeedType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 55 })
  name: DEED_TYPE;

  @ManyToMany(
    () => PoliticalBody,
    (politicalBodies) => politicalBodies.deedTypes,
  )
  politicalBodies: PoliticalBody[];

  @OneToMany(() => Deed, (deed) => deed.deedType)
  deeds: Deed[];

  @OneToMany(() => DeedSubtype, (deedSubtype) => deedSubtype.deedType)
  deedSubtypes: DeedSubtype[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: string;
}