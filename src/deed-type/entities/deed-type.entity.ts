import { DeedSubtype } from 'src/deed-subtype/entities/deed-subtype.entity';
import { Deed } from 'src/deed/entities/deed.entity';
import { PoliticalBody } from 'src/political-body/entities/political-body.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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
    { onDelete: 'CASCADE' },
  )
  politicalBodies: PoliticalBody[];

  @OneToMany(() => Deed, (deed) => deed.deedType, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  deeds: Deed[];

  @OneToMany(() => DeedSubtype, (deedSubtype) => deedSubtype.deedType, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  deedSubtypes: DeedSubtype[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: string;

  @DeleteDateColumn({
    type: 'time with time zone',
    nullable: true,
    select: false,
  })
  deletedAt: Date;
}
