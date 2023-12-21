import { Deed } from 'src/deed/entities/deed.entity';
import { PoliticalBody } from 'src/political-body/entities/political-body.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Unique(['name'])
@Unique(['name', 'politicalBody'])
@Entity()
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 55 })
  name: string;

  @ManyToOne(() => PoliticalBody, (politicalBody) => politicalBody.authors, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
  })
  politicalBody: PoliticalBody;

  @ManyToMany(() => Deed, (deeds) => deeds.authors, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  deeds: Deed[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: string;
}
