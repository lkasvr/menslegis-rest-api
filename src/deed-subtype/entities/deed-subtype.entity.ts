import { DeedType } from 'src/deed-type/entities/deed-type.entity';
import { Deed } from 'src/deed/entities/deed.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { DEED_SUBTYPE } from './enums/deed_subtype.enum';

@Unique(['name'])
@Unique(['name', 'deedType'])
@Entity()
export class DeedSubtype {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 55 })
  name: DEED_SUBTYPE;

  @OneToMany(() => Deed, (deed) => deed.deedSubtype)
  deeds: Deed[];

  @ManyToOne(() => DeedType, (deedType) => deedType.deedSubtypes)
  deedType: DeedType;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: string;
}
