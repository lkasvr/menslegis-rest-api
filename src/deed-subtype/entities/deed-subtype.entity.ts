import { DeedType } from 'src/deed-type/entities/deed-type.entity';
import { Deed } from 'src/deed/entities/deed.entity';
import { PoliticalBody } from 'src/political-body/entities/political-body.entity';
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

@Unique(['name'])
@Unique(['name', 'deedType'])
@Entity()
export class DeedSubtype {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 55 })
  name: string;

  @OneToMany(() => Deed, (deed) => deed.deedSubtype, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  deeds: Deed[];

  @ManyToOne(() => DeedType, (deedType) => deedType.deedSubtypes, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  deedType: DeedType;

  @ManyToOne(
    () => PoliticalBody,
    (politicalBody) => politicalBody.deedSubtypes,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  politicalBody: PoliticalBody;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: string;
}
